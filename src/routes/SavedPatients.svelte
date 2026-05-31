<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { savedPatients, removeSavedPatient, mergeRemote, type SavedPatient } from "$lib/stores/savedPatients";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText, selectedChronic } from "$lib/stores/trialSelection";
  import { fetchPatientsFromSheet, type SheetPatientRow } from "$lib/domain/sheet-payload";
  import { t } from "$lib/i18n";

  let syncing = $state(false);
  let lastSyncError = $state(false);
  let lastSyncOk = $state(false);
  let lastSyncCount = $state<number | null>(null);

  // Mapping nome colonna nel Sheet → nome display dell'app per i trial.
  // Le colonne reali del foglio (header riga 1) sono usate come chiavi.
  const SHEET_TO_DISPLAY: Record<string, string> = {
    "WeTrust": "WeTrust",
    "MARSS": "MARSS",
    "ATHENA": "ATHENA",
    "VANISH": "VANISH",
    "PIVOTAL": "PIVOTAL",
    "MOSTE": "MOSTE",
    "FASTEST": "FASTEST",
    "TICH3": "TICH-3",
    "LIBREXIA": "Librexia",
    "TWIN2WIN": "TWIN-2-WIN 2",
    "ARTEMIS": "ARTEMIS",
    "HYBERNIA": "HYBERNIA",
    "DONESYMPLE": "DONE SYMPLE",
    "SAFERDOAC": "SAFER-DOAC",
    "SHIONOGI": "SHIONOGI",
    "SOVATELTIDE": "SOVATELTIDE",
    "ORION": "ORION",
    "PROMISE": "PROMISE",
    "DO  IT": "DO-IT", // attenzione: due spazi nel foglio originale
    "DO IT": "DO-IT",  // anche con uno spazio (resilienza)
    "DOIT": "DO-IT",
    "NiVO": "NiVO",
    "NIVO": "NiVO",
    "REMEDY": "REMEDY",
  };

  function readTrialsFromRow(r: SheetPatientRow): string[] {
    const enrolled: string[] = [];
    for (const [sheetCol, display] of Object.entries(SHEET_TO_DISPLAY)) {
      const v = (r as Record<string, unknown>)[sheetCol];
      if (v == null) continue;
      const s = String(v).trim().toLowerCase();
      if (s === "" || s === "no" || s === "0" || s === "false") continue;
      if (!enrolled.includes(display)) enrolled.push(display);
    }
    return enrolled;
  }

  function num(v: unknown): number | undefined {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }

  function str(v: unknown): string | undefined {
    if (v == null) return undefined;
    const s = String(v).trim();
    return s === "" ? undefined : s;
  }

  function rowToSaved(r: SheetPatientRow): SavedPatient {
    const rec = r as Record<string, unknown>;
    const ts = rec.Timestamp ?? rec.timestamp;
    const savedAt = ts instanceof Date ? ts.toISOString() : (typeof ts === "string" ? ts : new Date().toISOString());
    const id = String(rec.id ?? ts ?? Math.random().toString(36).slice(2));
    const trials = (r.trials && r.trials.length > 0 ? r.trials : readTrialsFromRow(r))
      .map((t) => SHEET_TO_DISPLAY[t] ?? t);
    return {
      id,
      savedAt,
      patientId: str(rec.N_patient ?? rec.patientId),
      strokeType: (rec.strokeType as SavedPatient["strokeType"]) ?? "",
      age: num(rec.Age ?? rec.age),
      nihss: num(rec.NIHSS ?? rec.nihss),
      trials,
      missed: Array.isArray(r.missed) ? r.missed : [],
      remote: true,
      snapshot: {
        pre: {
          patientId: str(rec.N_patient ?? rec.patientId),
          age: num(rec.Age ?? rec.age),
          nihss: num(rec.NIHSS ?? rec.nihss),
          premrs: num(rec.pre_mRS ?? rec.premrs),
          ltsw: num(rec.LTSW_h ?? rec.ltsw),
        },
        post: { strokeType: (rec.strokeType as "ischemic" | "hemorrhagic" | "") || undefined },
        hem: {},
        studies: trials,
        outcomes: {},
        chronic: [],
        notes: str(rec.Notes) ?? "",
        extras: {
          tev: (rec.TEV as "Yes" | "No" | undefined) || undefined,
          mtici: str(rec.mTICI),
          tiv: (rec.TIV as "Yes" | "No" | undefined) || undefined,
        },
      },
    };
  }

  async function syncFromSheet() {
    if (syncing) return;
    syncing = true;
    lastSyncError = false;
    lastSyncOk = false;
    const result = await fetchPatientsFromSheet();
    if (result.ok) {
      if (result.rows.length > 0) {
        mergeRemote(result.rows.map(rowToSaved));
      }
      lastSyncOk = true;
      lastSyncCount = result.rows.length;
    } else {
      lastSyncError = true;
    }
    syncing = false;
  }

  // Auto-sync solo al primo mount (non in loop)
  let didInitialSync = false;
  $effect(() => {
    if (!didInitialSync) {
      didInitialSync = true;
      syncFromSheet();
    }
  });

  type Tab = "patients" | "stats";
  let tab = $state<Tab>("patients");

  function formatDate(iso: string): string {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  }

  function reopen(p: SavedPatient) {
    preData.set(p.snapshot.pre);
    postData.set(p.snapshot.post);
    hemData.set(p.snapshot.hem);
    selectedStudies.set(p.snapshot.studies);
    studyOutcomes.set(p.snapshot.outcomes);
    selectedChronic.set(p.snapshot.chronic);
    notesText.set(p.snapshot.notes);
    push("/share");
  }

  function remove(id: string, label: string) {
    if (confirm(`${$t.extras.savedRemoveConfirm} "${label}"?`)) removeSavedPatient(id);
  }

  const PAGE_SIZE = 10;
  let page = $state(1);
  const pageCount = $derived(Math.max(1, Math.ceil($savedPatients.length / PAGE_SIZE)));
  // Clamp page se diminuisce
  $effect(() => {
    if (page > pageCount) page = pageCount;
  });
  const pageItems = $derived($savedPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

  // Statistics derived
  const total = $derived($savedPatients.length);
  const ischemicCount = $derived($savedPatients.filter((p) => p.strokeType === "ischemic").length);
  const hemCount = $derived($savedPatients.filter((p) => p.strokeType === "hemorrhagic").length);
  const enrolledCount = $derived($savedPatients.filter((p) => p.trials.length > 0).length);
  const enrollmentRate = $derived(total > 0 ? Math.round((enrolledCount / total) * 100) : 0);

  const missedCount = $derived(
    $savedPatients.reduce((n, p) => n + (p.missed?.length ?? 0), 0)
  );

  // Distribuzione per trial: enrolled + missed (per stacked bar)
  const trialStats = $derived.by(() => {
    const map = new Map<string, { enrolled: number; missed: number }>();
    function add(name: string, kind: "enrolled" | "missed") {
      const cur = map.get(name) ?? { enrolled: 0, missed: 0 };
      cur[kind] += 1;
      map.set(name, cur);
    }
    for (const p of $savedPatients) {
      for (const trial of p.trials) add(trial, "enrolled");
      for (const trial of p.missed ?? []) add(trial, "missed");
    }
    const arr = Array.from(map.entries()).map(([name, c]) => ({ name, ...c, total: c.enrolled + c.missed }));
    arr.sort((a, b) => b.total - a.total);
    return arr;
  });

  const maxTrialCount = $derived(trialStats[0]?.total ?? 0);
</script>

<AppHeader title={$t.landing.pastPatients} sub={syncing ? "..." : $t.extras.savedSubtitle} onBack={() => push("/")} />

<div class="sync-bar">
  <button class="sync-btn" type="button" onclick={syncFromSheet} disabled={syncing} aria-label="Sync">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:spin={syncing}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
    {syncing ? "Sync..." : "Sync"}
  </button>
  {#if lastSyncError}
    <span class="err">Sync failed — showing local only</span>
  {:else if lastSyncOk && lastSyncCount !== null}
    <span class="ok">Sync OK · {lastSyncCount} remoti</span>
  {/if}
</div>

<div class="body">
  <div class="tabs" role="tablist">
    <button class="tab" class:on={tab === "patients"} role="tab" aria-selected={tab === "patients"} onclick={() => (tab = "patients")}>
      {$t.extras.tabPatients}
      {#if total > 0}<span class="cnt">{total}</span>{/if}
    </button>
    <button class="tab" class:on={tab === "stats"} role="tab" aria-selected={tab === "stats"} onclick={() => (tab = "stats")}>
      {$t.extras.tabStats}
    </button>
  </div>

  {#if tab === "patients"}
    {#if $savedPatients.length === 0}
      <Card>
        {#snippet children()}
          <p class="empty">{$t.extras.savedEmpty}</p>
        {/snippet}
      </Card>
    {:else}
      <div class="page-meta">
        <span>{($savedPatients.length === 0) ? 0 : ((page - 1) * PAGE_SIZE + 1)}–{Math.min(page * PAGE_SIZE, $savedPatients.length)} di {$savedPatients.length}</span>
      </div>
      <ul class="saved-list ens-screen-in">
        {#each pageItems as p (p.id)}
          <li>
            <Card>
              {#snippet children()}
                <div class="saved-row">
                  <button class="saved-main ens-press" type="button" onclick={() => reopen(p)} aria-label={`Riapri ${p.patientId ?? p.id}`}>
                    <div class="saved-head">
                      <strong>{p.patientId || $t.extras.senza}</strong>
                      {#if p.strokeType}
                        <Pill tone={p.strokeType === "ischemic" ? "ischemic" : "hemorrhagic"}>
                          {#snippet children()}{p.strokeType}{/snippet}
                        </Pill>
                      {/if}
                      {#if p.remote}
                        <Pill tone="info">{#snippet children()}cloud{/snippet}</Pill>
                      {/if}
                    </div>
                    <div class="saved-meta">
                      {#if p.age != null}<span>{$t.extras.age} {p.age}</span>{/if}
                      {#if p.nihss != null}<span>NIHSS {p.nihss}</span>{/if}
                      {#if p.trials.length > 0}<span class="trials-enrolled">{p.trials.join(", ")}</span>{/if}
                      {#if p.missed && p.missed.length > 0}<span class="trials-missed">{p.missed.length} missed</span>{/if}
                    </div>
                    <small class="saved-date">{formatDate(p.savedAt)}</small>
                  </button>
                  <button class="remove-btn ens-press" type="button" onclick={() => remove(p.id, p.patientId || p.id)} aria-label="Rimuovi">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              {/snippet}
            </Card>
          </li>
        {/each}
      </ul>
      {#if pageCount > 1}
        <div class="pager">
          <button class="page-btn" type="button" onclick={() => (page = Math.max(1, page - 1))} disabled={page === 1} aria-label="Pagina precedente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span class="page-info">{page} / {pageCount}</span>
          <button class="page-btn" type="button" onclick={() => (page = Math.min(pageCount, page + 1))} disabled={page === pageCount} aria-label="Pagina successiva">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      {/if}
    {/if}
  {:else}
    <!-- STATISTICS -->
    {#if total === 0}
      <Card>
        {#snippet children()}
          <p class="empty">{$t.extras.statNoData}</p>
        {/snippet}
      </Card>
    {:else}
      <div class="metrics ens-screen-in">
        <div class="metric">
          <div class="metric-val">{total}</div>
          <div class="metric-lbl">{$t.extras.statScreened}</div>
        </div>
        <div class="metric">
          <div class="metric-val tone-success">{enrolledCount}</div>
          <div class="metric-lbl">{$t.extras.statEnrolled}</div>
        </div>
        <div class="metric">
          <div class="metric-val tone-warn">{missedCount}</div>
          <div class="metric-lbl">Missed</div>
        </div>
        <div class="metric">
          <div class="metric-val">{enrollmentRate}%</div>
          <div class="metric-lbl">{$t.extras.statRate}</div>
        </div>
        <div class="metric">
          <div class="metric-val tone-ischemic">{ischemicCount}</div>
          <div class="metric-lbl">{$t.extras.statIschemic}</div>
        </div>
        <div class="metric">
          <div class="metric-val tone-hemorrhagic">{hemCount}</div>
          <div class="metric-lbl">{$t.extras.statHemorrhagic}</div>
        </div>
      </div>

      {#if trialStats.length > 0}
        <Card title={$t.extras.statEnrollmentsByTrial}>
          {#snippet children()}
            <ul class="bars">
              {#each trialStats as ts (ts.name)}
                {@const totalPct = (ts.total / Math.max(1, maxTrialCount)) * 100}
                {@const enrolledPct = ts.total ? (ts.enrolled / ts.total) * totalPct : 0}
                {@const missedPct = totalPct - enrolledPct}
                <li class="bar">
                  <div class="bar-lbl">
                    <span class="bar-name">{ts.name}</span>
                    <span class="bar-cnt">
                      <span class="cnt-enr">{ts.enrolled}</span>
                      {#if ts.missed > 0}<span class="cnt-mis">+{ts.missed}</span>{/if}
                    </span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill enr" style="width: {enrolledPct}%"></div>
                    <div class="bar-fill mis" style="width: {missedPct}%"></div>
                  </div>
                </li>
              {/each}
            </ul>
            <div class="legend">
              <span><span class="dot enr"></span> Enrolled</span>
              <span><span class="dot mis"></span> Missed (eligible non arruolato)</span>
            </div>
          {/snippet}
        </Card>
      {/if}
    {/if}
  {/if}
</div>

<style>
  .body { padding: 6px 16px 16px; display: flex; flex-direction: column; gap: 16px; }

  .tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    background: var(--bg);
    border-radius: 12px;
    padding: 4px;
    border: 1px solid var(--border);
  }
  .tab {
    border: none;
    border-radius: 9px;
    padding: 12px 4px;
    background: transparent;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  .tab.on {
    background: var(--surface);
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.12);
    color: var(--text);
  }
  .cnt {
    background: var(--primary);
    color: var(--text-inverted);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
  }

  .empty { color: var(--text-muted); text-align: center; margin: 0; padding-block: 8px; }
  .saved-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .saved-row { display: flex; align-items: stretch; gap: 8px; }
  .saved-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: transparent;
    padding: 0;
    text-align: left;
    color: var(--text);
    cursor: pointer;
    min-height: var(--touch-min);
    font-family: inherit;
  }
  .saved-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .saved-head strong { font-size: 15px; }
  .saved-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12.5px;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  .saved-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .remove-btn {
    flex-shrink: 0;
    width: var(--touch-min);
    height: var(--touch-min);
    background: transparent;
    color: var(--text-muted);
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .remove-btn:hover { color: var(--danger); background: var(--danger-soft); }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .metric {
    background: var(--surface);
    border-radius: 14px;
    padding: 14px 12px;
    box-shadow: var(--shadow-sm);
    text-align: center;
  }
  .metric-val {
    font-family: var(--font-mono);
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }
  .metric-val.tone-success { color: var(--success); }
  .metric-val.tone-ischemic { color: var(--ischemic-text); }
  .metric-val.tone-hemorrhagic { color: var(--hemorrhagic-text); }
  .metric-lbl {
    margin-top: 4px;
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
  .bar-lbl {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
    font-size: 13px;
  }
  .bar-name { font-weight: 600; color: var(--text); }
  .bar-cnt { font-family: var(--font-mono); font-weight: 600; color: var(--text-muted); }
  .bar-track {
    height: 10px;
    background: var(--bg);
    border-radius: 999px;
    overflow: hidden;
  }
  .bar-track {
    display: flex;
    gap: 2px;
  }
  .bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width var(--transition-base);
  }
  .bar-fill.enr { background: var(--success); }
  .bar-fill.mis { background: var(--warn); }
  .cnt-enr { color: var(--success); font-weight: 700; }
  .cnt-mis { color: var(--warn); font-weight: 700; margin-left: 4px; }
  .legend {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    font-size: 11.5px;
    color: var(--text-muted);
    flex-wrap: wrap;
  }
  .legend .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    margin-right: 4px;
    vertical-align: 1px;
  }
  .legend .dot.enr { background: var(--success); }
  .legend .dot.mis { background: var(--warn); }
  .sync-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px 6px;
  }
  .sync-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 999px;
    font: inherit;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    min-height: 32px;
  }
  .sync-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
  .sync-btn:disabled { opacity: 0.55; cursor: wait; }
  .sync-btn .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .err {
    color: var(--warn);
    font-size: 12px;
  }
  .ok {
    color: var(--success);
    font-size: 12px;
    font-weight: 600;
  }
  .trials-enrolled { color: var(--success); font-weight: 600; }
  .trials-missed { color: var(--warn); font-weight: 600; }
  .page-meta {
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
    margin-bottom: 4px;
    font-family: var(--font-mono);
  }
  .pager {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
    padding-block: 8px;
  }
  .page-btn {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }
  .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
  .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .page-info {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    min-width: 60px;
    text-align: center;
  }
</style>

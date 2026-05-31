<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { savedPatients, removeSavedPatient, type SavedPatient } from "$lib/stores/savedPatients";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText, selectedChronic } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";

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

  // Statistics derived
  const total = $derived($savedPatients.length);
  const ischemicCount = $derived($savedPatients.filter((p) => p.strokeType === "ischemic").length);
  const hemCount = $derived($savedPatients.filter((p) => p.strokeType === "hemorrhagic").length);
  const enrolledCount = $derived($savedPatients.filter((p) => p.trials.length > 0).length);
  const enrollmentRate = $derived(total > 0 ? Math.round((enrolledCount / total) * 100) : 0);

  // Distribuzione per trial
  const trialStats = $derived.by(() => {
    const map = new Map<string, number>();
    for (const p of $savedPatients) {
      for (const trial of p.trials) {
        map.set(trial, (map.get(trial) ?? 0) + 1);
      }
    }
    const arr = Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  });

  const maxTrialCount = $derived(trialStats[0]?.count ?? 0);
</script>

<AppHeader title={$t.landing.pastPatients} sub={$t.extras.savedSubtitle} onBack={() => push("/")} />

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
      <ul class="saved-list ens-screen-in">
        {#each $savedPatients as p (p.id)}
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
                    </div>
                    <div class="saved-meta">
                      {#if p.age != null}<span>{$t.extras.age} {p.age}</span>{/if}
                      {#if p.nihss != null}<span>NIHSS {p.nihss}</span>{/if}
                      {#if p.trials.length > 0}<span>{p.trials.join(", ")}</span>{/if}
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
                {@const pct = (ts.count / Math.max(1, maxTrialCount)) * 100}
                <li class="bar">
                  <div class="bar-lbl">
                    <span class="bar-name">{ts.name}</span>
                    <span class="bar-cnt">{ts.count}</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width: {pct}%"></div>
                  </div>
                </li>
              {/each}
            </ul>
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
  .bar-fill {
    height: 100%;
    background: var(--success);
    border-radius: 999px;
    transition: width var(--transition-base);
  }
</style>

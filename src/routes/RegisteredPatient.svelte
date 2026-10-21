<script lang="ts">
  // Paziente registrato (design "Eligo Registered Patient"): registrazione di un
  // paziente gia' arruolato, dopo la fase acuta, anche giorni dopo. Sostituisce
  // la registrazione rapida (ex Direct enrollment). L'LTSW non scorre: e'
  // quello alla visita ("Visto"). Stato in quickPatient, separato dal flusso
  // guidato; riga del foglio e messaggio come in Share (source "quick-patient").
  import { push } from "svelte-spa-router";
  import Sheet from "$lib/components/Sheet.svelte";
  import RegFieldSheet from "$lib/components/registered/RegFieldSheet.svelte";
  import RegSeenSheet from "$lib/components/registered/RegSeenSheet.svelte";
  import RegLtswSheet from "$lib/components/registered/RegLtswSheet.svelte";
  import RegTrialPicker from "$lib/components/registered/RegTrialPicker.svelte";
  import { MAIN_FIELDS, REG_FIELDS, extrasFor, type LtswValue, type RegFieldKey } from "$lib/components/registered/fields";
  import { dayWord, fmtFull, hm, regLabel, regValue } from "$lib/components/registered/format";
  import { designNote, displayName, focusOf } from "$lib/components/registered/trials";
  import { fill, fmtMin } from "$lib/components/board/format";
  import { quickPatient, clearQuickPatient, type QuickPatientData } from "$lib/stores/quickPatient";
  import { addSavedPatient } from "$lib/stores/savedPatients";
  import { now } from "$lib/stores/patient";
  import { buildShareMessage, buildSheetPayload, type PatientRecord } from "$lib/domain/patient-record";
  import { hasKnownStudyArm, sendToSheet, studyDesign, type SendStatus } from "$lib/domain/sheet-payload";
  import { exclusiveWith } from "$lib/domain/trials-info";
  import { selectionAlerts } from "$lib/domain/open-questions";
  import { isMissing } from "$lib/domain/board";
  import { toLocalIso } from "$lib/stores/board";
  import { announce } from "$lib/a11y/liveRegion";
  import { t, locale } from "$lib/i18n";

  type Arm = "intervention" | "control" | "";
  type SheetState =
    | { kind: "field"; key: RegFieldKey }
    | { kind: "seen" }
    | { kind: "ltsw" }
    | { kind: "add" }
    | { kind: "trials" }
    | { kind: "saved" }
    | null;
  let sheet = $state<SheetState>(null);

  const p = $derived($quickPatient);
  const parse = (iso?: string) => (iso ? new Date(iso).getTime() : NaN);

  // Prima apertura: "Visto" = adesso; la registrazione rapida salvava un solo studio.
  $effect(() => {
    const q = $quickPatient;
    if (!q.seenDate) quickPatient.update((s) => ({ ...s, seenDate: toLocalIso(Date.now()) }));
    if (!q.trials && q.trial) quickPatient.update((s) => ({ ...s, trials: [{ name: displayName(s.trial!), arm: (s.arm ?? "") as Arm }], trial: undefined, arm: undefined }));
  });

  const seenAt = $derived(Number.isFinite(parse(p.seenDate)) ? parse(p.seenDate) : $now);
  const lswAt = $derived(Number.isFinite(parse(p.lsw)) ? parse(p.lsw) : undefined);
  const agoMin = $derived(($now - seenAt) / 60_000);

  function update(fn: (s: QuickPatientData) => QuickPatientData) {
    quickPatient.update(fn);
  }
  function set(key: RegFieldKey, value: unknown) {
    update((s) => {
      const n = { ...s } as Record<string, unknown>;
      if (isMissing(value)) delete n[key];
      else n[key] = value;
      if (key === "tev" && value !== "Yes") delete n.mtici;
      if (key === "reversal" && value !== "Yes") delete n.reversalAgent;
      if (isMissing(value)) n.shown = (s.shown ?? []).filter((x) => x !== key);
      return n as QuickPatientData;
    });
  }
  function setSeen(v: number) {
    update((s) => {
      const n = { ...s, seenDate: toLocalIso(v) };
      // L'ultima volta visto bene non puo' essere dopo la visita.
      if (s.ltswMode === "clock" && s.lsw) {
        const l = Math.min(parse(s.lsw), v);
        n.lsw = toLocalIso(l);
        n.ltswH = Math.round(((v - l) / 3_600_000) * 100) / 100;
      }
      return n;
    });
  }
  function setLtsw(v: LtswValue | null) {
    update((s) => {
      const n = { ...s };
      delete n.ltswMode; delete n.ltswH; delete n.lsw; delete n.wakeup;
      if (!v) return n;
      return { ...n, ltswMode: v.ltswMode, ltswH: v.ltswH, lsw: v.lsw != null ? toLocalIso(v.lsw) : undefined, wakeup: v.wakeup };
    });
  }

  const avail = $derived(extrasFor(p));
  const visible = $derived((p.shown ?? []).filter((k) => avail.includes(k as RegFieldKey)) as RegFieldKey[]);
  const addable = $derived(avail.filter((k) => !visible.includes(k)));
  function addField(k: RegFieldKey) {
    update((s) => ({ ...s, shown: [...new Set([...(s.shown ?? []), k])] }));
    sheet = { kind: "field", key: k };
  }

  // Studi
  const trials = $derived(p.trials ?? []);
  const names = $derived(trials.map((x) => x.name));
  function setTrials(sel: string[]) {
    update((s) => ({ ...s, trials: sel.map((n) => (s.trials ?? []).find((x) => x.name === n) ?? { name: n, arm: "" as Arm }) }));
  }
  function setArm(name: string, arm: Arm) {
    update((s) => ({ ...s, trials: (s.trials ?? []).map((x) => (x.name === name ? { ...x, arm: x.arm === arm ? "" : arm } : x)) }));
  }
  // Conflitti: gruppi esclusivi del team (duri) e regole dei protocolli.
  const hardPairs = $derived(
    names.flatMap((a, i) => names.slice(i + 1).filter((b) => exclusiveWith(a).includes(b)).map((b) => [a, b]))
  );
  const softAlerts = $derived(selectionAlerts(names).filter((a) => a.kind === "coenrolment"));

  const missingArm = $derived(trials.filter((x) => hasKnownStudyArm(x.name) && !x.arm));
  const blockers = $derived(
    [
      !p.patientId?.trim() && $t.registered.needId,
      isMissing(p.age) && $t.registered.needAge,
      missingArm.length > 0 && fill($t.registered.needArm, { names: missingArm.map((x) => x.name).join(", ") }),
    ].filter(Boolean) as string[]
  );

  const record = $derived<PatientRecord>({
    patientId: p.patientId,
    age: p.age,
    nihss: p.nihss,
    premrs: p.premrs,
    ltswHours: p.ltswH,
    strokeType: p.strokeType,
    selected: names,
    outcomes: Object.fromEntries(trials.filter((x) => x.arm).map((x) => [x.name, x.arm as "intervention" | "control"])),
    notes: p.notes ?? "",
    tev: p.strokeType === "hemorrhagic" ? "" : p.tev ?? "",
    mtici: p.strokeType !== "hemorrhagic" && p.tev === "Yes" ? p.mtici ?? "" : "",
    tiv: p.strokeType === "hemorrhagic" ? "" : p.tiv ?? "",
    reversal: p.strokeType === "hemorrhagic" ? p.reversal ?? "" : "",
    reversalAgent: p.strokeType === "hemorrhagic" && p.reversal === "Yes" ? p.reversalAgent : undefined,
    wakeup: p.wakeup,
    targetVessels: p.strokeType === "hemorrhagic" ? undefined : p.targetVessels,
    aspects: p.strokeType === "hemorrhagic" ? undefined : p.aspects,
    gcs: p.strokeType === "hemorrhagic" ? p.gcs : undefined,
    hemVolume: p.strokeType === "hemorrhagic" ? p.hemVolume : undefined,
    seen: fmtFull(seenAt),
    seenAt: new Date(seenAt).toISOString(),
    ltswDetail: p.ltswH == null ? undefined : p.ltswMode === "clock" && lswAt != null ? `last seen well ${fmtFull(lswAt)}` : "reported",
  });
  const message = $derived(buildShareMessage(record));

  let saving = $state(false);
  let sendStatus = $state<SendStatus | null>(null);
  let savedLocally = false;
  function statusMessage(s: SendStatus): string {
    if (s === "not-found") return $t.share.saveNotFound;
    if (s === "unverified") return $t.share.saveUnverified;
    if (s === "failed") return $t.share.saveFailed;
    return $t.share.saveSuccess;
  }
  async function save() {
    if (blockers.length || saving) return;
    saving = true;
    const { payload } = buildSheetPayload(record, [], "quick-patient");
    const res = await sendToSheet(payload);
    sendStatus = res.status;
    if (!savedLocally) {
      savedLocally = true;
      addSavedPatient({
        patientId: p.patientId,
        strokeType: p.strokeType,
        age: p.age,
        nihss: p.nihss,
        trials: [...names],
        snapshot: {
          pre: { patientId: p.patientId, age: p.age, nihss: p.nihss, premrs: p.premrs, ltsw: p.ltswH, wakeupStroke: p.wakeup, ltswDate: p.lsw },
          post: { strokeType: p.strokeType || undefined, targetVessels: p.targetVessels, aspects: p.aspects },
          hem: { gcs: p.gcs, hemVolume: p.hemVolume },
          studies: [...names],
          outcomes: record.outcomes as Record<string, "intervention" | "control">,
          chronic: [],
          notes: p.notes ?? "",
          extras: { tev: (p.tev || undefined) as "Yes" | "No" | undefined, mtici: p.mtici, tiv: (p.tiv || undefined) as "Yes" | "No" | undefined },
        },
      });
    }
    saving = false;
    announce(statusMessage(res.status));
    if (res.status === "confirmed") sheet = { kind: "saved" };
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      announce($t.share.copied);
    } catch {
      announce($t.common.error);
    }
  }
  function newPatient() {
    clearQuickPatient();
    savedLocally = false;
    sendStatus = null;
    sheet = null;
    push("/workflow");
  }

  const cellValue = (k: RegFieldKey) => regValue($t, k, (p as Record<string, unknown>)[k]);
</script>

<div class="reg">
  <h1 class="sr-only">{$t.registered.title}</h1>
  <div class="kicker">{$t.registered.notAcute}</div>

  <button type="button" class="seen" onclick={() => (sheet = { kind: "seen" })}>
    <span class="lbl">{$t.registered.seen}</span>
    <span class="seen-row">
      <span class="clock">{hm(seenAt)}</span>
      <span class="ref">{dayWord($t, seenAt, $now, $locale)}<br />{agoMin < 1 ? $t.registered.justNow : fill($t.registered.ago, { t: fmtMin(agoMin) })}</span>
    </span>
  </button>

  <button type="button" class="ltsw" onclick={() => (sheet = { kind: "ltsw" })}>
    <span class="ltsw-l">{$t.registered.ltswAtVisit}</span>
    {#if p.ltswH == null}
      <span class="ltsw-set">{$t.registered.setLsw}</span>
    {:else}
      <span class="ltsw-v">{fmtMin(p.ltswH * 60)}</span>
      <span class="ltsw-ref">
        {p.ltswMode === "clock" && lswAt != null ? fill($t.registered.seenWell, { t: `${dayWord($t, lswAt, $now, $locale)} ${hm(lswAt)}` }) : $t.registered.reported}
        {#if p.wakeup}<span class="wake"> · {$t.registered.wakeTag}</span>{/if}
      </span>
    {/if}
  </button>

  <div class="grid">
    {#each MAIN_FIELDS as k (k)}{@render cell(k)}{/each}
  </div>
  {#if visible.length}
    <div class="grid extra">
      {#each visible as k (k)}{@render cell(k)}{/each}
    </div>
  {/if}
  {#if addable.length}
    <button type="button" class="link" onclick={() => (sheet = { kind: "add" })}>{$t.registered.addData}</button>
  {/if}

  <hr class="divider" />

  <div class="enrolled-head">
    <h2>{$t.registered.enrolledIn}</h2>
    {#if trials.length}<span class="muted">{trials.length === 1 ? $t.registered.trialOne : fill($t.registered.trialsN, { n: trials.length })}</span>{/if}
  </div>
  {#if !trials.length}<p class="muted small">{$t.registered.noTrial}</p>{/if}
  <ul class="trials">
    {#each trials as tr (tr.name)}
      {@const note = designNote($t, studyDesign(tr.name))}
      <li class="trial">
        <div class="trial-top">
          <div class="trial-body">
            <div class="trial-name">{tr.name}</div>
            <div class="trial-focus">{focusOf(tr.name)}{note ? ` · ${note}` : ""}</div>
          </div>
          <button type="button" class="remove ens-press" aria-label={fill($t.registered.remove, { name: tr.name })} onclick={() => setTrials(names.filter((n) => n !== tr.name))}>×</button>
        </div>
        {#if hasKnownStudyArm(tr.name)}
          <div class="arms" role="radiogroup" aria-label={`${$t.share.outcomeFor} ${tr.name}`}>
            {#each [["intervention", $t.share.intervention], ["control", $t.share.control]] as [v, l] (v)}
              <button type="button" role="radio" aria-checked={tr.arm === v} class="arm ens-press" class:on={tr.arm === v} class:todo={!tr.arm} onclick={() => setArm(tr.name, v as Arm)}>{l}</button>
            {/each}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
  <button type="button" class="link" onclick={() => (sheet = { kind: "trials" })}>{trials.length ? $t.registered.addAnother : $t.registered.addTrial}</button>
  {#if hardPairs.length || softAlerts.length}
    <ul class="alerts" lang="en">
      {#each hardPairs as [a, b] (a + b)}
        <li class="hard">{fill($t.registered.teamRule, { a, b })}</li>
      {/each}
      {#each softAlerts as al (al.title)}
        <li>{al.title}: {al.detail}</li>
      {/each}
    </ul>
  {/if}

  <div class="save-bar">
    {#if sendStatus && sendStatus !== "confirmed"}
      <p class="warn" role="alert">{statusMessage(sendStatus)}</p>
    {/if}
    {#if blockers.length}
      <p class="needs">{fill($t.registered.needs, { list: blockers.join(", ") })}</p>
    {/if}
    <button type="button" class="save ens-press" disabled={blockers.length > 0 || saving} onclick={save}>
      {saving ? $t.registered.saving : sendStatus && sendStatus !== "confirmed" ? $t.share.retrySend : $t.registered.save}
    </button>
  </div>
</div>

{#snippet cell(k: RegFieldKey)}
  {@const v = cellValue(k)}
  <button type="button" class="cell" aria-label={`${regLabel($t, k)}: ${v ?? "—"}`} onclick={() => (sheet = { kind: "field", key: k })}>
    <span class="cell-l">{regLabel($t, k, true)}</span>
    <span class="cell-v" class:empty={v == null} class:mono={REG_FIELDS[k].mono}>{v ?? "—"}</span>
  </button>
{/snippet}

{#if sheet?.kind === "field"}
  {#key sheet.key}
    <RegFieldSheet field={sheet.key} value={(p as Record<string, unknown>)[sheet.key]} onSet={set} onClose={() => (sheet = null)} />
  {/key}
{:else if sheet?.kind === "seen"}
  <RegSeenSheet value={seenAt} onSet={setSeen} onClose={() => (sheet = null)} />
{:else if sheet?.kind === "ltsw"}
  <RegLtswSheet {seenAt} current={{ ltswMode: p.ltswMode, ltswH: p.ltswH, lsw: lswAt, wakeup: p.wakeup }} onSet={setLtsw} onClose={() => (sheet = null)} />
{:else if sheet?.kind === "trials"}
  <RegTrialPicker selected={names} strokeType={p.strokeType} onDone={setTrials} onClose={() => (sheet = null)} />
{:else if sheet?.kind === "add"}
  <Sheet open={true} ariaLabel={$t.registered.addDataTitle} onClose={() => (sheet = null)}>
    {#snippet children()}
      <h2 class="sheet-title">{$t.registered.addDataTitle}</h2>
      <p class="sheet-desc">{$t.registered.addDataSub}</p>
      <ul class="add-list">
        {#each addable as k (k)}
          <li><button type="button" class="add-row ens-press" onclick={() => addField(k)}><span>{regLabel($t, k)}</span><span class="plus" aria-hidden="true">+</span></button></li>
        {/each}
      </ul>
    {/snippet}
  </Sheet>
{:else if sheet?.kind === "saved"}
  <Sheet open={true} tall ariaLabel={$t.registered.savedTitle} onClose={() => (sheet = null)}>
    {#snippet children()}
      <div class="saved-head">
        <span class="ok" aria-hidden="true">✓</span>
        <div><h2 class="sheet-title flat">{$t.registered.savedTitle}</h2><p class="sheet-desc flat">{$t.registered.savedSub}</p></div>
      </div>
      <pre class="msg">{message}</pre>
      <div class="pair">
        <button type="button" class="soft ens-press" onclick={copy}>{$t.share.copy}</button>
        <button type="button" class="soft ens-press" onclick={() => window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener")}>WhatsApp</button>
      </div>
      <button type="button" class="save ens-press wide" onclick={newPatient}>{$t.registered.newPatient}</button>
    {/snippet}
  </Sheet>
{/if}

<style>
  .reg { padding: 8px 22px 0; color: var(--text); }
  .kicker, .lbl, .ltsw-l, .cell-l, .muted { color: var(--text-muted); }
  .kicker { font-size: 12px; }
  .seen { width: 100%; text-align: left; padding: 0; margin-top: 10px; color: var(--text); }
  .lbl { display: block; font-size: 12px; }
  .seen-row { display: flex; align-items: baseline; gap: 12px; margin-top: 2px; }
  .clock { font-family: var(--font-mono); font-size: 46px; font-weight: 500; letter-spacing: -2.4px; line-height: 1.05; }
  .ref { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.4; color: var(--text-muted); }
  .ltsw {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-top: 12px;
    padding: 12px 0 0;
    border-top: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }
  .ltsw-l { font-size: 12px; width: 86px; flex-shrink: 0; }
  .ltsw-set { font-size: 15px; font-weight: 500; color: var(--primary-hover); }
  .ltsw-v { font-family: var(--font-mono); font-size: 22px; font-weight: 500; letter-spacing: -0.8px; }
  .ltsw-ref { font-family: var(--font-mono); font-size: 12px; line-height: 1.35; color: var(--text-muted); }
  .wake { color: var(--warn); font-weight: 600; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 12px; column-gap: 10px; margin-top: 20px; }
  .grid.extra { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
  .cell { text-align: left; padding: 2px 0; min-height: 44px; min-width: 0; color: var(--text); }
  .cell-l { display: block; font-size: 11px; }
  .cell-v { display: block; margin-top: 2px; font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cell-v.mono { font-family: var(--font-mono); }
  .cell-v.empty { color: var(--text-muted); font-weight: 400; }
  .link { display: block; padding: 10px 0 0; font-size: 13.5px; font-weight: 500; color: var(--primary-hover); }
  .divider { border: none; height: 1px; background: var(--border); margin: 18px 0 16px; }
  .enrolled-head { display: flex; align-items: baseline; justify-content: space-between; }
  .enrolled-head h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.4px; }
  .muted { font-size: 13px; }
  .small { margin: 6px 0 0; }
  .trials { list-style: none; margin: 4px 0 0; padding: 0; }
  .trial { padding: 13px 0; border-bottom: 1px solid var(--border); }
  .trial-top { display: flex; align-items: flex-start; gap: 10px; }
  .trial-body { flex: 1; min-width: 0; }
  .trial-name { font-size: 15.5px; font-weight: 600; letter-spacing: -0.2px; }
  .trial-focus { font-size: 12.5px; color: var(--text-muted); margin-top: 1px; }
  .remove { width: 36px; height: 36px; margin: -6px -8px 0 0; font-size: 20px; color: var(--text-muted); }
  .arms { display: flex; gap: 6px; margin-top: 10px; }
  .arm { flex: 1; border: 1px solid var(--border); border-radius: 10px; padding: 9px 0; font-size: 13px; color: var(--text-muted); background: var(--surface); }
  .arm.todo { border-color: var(--primary); }
  .arm.on { background: var(--primary-hover); border-color: var(--primary-hover); color: var(--text-inverted); font-weight: 600; }
  .alerts { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .alerts li { font-size: 12.5px; line-height: 1.45; color: var(--text-muted); padding-left: 14px; position: relative; }
  .alerts li::before { content: ""; position: absolute; left: 0; top: 7px; width: 6px; height: 6px; border-radius: 99px; background: var(--border-strong); }
  .alerts li.hard { color: var(--warn); }
  .alerts li.hard::before { background: var(--warn); }
  /* In fondo alla pagina, come il "Avanti" del board. */
  .save-bar { padding: 22px 0 calc(96px + env(safe-area-inset-bottom, 0px)); }
  .needs { margin: 0 0 8px; text-align: center; font-size: 12.5px; color: var(--text-muted); }
  .warn { margin: 0 0 8px; padding: 10px 12px; border-radius: 12px; background: var(--warn-soft); color: var(--warn); font-size: 13.5px; }
  .save { width: 100%; border-radius: 14px; padding: 15px 0; font-size: 15px; font-weight: 600; color: var(--text-inverted); background: var(--primary-hover); }
  .save:disabled { opacity: 0.35; }
  .save.wide { width: calc(100% - 12px); margin: 12px 6px 0; }
  .sheet-title { margin: 0 6px; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .sheet-desc { margin: 3px 6px 0; font-size: 12.5px; color: var(--text-muted); }
  .flat { margin-left: 0; margin-right: 0; }
  .add-list { list-style: none; margin: 8px 6px 0; padding: 0; }
  .add-row { width: 100%; display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border); text-align: left; font-size: 14.5px; color: var(--text); }
  .add-row span:first-child { flex: 1; }
  .plus { color: var(--primary-hover); font-size: 18px; line-height: 1; }
  .saved-head { display: flex; align-items: center; gap: 10px; margin: 0 6px; }
  .ok { width: 28px; height: 28px; border-radius: 99px; background: var(--success-soft); color: var(--success); font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .msg { margin: 16px 6px 0; padding: 14px; background: var(--surface-elevated); border-radius: 12px; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.55; white-space: pre-wrap; color: var(--text); }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 6px 0; }
  .soft { border: 1px solid var(--border); background: var(--surface); border-radius: 12px; padding: 13px 0; font-size: 14px; font-weight: 600; color: var(--primary-hover); }
</style>

<script lang="ts">
  // Invio al coordinatore: riepilogo del board + WhatsApp / copia + foglio,
  // con gli stessi messaggi e la stessa riga del foglio di Share.svelte.
  import Sheet from "../Sheet.svelte";
  import Button from "../Button.svelte";
  import { BOARD_FIELDS, isMissing, type BoardResult } from "$lib/domain/board";
  import { buildShareMessage, buildSheetPayload, type PatientRecord } from "$lib/domain/patient-record";
  import { hasKnownStudyArm, sendToSheet, type SendStatus } from "$lib/domain/sheet-payload";
  import { exclusiveWith } from "$lib/domain/trials-info";
  import { selectionAlerts } from "$lib/domain/open-questions";
  import { boardAlertInput } from "$lib/stores/board";
  import BoardAlerts from "./BoardAlerts.svelte";
  import { preData, postData, hemData, ltswHours, now } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText } from "$lib/stores/trialSelection";
  import { eligibleOpenTrials } from "$lib/stores/eligibility";
  import { addSavedPatient } from "$lib/stores/savedPatients";
  import type { BoardClock } from "$lib/stores/board";
  import { announce } from "$lib/a11y/liveRegion";
  import { t, locale } from "$lib/i18n";
  import { fieldLabel, fill, fmtClock, fmtMin, fmtValue } from "./format";

  interface Props {
    result: BoardResult;
    clock: BoardClock;
    values: Record<string, unknown>;
    onClose: () => void;
  }
  let { result, clock, values, onClose }: Props = $props();

  const setFields = $derived(BOARD_FIELDS.filter((f) => !isMissing(values[f.key]) || (f.kind === "vessels" && Array.isArray(values[f.key]))));
  const eligibleNames = $derived(result.eligible.map((j) => j.name));
  const possibleNames = $derived(result.open.filter((j) => j.status === "possible").map((j) => j.name));

  const clockLine = $derived(
    clock.at == null
      ? ""
      : `${fmtClock(clock.at, $now, $t.board.yesterday, $locale)} · ${fmtMin(($now - clock.at) / 60_000)}` +
        (clock.mode === "wakeup" && clock.found != null ? ` · ${$t.board.foundAt} ${fmtClock(clock.found, $now, $t.board.yesterday, $locale)}` : "")
  );
  const clockTitle = $derived(clock.mode === "known" ? $t.board.symptomOnset : `${fieldLabel($t, "__clock")} · ${$t.board.wakeupTag}`);

  // Dati gia' nel messaggio base di Share (eta', NIHSS, mRS, tipo).
  const BASE = new Set(["age", "nihss", "premrs", "strokeType"]);

  const record = $derived<PatientRecord>({
    patientId: $preData.patientId,
    age: $preData.age,
    nihss: $preData.nihss,
    premrs: $preData.premrs,
    ltswHours: $ltswHours,
    strokeType: $postData.strokeType,
    selected: $selectedStudies,
    outcomes: $studyOutcomes,
    notes: $notesText,
  });
  const message = $derived(
    buildShareMessage(record, [
      ...(clock.at != null ? [`${clockTitle}: ${clockLine}`] : []),
      ...setFields.filter((f) => !BASE.has(f.key)).map((f) => `${fieldLabel($t, f.key)}: ${fmtValue($t, f.key, values[f.key])}`),
      "",
      `${$t.board.eligible}: ${eligibleNames.join(", ") || $t.board.none}`,
      `${$t.board.possible}: ${possibleNames.join(", ") || $t.board.none}`,
      ...result.conflicts.map((g) => fill($t.board.compete, { names: g.join(", ") })),
    ])
  );

  function toggle(name: string) {
    // Selezionare uno studio di un gruppo esclusivo toglie gli altri del gruppo (come Summary).
    const partners = exclusiveWith(name);
    selectedStudies.update((arr) =>
      arr.includes(name) ? arr.filter((n) => n !== name) : [...arr.filter((n) => !partners.includes(n)), name]
    );
  }
  function setArm(name: string, v: "intervention" | "control") {
    studyOutcomes.update((o) => ({ ...o, [name]: v }));
  }

  function setPatientId(v: string) {
    preData.update((s) => ({ ...s, patientId: v.trim() || undefined }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      announce($t.share.copy);
    } catch {
      announce($t.common.error);
    }
  }
  function shareWhatsApp() {
    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener");
  }

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
    if (saving) return;
    saving = true;
    const { payload, missed } = buildSheetPayload(record, $eligibleOpenTrials, "board");
    const res = await sendToSheet(payload);
    sendStatus = res.status;
    if (!savedLocally) {
      savedLocally = true;
      addSavedPatient({
        patientId: $preData.patientId,
        strokeType: $postData.strokeType,
        age: $preData.age,
        nihss: $preData.nihss,
        trials: [...$selectedStudies],
        missed,
        snapshot: {
          pre: { ...$preData },
          post: { ...$postData },
          hem: { ...$hemData },
          studies: [...$selectedStudies],
          outcomes: { ...$studyOutcomes },
          chronic: [],
          notes: $notesText,
          extras: {},
        },
      });
    }
    saving = false;
    announce(statusMessage(res.status));
  }
</script>

<Sheet open={true} tall ariaLabel={$t.board.sendTitle} {onClose}>
  {#snippet children()}
    <h2 class="title">{$t.board.sendTitle}</h2>
    <dl class="sum">
      {#if clock.at != null}
        <div class="line"><dt>{clockTitle}</dt><dd>{clockLine}</dd></div>
      {/if}
      {#each setFields as f (f.key)}
        <div class="line"><dt>{fieldLabel($t, f.key)}</dt><dd>{fmtValue($t, f.key, values[f.key])}</dd></div>
      {/each}
    </dl>
    <p class="lists"><span class="ok">{$t.board.eligible}</span> {eligibleNames.join(", ") || $t.board.none}</p>
    <p class="lists"><span class="pos">{$t.board.possible}</span> {possibleNames.join(", ") || $t.board.none}</p>

    <label class="pid">
      <span>{$t.board.patientId}</span>
      <input type="text" inputmode="numeric" autocomplete="off" value={$preData.patientId ?? ""} oninput={(e) => setPatientId(e.currentTarget.value)} />
    </label>

    {#if eligibleNames.length}
      <fieldset class="enroll">
        <legend>{$t.board.enrolling}</legend>
        <p class="hint">{$t.board.enrollingHint}</p>
        {#each eligibleNames as name (name)}
          {@const on = $selectedStudies.includes(name)}
          <div class="trial">
            <label class="check">
              <input type="checkbox" checked={on} onchange={() => toggle(name)} />
              <span>{name}</span>
            </label>
            {#if on && hasKnownStudyArm(name)}
              {@const arm = $studyOutcomes[name] ?? "intervention"}
              <div class="arms" role="radiogroup" aria-label={`${$t.share.outcomeFor} ${name}`}>
                <button type="button" role="radio" aria-checked={arm === "intervention"} class="arm" class:on={arm === "intervention"} onclick={() => setArm(name, "intervention")}>{$t.share.intervention}</button>
                <button type="button" role="radio" aria-checked={arm === "control"} class="arm" class:on={arm === "control"} onclick={() => setArm(name, "control")}>{$t.share.control}</button>
              </div>
            {/if}
          </div>
        {/each}
      </fieldset>
      <!-- Stessi avvisi del Riepilogo per gli studi scelti. -->
      <BoardAlerts alerts={selectionAlerts($selectedStudies, $boardAlertInput)} />
    {/if}

    <div class="actions">
      <div class="row">
        <Button variant="secondary" onclick={copy}>{#snippet children()}{$t.share.copy}{/snippet}</Button>
        <Button variant="secondary" onclick={shareWhatsApp}>{#snippet children()}WhatsApp{/snippet}</Button>
      </div>
      {#if sendStatus === "confirmed"}
        <p class="done" role="status">{$t.share.saveSuccess}</p>
      {:else}
        {#if sendStatus}
          <p class="warn" role="alert">{statusMessage(sendStatus)}</p>
        {/if}
        <Button variant="primary" fullWidth loading={saving} onclick={save}>
          {#snippet children()}{sendStatus ? $t.share.retrySend : $t.share.sendToSheet}{/snippet}
        </Button>
      {/if}
    </div>
  {/snippet}
</Sheet>

<style>
  .title {
    margin: 0 6px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .sum {
    margin: 12px 6px 0;
    font-size: 13.5px;
    line-height: 1.55;
  }
  .line {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 7px 0;
    border-bottom: 1px solid var(--border);
  }
  dt { color: var(--text-muted); }
  dd {
    margin: 0;
    font-family: var(--font-mono);
    text-align: right;
  }
  .lists {
    margin: 10px 6px 0;
    font-size: 13.5px;
  }
  .lists .ok { color: var(--success); font-weight: 600; }
  .lists .pos { color: var(--primary-hover); font-weight: 600; }
  .pid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 16px 6px 0;
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .pid input {
    min-height: var(--touch-min);
    padding: 0 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
    font-family: var(--font-mono);
    font-size: 15px;
  }
  .enroll {
    border: none;
    margin: 16px 6px 0;
    padding: 0;
  }
  legend {
    font-size: 14px;
    font-weight: 600;
    padding: 0;
  }
  .hint {
    margin: 2px 0 6px;
    font-size: 12px;
    color: var(--text-muted);
  }
  .trial {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    min-height: 36px;
  }
  .check input {
    width: 20px;
    height: 20px;
    accent-color: var(--success);
  }
  .arms {
    display: flex;
    gap: 4px;
  }
  .arm {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    color: var(--text-muted);
    min-height: 32px;
  }
  .arm.on {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    color: var(--text-inverted);
    font-weight: 600;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 18px 6px 0;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .warn {
    margin: 0;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--warn-soft);
    color: var(--warn);
    font-size: 13.5px;
  }
  .done {
    margin: 0;
    padding: 12px;
    border-radius: 12px;
    background: var(--success-soft);
    color: var(--success);
    font-weight: 600;
    text-align: center;
  }
</style>

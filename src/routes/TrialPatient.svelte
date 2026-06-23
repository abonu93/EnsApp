<script lang="ts">
  // Quick patient: flusso indipendente dal guided. NON tocca preData/postData.
  // Form completo + invio diretto a Google Sheets + saving locale.
  // Niente passaggio per Summary/Share del flusso guided.
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import NihssScale from "$lib/components/NihssScale.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import DateTimeField from "$lib/components/DateTimeField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { TRIALS_INFO } from "$lib/domain/trials-info";
  import { buildTrialsForSheet, sendToSheet, hasKnownStudyArm } from "$lib/domain/sheet-payload";
  import { addSavedPatient } from "$lib/stores/savedPatients";
  import { quickPatient, clearQuickPatient } from "$lib/stores/quickPatient";
  import { hoursSince } from "$lib/stores/patient";
  import { fmtHoursAsClock } from "$lib/utils/time";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  type Arm = "intervention" | "control" | "";
  type YesNo = "Yes" | "No" | "";
  type MticiVal = "" | "0" | "1" | "2a" | "2b50" | "2b67" | "2c" | "3";

  let patientId = $state($quickPatient.patientId ?? "");
  let age = $state<number | null>($quickPatient.age ?? null);
  let nihss = $state<number | null>($quickPatient.nihss ?? null);
  let premrs = $state<number | null>($quickPatient.premrs ?? null);
  let ltswDate = $state<string>($quickPatient.ltswDate ?? "");
  let strokeType = $state<"ischemic" | "hemorrhagic" | "">(
    ($quickPatient.strokeType as "ischemic" | "hemorrhagic" | "") ?? ""
  );
  let trial = $state<string>($quickPatient.trial ?? "");
  let arm = $state<Arm>(($quickPatient.arm as Arm) ?? "");
  // Trattamenti in acuto (TEV + mTICI + TIV), come nel flusso guided (Share).
  let tev = $state<YesNo>(($quickPatient.tev as YesNo) ?? "");
  let mtici = $state<MticiVal>(($quickPatient.mtici as MticiVal) ?? "");
  let tiv = $state<YesNo>(($quickPatient.tiv as YesNo) ?? "");
  let notes = $state($quickPatient.notes ?? "");

  let saving = $state(false);
  let saved = $state(false);

  const ltswHrs = $derived(hoursSince(ltswDate));
  const showMtici = $derived(tev === "Yes");

  // Persist su store dedicato (NON preData!)
  $effect(() => {
    quickPatient.set({
      patientId,
      age: age ?? undefined,
      nihss: nihss ?? undefined,
      premrs: premrs ?? undefined,
      ltswDate: ltswDate || undefined,
      ltsw: ltswHrs,
      strokeType,
      trial: trial || undefined,
      arm: arm || undefined,
      tev: tev || undefined,
      mtici: showMtici ? mtici || undefined : undefined,
      tiv: tiv || undefined,
      notes,
    });
  });

  const trialOptions = Object.keys(TRIALS_INFO).map((name) => ({ value: name, label: name }));
  const showArm = $derived(trial !== "" && hasKnownStudyArm(trial));

  const mrsOpts: { value: number; label: string }[] = [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }));
  const strokeOpts = $derived([
    { value: "ischemic" as const, label: $t.postImaging.ischemic },
    { value: "hemorrhagic" as const, label: $t.postImaging.hemorrhagic },
  ]);
  const armOpts = $derived([
    { value: "intervention" as const, label: $t.extras.quickIntervention },
    { value: "control" as const, label: $t.extras.quickControl },
  ]);
  const ynOpts = $derived<{ value: "Yes" | "No"; label: string }[]>([
    { value: "No", label: $t.common.no },
    { value: "Yes", label: $t.common.yes },
  ]);
  const mticiOpts: { value: MticiVal; label: string }[] = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2a", label: "2a" },
    { value: "2b50", label: "2b50" },
    { value: "2b67", label: "2b67" },
    { value: "2c", label: "2c" },
    { value: "3", label: "3" },
  ];

  // Classificazione finestra terapeutica per LTSW (come PreImaging).
  function windowInfo(hours: number | undefined): { tone: "success" | "warn" | "danger"; label: string } | null {
    if (hours === undefined) return null;
    const min = hours * 60;
    if (min <= 270) return { tone: "success", label: $t.extras.windowIv };
    if (min <= 360) return { tone: "success", label: $t.extras.windowEvt };
    if (min <= 1440) return { tone: "warn", label: $t.extras.windowEvtSelected };
    return { tone: "danger", label: $t.extras.windowClosed };
  }
  const win = $derived(windowInfo(ltswHrs));

  const canSubmit = $derived(
    patientId !== "" && age !== null && (trial === "" || !showArm || arm !== "")
  );

  const message = $derived.by(() => {
    const lines: string[] = [];
    if (patientId) lines.push(`Patient ID: ${patientId}`);
    if (age != null) lines.push(`Age: ${age}`);
    if (nihss != null) lines.push(`NIHSS: ${nihss}`);
    if (premrs != null) lines.push(`pre-mRS: ${premrs}`);
    if (ltswHrs != null) lines.push(`LTSW: ${fmtHoursAsClock(ltswHrs)}`);
    if (strokeType) lines.push(`Stroke type: ${strokeType}`);
    if (trial) {
      lines.push("");
      if (hasKnownStudyArm(trial) && arm) {
        lines.push(`Trial: ${trial} - ${arm}`);
      } else {
        lines.push(`Trial: ${trial}`);
      }
    }

    // Acute treatments
    const extras: string[] = [];
    if (tev) extras.push(`TEV: ${tev}`);
    if (showMtici && mtici) extras.push(`mTICI: ${mtici}`);
    if (tiv) extras.push(`TIV: ${tiv}`);
    if (extras.length > 0) {
      lines.push("");
      lines.push("Acute treatments:");
      for (const e of extras) lines.push(`- ${e}`);
    }

    if (notes.trim()) {
      lines.push("");
      lines.push(`Notes: ${notes.trim()}`);
    }
    return lines.join("\n");
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      announce("Copied");
    } catch {
      // ignore
    }
  }

  function shareWhatsApp() {
    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  async function submit() {
    if (!canSubmit || saving) return;
    saving = true;

    const outcomes: Record<string, "intervention" | "control"> =
      trial && arm && hasKnownStudyArm(trial) ? { [trial]: arm } : {};
    const selected = trial ? [trial] : [];

    const payload = {
      patientId,
      age,
      nihss,
      premrs,
      ltsw: ltswHrs,
      strokeType,
      ...buildTrialsForSheet(selected, outcomes),
      TEV: tev,
      mTICI: showMtici ? mtici : "",
      TIV: tiv,
      Notes: notes,
      missed: "",
      eligible: "",
      source: "quick-patient",
      timestamp: new Date().toISOString(),
    };
    await sendToSheet(payload);

    addSavedPatient({
      patientId,
      strokeType,
      age: age ?? undefined,
      nihss: nihss ?? undefined,
      trials: selected,
      snapshot: {
        pre: {
          patientId,
          age: age ?? undefined,
          nihss: nihss ?? undefined,
          premrs: premrs ?? undefined,
          ltswDate: ltswDate || undefined,
          ltsw: ltswHrs,
        },
        post: { strokeType: strokeType || undefined },
        hem: {},
        studies: selected,
        outcomes,
        chronic: [],
        notes,
        extras: {
          tev: tev || undefined,
          mtici: showMtici ? mtici || undefined : undefined,
          tiv: tiv || undefined,
        },
      },
    });

    saving = false;
    saved = true;
    announce($t.share.saveSuccess);
  }

  function backHome() {
    clearQuickPatient();
    push("/");
  }
</script>

<AppHeader title={$t.workflow.quickTitle} sub={$t.extras.quickSubtitle} onBack={() => push("/workflow")} />

<div class="body">
  <Card>
    {#snippet children()}
      <label class="field">
        <span class="lbl">{$t.preImaging.patientRecordLabel}</span>
        <input class="input mono" type="text" bind:value={patientId} placeholder={$t.preImaging.patientRecordPlaceholder} />
      </label>
    {/snippet}
  </Card>

  <Card title={$t.preImaging.anamnesis}>
    {#snippet children()}
      <div class="stack">
        <label class="field">
          <span class="row-lbl"><span class="lbl">{$t.preImaging.ageLabel}</span><span class="hint">18-110</span></span>
          <div class="input-wrap">
            <input
              class="input mono"
              type="text"
              inputmode="numeric"
              value={age ?? ""}
              oninput={(e) => {
                const v = (e.currentTarget as HTMLInputElement).value.replace(/[^0-9]/g, "");
                age = v === "" ? null : Number(v);
              }}
              placeholder="—"
            />
            <span class="unit">{$t.preImaging.ageSuffix}</span>
          </div>
        </label>

        <div class="field">
          <span class="row-lbl"><span class="lbl">NIHSS</span><span class="hint">0-42</span></span>
          <NihssScale bind:value={nihss} />
        </div>

        <div class="field">
          <span class="row-lbl"><span class="lbl">pre-mRS</span><span class="hint">0 - 5</span></span>
          <Segmented options={mrsOpts} value={premrs ?? ""} onChange={(v) => (premrs = v)} />
        </div>

        <div class="field">
          <span class="lbl">{$t.postImaging.strokeTypeLabel}</span>
          <Segmented options={strokeOpts} bind:value={strokeType} cols={2} />
        </div>
      </div>
    {/snippet}
  </Card>

  <Card title={$t.preImaging.ltswLabel}>
    {#snippet children()}
      <div class="stack">
        <DateTimeField id="quick-ltsw" bind:value={ltswDate} label={$t.preImaging.ltswLabel} />

        {#if ltswHrs !== undefined}
          <div class="elapsed">
            <span class="elapsed-val">{fmtHoursAsClock(ltswHrs)}</span>
            <span class="elapsed-lbl">{$t.extras.sinceLtsw}</span>
          </div>
          {#if win}
            <div class="window tone-{win.tone}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{win.label}</span>
            </div>
          {/if}
        {/if}
      </div>
    {/snippet}
  </Card>

  <Card title={$t.extras.quickTrialLabel}>
    {#snippet children()}
      <label class="field">
        <span class="sr-only">{$t.extras.quickTrialLabel}</span>
        <select class="input" bind:value={trial} aria-label={$t.extras.quickTrialLabel}>
          <option value="">{$t.extras.quickTrialPlaceholder}</option>
          {#each trialOptions as opt (opt.value)}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </label>
      {#if showArm}
        <div class="field" style="margin-top: 16px">
          <span class="lbl">{$t.extras.quickArmLabel}</span>
          <Segmented options={armOpts} bind:value={arm} cols={2} />
        </div>
      {/if}
    {/snippet}
  </Card>

  <Card title={$t.extras.acuteTreatments}>
    {#snippet children()}
      <div class="stack">
        <RadioGroup id="quick-tev" label={$t.trialPatient.tevLabel} name="tev" columns={2} bind:value={tev} options={ynOpts} />
        {#if showMtici}
          <label class="field">
            <span class="lbl">{$t.trialPatient.mticiLabel}</span>
            <select class="input" bind:value={mtici} aria-label={$t.trialPatient.mticiLabel}>
              <option value="">--</option>
              {#each mticiOpts as opt (opt.value)}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </label>
        {/if}
        <RadioGroup id="quick-tiv" label={$t.trialPatient.tivLabel} name="tiv" columns={2} bind:value={tiv} options={ynOpts} />
      </div>
    {/snippet}
  </Card>

  <Card title={$t.share.notesLabel}>
    {#snippet children()}
      <textarea class="notes" rows="3" bind:value={notes} placeholder={$t.share.notesPlaceholder}></textarea>
    {/snippet}
  </Card>

  <Card title={$t.share.messagePreview}>
    {#snippet children()}
      <pre class="preview">{message || "—"}</pre>
      <div class="msg-actions">
        <button type="button" class="msg-btn" onclick={copy} disabled={!message}>
          {$t.share.copy}
        </button>
        <button type="button" class="msg-btn" onclick={shareWhatsApp} disabled={!message}>
          WhatsApp
        </button>
      </div>
    {/snippet}
  </Card>

  {#if saved}
    <Card>
      {#snippet children()}
        <div class="success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{$t.share.saveSuccess}</span>
        </div>
      {/snippet}
    </Card>
  {/if}
</div>

{#if !saved}
  <BottomBar
    onBack={() => push("/workflow")}
    onNext={submit}
    nextDisabled={!canSubmit || saving}
    nextLabel={$t.extras.sendDirect}
  />
{:else}
  <BottomBar
    onNext={backHome}
    nextLabel={$t.extras.goHome}
  />
{/if}

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .stack { display: flex; flex-direction: column; gap: 18px; }
  .field { display: block; }
  .row-lbl {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .lbl { font-size: 13.5px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 8px; }
  .row-lbl .lbl { margin-bottom: 0; }
  .hint { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); }
  .input-wrap { position: relative; display: flex; align-items: center; }
  .input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px 14px;
    font-size: 16px;
    color: var(--text);
    background: var(--surface);
    font-family: inherit;
    outline: none;
    transition: border-color var(--transition-fast);
  }
  .input.mono { font-family: var(--font-mono); }
  .input:focus { border-color: var(--primary); box-shadow: var(--focus-ring); }
  .elapsed {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .elapsed-val {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.4px;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .elapsed-lbl { font-size: 12.5px; color: var(--text-muted); }
  .window {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .window.tone-success { background: var(--success-soft); color: var(--success); }
  .window.tone-warn { background: var(--warn-soft); color: var(--warn); }
  .window.tone-danger { background: var(--danger-soft); color: var(--danger); }
  .unit {
    position: absolute;
    right: 14px;
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    pointer-events: none;
  }
  .notes {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px 14px;
    background: var(--surface);
    color: var(--text);
    font: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
  }
  .notes:focus { border-color: var(--primary); box-shadow: var(--focus-ring); }
  .success {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
    color: var(--success);
    font-weight: 600;
  }
  .preview {
    margin: 0;
    padding: 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--text);
    max-height: 220px;
    overflow: auto;
  }
  .msg-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;
  }
  .msg-btn {
    min-height: 40px;
    padding: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 10px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .msg-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
  .msg-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0);
    white-space: nowrap; border: 0;
  }
</style>

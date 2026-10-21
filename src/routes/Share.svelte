<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { preData, postData, hemData, clearPatient, ltswHours } from "$lib/stores/patient";
  import {
    selectedStudies,
    studyOutcomes,
    notesText,
    clearSelection,
    flowOrigin,
  } from "$lib/stores/trialSelection";
  import { addSavedPatient } from "$lib/stores/savedPatients";
  import { sendToSheet, hasKnownStudyArm, type SendStatus } from "$lib/domain/sheet-payload";
  import { buildShareMessage, buildSheetPayload, type PatientRecord } from "$lib/domain/patient-record";
  import { eligibleOpenTrials } from "$lib/stores/eligibility";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  let saving = $state(false);
  let saved = $state(false);
  // Esito verificato dell'invio: "saved" solo se la riga e' nel foglio.
  let sendStatus = $state<SendStatus | null>(null);
  let savedLocally = false;

  // Trattamenti acuti aggiuntivi (TEV + mTICI + TIV)
  type YesNo = "Yes" | "No" | "";
  type MticiVal = "" | "0" | "1" | "2a" | "2b50" | "2b67" | "2c" | "3";

  // TEV/TIV gia' noti dalla candidatura (board o post-imaging): non si
  // richiedono, si mostra solo il valore (e l'mTICI se c'e' trombectomia).
  const fromCandidacy = (c: string | undefined): YesNo => (c === "eligible" ? "Yes" : c === "not eligible" ? "No" : "");
  const tevGiven = $derived(fromCandidacy($postData.candidate));
  const tivGiven = $derived(fromCandidacy($postData.ivtCandidate));
  // svelte-ignore state_referenced_locally
  let tev = $state<YesNo>(fromCandidacy($postData.candidate));
  let mtici = $state<MticiVal>("");
  // svelte-ignore state_referenced_locally
  let tiv = $state<YesNo>(fromCandidacy($postData.ivtCandidate));
  const plain = (label: string) => label.replace(/[¿?]/g, "").trim();

  // Emorragia: niente TEV/TIV, si chiede la reversione dell'anticoagulazione e con cosa.
  const isHem = $derived($postData.strokeType === "hemorrhagic");
  let reversal = $state<YesNo>("");
  let reversalAgent = $state("");
  const REVERSAL_AGENTS = ["idarucizumab", "andexanet", "pcc", "vitk", "ffp", "protamine", "other"] as const;

  // Senza ID paziente non si invia (foglio e WhatsApp).
  const idMissing = $derived(!$preData.patientId?.trim());

  const showMtici = $derived(tev === "Yes");

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
    tev: isHem ? "" : tev,
    mtici: !isHem && showMtici ? mtici : "",
    tiv: isHem ? "" : tiv,
    reversal: isHem ? reversal : "",
    reversalAgent: isHem && reversal === "Yes" ? reversalAgent : "",
    wakeup: $preData.wakeupStroke === true,
    targetVessels: $postData.targetVessels,
    tandem: $postData.tandem,
    aspects: $postData.aspects,
    evtCandidate: $postData.candidate,
    ivtCandidate: $postData.ivtCandidate,
    gcs: $hemData.gcs,
    hemVolume: $hemData.hemVolume,
    anticoag: $hemData.anticoag,
    secondaryCause: $hemData.secondaryCause,
    spotSign: $hemData.spotSign,
  });
  const message = $derived(buildShareMessage(record));

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      announce($t.share.copied);
    } catch {
      announce($t.common.error);
    }
  }

  function shareWhatsApp() {
    if (idMissing) return;
    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  async function save() {
    if (saving || idMissing) return;
    saving = true;
    const { payload, missed } = buildSheetPayload(record, $eligibleOpenTrials, $flowOrigin === "board" ? "board" : "guided");
    const result = await sendToSheet(payload);
    sendStatus = result.status;

    // Salva localmente per accesso futuro (una sola volta, anche se si riprova l'invio).
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
        extras: {
          tev: tev || undefined,
          mtici: showMtici ? mtici : undefined,
          tiv: tiv || undefined,
        },
      },
    });
    }

    saving = false;
    saved = result.status === "confirmed";
    announce(saved ? $t.share.saveSuccess : sendMessage(result.status));
  }

  function sendMessage(status: SendStatus): string {
    if (status === "not-found") return $t.share.saveNotFound;
    if (status === "unverified") return $t.share.saveUnverified;
    if (status === "failed") return $t.share.saveFailed;
    return $t.share.saveSuccess;
  }

  function newPatient() {
    clearPatient();
    clearSelection();
    push("/");
  }

  function setOutcome(name: string, value: "intervention" | "control") {
    studyOutcomes.update((o) => ({ ...o, [name]: value }));
  }

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
</script>

<AppHeader title={$t.share.title} sub={$t.share.subtitle} step={2} steps={3} onBack={() => push($flowOrigin === "board" ? "/board" : "/summary")} />

<div class="body"><div class="stack">
  {#each $selectedStudies as name (name)}
    {#if hasKnownStudyArm(name)}
      <Card title={`${$t.share.outcomeFor} ${name}`}>
        {#snippet children()}
          {@const current = $studyOutcomes[name] ?? "intervention"}
          <div class="arm-row">
            <button
              type="button"
              class="arm-btn"
              class:active={current === "intervention"}
              onclick={() => setOutcome(name, "intervention")}
            >
              {$t.share.intervention}
            </button>
            <button
              type="button"
              class="arm-btn"
              class:active={current === "control"}
              onclick={() => setOutcome(name, "control")}
            >
              {$t.share.control}
            </button>
          </div>
        {/snippet}
      </Card>
    {/if}
  {/each}

  <Card title={$t.share.patientId}>
    {#snippet children()}
      <input
        class="pid"
        type="text"
        autocomplete="off"
        aria-label={$t.share.patientId}
        value={$preData.patientId ?? ""}
        oninput={(e) => preData.update((s) => ({ ...s, patientId: e.currentTarget.value.trim() || undefined }))}
      />
    {/snippet}
  </Card>

  <Card title={$t.extras.acuteTreatments}>
    {#snippet children()}
      <div class="form-stack">
        {#if isHem}
          <RadioGroup id="share-reversal" label={$t.share.reversalLabel} name="reversal" columns={2} bind:value={reversal} options={ynOpts} />
          {#if reversal === "Yes"}
            <div class="field">
              <label for="share-reversal-agent" class="lbl">{$t.share.reversalAgentLabel}</label>
              <select id="share-reversal-agent" class="select" bind:value={reversalAgent}>
                <option value="">--</option>
                {#each REVERSAL_AGENTS as a (a)}
                  <option value={a}>{$t.share.reversalAgents[a]}</option>
                {/each}
              </select>
            </div>
          {/if}
        {:else}
        {#if tevGiven}
          <p class="given"><span>{plain($t.trialPatient.tevLabel)}</span><strong>{tevGiven === "Yes" ? $t.common.yes : $t.common.no}</strong></p>
        {:else}
          <RadioGroup id="share-tev" label={$t.trialPatient.tevLabel} name="tev" columns={2} bind:value={tev} options={ynOpts} />
        {/if}
        {#if showMtici}
          <div class="field">
            <label for="share-mtici" class="lbl">mTICI</label>
            <select id="share-mtici" class="select" bind:value={mtici}>
              <option value="">--</option>
              {#each mticiOpts as opt (opt.value)}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>
        {/if}
        {#if tivGiven}
          <p class="given"><span>{plain($t.trialPatient.tivLabel)}</span><strong>{tivGiven === "Yes" ? $t.common.yes : $t.common.no}</strong></p>
        {:else}
          <RadioGroup id="share-tiv" label={$t.trialPatient.tivLabel} name="tiv" columns={2} bind:value={tiv} options={ynOpts} />
        {/if}
        {/if}
      </div>
    {/snippet}
  </Card>

  <Card title={$t.share.notesLabel}>
    {#snippet children()}
      <textarea
        class="notes"
        placeholder={$t.share.notesPlaceholder}
        bind:value={$notesText}
        rows="4"
      ></textarea>
    {/snippet}
  </Card>

  <Card title={$t.share.messagePreview}>
    {#snippet children()}
      <pre class="preview">{message}</pre>
    {/snippet}
  </Card>

  <div class="actions">
    {#if !saved}
      <div class="action-row">
        <Button variant="secondary" onclick={copy}>
          {#snippet children()}{$t.share.copy}{/snippet}
        </Button>
        <Button variant="secondary" disabled={idMissing} onclick={shareWhatsApp}>
          {#snippet children()}WhatsApp{/snippet}
        </Button>
      </div>
      {#if idMissing}
        <p class="send-warn" role="alert">{$t.share.idRequired}</p>
      {/if}
      {#if sendStatus && sendStatus !== "confirmed"}
        <p class="send-warn" role="alert">{sendMessage(sendStatus)}</p>
      {/if}
      <Button variant="primary" fullWidth loading={saving} disabled={idMissing} onclick={save}>
        {#snippet children()}{sendStatus && sendStatus !== "confirmed" ? $t.share.retrySend : $t.share.sendToSheet}{/snippet}
      </Button>
    {:else}
      <div class="success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{$t.share.saveSuccess}</span>
      </div>
      <Button variant="secondary" fullWidth onclick={() => push("/saved")}>
        {#snippet children()}{$t.share.goToSaved}{/snippet}
      </Button>
      <Button variant="primary" fullWidth onclick={newPatient}>
        {#snippet children()}{$t.landing.newPatient}{/snippet}
      </Button>
    {/if}
  </div>
</div>
</div>

<style>
  .body { padding: 6px 16px 16px; }
  .send-warn {
    margin: 0;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--warn-soft);
    color: var(--warn);
    font-size: 13.5px;
  }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .form-stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .field { display: flex; flex-direction: column; gap: var(--sp-1); }
  .lbl { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text); }
  .select {
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
  }
  .given {
    display: flex;
    justify-content: space-between;
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .given strong { color: var(--text); }
  .pid {
    width: 100%;
    min-height: var(--touch-min);
    padding: 0 var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
    font-family: var(--font-mono);
  }
  .notes {
    width: 100%;
    padding: var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
    resize: vertical;
    min-height: 96px;
  }
  .notes:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .preview {
    margin: 0;
    padding: var(--sp-3);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--text);
    max-height: 280px;
    overflow: auto;
  }
  .actions {
    display: grid;
    gap: var(--sp-2);
    position: sticky;
    bottom: var(--bottom-nav-h);
    background: var(--surface-elevated);
    padding: var(--sp-3);
    margin-inline: calc(-1 * var(--sp-4));
    border-top: 1px solid var(--border);
  }
  .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-2); }
  .arm-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-2); }
  .arm-btn {
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
    font-weight: var(--fw-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .arm-btn:hover { border-color: var(--primary); color: var(--primary); }
  .arm-btn.active {
    background: var(--primary);
    color: var(--text-inverted);
    border-color: var(--primary);
  }
  .success {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-2);
    padding: var(--sp-3);
    background: var(--success-soft);
    color: var(--success);
    border-radius: var(--radius-md);
    font-weight: var(--fw-medium);
  }
</style>

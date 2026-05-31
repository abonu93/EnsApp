<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { preData, postData, hemData, clearPatient } from "$lib/stores/patient";
  import {
    selectedStudies,
    studyOutcomes,
    notesText,
    clearSelection,
  } from "$lib/stores/trialSelection";
  import { addSavedPatient } from "$lib/stores/savedPatients";
  import { buildTrialsForSheet, sendToSheet, hasKnownStudyArm } from "$lib/domain/sheet-payload";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  let saving = $state(false);
  let saved = $state(false);

  // Trattamenti acuti aggiuntivi (TEV + mTICI + TIV)
  type YesNo = "Yes" | "No" | "";
  type MticiVal = "" | "0" | "1" | "2a" | "2b50" | "2b67" | "2c" | "3";

  let tev = $state<YesNo>("");
  let mtici = $state<MticiVal>("");
  let tiv = $state<YesNo>("");

  const showMtici = $derived(tev === "Yes");

  const message = $derived.by(() => {
    const lines: string[] = [];
    if ($preData.patientId) lines.push(`Patient ID: ${$preData.patientId}`);
    if ($preData.age != null) lines.push(`Age: ${$preData.age}`);
    if ($preData.nihss != null) lines.push(`NIHSS: ${$preData.nihss}`);
    if ($preData.premrs != null) lines.push(`pre-mRS: ${$preData.premrs}`);
    if ($preData.ltsw != null) lines.push(`LTSW: ${$preData.ltsw.toFixed(1)}h`);
    if ($postData.strokeType) lines.push(`Stroke type: ${$postData.strokeType}`);

    if ($selectedStudies.length > 0) {
      lines.push("");
      lines.push("Selected trials:");
      for (const name of $selectedStudies) {
        if (hasKnownStudyArm(name)) {
          lines.push(`- ${name}: ${$studyOutcomes[name] ?? "intervention"}`);
        } else {
          lines.push(`- ${name}`);
        }
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

    if ($notesText.trim()) {
      lines.push("");
      lines.push(`Notes: ${$notesText.trim()}`);
    }
    return lines.join("\n");
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      announce("Copiato");
    } catch {
      announce("Errore nella copia");
    }
  }

  function shareWhatsApp() {
    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  async function save() {
    if (saving) return;
    saving = true;
    const sheetTrials = buildTrialsForSheet($selectedStudies, $studyOutcomes);
    const payload = {
      patientId: $preData.patientId,
      age: $preData.age,
      nihss: $preData.nihss,
      premrs: $preData.premrs,
      ltsw: $preData.ltsw,
      strokeType: $postData.strokeType,
      ...sheetTrials,
      TEV: tev,
      mTICI: showMtici ? mtici : "",
      TIV: tiv,
      Notes: $notesText,
      timestamp: new Date().toISOString(),
    };
    await sendToSheet(payload);

    // Salva localmente per accesso futuro
    addSavedPatient({
      patientId: $preData.patientId,
      strokeType: $postData.strokeType,
      age: $preData.age,
      nihss: $preData.nihss,
      trials: [...$selectedStudies],
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

    saving = false;
    saved = true;
    announce($t.share.saveSuccess);
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

<AppHeader title={$t.share.title} sub={$t.share.subtitle} step={2} steps={3} onBack={() => push("/summary")} />

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

  <Card title="Trattamenti in acuto">
    {#snippet children()}
      <div class="form-stack">
        <RadioGroup id="share-tev" label="Trombectomia (TEV)?" name="tev" columns={2} bind:value={tev} options={ynOpts} />
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
        <RadioGroup id="share-tiv" label="Trombolisi (TIV)?" name="tiv" columns={2} bind:value={tiv} options={ynOpts} />
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
        <Button variant="secondary" onclick={shareWhatsApp}>
          {#snippet children()}WhatsApp{/snippet}
        </Button>
      </div>
      <Button variant="primary" fullWidth loading={saving} onclick={save}>
        {#snippet children()}{$t.share.sendToSheet}{/snippet}
      </Button>
    {:else}
      <div class="success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{$t.share.saveSuccess}</span>
      </div>
      <Button variant="secondary" fullWidth onclick={() => push("/saved")}>
        {#snippet children()}Vai ai pazienti salvati{/snippet}
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

<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { preData, postData, hemData, clearPatient } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText, clearSelection } from "$lib/stores/trialSelection";
  import { buildTrialsForSheet, sendToSheet, hasKnownStudyArm } from "$lib/domain/sheet-payload";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  let saving = $state(false);
  let saved = $state(false);

  const message = $derived.by(() => {
    const lines: string[] = [];
    if ($preData.patientId) lines.push(`Patient ID: ${$preData.patientId}`);
    if ($preData.age != null) lines.push(`Age: ${$preData.age}`);
    if ($preData.nihss != null) lines.push(`NIHSS: ${$preData.nihss}`);
    if ($preData.premrs != null) lines.push(`pre-mRS: ${$preData.premrs}`);
    if ($preData.ltsw != null) lines.push(`LTSW: ${$preData.ltsw}h`);
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

  async function save() {
    if (saving) return;
    saving = true;
    const payload = {
      patientId: $preData.patientId,
      age: $preData.age,
      nihss: $preData.nihss,
      premrs: $preData.premrs,
      ltsw: $preData.ltsw,
      strokeType: $postData.strokeType,
      ...buildTrialsForSheet($selectedStudies, $studyOutcomes),
      notes: $notesText,
      timestamp: new Date().toISOString(),
    };
    await sendToSheet(payload);
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
</script>

<h1>{$t.share.title}</h1>
<p class="lead">{$t.share.subtitle}</p>

<div class="stack">
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
      <Button variant="ghost" onclick={copy}>
        {#snippet children()}{$t.share.copy}{/snippet}
      </Button>
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
      <Button variant="primary" fullWidth onclick={newPatient}>
        {#snippet children()}{$t.landing.newPatient}{/snippet}
      </Button>
    {/if}
  </div>
</div>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
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
  .notes:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
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
  .arm-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-2);
  }
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
  .arm-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
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

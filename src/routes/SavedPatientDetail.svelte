<script lang="ts">
  // Dettaglio paziente salvato (read-only) + tasto Modifica che riapre
  // il record nel flusso /share con i dati pre-popolati.
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { savedPatients, removeSavedPatient, type SavedPatient } from "$lib/stores/savedPatients";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText, selectedChronic } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";
  import { fmtHoursAsClock } from "$lib/utils/time";

  interface Props { params?: { id?: string } }
  let { params }: Props = $props();
  const id = $derived(params?.id ? decodeURIComponent(params.id) : "");
  const patient = $derived<SavedPatient | undefined>($savedPatients.find((p) => p.id === id));

  function formatDate(iso: string): string {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  }

  function modify() {
    if (!patient) return;
    preData.set(patient.snapshot.pre);
    postData.set(patient.snapshot.post);
    hemData.set(patient.snapshot.hem);
    selectedStudies.set(patient.snapshot.studies);
    studyOutcomes.set(patient.snapshot.outcomes);
    selectedChronic.set(patient.snapshot.chronic);
    notesText.set(patient.snapshot.notes);
    push("/share");
  }

  function remove() {
    if (!patient) return;
    if (confirm(`${$t.extras.savedRemoveConfirm} "${patient.patientId || patient.id}"?`)) {
      removeSavedPatient(patient.id);
      push("/saved");
    }
  }
</script>

{#if !patient}
  <AppHeader title={$t.extras.notFound} sub={$t.extras.notInLocalArchive} onBack={() => push("/saved")} />
  <div class="body">
    <Card>
      {#snippet children()}
        <p class="muted">{$t.extras.syncToFetch}</p>
      {/snippet}
    </Card>
  </div>
{:else}
  <AppHeader
    title={patient.patientId || $t.extras.senza}
    sub={formatDate(patient.savedAt)}
    onBack={() => push("/saved")}
  />

  <div class="body">
    <div class="head-row">
      {#if patient.strokeType}
        <Pill tone={patient.strokeType === "ischemic" ? "ischemic" : "hemorrhagic"}>
          {#snippet children()}{patient.strokeType}{/snippet}
        </Pill>
      {/if}
      {#if patient.remote}
        <Pill tone="info">{#snippet children()}cloud{/snippet}</Pill>
      {/if}
    </div>

    <Card title={$t.preImaging.anamnesis}>
      {#snippet children()}
        <dl class="kv">
          {#if patient.age != null}
            <div><dt>{$t.extras.age}</dt><dd>{patient.age}</dd></div>
          {/if}
          {#if patient.nihss != null}
            <div><dt>NIHSS</dt><dd>{patient.nihss}</dd></div>
          {/if}
          {#if patient.snapshot.pre.premrs != null}
            <div><dt>pre-mRS</dt><dd>{patient.snapshot.pre.premrs}</dd></div>
          {/if}
          {#if patient.snapshot.pre.ltsw != null}
            <div><dt>LTSW</dt><dd>{fmtHoursAsClock(patient.snapshot.pre.ltsw)}</dd></div>
          {/if}
        </dl>
      {/snippet}
    </Card>

    {#if patient.trials.length > 0}
      <Card title={$t.extras.trialsEnrolled}>
        {#snippet children()}
          <ul class="chip-list">
            {#each patient.trials as name}
              <li class="chip enrolled">{name}</li>
            {/each}
          </ul>
        {/snippet}
      </Card>
    {/if}

    {#if patient.missed && patient.missed.length > 0}
      <Card title={`${$t.extras.trialsEligibleNotEnrolled} (${patient.missed.length})`}>
        {#snippet children()}
          <ul class="chip-list">
            {#each patient.missed as name}
              <li class="chip missed">{name}</li>
            {/each}
          </ul>
        {/snippet}
      </Card>
    {/if}

    {#if patient.snapshot.extras.tev || patient.snapshot.extras.mtici || patient.snapshot.extras.tiv}
      <Card title={$t.extras.acuteTreatments}>
        {#snippet children()}
          <dl class="kv">
            {#if patient.snapshot.extras.tev}
              <div><dt>TEV</dt><dd>{patient.snapshot.extras.tev}</dd></div>
            {/if}
            {#if patient.snapshot.extras.mtici}
              <div><dt>mTICI</dt><dd class="mono">{patient.snapshot.extras.mtici}</dd></div>
            {/if}
            {#if patient.snapshot.extras.tiv}
              <div><dt>TIV</dt><dd>{patient.snapshot.extras.tiv}</dd></div>
            {/if}
          </dl>
        {/snippet}
      </Card>
    {/if}

    {#if patient.snapshot.notes && patient.snapshot.notes.trim() !== ""}
      <Card title={$t.share.notesLabel}>
        {#snippet children()}
          <p class="notes">{patient.snapshot.notes}</p>
        {/snippet}
      </Card>
    {/if}

    <div class="actions">
      <button class="action-btn danger" type="button" onclick={remove}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
        {$t.extras.deleteAction}
      </button>
      <button class="action-btn primary" type="button" onclick={modify}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {$t.extras.edit}
      </button>
    </div>
  </div>
{/if}

<style>
  .body { padding: 6px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
  .head-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .muted { color: var(--text-muted); margin: 0; font-size: 14px; }
  .kv {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 0;
  }
  .kv div { display: flex; flex-direction: column; gap: 2px; }
  dt {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
  }
  dd {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    font-family: var(--font-mono);
  }
  dd.mono { font-family: var(--font-mono); }
  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chip {
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .chip.enrolled {
    background: var(--success-soft);
    color: var(--success);
  }
  .chip.missed {
    background: var(--warn-soft);
    color: var(--warn);
  }
  .notes {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .actions {
    position: sticky;
    bottom: calc(var(--bottom-nav-h) + 12px);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    margin-top: 16px;
    padding: 8px;
    background: var(--bg);
    border-radius: 16px;
  }
  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 18px;
    border-radius: 14px;
    border: none;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: transform var(--transition-fast), background var(--transition-base);
    min-height: var(--touch-min);
  }
  .action-btn:active { transform: scale(0.98); }
  .action-btn.danger {
    background: var(--surface);
    color: var(--danger);
    border: 1px solid var(--border);
  }
  .action-btn.danger:hover {
    background: var(--danger-soft);
    border-color: var(--danger);
  }
  .action-btn.primary {
    background: var(--primary);
    color: var(--text-inverted);
    box-shadow: 0 6px 16px rgba(45, 91, 215, 0.28);
  }
  .action-btn.primary:hover { background: var(--primary-hover); }
</style>

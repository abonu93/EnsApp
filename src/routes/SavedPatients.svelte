<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { savedPatients, removeSavedPatient, type SavedPatient } from "$lib/stores/savedPatients";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { selectedStudies, studyOutcomes, notesText, selectedChronic } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";

  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  function reopen(p: SavedPatient) {
    // Ripristina lo stato del paziente nei vari store
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
    const ok = confirm(`Rimuovere "${label}" dalla lista locale?`);
    if (ok) removeSavedPatient(id);
  }
</script>

<h1>Pazienti inviati</h1>
<p class="lead">Lista locale dei pazienti gia' salvati. Tap per riaprire.</p>

{#if $savedPatients.length === 0}
  <Card>
    {#snippet children()}
      <p class="empty">Nessun paziente salvato ancora.</p>
      <div class="empty-actions">
        <Button variant="primary" onclick={() => push("/workflow")}>
          {#snippet children()}{$t.landing.newPatient}{/snippet}
        </Button>
      </div>
    {/snippet}
  </Card>
{:else}
  <ul class="saved-list">
    {#each $savedPatients as p (p.id)}
      <li>
        <Card>
          {#snippet children()}
            <div class="saved-row">
              <button class="saved-main" type="button" onclick={() => reopen(p)} aria-label={`Riapri paziente ${p.patientId ?? p.id}`}>
                <div class="saved-head">
                  <strong>{p.patientId || `(senza ID)`}</strong>
                  {#if p.strokeType}
                    <Pill tone={p.strokeType === "ischemic" ? "ischemic" : "hemorrhagic"}>
                      {#snippet children()}{p.strokeType}{/snippet}
                    </Pill>
                  {/if}
                </div>
                <div class="saved-meta">
                  {#if p.age != null}<span>Eta' {p.age}</span>{/if}
                  {#if p.nihss != null}<span>NIHSS {p.nihss}</span>{/if}
                  {#if p.trials.length > 0}<span>Trial: {p.trials.join(", ")}</span>{/if}
                </div>
                <small class="saved-date">{formatDate(p.savedAt)}</small>
              </button>
              <button class="remove-btn" type="button" onclick={() => remove(p.id, p.patientId || p.id)} aria-label="Rimuovi dalla lista">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .empty { color: var(--text-muted); text-align: center; padding-block: var(--sp-3); margin: 0; }
  .empty-actions { display: flex; justify-content: center; margin-top: var(--sp-3); }
  .saved-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--sp-3); }
  .saved-row { display: flex; align-items: stretch; gap: var(--sp-2); }
  .saved-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    padding: 0;
    text-align: left;
    color: var(--text);
    min-height: var(--touch-min);
    cursor: pointer;
  }
  .saved-main:hover { color: var(--primary); }
  .saved-head {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
  .saved-head strong { font-size: var(--fs-base); }
  .saved-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .saved-date {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    margin-top: var(--sp-1);
  }
  .remove-btn {
    flex-shrink: 0;
    width: var(--touch-min);
    height: var(--touch-min);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    border-radius: var(--radius-md);
    transition: color var(--transition-fast), background var(--transition-fast);
  }
  .remove-btn:hover { color: var(--danger); background: var(--danger-soft); }
</style>

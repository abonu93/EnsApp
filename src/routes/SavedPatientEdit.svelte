<script lang="ts">
  // Modifica di un paziente gia' salvato: tutti i dati registrati all'invio
  // (ID, eta', NIHSS, pre-mRS, LTSW, tipo di ictus, studi con braccio,
  // trattamenti acuti, note) in una sola pagina. Il record locale si aggiorna
  // subito; nel foglio si corregge la riga esistente (op=update), senza
  // aggiungerne una nuova.
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import RegTrialPicker from "$lib/components/registered/RegTrialPicker.svelte";
  import { savedPatients, replaceSavedPatient, type SavedPatient } from "$lib/stores/savedPatients";
  import {
    applyDraft,
    buildUpdatePayload,
    draftFromSaved,
    draftProblems,
    isMaskedId,
    missedAfterEdit,
    MTICI_VALUES,
    REVERSAL_AGENTS,
    type Arm,
    type EditDraft,
    type YesNo,
  } from "$lib/domain/patient-edit";
  import { hasKnownStudyArm, sendUpdateToSheet, type UpdateStatus } from "$lib/domain/sheet-payload";
  import { fill } from "$lib/components/board/format";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  interface Props { params?: { id?: string } }
  let { params }: Props = $props();
  const id = $derived(params?.id ? decodeURIComponent(params.id) : "");
  const patient = $derived<SavedPatient | undefined>($savedPatients.find((p) => p.id === id));

  // Bozza creata una volta all'apertura (la sync non deve cancellare cio' che si sta scrivendo).
  let draft = $state<EditDraft | null>(null);
  $effect(() => {
    if (!draft && patient) draft = draftFromSaved(patient);
  });

  let picker = $state(false);
  let saving = $state(false);
  let status = $state<UpdateStatus | "local" | null>(null);

  const isHem = $derived(draft?.strokeType === "hemorrhagic");
  const problems = $derived(patient && draft ? draftProblems(patient, draft) : []);
  const masked = $derived(isMaskedId(patient?.patientId));

  const ynOpts = $derived<{ value: "Yes" | "No"; label: string }[]>([
    { value: "No", label: $t.common.no },
    { value: "Yes", label: $t.common.yes },
  ]);
  const strokeOpts = $derived<{ value: "ischemic" | "hemorrhagic"; label: string }[]>([
    { value: "ischemic", label: $t.editPatient.ischemic },
    { value: "hemorrhagic", label: $t.editPatient.hemorrhagic },
  ]);
  const armOpts = $derived<{ value: Arm; label: string }[]>([
    { value: "intervention", label: $t.share.intervention },
    { value: "control", label: $t.share.control },
  ]);

  function setStudies(names: string[]) {
    if (!draft) return;
    const outcomes: Record<string, Arm> = {};
    for (const n of names) if (hasKnownStudyArm(n)) outcomes[n] = draft.outcomes[n] ?? "intervention";
    draft.studies = names;
    draft.outcomes = outcomes;
  }

  function statusText(s: UpdateStatus | "local"): string {
    if (s === "confirmed") return $t.editPatient.saved;
    if (s === "unsupported") return $t.editPatient.unsupported;
    if (s === "not-found") return $t.editPatient.notFound;
    if (s === "unverified") return $t.editPatient.unverified;
    if (s === "local") return $t.editPatient.notSynced;
    return $t.editPatient.failed;
  }

  async function save() {
    if (!patient || !draft || saving || problems.length) return;
    saving = true;
    const d = $state.snapshot(draft) as EditDraft;
    const missed = missedAfterEdit(patient, d);
    const now = new Date().toISOString();
    // ID con cui la riga e' ora nel foglio: completo, mai quello mascherato.
    const matchId = masked ? d.patientId.trim() : patient.sheetId ?? patient.patientId ?? "";
    const prevSheetId = patient.sheetId ?? (masked ? undefined : patient.patientId);
    // Prima il telefono: la modifica non si perde se il foglio non risponde.
    const next = applyDraft(patient, d, missed, now);
    replaceSavedPatient({ ...next, pendingSync: true, sheetId: prevSheetId });

    let result: UpdateStatus | "local";
    let updatedAt: string | undefined;
    if (!patient.sheetTs || !matchId) {
      result = "local";
    } else {
      const res = await sendUpdateToSheet({
        ...buildUpdatePayload(d, { timestamp: patient.sheetTs, patientId: matchId }, missed),
        matchTimestamp: patient.sheetTs,
        N_patient: d.patientId.trim(),
      });
      result = res.status;
      updatedAt = res.updatedAt;
    }
    if (result === "confirmed") {
      replaceSavedPatient({ ...next, updatedAt: updatedAt ?? now, pendingSync: false, sheetId: undefined });
    }
    status = result;
    saving = false;
    announce(statusText(result));
    if (result === "confirmed") push("/saved/" + encodeURIComponent(patient.id));
  }
</script>

{#if !patient || !draft}
  <AppHeader title={$t.extras.notFound} sub={$t.extras.notInLocalArchive} onBack={() => push("/saved")} />
{:else}
  <AppHeader
    title={$t.editPatient.title}
    sub={patient.patientId || $t.extras.senza}
    onBack={() => push("/saved/" + encodeURIComponent(patient.id))}
  />

  <div class="body"><div class="stack">
    <Card title={$t.editPatient.basics}>
      {#snippet children()}
        <div class="form-stack">
          <div class="field">
            <label for="edit-pid" class="lbl">{$t.share.patientId}</label>
            <input id="edit-pid" class="pid" type="text" autocomplete="off" bind:value={draft!.patientId} placeholder={masked ? patient.patientId : ""} />
            {#if masked}
              <p class="hint">{fill($t.editPatient.idMasked, { id: patient.patientId ?? "" })}</p>
            {/if}
          </div>
          <div class="grid2">
            <NumberField id="edit-age" label={$t.extras.age} bind:value={draft!.age} min={0} max={120} />
            <NumberField id="edit-nihss" label="NIHSS" bind:value={draft!.nihss} min={0} max={42} />
            <NumberField id="edit-premrs" label="pre-mRS" bind:value={draft!.premrs} min={0} max={5} />
            <NumberField id="edit-ltsw" label={$t.editPatient.ltsw} bind:value={draft!.ltswH} min={0} step={0.1} />
          </div>
          <Segmented label={$t.editPatient.strokeType} name="edit-stroke" options={strokeOpts} bind:value={draft!.strokeType} />
        </div>
      {/snippet}
    </Card>

    <Card title={$t.editPatient.studies}>
      {#snippet children()}
        <div class="form-stack">
          {#if draft!.studies.length === 0}
            <p class="hint">{$t.editPatient.noStudies}</p>
          {/if}
          {#each draft!.studies as name (name)}
            <div class="study">
              <div class="study-head">
                <span class="study-name">{name}</span>
                <button type="button" class="remove" aria-label={`${$t.editPatient.removeStudy} ${name}`}
                  onclick={() => setStudies(draft!.studies.filter((s) => s !== name))}>{$t.editPatient.removeStudy}</button>
              </div>
              {#if hasKnownStudyArm(name)}
                <Segmented label={`${$t.editPatient.arm} ${name}`} name={`edit-arm-${name}`} options={armOpts}
                  value={draft!.outcomes[name] ?? "intervention"}
                  onChange={(v) => (draft!.outcomes = { ...draft!.outcomes, [name]: v })} />
              {/if}
            </div>
          {/each}
          <Button variant="secondary" fullWidth onclick={() => (picker = true)}>
            {#snippet children()}{$t.editPatient.changeStudies}{/snippet}
          </Button>
        </div>
      {/snippet}
    </Card>

    <Card title={$t.extras.acuteTreatments}>
      {#snippet children()}
        <div class="form-stack">
          {#if isHem}
            <RadioGroup id="edit-reversal" label={$t.share.reversalLabel} name="edit-reversal" columns={2} bind:value={draft!.reversal} options={ynOpts} />
            {#if draft!.reversal === "Yes"}
              <div class="field">
                <label for="edit-reversal-agent" class="lbl">{$t.share.reversalAgentLabel}</label>
                <select id="edit-reversal-agent" class="select" bind:value={draft!.reversalAgent}>
                  <option value="">--</option>
                  {#each REVERSAL_AGENTS as a (a)}
                    <option value={a}>{$t.share.reversalAgents[a]}</option>
                  {/each}
                </select>
              </div>
            {/if}
          {:else}
            <RadioGroup id="edit-tev" label={$t.trialPatient.tevLabel} name="edit-tev" columns={2} bind:value={draft!.tev} options={ynOpts} />
            {#if draft!.tev === "Yes"}
              <div class="field">
                <label for="edit-mtici" class="lbl">mTICI</label>
                <select id="edit-mtici" class="select" bind:value={draft!.mtici}>
                  <option value="">--</option>
                  {#each MTICI_VALUES as m (m)}
                    <option value={m}>{m}</option>
                  {/each}
                </select>
              </div>
            {/if}
            <RadioGroup id="edit-tiv" label={$t.trialPatient.tivLabel} name="edit-tiv" columns={2} bind:value={draft!.tiv} options={ynOpts} />
          {/if}
        </div>
      {/snippet}
    </Card>

    <Card title={$t.share.notesLabel}>
      {#snippet children()}
        <textarea class="notes" aria-label={$t.share.notesLabel} placeholder={$t.share.notesPlaceholder} bind:value={draft!.notes} rows="4"></textarea>
      {/snippet}
    </Card>

    <p class="hint">{$t.editPatient.detailsNote}</p>

    <div class="actions">
      {#if problems.includes("id-missing")}
        <p class="send-warn" role="alert">{$t.share.idRequired}</p>
      {/if}
      {#if problems.includes("id-mismatch")}
        <p class="send-warn" role="alert">{fill($t.editPatient.idMismatch, { id: patient.patientId ?? "" })}</p>
      {/if}
      {#if problems.includes("mtici-missing")}
        <p class="send-warn" role="alert">{$t.share.mticiRequired}</p>
      {/if}
      {#if status && status !== "confirmed"}
        <p class="send-warn" role="alert">{statusText(status)}</p>
      {/if}
      <div class="action-row">
        <Button variant="secondary" onclick={() => push("/saved/" + encodeURIComponent(patient.id))}>
          {#snippet children()}{$t.editPatient.cancel}{/snippet}
        </Button>
        <Button variant="primary" loading={saving} disabled={problems.length > 0} onclick={save}>
          {#snippet children()}{status && status !== "confirmed" && status !== "local" ? $t.editPatient.retry : $t.editPatient.save}{/snippet}
        </Button>
      </div>
    </div>
  </div></div>

  {#if picker}
    <RegTrialPicker
      selected={draft.studies}
      strokeType={draft.strokeType}
      onDone={(names) => setStudies(names)}
      onClose={() => (picker = false)}
    />
  {/if}
{/if}

<style>
  .body { padding: 6px 16px 16px; }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .form-stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .grid2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--sp-3); }
  .grid2 > :global(*) { min-width: 0; }
  .grid2 :global(input) { min-width: 0; width: 100%; }
  .field { display: flex; flex-direction: column; gap: var(--sp-1); }
  .lbl { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text); }
  .hint { margin: 0; font-size: 13px; color: var(--text-muted); }
  .pid, .select {
    width: 100%;
    min-height: var(--touch-min);
    padding: 0 var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
  }
  .pid { font-family: var(--font-mono); }
  .study { display: flex; flex-direction: column; gap: var(--sp-2); padding-bottom: var(--sp-3); border-bottom: 1px solid var(--border); }
  .study-head { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2); }
  .study-name { font-weight: 600; font-size: 15px; color: var(--text); }
  .remove {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--danger);
    border-radius: 10px;
    padding: 6px 12px;
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    min-height: 36px;
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
  .send-warn {
    margin: 0;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--warn-soft);
    color: var(--warn);
    font-size: 13.5px;
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
  .action-row { display: grid; grid-template-columns: 1fr 2fr; gap: var(--sp-2); }
</style>

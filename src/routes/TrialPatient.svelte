<script lang="ts">
  // TrialPatient: entry rapida per paziente gia' arruolato.
  // Differente dal flusso eligibility: nessuna regola applicata,
  // solo raccolta dati per Sheet.
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { TRIALS_INFO } from "$lib/domain/trials-info";
  import { hasKnownStudyArm } from "$lib/domain/sheet-payload";
  import { t } from "$lib/i18n";

  let patientId = $state("");
  let age = $state<number | null>(null);
  let nihss = $state<number | null>(null);
  let trial = $state<string>("");
  let arm = $state<"intervention" | "control" | "">("");
  let strokeType = $state<"ischemic" | "hemorrhagic" | "">("");

  const trialOptions = Object.keys(TRIALS_INFO).map((name) => ({ value: name, label: name }));
  const showArm = $derived(trial !== "" && hasKnownStudyArm(trial));

  const armOpts = $derived<{ value: "intervention" | "control"; label: string }[]>([
    { value: "intervention", label: $t.share.intervention },
    { value: "control", label: $t.share.control },
  ]);

  const strokeOpts = $derived<{ value: "ischemic" | "hemorrhagic"; label: string }[]>([
    { value: "ischemic", label: $t.postImaging.ischemic },
    { value: "hemorrhagic", label: $t.postImaging.hemorrhagic },
  ]);

  const canSubmit = $derived(
    patientId !== "" && age !== null && trial !== "" && (!showArm || arm !== "")
  );

  function submit() {
    // TODO: integrare in Share quando l'utente clicca proceed
    push("/share");
  }
</script>

<h1>{$t.trialPatient.title}</h1>
<p class="lead">{$t.trialPatient.subtitle}</p>

<div class="stack">
  <Card>
    {#snippet children()}
      <div class="form-stack">
        <TextField id="tp-pid" label={$t.preImaging.patientRecordLabel} placeholder={$t.preImaging.patientRecordPlaceholder} bind:value={patientId} required />
        <NumberField id="tp-age" label={$t.preImaging.ageLabel} suffix={$t.preImaging.ageSuffix} bind:value={age} required />
        <NumberField id="tp-nihss" label="NIHSS" hint={$t.preImaging.nihssHint} bind:value={nihss} />
        <RadioGroup id="tp-stroke" label={$t.postImaging.strokeTypeLabel} name="strokeType" columns={2} bind:value={strokeType} options={strokeOpts} required />
      </div>
    {/snippet}
  </Card>

  <Card title={$t.trialPatient.selectedTrialLabel}>
    {#snippet children()}
      <select bind:value={trial} class="select">
        <option value="">--- {$t.common.select} ---</option>
        {#each trialOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
      {#if showArm}
        <div style="margin-top: var(--sp-3)">
          <RadioGroup id="tp-arm" label={$t.trialPatient.armLabel} name="arm" columns={2} bind:value={arm} options={armOpts} required />
        </div>
      {/if}
    {/snippet}
  </Card>

  <div class="actions">
    <Button variant="secondary" fullWidth onclick={() => push("/workflow")}>
      {#snippet children()}{$t.common.back}{/snippet}
    </Button>
    <Button variant="primary" fullWidth disabled={!canSubmit} onclick={submit}>
      {#snippet children()}{$t.common.next}{/snippet}
    </Button>
  </div>
</div>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .form-stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .select {
    width: 100%;
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font: inherit;
  }
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-2);
    position: sticky;
    bottom: var(--bottom-nav-h);
    background: var(--surface-elevated);
    padding: var(--sp-3);
    margin-inline: calc(-1 * var(--sp-4));
    border-top: 1px solid var(--border);
  }
</style>

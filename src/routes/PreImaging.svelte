<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import DatetimeField from "$lib/components/DatetimeField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { preData, hoursSince } from "$lib/stores/patient";
  import { validate, isValid } from "$lib/validation/schema";
  import { required, range } from "$lib/validation/rules";
  import { t } from "$lib/i18n";

  type YN = "yes" | "no" | "";

  let patientId = $state($preData.patientId ?? "");
  let age = $state<number | null>($preData.age ?? null);
  let nihss = $state<number | null>($preData.nihss ?? null);
  let premrs = $state<number | null>($preData.premrs ?? null);
  let ltswDate = $state<string>($preData.ltswDate ?? "");
  let wakeupStroke = $state<boolean>($preData.wakeupStroke ?? false);
  let angiograph = $state<YN>(($preData.angiograph as YN) ?? "");
  let doac = $state<YN>(($preData.doac as YN) ?? "");
  let acei = $state<YN>(($preData.acei as YN) ?? "");

  // Ore derivate dal datetime (per validazione + UI feedback)
  const ltswHrs = $derived(hoursSince(ltswDate));
  // Auto-calcolo: wake-up + sintomi entro 6h = ore tra LTSW e adesso <= 6
  const symptomsWithin6h = $derived(
    wakeupStroke && ltswHrs !== undefined && ltswHrs <= 6
  );

  $effect(() => {
    preData.set({
      patientId,
      age: age ?? undefined,
      nihss: nihss ?? undefined,
      premrs: premrs ?? undefined,
      ltswDate: ltswDate || undefined,
      ltsw: ltswHrs,
      wakeupStroke,
      wakeupSymptomsWithin6h: wakeupStroke ? symptomsWithin6h : undefined,
      angiograph: angiograph || undefined,
      doac: doac || undefined,
      acei: acei || undefined,
    });
  });

  const errors = $derived(
    validate(
      { age, nihss, premrs, ltswDate, angiograph, doac, acei },
      {
        age: [required($t.common.required), range(0, 120, $t.preImaging.rangeAge)],
        nihss: [required($t.common.required), range(0, 42, $t.preImaging.rangeNihss)],
        premrs: [required($t.common.required), range(0, 5, $t.preImaging.rangeMrs)],
        ltswDate: [required($t.common.required)],
        angiograph: [required($t.common.select)],
        doac: [required($t.common.select)],
        acei: [required($t.common.select)],
      }
    )
  );

  const canSubmit = $derived(isValid(errors));

  function submit() {
    if (!canSubmit) return;
    push("/pre-result");
  }

  const ynOptions = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);
</script>

<h1>{$t.preImaging.title}</h1>
<p class="lead">{$t.preImaging.subtitle}</p>

<div class="stack">
  <Card title={$t.preImaging.identification}>
    {#snippet children()}
      <TextField
        id="pre-pid"
        label={$t.preImaging.patientRecordLabel}
        placeholder={$t.preImaging.patientRecordPlaceholder}
        bind:value={patientId}
      />
    {/snippet}
  </Card>

  <Card title={$t.preImaging.anamnesis}>
    {#snippet children()}
      <div class="form-stack">
        <NumberField id="pre-age" label={$t.preImaging.ageLabel} suffix={$t.preImaging.ageSuffix} bind:value={age} required error={errors.age ?? ""} />
        <NumberField id="pre-nihss" label="NIHSS" hint={$t.preImaging.nihssHint} bind:value={nihss} required error={errors.nihss ?? ""} />
        <NumberField id="pre-mrs" label={$t.preImaging.mrsLabel} hint={$t.preImaging.mrsHint} bind:value={premrs} required error={errors.premrs ?? ""} />
        <DatetimeField
          id="pre-ltsw"
          label={$t.preImaging.ltswLabel}
          hint={$t.preImaging.ltswHint}
          bind:value={ltswDate}
          required
          error={errors.ltswDate ?? ""}
        />
        {#if ltswHrs !== undefined}
          <p class="auto-calc">
            <strong>{ltswHrs.toFixed(1)}h</strong> {$t.preImaging.ltswSuffix}
          </p>
        {/if}
      </div>
    {/snippet}
  </Card>

  <Card title={$t.preImaging.wakeupTitle}>
    {#snippet children()}
      <label class="check-row">
        <input type="checkbox" bind:checked={wakeupStroke} />
        <span>
          <strong>{$t.preImaging.wakeupLabel}</strong>
          <small>{$t.preImaging.wakeupDesc}</small>
        </span>
      </label>
      {#if wakeupStroke && ltswHrs !== undefined}
        <div class="auto-status" class:ok={symptomsWithin6h} class:warn={!symptomsWithin6h}>
          {#if symptomsWithin6h}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          {/if}
          <span>
            {$t.preImaging.wakeupSymptomsLabel}: <strong>{symptomsWithin6h ? $t.common.yes : $t.common.no}</strong>
            <small>(calcolato da LTSW)</small>
          </span>
        </div>
      {/if}
    {/snippet}
  </Card>

  <Card title={$t.preImaging.contextTitle}>
    {#snippet children()}
      <div class="form-stack">
        <RadioGroup
          id="pre-angio"
          label={$t.preImaging.angioLabel}
          name="angiograph"
          columns={2}
          options={ynOptions}
          bind:value={angiograph}
          required
          error={errors.angiograph ?? ""}
        />
        <RadioGroup
          id="pre-doac"
          label={$t.preImaging.doacLabel}
          name="doac"
          columns={2}
          options={ynOptions}
          bind:value={doac}
          required
          error={errors.doac ?? ""}
        />
        <RadioGroup
          id="pre-acei"
          label={$t.preImaging.aceiLabel}
          name="acei"
          columns={2}
          options={ynOptions}
          bind:value={acei}
          required
          error={errors.acei ?? ""}
        />
      </div>
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
  .check-row {
    display: flex;
    gap: var(--sp-3);
    align-items: flex-start;
    cursor: pointer;
    padding: var(--sp-2);
    border-radius: var(--radius-md);
  }
  .check-row input { margin-top: 4px; transform: scale(1.2); accent-color: var(--primary); }
  .check-row strong { display: block; }
  .check-row small {
    display: block;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    margin-top: 2px;
  }
  .auto-calc {
    margin: 0;
    padding: var(--sp-2) var(--sp-3);
    background: var(--surface);
    border-radius: var(--radius-md);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .auto-calc strong { color: var(--primary); font-size: var(--fs-base); }
  .auto-status {
    margin-top: var(--sp-2);
    padding: var(--sp-3);
    border-radius: var(--radius-md);
    display: flex;
    align-items: flex-start;
    gap: var(--sp-2);
    font-size: var(--fs-sm);
  }
  .auto-status.ok { background: var(--success-soft); color: var(--success); }
  .auto-status.warn { background: var(--warn-soft); color: var(--warn); }
  .auto-status strong { color: var(--text); }
  .auto-status small { color: var(--text-muted); display: block; margin-top: 2px; }
  .actions {
    position: sticky;
    bottom: var(--bottom-nav-h);
    background: var(--surface-elevated);
    padding: var(--sp-3);
    margin-inline: calc(-1 * var(--sp-4));
    margin-block: var(--sp-4) calc(-1 * var(--sp-8));
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-2);
  }
</style>

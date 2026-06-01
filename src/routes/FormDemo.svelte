<script lang="ts">
  // Mini wizard di dimostrazione: 3 step con validazione live e persistenza.
  // NON e' ancora il vero flusso clinico - serve a provare il framework.
  import Card from "$lib/components/Card.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import StepWizard from "$lib/components/StepWizard.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { preData, clearPatient } from "$lib/stores/patient";
  import { validate, isValid } from "$lib/validation/schema";
  import { required, range } from "$lib/validation/rules";

  let current = $state(0);
  const steps = ["Identifica", "Anamnesi", "Conferma"];

  const errorsStep0 = $derived(
    validate(
      { patientId: $preData.patientId ?? "" },
      { patientId: [required("ID paziente richiesto")] }
    )
  );

  const errorsStep1 = $derived(
    validate(
      {
        age: $preData.age ?? null,
        nihss: $preData.nihss ?? null,
        premrs: $preData.premrs ?? null,
      },
      {
        age: [required(), range(18, 110, "Eta' tra 18 e 110")],
        nihss: [required(), range(0, 42, "NIHSS tra 0 e 42")],
        premrs: [required(), range(0, 5, "mRS tra 0 e 5")],
      }
    )
  );

  const canGoNext = $derived(
    current === 0 ? isValid(errorsStep0) :
    current === 1 ? isValid(errorsStep1) :
    true
  );

  function onNext() {
    if (current < steps.length - 1) current += 1;
  }
  function onPrev() {
    if (current > 0) current -= 1;
  }

  function setField<K extends "patientId" | "age" | "nihss" | "premrs">(key: K, value: NonNullable<typeof $preData>[K]) {
    preData.update((p) => ({ ...p, [key]: value }));
  }
</script>

<h1>Form demo - wizard 3 step</h1>
<p class="lead">Validazione live, persistenza in localStorage (refresh per testare).</p>

<StepWizard
  {steps}
  {current}
  {canGoNext}
  {onPrev}
  {onNext}
>
  {#snippet children()}
    {#if current === 0}
      <Card title="Identificazione paziente">
        {#snippet children()}
          <TextField
            id="wiz-pid"
            label="Patient ID"
            placeholder="es. PRN-2025-001"
            value={$preData.patientId ?? ""}
            oninput={(e) => setField("patientId", (e.currentTarget as HTMLInputElement).value)}
            required
            error={errorsStep0.patientId ?? ""}
          />
        {/snippet}
      </Card>
    {:else if current === 1}
      <Card title="Anamnesi clinica">
        {#snippet children()}
          <div class="stack">
            <NumberField
              id="wiz-age"
              label="Eta'"
              value={$preData.age ?? null}
              oninput={(e) => {
                const t = e.currentTarget as HTMLInputElement;
                const n = Number(t.value);
                setField("age", Number.isNaN(n) ? undefined : n);
              }}
              min={0}
              max={120}
              suffix="anni"
              required
              error={errorsStep1.age ?? ""}
            />
            <NumberField
              id="wiz-nihss"
              label="NIHSS"
              value={$preData.nihss ?? null}
              oninput={(e) => {
                const t = e.currentTarget as HTMLInputElement;
                const n = Number(t.value);
                setField("nihss", Number.isNaN(n) ? undefined : n);
              }}
              min={0}
              max={42}
              required
              hint="0-42, intero"
              error={errorsStep1.nihss ?? ""}
            />
            <NumberField
              id="wiz-mrs"
              label="pre-mRS"
              value={$preData.premrs ?? null}
              oninput={(e) => {
                const t = e.currentTarget as HTMLInputElement;
                const n = Number(t.value);
                setField("premrs", Number.isNaN(n) ? undefined : n);
              }}
              min={0}
              max={5}
              required
              hint="0 (autonomo) - 5 (severamente disabile)"
              error={errorsStep1.premrs ?? ""}
            />
          </div>
        {/snippet}
      </Card>
    {:else}
      <Card title="Riepilogo">
        {#snippet children()}
          <dl class="summary">
            <div><dt>Patient ID</dt><dd>{$preData.patientId ?? "-"}</dd></div>
            <div><dt>Eta'</dt><dd>{$preData.age ?? "-"} anni</dd></div>
            <div><dt>NIHSS</dt><dd>{$preData.nihss ?? "-"}</dd></div>
            <div><dt>pre-mRS</dt><dd>{$preData.premrs ?? "-"}</dd></div>
          </dl>
          <div class="status">
            <Pill tone="success">{#snippet children()}Dati persistiti{/snippet}</Pill>
            <button class="link" type="button" onclick={clearPatient}>Pulisci paziente</button>
          </div>
        {/snippet}
      </Card>
    {/if}
  {/snippet}
</StepWizard>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; padding-inline: var(--sp-4); }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); padding-inline: var(--sp-4); font-size: var(--fs-sm); }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .summary {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    margin: 0 0 var(--sp-4);
  }
  .summary div { display: flex; justify-content: space-between; gap: var(--sp-3); }
  .summary dt { color: var(--text-muted); font-size: var(--fs-sm); }
  .summary dd { margin: 0; font-weight: var(--fw-semibold); }
  .status { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; }
  .link {
    color: var(--primary);
    text-decoration: underline;
    font-size: var(--fs-sm);
    padding: var(--sp-2);
  }
</style>

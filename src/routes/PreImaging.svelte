<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import { preData } from "$lib/stores/patient";
  import { validate, isValid } from "$lib/validation/schema";
  import { required, range } from "$lib/validation/rules";

  type YN = "yes" | "no" | "";

  let patientId = $state($preData.patientId ?? "");
  let age = $state<number | null>($preData.age ?? null);
  let nihss = $state<number | null>($preData.nihss ?? null);
  let premrs = $state<number | null>($preData.premrs ?? null);
  let ltsw = $state<number | null>($preData.ltsw ?? null);
  let wakeupStroke = $state<boolean>($preData.wakeupStroke ?? false);
  let wakeupSymptomsWithin6h = $state<boolean>($preData.wakeupSymptomsWithin6h ?? false);
  let angiograph = $state<YN>(($preData.angiograph as YN) ?? "");
  let doac = $state<YN>(($preData.doac as YN) ?? "");
  let acei = $state<YN>(($preData.acei as YN) ?? "");

  // Persist on every change
  $effect(() => {
    preData.set({
      patientId,
      age: age ?? undefined,
      nihss: nihss ?? undefined,
      premrs: premrs ?? undefined,
      ltsw: ltsw ?? undefined,
      wakeupStroke,
      wakeupSymptomsWithin6h: wakeupStroke ? wakeupSymptomsWithin6h : undefined,
      angiograph: angiograph || undefined,
      doac: doac || undefined,
      acei: acei || undefined,
    });
  });

  const errors = $derived(
    validate(
      { age, nihss, premrs, ltsw, angiograph, doac, acei },
      {
        age: [required(), range(0, 120, "Eta' fra 0 e 120")],
        nihss: [required(), range(0, 42, "NIHSS fra 0 e 42")],
        premrs: [required(), range(0, 5, "pre-mRS fra 0 e 5")],
        ltsw: [required(), range(0, 168, "LTSW in ore (0-168)")],
        angiograph: [required("Selezionare")],
        doac: [required("Selezionare")],
        acei: [required("Selezionare")],
      }
    )
  );

  const canSubmit = $derived(isValid(errors));

  function submit() {
    if (!canSubmit) return;
    push("/pre-result");
  }

  const ynOptions: { value: "yes" | "no"; label: string }[] = [
    { value: "no", label: "No" },
    { value: "yes", label: "Si'" },
  ];
</script>

<h1>Pre-Imaging</h1>
<p class="lead">Anamnesi iniziale per la valutazione WeTrust.</p>

<div class="stack">
  <Card title="Identificazione">
    {#snippet children()}
      <TextField
        id="pre-pid"
        label="Patient record number"
        placeholder="es. 2025-00123"
        bind:value={patientId}
      />
    {/snippet}
  </Card>

  <Card title="Anamnesi">
    {#snippet children()}
      <div class="form-stack">
        <NumberField id="pre-age" label="Eta'" suffix="anni" bind:value={age} required error={errors.age ?? ""} />
        <NumberField id="pre-nihss" label="NIHSS" hint="0-42" bind:value={nihss} required error={errors.nihss ?? ""} />
        <NumberField id="pre-mrs" label="pre-mRS" hint="0 autonomo - 5 severamente disabile" bind:value={premrs} required error={errors.premrs ?? ""} />
        <NumberField id="pre-ltsw" label="LTSW" suffix="ore" hint="Ore dall'ultima volta visto bene" bind:value={ltsw} step={0.1} required error={errors.ltsw ?? ""} />
      </div>
    {/snippet}
  </Card>

  <Card title="Wake-up stroke">
    {#snippet children()}
      <label class="check-row">
        <input type="checkbox" bind:checked={wakeupStroke} />
        <span>
          <strong>Wake-up stroke</strong>
          <small>Per WeTrust: ammette LTSW fino a 12h se sintomi identificati entro 6h.</small>
        </span>
      </label>
      {#if wakeupStroke}
        <label class="check-row">
          <input type="checkbox" bind:checked={wakeupSymptomsWithin6h} />
          <span>Sintomi identificati entro 6h dal risveglio</span>
        </label>
      {/if}
    {/snippet}
  </Card>

  <Card title="Contesto operativo">
    {#snippet children()}
      <div class="form-stack">
        <RadioGroup
          id="pre-angio"
          label="Angiografo Philips disponibile?"
          name="angiograph"
          columns={2}
          options={ynOptions}
          bind:value={angiograph}
          required
          error={errors.angiograph ?? ""}
        />
        <RadioGroup
          id="pre-doac"
          label="DOAC (NOAC) nelle 48h precedenti?"
          name="doac"
          columns={2}
          options={ynOptions}
          bind:value={doac}
          required
          error={errors.doac ?? ""}
        />
        <RadioGroup
          id="pre-acei"
          label="ACE inibitore (IECA) in terapia?"
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
      {#snippet children()}Indietro{/snippet}
    </Button>
    <Button variant="primary" fullWidth disabled={!canSubmit} onclick={submit}>
      {#snippet children()}Avanti{/snippet}
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
  .check-row + .check-row {
    margin-top: var(--sp-2);
    border-top: 1px solid var(--border);
    padding-top: var(--sp-3);
  }
  .check-row input { margin-top: 4px; transform: scale(1.2); accent-color: var(--primary); }
  .check-row strong { display: block; }
  .check-row small {
    display: block;
    font-size: var(--fs-sm);
    color: var(--text-muted);
    margin-top: 2px;
  }
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

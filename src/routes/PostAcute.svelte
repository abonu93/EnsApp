<script lang="ts">
  // PostAcute (Librexia): valutazione semplificata. Le regole formali sono
  // descritte in TRIALS_INFO; qui usiamo un calcolo derived per mostrare
  // eligibility on-the-fly al medico (no porting da legacy: librexia
  // non aveva regola pura in domain/, era inline in app-post-acute.js).
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { preData } from "$lib/stores/patient";
  import { t } from "$lib/i18n";

  type YN = "yes" | "no" | "";

  let causeSuspect = $state<YN>("");
  let persistent = $state<YN>("");
  let imagingFinding = $state<YN>("");
  let treatmentReceived = $state<YN>("");
  let abcd2 = $state<number | null>(null);
  let inr = $state<number | null>(null);
  let aptt = $state<number | null>(null);
  let gfr = $state<number | null>(null);
  let chronicAnticoag = $state<YN>("");
  let hepatic = $state<YN>("");
  let pregnancyP = $state<YN>("");

  const eligible = $derived.by(() => {
    const age = $preData.age ?? -1;
    const ltsw = $preData.ltsw ?? 999;
    const nihss = $preData.nihss ?? 999;
    return (
      age >= 40 &&
      ltsw <= 48 &&
      nihss <= 7 &&
      causeSuspect === "yes" &&
      (persistent === "yes" || imagingFinding === "yes" || treatmentReceived === "yes") &&
      abcd2 !== null && abcd2 >= 6 &&
      inr !== null && inr <= 1.5 &&
      aptt !== null && aptt <= 1.4 &&
      gfr !== null && gfr >= 15 &&
      chronicAnticoag === "no" &&
      hepatic === "no" &&
      pregnancyP === "no"
    );
  });

  const ynOpts = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);

  function proceed() {
    push("/share");
  }
</script>

<AppHeader title={$t.postAcute.title} sub={$t.postAcute.subtitle} onBack={() => push("/summary")} />

<div class="body"><div class="stack">
  <Card>
    {#snippet children()}
      <div class="status">
        {#if eligible}
          <Pill tone="success">{#snippet children()}{$t.postAcute.eligibleTitle}{/snippet}</Pill>
        {:else}
          <Pill tone="neutral">{#snippet children()}{$t.postAcute.notEligibleTitle}{/snippet}</Pill>
        {/if}
      </div>
    {/snippet}
  </Card>

  <Card>
    {#snippet children()}
      <div class="form-stack">
        <RadioGroup id="pa-cause" label={$t.postAcute.causeSuspectLabel} name="causeSuspect" columns={2} bind:value={causeSuspect} options={ynOpts} required />
        <RadioGroup id="pa-pers" label={$t.postAcute.persistentLabel} name="persistent" columns={2} bind:value={persistent} options={ynOpts} />
        <RadioGroup id="pa-img" label={$t.postAcute.imagingFindingLabel} name="imagingFinding" columns={2} bind:value={imagingFinding} options={ynOpts} />
        <RadioGroup id="pa-tx" label={$t.postAcute.treatmentReceivedLabel} name="treatmentReceived" columns={2} bind:value={treatmentReceived} options={ynOpts} />
        <NumberField id="pa-abcd2" label={$t.postAcute.abcd2Label} hint={$t.postAcute.abcd2Hint} bind:value={abcd2} min={0} max={7} required />
      </div>
    {/snippet}
  </Card>

  <Card title={$t.postAcute.labsTitle}>
    {#snippet children()}
      <div class="form-stack">
        <NumberField id="pa-inr" label={$t.postAcute.inrLabel} bind:value={inr} step={0.1} required />
        <NumberField id="pa-aptt" label={$t.postAcute.apttLabel} bind:value={aptt} step={0.1} required />
        <NumberField id="pa-gfr" label={$t.postAcute.gfrLabel} bind:value={gfr} required />
      </div>
    {/snippet}
  </Card>

  <Card>
    {#snippet children()}
      <div class="form-stack">
        <RadioGroup id="pa-chronic" label={$t.postAcute.chronicAnticoagLabel} name="chronicAnticoag" columns={2} bind:value={chronicAnticoag} options={ynOpts} required />
        <RadioGroup id="pa-hep" label={$t.postAcute.hepaticLabel} name="hepatic" columns={2} bind:value={hepatic} options={ynOpts} required />
        <RadioGroup id="pa-pregn" label={$t.postAcute.pregnancyLabel} name="pregnancy" columns={2} bind:value={pregnancyP} options={ynOpts} required />
      </div>
    {/snippet}
  </Card>
</div>
</div>

<BottomBar onBack={() => push("/summary")} onNext={proceed} nextDisabled={!eligible} nextLabel={$t.summary.proceed} />

<style>
  .body { padding: 6px 16px 16px; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .form-stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .status { display: flex; justify-content: center; padding: var(--sp-2); }
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

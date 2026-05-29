<script lang="ts">
  // PostImaging: form single-page con sezioni condizionali (ischemic vs hemorrhagic).
  // L'esperienza mobile-first usa scroll + sticky bottom CTA, non un wizard,
  // perche' i campi sono spesso compilati in ordine non strettamente sequenziale
  // (es. tipo di stroke -> vasi -> ASPECTS).
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import CheckboxGroup from "$lib/components/CheckboxGroup.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { t } from "$lib/i18n";
  import { VESSEL_OPTIONS } from "$lib/domain/vessels";
  import type { VesselCode } from "$lib/domain/acute-rules";

  type YN = "yes" | "no" | "";
  type StrokeType = "ischemic" | "hemorrhagic" | "";
  type CandidateStatus = "eligible" | "not eligible" | "";
  type Anticoag = "none" | "warfarin" | "heparin" | "doac" | "";
  type SecondaryCause = "None" | "Traumatic" | "AVM" | "Aneurysm" | "Tumor" | "Other" | "";

  // -- Stato --
  let strokeType = $state<StrokeType>(($postData.strokeType as StrokeType) ?? "");
  // Ischemic
  let candidate = $state<CandidateStatus>(($postData.candidate as CandidateStatus) ?? "");
  let ivtCandidate = $state<CandidateStatus>(($postData.ivtCandidate as CandidateStatus) ?? "");
  let tandem = $state<YN>(($postData.tandem as YN) ?? "");
  let tortuosity = $state<YN>(($postData.tortuosity as YN) ?? "");
  let targetVessels = $state<VesselCode[]>(($postData.targetVessels as VesselCode[]) ?? []);
  let contraTpa = $state<YN>(($postData.contraTpa as YN) ?? "");
  let aspects = $state<number | null>($postData.aspects ?? null);
  let lesionConfirmed = $state<YN>(($postData.lesionConfirmed as YN) ?? "");
  // Hemorrhagic
  let hemVolume = $state<number | null>($hemData.hemVolume ?? null);
  let gcs = $state<number | null>($hemData.gcs ?? null);
  let ivh = $state<YN>(($hemData.ivh as YN) ?? "");
  let secondaryCause = $state<SecondaryCause>(($hemData.secondaryCause as SecondaryCause) ?? "");
  let seizure = $state<YN>(($hemData.seizure as YN) ?? "");
  let anticoag = $state<Anticoag>(($hemData.anticoag as Anticoag) ?? "");
  // FASTEST extra
  let brainstem = $state<YN>(($hemData.brainstem as YN) ?? "");
  let procoagulant = $state<YN>(($hemData.procoagulant as YN) ?? "");
  let ecg = $state<YN>(($hemData.ecg as YN) ?? "");
  let thrombosis = $state<YN>(($hemData.thrombosis as YN) ?? "");
  let pregnancy = $state<YN>(($hemData.pregnancy as YN) ?? "");
  let angioplasty = $state<YN>(($hemData.angioplasty as YN) ?? "");
  let ivhScore = $state<YN>(($hemData.ivhScore as YN) ?? "");

  // -- Persist su stores --
  $effect(() => {
    postData.set({
      strokeType,
      candidate: candidate || undefined,
      ivtCandidate: ivtCandidate || undefined,
      tandem: tandem || undefined,
      tortuosity: tortuosity || undefined,
      targetVessels,
      contraTpa: contraTpa || undefined,
      aspects: aspects ?? undefined,
      lesionConfirmed: lesionConfirmed || undefined,
    });
  });

  $effect(() => {
    hemData.set({
      hemVolume: hemVolume ?? undefined,
      gcs: gcs ?? undefined,
      ivh: ivh || undefined,
      secondaryCause: secondaryCause || undefined,
      seizure: seizure || undefined,
      anticoag: anticoag === "" ? undefined : anticoag,
      brainstem: brainstem || undefined,
      procoagulant: procoagulant || undefined,
      ecg: ecg || undefined,
      thrombosis: thrombosis || undefined,
      pregnancy: pregnancy || undefined,
      angioplasty: angioplasty || undefined,
      ivhScore: ivhScore || undefined,
    });
  });

  // -- Conditional visibility --
  const isIschemic = $derived(strokeType === "ischemic");
  const isHem = $derived(strokeType === "hemorrhagic");
  const showEvt = $derived(isIschemic && candidate === "eligible");
  const showNonEvtConfirm = $derived(isIschemic && candidate === "not eligible");
  const showFastestExtra = $derived(
    isHem && ($preData.ltsw ?? 999) < 2 && ($preData.premrs ?? 99) <= 2
  );

  // -- Options derivate i18n --
  const ynOpts = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);
  const strokeOpts = $derived<{ value: "ischemic" | "hemorrhagic"; label: string; description?: string }[]>([
    { value: "ischemic", label: $t.postImaging.ischemic, description: $t.postImaging.ischemicDesc },
    { value: "hemorrhagic", label: $t.postImaging.hemorrhagic, description: $t.postImaging.hemorrhagicDesc },
  ]);
  const candidateOpts = $derived<{ value: "eligible" | "not eligible"; label: string }[]>([
    { value: "eligible", label: $t.postImaging.candidateEligible },
    { value: "not eligible", label: $t.postImaging.candidateNotEligible },
  ]);
  const secondaryOpts = $derived<{ value: SecondaryCause; label: string }[]>([
    { value: "None", label: $t.postImaging.secondaryCauseNone },
    { value: "Traumatic", label: "Trauma" },
    { value: "AVM", label: "AVM" },
    { value: "Aneurysm", label: "Aneurysm" },
    { value: "Tumor", label: "Tumor" },
    { value: "Other", label: "Other" },
  ]);
  const anticoagOpts = $derived<{ value: "none" | "warfarin" | "heparin" | "doac"; label: string }[]>([
    { value: "none", label: $t.postImaging.anticoagNone },
    { value: "warfarin", label: "Warfarin" },
    { value: "heparin", label: "Heparin <24h" },
    { value: "doac", label: "DOAC" },
  ]);

  const canSubmit = $derived(
    (isIschemic && candidate !== "" && (showEvt ? targetVessels.length > 0 : lesionConfirmed !== "")) ||
    (isHem && gcs !== null && hemVolume !== null && secondaryCause !== "")
  );

  function submit() {
    if (!canSubmit) return;
    push("/summary");
  }
</script>

<h1>{$t.postImaging.title}</h1>
<p class="lead">{$t.postImaging.subtitle}</p>

<div class="stack">
  <Card>
    {#snippet children()}
      <RadioGroup
        id="post-stroke"
        label={$t.postImaging.strokeTypeLabel}
        name="strokeType"
        columns={2}
        bind:value={strokeType}
        options={strokeOpts}
        required
      />
    {/snippet}
  </Card>

  {#if isIschemic}
    <Card title={$t.postImaging.candidacyTitle}>
      {#snippet children()}
        <div class="form-stack">
          <RadioGroup
            id="post-candidate"
            label={$t.postImaging.candidateEvt}
            name="candidate"
            columns={2}
            bind:value={candidate}
            options={candidateOpts}
            required
          />
          <RadioGroup
            id="post-ivt"
            label={$t.postImaging.candidateIvt}
            name="ivtCandidate"
            columns={2}
            bind:value={ivtCandidate}
            options={candidateOpts}
          />
        </div>
      {/snippet}
    </Card>

    {#if showEvt}
      <Card title={$t.postImaging.evtTitle} subtitle={$t.postImaging.evtDesc}>
        {#snippet children()}
          <div class="form-stack">
            <RadioGroup id="post-tandem" label={$t.postImaging.tandemLabel} name="tandem" columns={2} bind:value={tandem} options={ynOpts} required />
            <RadioGroup id="post-tort" label={$t.postImaging.tortuosityLabel} name="tortuosity" columns={2} bind:value={tortuosity} options={ynOpts} hint={$t.postImaging.tortuosityHint} />
            <CheckboxGroup
              id="post-vessels"
              label={$t.postImaging.vesselsLabel}
              options={VESSEL_OPTIONS}
              bind:value={targetVessels}
              columns={2}
              hint={$t.postImaging.vesselsHint}
              required
            />
            <RadioGroup id="post-contra" label={$t.postImaging.contraTpaLabel} name="contraTpa" columns={2} bind:value={contraTpa} options={ynOpts} required />
            <NumberField id="post-aspects" label={$t.postImaging.aspectsLabel} bind:value={aspects} min={0} max={10} hint={$t.postImaging.aspectsHint} />
          </div>
        {/snippet}
      </Card>
    {:else if showNonEvtConfirm}
      <Card title={$t.postImaging.nonEvtTitle}>
        {#snippet children()}
          <RadioGroup id="post-lesion" label={$t.postImaging.lesionConfirmedLabel} name="lesionConfirmed" columns={2} bind:value={lesionConfirmed} options={ynOpts} required />
        {/snippet}
      </Card>
    {/if}
  {/if}

  {#if isHem}
    <Card title={$t.postImaging.hemTitle}>
      {#snippet children()}
        <div class="form-stack">
          <NumberField id="post-hemvol" label={$t.postImaging.hemVolumeLabel} suffix={$t.postImaging.hemVolumeSuffix} bind:value={hemVolume} step={0.1} required />
          <NumberField id="post-gcs" label={$t.postImaging.gcsLabel} bind:value={gcs} min={3} max={15} hint={$t.postImaging.gcsHint} required />
          <RadioGroup id="post-ivh" label={$t.postImaging.ivhLabel} name="ivh" columns={2} bind:value={ivh} options={ynOpts} required />
          <RadioGroup id="post-sec" label={$t.postImaging.secondaryCauseLabel} name="secondaryCause" bind:value={secondaryCause} options={secondaryOpts} columns="auto" required />
          <RadioGroup id="post-seizure" label={$t.postImaging.seizureLabel} name="seizure" columns={2} bind:value={seizure} options={ynOpts} required />
          <RadioGroup id="post-anti" label={$t.postImaging.anticoagLabel} name="anticoag" bind:value={anticoag} options={anticoagOpts} columns="auto" required />
        </div>
      {/snippet}
    </Card>

    {#if showFastestExtra}
      <Card title={$t.postImaging.fastestTitle} subtitle={$t.postImaging.fastestHint}>
        {#snippet children()}
          <div class="form-stack">
            <Pill tone="info">{#snippet children()}FASTEST{/snippet}</Pill>
            <RadioGroup id="post-brain" label={$t.postImaging.brainstemLabel} name="brainstem" columns={2} bind:value={brainstem} options={ynOpts} required />
            <RadioGroup id="post-proco" label={$t.postImaging.procoagulantLabel} name="procoagulant" columns={2} bind:value={procoagulant} options={ynOpts} required />
            <RadioGroup id="post-ecg" label={$t.postImaging.ecgLabel} name="ecg" columns={2} bind:value={ecg} options={ynOpts} required />
            <RadioGroup id="post-thrombosis" label={$t.postImaging.thrombosisLabel} name="thrombosis" columns={2} bind:value={thrombosis} options={ynOpts} required />
            <RadioGroup id="post-pregn" label={$t.postImaging.pregnancyLabel} name="pregnancy" columns={2} bind:value={pregnancy} options={ynOpts} required />
            <RadioGroup id="post-angio" label={$t.postImaging.angioplastyLabel} name="angioplasty" columns={2} bind:value={angioplasty} options={ynOpts} required />
            <RadioGroup id="post-ivhscore" label={$t.postImaging.ivhScoreLabel} name="ivhScore" columns={2} bind:value={ivhScore} options={ynOpts} required />
          </div>
        {/snippet}
      </Card>
    {/if}
  {/if}

  <div class="actions">
    <Button variant="secondary" fullWidth onclick={() => push("/pre-result")}>
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

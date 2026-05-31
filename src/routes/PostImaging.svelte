<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import VesselPicker from "$lib/components/VesselPicker.svelte";
  import ToggleRow from "$lib/components/ToggleRow.svelte";
  import AspectsCells from "$lib/components/AspectsCells.svelte";
  import { preData, postData, hemData } from "$lib/stores/patient";
  import { t } from "$lib/i18n";
  import type { VesselCode } from "$lib/domain/acute-rules";

  type YN = "yes" | "no" | "";
  type StrokeType = "ischemic" | "hemorrhagic" | "";
  type CandidateStatus = "eligible" | "not eligible" | "";

  let strokeType = $state<StrokeType>(($postData.strokeType as StrokeType) ?? "");
  let candidate = $state<CandidateStatus>(($postData.candidate as CandidateStatus) ?? "");

  // IVT unificato (mapped da ivtCandidate + contraTpa)
  type IvtStatus = "" | "eligible-no-contra" | "eligible-with-contra" | "not-eligible";
  function ivtFromStore(ivt: string | undefined, contra: string | undefined): IvtStatus {
    if (ivt === "eligible" && contra === "yes") return "eligible-with-contra";
    if (ivt === "eligible") return "eligible-no-contra";
    if (ivt === "not eligible") return "not-eligible";
    return "";
  }
  let ivtStatus = $state<IvtStatus>(ivtFromStore($postData.ivtCandidate, $postData.contraTpa));
  const ivtCandidate = $derived<CandidateStatus>(ivtStatus === "not-eligible" ? "not eligible" : ivtStatus ? "eligible" : "");
  const contraTpa = $derived<YN>(ivtStatus === "eligible-with-contra" ? "yes" : ivtStatus === "eligible-no-contra" ? "no" : "");

  // Switches (Tandem, Tortuosity)
  let tandem = $state<boolean>($postData.tandem === "yes");
  let tortuosity = $state<boolean>($postData.tortuosity === "yes");

  let targetVessels = $state<VesselCode[]>(($postData.targetVessels as VesselCode[]) ?? []);
  let aspects = $state<number | null>($postData.aspects ?? null);
  let lesionConfirmed = $state<YN>(($postData.lesionConfirmed as YN) ?? "");

  // Hemorrhagic
  let hemVolume = $state<number | null>($hemData.hemVolume ?? null);
  let gcs = $state<number | null>($hemData.gcs ?? null);
  let ivh = $state<YN>(($hemData.ivh as YN) ?? "");
  let secondaryCause = $state<string>(($hemData.secondaryCause as string) ?? "");
  let seizure = $state<YN>(($hemData.seizure as YN) ?? "");
  let anticoag = $state<string>(($hemData.anticoag as string) ?? "");
  let brainstem = $state<YN>(($hemData.brainstem as YN) ?? "");
  let procoagulant = $state<YN>(($hemData.procoagulant as YN) ?? "");
  let ecg = $state<YN>(($hemData.ecg as YN) ?? "");
  let thrombosis = $state<YN>(($hemData.thrombosis as YN) ?? "");
  let pregnancy = $state<YN>(($hemData.pregnancy as YN) ?? "");
  let angioplasty = $state<YN>(($hemData.angioplasty as YN) ?? "");
  let ivhScore = $state<YN>(($hemData.ivhScore as YN) ?? "");

  $effect(() => {
    postData.set({
      strokeType,
      candidate: candidate || undefined,
      ivtCandidate: ivtCandidate || undefined,
      tandem: tandem ? "yes" : "no",
      tortuosity: tortuosity ? "yes" : "no",
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
      secondaryCause: (secondaryCause || undefined) as any,
      seizure: seizure || undefined,
      anticoag: (anticoag === "" ? undefined : anticoag) as any,
      brainstem: brainstem || undefined,
      procoagulant: procoagulant || undefined,
      ecg: ecg || undefined,
      thrombosis: thrombosis || undefined,
      pregnancy: pregnancy || undefined,
      angioplasty: angioplasty || undefined,
      ivhScore: ivhScore || undefined,
    });
  });

  const isIschemic = $derived(strokeType === "ischemic");
  const isHem = $derived(strokeType === "hemorrhagic");
  const showEvt = $derived(isIschemic && candidate === "eligible");
  const showNonEvt = $derived(isIschemic && candidate === "not eligible");
  const showFastest = $derived(isHem && ($preData.ltsw ?? 999) < 2 && ($preData.premrs ?? 99) <= 2);

  const strokeOpts = $derived([
    { value: "ischemic" as const, label: $t.postImaging.ischemic },
    { value: "hemorrhagic" as const, label: $t.postImaging.hemorrhagic },
  ]);
  const candidateOpts = $derived([
    { value: "eligible" as const, label: "Eleggibile" },
    { value: "not eligible" as const, label: "Non eleggibile" },
  ]);
  const ivtOpts = $derived([
    { value: "eligible-no-contra" as const, label: "Si, no controind." },
    { value: "eligible-with-contra" as const, label: "Si, con controind." },
    { value: "not-eligible" as const, label: "Non eleggibile" },
  ]);
  const ynOpts = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);
  const secondaryOpts = [
    { value: "None", label: "Nessuna" },
    { value: "Traumatic", label: "Trauma" },
    { value: "AVM", label: "AVM" },
    { value: "Aneurysm", label: "Aneurisma" },
    { value: "Tumor", label: "Tumore" },
    { value: "Other", label: "Altro" },
  ];
  const anticoagOpts = [
    { value: "none", label: "Nessuna" },
    { value: "warfarin", label: "Warfarin" },
    { value: "heparin", label: "Hep <24h" },
    { value: "doac", label: "DOAC" },
  ];

  const canSubmit = $derived(
    (isIschemic && candidate !== "" && (showEvt ? targetVessels.length > 0 : lesionConfirmed !== "")) ||
    (isHem && gcs !== null && hemVolume !== null && secondaryCause !== "")
  );
</script>

<AppHeader title={$t.postImaging.title} sub={$t.postImaging.subtitle} step={1} steps={3} />

<div class="body">
  <Card>
    {#snippet children()}
      <Segmented options={strokeOpts} bind:value={strokeType} cols={2} label={$t.postImaging.strokeTypeLabel} />
    {/snippet}
  </Card>

  {#if isIschemic}
    <Card title={$t.postImaging.candidacyTitle}>
      {#snippet children()}
        <div class="stack">
          <Segmented options={candidateOpts} bind:value={candidate} cols={2} label={$t.postImaging.candidateEvt} />
        </div>
      {/snippet}
    </Card>

    {#if showEvt}
      <Card title={$t.postImaging.evtTitle} subtitle={$t.postImaging.evtDesc}>
        {#snippet children()}
          <div class="stack">
            <ToggleRow title={$t.postImaging.tandemLabel} bind:checked={tandem} />
            <ToggleRow title={$t.postImaging.tortuosityLabel} sub={$t.postImaging.tortuosityHint} bind:checked={tortuosity} />
            <div class="field">
              <span class="lbl">{$t.postImaging.vesselsLabel}</span>
              <VesselPicker bind:value={targetVessels} />
            </div>
            <div class="field">
              <span class="lbl">{$t.postImaging.aspectsLabel}</span>
              <AspectsCells bind:value={aspects} />
            </div>
          </div>
        {/snippet}
      </Card>

      <Card>
        {#snippet children()}
          <Segmented options={ivtOpts} bind:value={ivtStatus} cols={1} label={$t.postImaging.candidateIvt} />
        {/snippet}
      </Card>
    {:else if showNonEvt}
      <Card title={$t.postImaging.nonEvtTitle}>
        {#snippet children()}
          <Segmented options={ynOpts} bind:value={lesionConfirmed} cols={2} label={$t.postImaging.lesionConfirmedLabel} />
        {/snippet}
      </Card>
    {/if}
  {/if}

  {#if isHem}
    <Card title={$t.postImaging.hemTitle}>
      {#snippet children()}
        <div class="stack">
          <label class="field">
            <span class="lbl">{$t.postImaging.hemVolumeLabel} ({$t.postImaging.hemVolumeSuffix})</span>
            <input class="input mono" type="number" min="0" step="0.1" value={hemVolume ?? ""} oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).value; hemVolume = v === '' ? null : Number(v); }} />
          </label>
          <label class="field">
            <span class="lbl">{$t.postImaging.gcsLabel} ({$t.postImaging.gcsHint})</span>
            <input class="input mono" type="number" min="3" max="15" value={gcs ?? ""} oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).value; gcs = v === '' ? null : Number(v); }} />
          </label>
          <div class="field">
            <span class="lbl">{$t.postImaging.ivhLabel}</span>
            <Segmented options={ynOpts} bind:value={ivh} cols={2} />
          </div>
          <div class="field">
            <span class="lbl">{$t.postImaging.secondaryCauseLabel}</span>
            <Segmented options={secondaryOpts} bind:value={secondaryCause} cols={3} />
          </div>
          <div class="field">
            <span class="lbl">{$t.postImaging.seizureLabel}</span>
            <Segmented options={ynOpts} bind:value={seizure} cols={2} />
          </div>
          <div class="field">
            <span class="lbl">{$t.postImaging.anticoagLabel}</span>
            <Segmented options={anticoagOpts} bind:value={anticoag} cols={2} />
          </div>
        </div>
      {/snippet}
    </Card>

    {#if showFastest}
      <Card title={$t.postImaging.fastestTitle} subtitle={$t.postImaging.fastestHint}>
        {#snippet children()}
          <div class="stack">
            <div class="field"><span class="lbl">{$t.postImaging.brainstemLabel}</span><Segmented options={ynOpts} bind:value={brainstem} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.procoagulantLabel}</span><Segmented options={ynOpts} bind:value={procoagulant} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.ecgLabel}</span><Segmented options={ynOpts} bind:value={ecg} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.thrombosisLabel}</span><Segmented options={ynOpts} bind:value={thrombosis} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.pregnancyLabel}</span><Segmented options={ynOpts} bind:value={pregnancy} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.angioplastyLabel}</span><Segmented options={ynOpts} bind:value={angioplasty} cols={2} /></div>
            <div class="field"><span class="lbl">{$t.postImaging.ivhScoreLabel}</span><Segmented options={ynOpts} bind:value={ivhScore} cols={2} /></div>
          </div>
        {/snippet}
      </Card>
    {/if}
  {/if}
</div>

<BottomBar onBack={() => push("/pre-result")} onNext={() => push("/summary")} nextDisabled={!canSubmit} />

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .stack { display: flex; flex-direction: column; gap: 20px; }
  .field { display: flex; flex-direction: column; gap: 8px; }
  .lbl { font-size: 13.5px; font-weight: 600; color: var(--text-muted); }
  .input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px 14px;
    font-size: 16px;
    color: var(--text);
    background: var(--surface);
    font-family: inherit;
    outline: none;
  }
  .input.mono { font-family: var(--font-mono); }
  .input:focus { border-color: var(--primary); box-shadow: var(--focus-ring); }
</style>

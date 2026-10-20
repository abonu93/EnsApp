<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import VesselPicker from "$lib/components/VesselPicker.svelte";
  import ToggleRow from "$lib/components/ToggleRow.svelte";
  import AspectsCells from "$lib/components/AspectsCells.svelte";
  import HIchCard from "$lib/components/HIchCard.svelte";
  import HVolDial from "$lib/components/HVolDial.svelte";
  import HGcs from "$lib/components/HGcs.svelte";
  import { fastestNeedsSpotSign } from "$lib/domain/hemorrhagic-rules";
  import { preData, postData, hemData, ltswHours } from "$lib/stores/patient";
  import { t } from "$lib/i18n";
  import { VANISH_MAX_HOURS, type VesselCode } from "$lib/domain/acute-rules";

  type YN = "yes" | "no" | "";
  type YNNa = YN | "na";
  type StrokeType = "ischemic" | "hemorrhagic" | "";
  type CandidateStatus = "eligible" | "not eligible" | "";

  let strokeType = $state<StrokeType>(($postData.strokeType as StrokeType) ?? "");
  let candidate = $state<CandidateStatus>(($postData.candidate as CandidateStatus) ?? "");
  let ivtCandidate = $state<CandidateStatus>(($postData.ivtCandidate as CandidateStatus) ?? "");

  // LVO derivato da candidate: se candidato a trombectomia eleggibile,
  // l'occlusione di grosso vaso e' implicitamente confermata.
  const lvo = $derived<YN>(candidate === "eligible" ? "yes" : candidate === "not eligible" ? "no" : "");

  // Switches (Tandem, Tortuosity)
  let tandem = $state<boolean>($postData.tandem === "yes");
  let tortuosity = $state<boolean>($postData.tortuosity === "yes");

  let targetVessels = $state<VesselCode[]>(($postData.targetVessels as VesselCode[]) ?? []);
  let aspects = $state<number | null>($postData.aspects ?? null);
  let lesionConfirmed = $state<YN>(($postData.lesionConfirmed as YN) ?? "");

  // TENACITY (TNK > 4.5h - 72h): campi specifici del trial.
  let perfusionMismatch = $state<YN>(($postData.perfusionMismatch as YN) ?? "");
  let largeCore = $state<YN>(($postData.largeCore as YN) ?? "");
  let diabetes = $state<YN>(($postData.diabetes as YN) ?? "");
  // VANISH: core/mismatch alla perfusione (chiesto nella scheda EVT entro 9 h).
  let vanishCoreMismatch = $state<YN>(($postData.vanishCoreMismatch as YN) ?? "");
  // ORION: trombectomia fattibile entro 1 h dall'inizio del farmaco (candidati EVT, 4,5-24 h).
  let evtWithin1h = $state<YN>(($postData.evtWithin1h as YN) ?? "");
  // contraTpa passa da costante a campo: mostrato solo nella card TENACITY,
  // resta "no" (default invariato per ORION) se la card non e' visibile.
  let contraTpaAnswer = $state<YN>(($postData.contraTpa as YN) || "no");

  // SAIL-MeVO (EVT in MeVO): campi specifici del trial.
  let aiCoreLt10 = $state<YNNa>(($postData.aiCoreLt10 as YNNa) ?? "");
  let tmaxGt30 = $state<YNNa>(($postData.tmaxGt30 as YNNa) ?? "");
  let pregnant = $state<YN>(($postData.pregnant as YN) ?? "");
  let lifeExpectancyLt3m = $state<YN>(($postData.lifeExpectancyLt3m as YN) ?? "");
  let contrastAllergy = $state<YN>(($postData.contrastAllergy as YN) ?? "");

  // Hemorrhagic
  let hemVolume = $state<number | null>($hemData.hemVolume ?? null);
  let volUnknown = $state<boolean>(false);
  let gcs = $state<number | null>($hemData.gcs ?? null);
  // ivh/seizure sono ToggleRow: spento = "no". Devono partire da "no" e non da
  // "" altrimenti il toggle appare spento ma il valore resta vuoto e TICH-3
  // risulta non eleggibile finche' l'utente non lo accende e rispegne.
  let ivh = $state<YN>(($hemData.ivh as YN) || "no");
  let secondaryCause = $state<string>(($hemData.secondaryCause as string) ?? "");
  let seizure = $state<YN>(($hemData.seizure as YN) || "no");
  let anticoag = $state<string>(($hemData.anticoag as string) ?? "");
  let brainstem = $state<YN>(($hemData.brainstem as YN) ?? "");
  let procoagulant = $state<YN>(($hemData.procoagulant as YN) ?? "");
  let ecg = $state<YN>(($hemData.ecg as YN) ?? "");
  let thrombosis = $state<YN>(($hemData.thrombosis as YN) ?? "");
  let pregnancy = $state<YN>(($hemData.pregnancy as YN) ?? "");
  let angioplasty = $state<YN>(($hemData.angioplasty as YN) ?? "");
  let ivhLarge = $state<YN>(($hemData.ivhLarge as YN) ?? "");
  let spotSign = $state<YN>(($hemData.spotSign as YN) ?? "");

  $effect(() => {
    postData.set({
      strokeType,
      candidate: candidate || undefined,
      ivtCandidate: ivtCandidate || undefined,
      lvo: lvo || undefined,
      tandem: tandem ? "yes" : "no",
      tortuosity: tortuosity ? "yes" : "no",
      targetVessels,
      contraTpa: contraTpaAnswer || undefined,
      aspects: aspects ?? undefined,
      lesionConfirmed: lesionConfirmed || undefined,
      perfusionMismatch: perfusionMismatch || undefined,
      largeCore: largeCore || undefined,
      diabetes: diabetes || undefined,
      vanishCoreMismatch: (showVanishQuestion && vanishCoreMismatch) || undefined,
      evtWithin1h: (showOrionEvtQuestion && evtWithin1h) || undefined,
      aiCoreLt10: aiCoreLt10 || undefined,
      tmaxGt30: tmaxGt30 || undefined,
      pregnant: pregnant || undefined,
      lifeExpectancyLt3m: lifeExpectancyLt3m || undefined,
      contrastAllergy: contrastAllergy || undefined,
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
      ivhLarge: ivhLarge || undefined,
      spotSign: (showSpotSign && spotSign) || undefined,
    });
  });

  const isIschemic = $derived(strokeType === "ischemic");
  const isHem = $derived(strokeType === "hemorrhagic");
  const showEvt = $derived(isIschemic && candidate === "eligible");
  // Vasi occlusi, ASPECTS e tandem servono anche ai trial senza EVT (REMEDY li
  // usa per escludere, ORION/SAIL-MeVO/TENACITY per includere): una sola
  // scheda per tutti gli ischemici, indipendente dalla candidatura a EVT.
  const showImaging = $derived(isIschemic && candidate !== "");
  const showVanishQuestion = $derived(showEvt && ($ltswHours ?? 999) <= VANISH_MAX_HOURS);
  const showOrionEvtQuestion = $derived(
    showEvt && ($ltswHours ?? -1) >= 4.5 && ($ltswHours ?? 999) <= 24
  );
  // Perfusione (mismatch, core esteso): oltre 4,5 h la usano TENACITY e ORION
  // (obbligatoria per ORION oltre 6 h), quindi sta nella scheda Imaging.
  const showPerfusion = $derived(showImaging && ($ltswHours ?? -1) > 4.5);
  const showNonEvt = $derived(isIschemic && candidate === "not eligible");
  // Stesso limite della regola fastest() (ltsw <= 2): a 2,0 h la scheda deve comparire.
  const showFastest = $derived(isHem && ($ltswHours ?? 999) <= 2 && ($preData.premrs ?? 99) <= 2);
  const showSpotSign = $derived(showFastest && fastestNeedsSpotSign($ltswHours ?? 0));
  // TENACITY: solo ischemico NON candidato a trombectomia, finestra > 4.5h e <= 72h.
  const showTenacity = $derived(
    showNonEvt && ($ltswHours ?? -1) > 4.5 && ($ltswHours ?? -1) <= 72
  );
  // SAIL-MeVO: ischemico (EVT randomizzato, quindi entrambi i percorsi) con
  // eta' 18-80, pre-mRS 0-1, NIHSS 9-17 e LTSW < 12h.
  const showSailMevo = $derived(
    isIschemic &&
    candidate !== "" &&
    ($ltswHours ?? 999) < 12 &&
    ($preData.age ?? -1) >= 18 && ($preData.age ?? 999) <= 80 &&
    ($preData.premrs ?? 99) <= 1 &&
    ($preData.nihss ?? -1) >= 9 && ($preData.nihss ?? 99) <= 17
  );

  const strokeOpts = $derived([
    { value: "ischemic" as const, label: $t.postImaging.ischemic },
    { value: "hemorrhagic" as const, label: $t.postImaging.hemorrhagic },
  ]);
  const candidateOpts = $derived([
    { value: "eligible" as const, label: $t.postImaging.candidateEligible },
    { value: "not eligible" as const, label: $t.postImaging.candidateNotEligible },
  ]);
  const ynOpts = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);
  const ynNaOpts = $derived<{ value: "yes" | "no" | "na"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
    { value: "na", label: $t.postImaging.notAvailable },
  ]);
  const secondaryOpts = $derived([
    { value: "None", label: $t.extras.causeNone },
    { value: "Traumatic", label: $t.extras.causeTrauma },
    { value: "AVM", label: $t.extras.causeAVM },
    { value: "Aneurysm", label: $t.extras.causeAneurysm },
    { value: "Tumor", label: $t.extras.causeTumor },
    { value: "Other", label: $t.extras.causeOther },
  ]);
  // Usata da FASTEST (esclude tutte le voci tranne "none") e da TICH-3
  // (esclude AVK ed eparina/EBPM terapeutica, ammette DOAC ed EBPM profilattica).
  const anticoagOpts = $derived([
    { value: "none", label: $t.extras.anticoagNoneOrAntiplatelet },
    { value: "warfarin", label: $t.extras.anticoagVka },
    { value: "doac", label: $t.extras.anticoagDoac },
    { value: "heparin", label: $t.extras.anticoagHep },
    { value: "lmwh", label: $t.extras.anticoagLmwhProphylaxis },
  ]);

  const canSubmit = $derived(
    (isIschemic && candidate !== "" && (showEvt ? targetVessels.length > 0 : lesionConfirmed !== "")) ||
    (isHem && gcs !== null && hemVolume !== null && secondaryCause !== "" && anticoag !== "")
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
          <div class="divider"></div>
          <Segmented options={candidateOpts} bind:value={ivtCandidate} cols={2} label={$t.postImaging.candidateIvt} />
        </div>
      {/snippet}
    </Card>

    {#if showImaging}
      <Card title={$t.postImaging.imagingTitle} subtitle={$t.postImaging.imagingDesc}>
        {#snippet children()}
          <div class="stack">
            <div class="field">
              <span class="lbl">{$t.postImaging.imagingVesselsLabel}</span>
              <VesselPicker bind:value={targetVessels} />
            </div>
            <div class="divider"></div>
            <ToggleRow title={$t.postImaging.tandemLabel.replace('?', '')} bind:checked={tandem} />
            <div class="field">
              <span class="lbl">{$t.postImaging.aspectsLabel}</span>
              <AspectsCells bind:value={aspects} />
            </div>
            {#if showPerfusion}
              <div class="divider"></div>
              <div class="field">
                <span class="lbl">{$t.postImaging.perfusionMismatchLabel}</span>
                <Segmented options={ynOpts} bind:value={perfusionMismatch} cols={2} />
              </div>
              <div class="field">
                <span class="lbl">{$t.postImaging.largeCoreLabel}</span>
                <Segmented options={ynOpts} bind:value={largeCore} cols={2} />
              </div>
            {/if}
          </div>
        {/snippet}
      </Card>
    {/if}

    {#if showEvt}
      <Card title={$t.postImaging.evtTitle} subtitle={$t.postImaging.evtDesc}>
        {#snippet children()}
          <div class="stack">
            <ToggleRow title={$t.postImaging.tortuosityLabel.replace('?', '')} sub={$t.postImaging.tortuosityHint} bind:checked={tortuosity} />
            {#if showOrionEvtQuestion}
              <div class="divider"></div>
              <div class="field">
                <span class="lbl">{$t.postImaging.orionEvtWithin1hLabel}</span>
                <Segmented options={ynOpts} bind:value={evtWithin1h} cols={2} />
              </div>
            {/if}
            {#if showVanishQuestion}
              <div class="divider"></div>
              <div class="field">
                <span class="lbl">{$t.postImaging.vanishCoreMismatchLabel}</span>
                <Segmented options={ynOpts} bind:value={vanishCoreMismatch} cols={2} />
              </div>
            {/if}
          </div>
        {/snippet}
      </Card>
    {:else if showNonEvt}
      <Card title={$t.postImaging.nonEvtTitle}>
        {#snippet children()}
          <Segmented options={ynOpts} bind:value={lesionConfirmed} cols={2} label={$t.postImaging.lesionConfirmedLabel} />
        {/snippet}
      </Card>
    {/if}

    {#if showTenacity}
      <Card title={$t.postImaging.tenacityTitle} subtitle={$t.postImaging.tenacityHint}>
        {#snippet children()}
          <div class="stack">
            <div class="field">
              <span class="lbl">{$t.postImaging.contraTpaLabel}</span>
              <Segmented options={ynOpts} bind:value={contraTpaAnswer} cols={2} />
            </div>
            <div class="field">
              <span class="lbl">{$t.postImaging.diabetesLabel}</span>
              <Segmented options={ynOpts} bind:value={diabetes} cols={2} />
            </div>
          </div>
        {/snippet}
      </Card>
    {/if}

    {#if showSailMevo}
      <Card title={$t.postImaging.sailMevoTitle} subtitle={$t.postImaging.sailMevoHint}>
        {#snippet children()}
          <div class="stack">
            <div class="field">
              <span class="lbl">{$t.postImaging.aiCoreLt10Label}</span>
              <Segmented options={ynNaOpts} bind:value={aiCoreLt10} cols={3} />
            </div>
            <div class="field">
              <span class="lbl">{$t.postImaging.tmaxGt30Label}</span>
              <Segmented options={ynNaOpts} bind:value={tmaxGt30} cols={3} />
            </div>
            <div class="divider"></div>
            <div class="field">
              <span class="lbl">{$t.postImaging.pregnancyLabel}</span>
              <Segmented options={ynOpts} bind:value={pregnant} cols={2} />
            </div>
            <div class="field">
              <span class="lbl">{$t.postImaging.lifeExpectancyLabel}</span>
              <Segmented options={ynOpts} bind:value={lifeExpectancyLt3m} cols={2} />
            </div>
            <div class="field">
              <span class="lbl">{$t.postImaging.contrastAllergyLabel}</span>
              <Segmented options={ynOpts} bind:value={contrastAllergy} cols={2} />
            </div>
          </div>
        {/snippet}
      </Card>
    {/if}
  {/if}

  {#if isHem}
    <HIchCard patient={{ gcs, ivh: ivh === "yes", age: $preData.age, hemVolume, volUnknown }} />

    <Card title={$t.extras.severity}>
      {#snippet children()}
        <div class="stack">
          <HVolDial bind:value={hemVolume} bind:unknown={volUnknown} />
          <div class="divider"></div>
          <div class="field">
            <span class="lbl">{$t.postImaging.gcsLabel}</span>
            <HGcs bind:value={gcs} />
          </div>
        </div>
      {/snippet}
    </Card>

    <Card title={$t.extras.patternCause}>
      {#snippet children()}
        <div class="stack">
          <ToggleRow title={$t.extras.isolatedIvh} sub={$t.extras.isolatedIvhSub} checked={ivh === "yes"} onChange={(v) => ivh = v ? "yes" : "no"} />
          <div class="divider"></div>
          <div class="field">
            <span class="lbl">{$t.postImaging.secondaryCauseLabel}</span>
            <Segmented options={secondaryOpts} bind:value={secondaryCause} cols={3} />
          </div>
        </div>
      {/snippet}
    </Card>

    <Card title={$t.extras.eligFactors}>
      {#snippet children()}
        <div class="stack">
          <ToggleRow title={$t.extras.txaExcl} sub={$t.extras.txaExclSub} checked={seizure === "yes"} onChange={(v) => seizure = v ? "yes" : "no"} />
          <div class="divider"></div>
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
            <div class="field"><span class="lbl">{$t.postImaging.ivhLargeLabel}</span><Segmented options={ynOpts} bind:value={ivhLarge} cols={2} /></div>
            {#if showSpotSign}
              <div class="field"><span class="lbl">{$t.postImaging.spotSignLabel}</span><Segmented options={ynOpts} bind:value={spotSign} cols={2} /></div>
            {/if}
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
  .stack { display: flex; flex-direction: column; gap: 16px; }
  .divider { border-top: 1px solid var(--border); }
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

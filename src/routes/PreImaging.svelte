<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import NihssScale from "$lib/components/NihssScale.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import { preData, hoursSince } from "$lib/stores/patient";
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

  const ltswHrs = $derived(hoursSince(ltswDate));
  const symptomsWithin6h = $derived(wakeupStroke && ltswHrs !== undefined && ltswHrs <= 6);

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

  const canSubmit = $derived(
    age !== null && nihss !== null && premrs !== null && ltswDate !== "" &&
    angiograph !== "" && doac !== "" && acei !== ""
  );

  function submit() { if (canSubmit) push("/pre-result"); }

  // Window classification per LTSW
  function windowInfo(hours: number | undefined): { tone: "success" | "warn" | "danger"; label: string } | null {
    if (hours === undefined) return null;
    const min = hours * 60;
    if (min <= 270) return { tone: "success", label: "Finestra trombolisi IV" };
    if (min <= 360) return { tone: "success", label: "Finestra EVT standard" };
    if (min <= 1440) return { tone: "warn", label: "Finestra EVT selezionata (<=24h)" };
    return { tone: "danger", label: "Finestra chiusa" };
  }
  const win = $derived(windowInfo(ltswHrs));

  // Presets per LTSW (now / -1h / -3h / -6h)
  function setPreset(hoursAgo: number) {
    const d = new Date(Date.now() - hoursAgo * 3_600_000);
    // datetime-local accetta YYYY-MM-DDTHH:MM
    const off = d.getTimezoneOffset() * 60_000;
    ltswDate = new Date(d.getTime() - off).toISOString().slice(0, 16);
  }

  const mrsOpts: { value: number; label: string }[] = [0, 1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }));
  const ynOpts = $derived<{ value: "yes" | "no"; label: string }[]>([
    { value: "no", label: $t.common.no },
    { value: "yes", label: $t.common.yes },
  ]);
</script>

<AppHeader title={$t.preImaging.title} sub={$t.preImaging.subtitle} step={0} steps={3} />

<div class="body">
  <Card>
    {#snippet children()}
      <label class="field">
        <span class="lbl">{$t.preImaging.patientRecordLabel}</span>
        <input class="input mono" type="text" bind:value={patientId} placeholder="2025-00123" />
      </label>
    {/snippet}
  </Card>

  <Card title={$t.preImaging.anamnesis}>
    {#snippet children()}
      <div class="stack">
        <label class="field">
          <span class="row-lbl"><span class="lbl">{$t.preImaging.ageLabel}</span><span class="hint">18-110</span></span>
          <div class="input-wrap">
            <input class="input mono" type="text" inputmode="numeric" value={age ?? ""} oninput={(e) => { const v = (e.currentTarget as HTMLInputElement).value.replace(/[^0-9]/g, ''); age = v === '' ? null : Number(v); }} placeholder="—" />
            <span class="unit">{$t.preImaging.ageSuffix}</span>
          </div>
        </label>

        <div class="field">
          <span class="row-lbl"><span class="lbl">NIHSS</span><span class="hint">0-42</span></span>
          <NihssScale bind:value={nihss} />
        </div>

        <div class="field">
          <span class="row-lbl"><span class="lbl">pre-mRS</span><span class="hint">0 autonomo - 5 severo</span></span>
          <Segmented
            options={mrsOpts}
            value={premrs ?? ""}
            onChange={(v) => (premrs = v)}
          />
        </div>
      </div>
    {/snippet}
  </Card>

  <Card title="Last seen well">
    {#snippet children()}
      <div class="stack">
        <input class="input" type="datetime-local" bind:value={ltswDate} aria-label="LTSW" />

        <div class="presets">
          <button type="button" class="preset" onclick={() => setPreset(0)}>Adesso</button>
          <button type="button" class="preset" onclick={() => setPreset(1)}>-1h</button>
          <button type="button" class="preset" onclick={() => setPreset(3)}>-3h</button>
          <button type="button" class="preset" onclick={() => setPreset(6)}>-6h</button>
        </div>

        {#if ltswHrs !== undefined}
          <div class="elapsed">
            <span class="elapsed-val">{ltswHrs.toFixed(1)}h</span>
            <span class="elapsed-lbl">da LTSW</span>
          </div>
          {#if win}
            <div class="window tone-{win.tone}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{win.label}</span>
            </div>
          {/if}
        {/if}

        <div class="toggle">
          <span class="text">
            <strong>{$t.preImaging.wakeupLabel}</strong>
            <small>{$t.preImaging.wakeupDesc}</small>
          </span>
          <Switch bind:checked={wakeupStroke} label={$t.preImaging.wakeupLabel} />
        </div>
        {#if wakeupStroke && ltswHrs !== undefined}
          <div class="window tone-{symptomsWithin6h ? 'success' : 'warn'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Sintomi entro 6h: <strong>{symptomsWithin6h ? $t.common.yes : $t.common.no}</strong></span>
          </div>
        {/if}
      </div>
    {/snippet}
  </Card>

  <Card title={$t.preImaging.contextTitle}>
    {#snippet children()}
      <div class="stack">
        <div class="field">
          <span class="lbl">{$t.preImaging.angioLabel}</span>
          <Segmented options={ynOpts} bind:value={angiograph} cols={2} />
        </div>
        <div class="field">
          <span class="lbl">{$t.preImaging.doacLabel}</span>
          <Segmented options={ynOpts} bind:value={doac} cols={2} />
        </div>
        <div class="field">
          <span class="lbl">{$t.preImaging.aceiLabel}</span>
          <Segmented options={ynOpts} bind:value={acei} cols={2} />
        </div>
      </div>
    {/snippet}
  </Card>
</div>

<BottomBar onBack={() => push("/workflow")} onNext={submit} nextDisabled={!canSubmit} />

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
  .field { display: block; }
  .row-lbl {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .lbl { font-size: 13.5px; font-weight: 600; color: var(--text-muted); }
  .hint { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); }
  .input-wrap { position: relative; display: flex; align-items: center; }
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
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .input.mono { font-family: var(--font-mono); }
  .input:focus { border-color: var(--primary); box-shadow: var(--focus-ring); }
  .unit {
    position: absolute;
    right: 14px;
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    pointer-events: none;
  }

  .presets {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .preset {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 10px;
    padding: 10px 0;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .preset:hover { border-color: var(--primary); color: var(--primary); }
  .preset:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  .elapsed {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .elapsed-val {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.4px;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .elapsed-lbl { font-size: 12.5px; color: var(--text-muted); }

  .window {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .window.tone-success { background: var(--success-soft); color: var(--success); }
  .window.tone-warn { background: var(--warn-soft); color: var(--warn); }
  .window.tone-danger { background: var(--danger-soft); color: var(--danger); }

  .toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
  }
  .text { flex: 1; min-width: 0; }
  .text strong { display: block; font-size: 14px; font-weight: 600; color: var(--text); }
  .text small { display: block; font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }
</style>

<script lang="ts">
  // NIHSS scale: slider 0-42 con value mono grande + badge severità.
  // Bands: 0 No deficit (success) · 1-4 Minor (success) · 5-15 Moderate (warn)
  //        · 16-20 Mod-severe (warn) · 21-42 Severe (danger)
  interface Props {
    value: number | null;
    onChange?: (v: number) => void;
  }
  let { value = $bindable<number | null>(null), onChange }: Props = $props();

  type Tone = "success" | "warn" | "danger";
  const bands: Array<[number, number, string, Tone]> = [
    [0, 0, "No deficit", "success"],
    [1, 4, "Minor", "success"],
    [5, 15, "Moderate", "warn"],
    [16, 20, "Mod-severe", "warn"],
    [21, 42, "Severe", "danger"],
  ];

  const band = $derived.by(() => {
    const v = value ?? 0;
    return bands.find(([lo, hi]) => v >= lo && v <= hi) ?? bands[0];
  });

  function onInput(e: Event) {
    const n = Number((e.currentTarget as HTMLInputElement).value);
    value = n;
    onChange?.(n);
  }
</script>

<div class="nihss">
  <div class="head">
    <span class="val">{value == null ? "—" : value}</span>
    <span class="band tone-{band[3]}">{band[2]}</span>
  </div>
  <input
    class="range tone-{band[3]}"
    type="range"
    min="0"
    max="42"
    value={value ?? 0}
    oninput={onInput}
    aria-label="NIHSS"
  />
  <div class="ticks">
    <span>0</span><span>21</span><span>42</span>
  </div>
</div>

<style>
  .nihss { display: block; }
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .val {
    font-family: var(--font-mono);
    font-size: 38px;
    font-weight: 600;
    letter-spacing: -1px;
    color: var(--text);
    line-height: 0.9;
    font-variant-numeric: tabular-nums;
  }
  .band {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .band.tone-success { color: var(--success); background: var(--success-soft); }
  .band.tone-warn { color: var(--warn); background: var(--warn-soft); }
  .band.tone-danger { color: var(--danger); background: var(--danger-soft); }

  .range {
    width: 100%;
    appearance: none;
    height: 6px;
    border-radius: 999px;
    background: var(--border);
    outline: none;
  }
  .range::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--surface);
    border: 3px solid var(--primary);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }
  .range.tone-success::-webkit-slider-thumb { border-color: var(--success); }
  .range.tone-warn::-webkit-slider-thumb { border-color: var(--warn); }
  .range.tone-danger::-webkit-slider-thumb { border-color: var(--danger); }
  .range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--surface);
    border: 3px solid var(--primary);
    cursor: pointer;
  }
  .range:focus-visible { box-shadow: var(--focus-ring); }

  .ticks {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--text-muted);
  }
</style>

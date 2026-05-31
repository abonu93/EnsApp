<script lang="ts">
  // GCS 3-15 slider con value mono + severity badge.
  interface Props {
    value: number | null;
    onChange?: (v: number) => void;
  }
  let { value = $bindable<number | null>(null), onChange }: Props = $props();

  type Tone = "danger" | "warn" | "success";
  function bandTone(v: number): Tone {
    if (v <= 8) return "danger";
    if (v <= 12) return "warn";
    return "success";
  }
  function bandLabel(v: number): string {
    if (v <= 8) return "Severo";
    if (v <= 12) return "Moderato";
    return "Lieve";
  }
  const v = $derived(value == null ? 15 : value);
  const tone = $derived(bandTone(v));

  function onInput(e: Event) {
    const n = Number((e.currentTarget as HTMLInputElement).value);
    value = n;
    onChange?.(n);
  }
</script>

<div class="gcs">
  <div class="head">
    <span class="val tone-{tone}">
      {value == null ? "—" : v}<span class="den">/15</span>
    </span>
    <span class="band tone-{tone}">{bandLabel(v)}</span>
  </div>
  <input class="range tone-{tone}" type="range" min="3" max="15" value={v} oninput={onInput} aria-label="GCS" />
  <div class="ticks"><span>3</span><span>9</span><span>15</span></div>
</div>

<style>
  .gcs { display: block; }
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .val {
    font-family: var(--font-mono);
    font-size: 30px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .val.tone-success { color: var(--success); }
  .val.tone-warn { color: var(--warn); }
  .val.tone-danger { color: var(--danger); }
  .den { font-size: 14px; color: var(--text-muted); }
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
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--surface);
    border: 3px solid var(--primary);
    cursor: pointer;
  }
  .range.tone-danger::-webkit-slider-thumb { border-color: var(--danger); }
  .range.tone-warn::-webkit-slider-thumb { border-color: var(--warn); }
  .range.tone-success::-webkit-slider-thumb { border-color: var(--success); }
  .ticks {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--text-muted);
  }
</style>

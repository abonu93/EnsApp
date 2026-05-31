<script lang="ts">
  // Radial dial per volume emorragia (0-120 mL). "Not available" toggle disabilita.
  interface Props {
    value: number | null;
    unknown: boolean;
    onChange?: (v: number) => void;
    onUnknown?: (u: boolean) => void;
  }
  let { value = $bindable<number | null>(null), unknown = $bindable(false), onChange, onUnknown }: Props = $props();

  const MAX = 120;
  const R = 44;
  const C = 2 * Math.PI * R;

  const v = $derived(value == null ? 0 : value);
  const frac = $derived(unknown ? 0 : Math.min(1, v / MAX));
  const high = $derived(!unknown && v >= 30);

  function setRange(e: Event) {
    const n = Number((e.currentTarget as HTMLInputElement).value);
    value = n;
    onChange?.(n);
  }
  function toggleUnknown() {
    unknown = !unknown;
    onUnknown?.(unknown);
  }
</script>

<div class="vol">
  <div class="head">
    <span class="lbl">Volume emorragia</span>
    <button class="not-avail" class:on={unknown} type="button" onclick={toggleUnknown}>
      <span class="box" aria-hidden="true">
        {#if unknown}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        {/if}
      </span>
      Non disponibile
    </button>
  </div>
  <div class="body" class:unknown>
    <div class="ring">
      <svg width="116" height="116" aria-hidden="true">
        <circle cx="58" cy="58" r={R} fill="none" stroke="var(--border)" stroke-width="10" />
        <circle
          cx="58" cy="58" r={R}
          fill="none"
          stroke={unknown ? "var(--border)" : high ? "var(--warn)" : "var(--primary)"}
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray={C}
          stroke-dashoffset={C * (1 - frac)}
          transform="rotate(-90 58 58)"
          style="transition: stroke-dashoffset .2s, stroke .2s"
        />
      </svg>
      <div class="ring-val" class:high>
        <span class="num">{unknown ? "—" : v}</span>
        <span class="unit">mL</span>
      </div>
    </div>
    <div class="ctrl">
      <input
        class="range"
        type="range"
        min="0"
        max={MAX}
        value={v}
        disabled={unknown}
        oninput={setRange}
        aria-label="Volume mL"
      />
      <div class="hint" class:high>
        {unknown ? "Volume da definire" : high ? "Ematoma esteso (>=30 mL)" : "Trascina o tap sul cerchio"}
      </div>
    </div>
  </div>
</div>

<style>
  .vol { display: block; }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .lbl { font-size: 13.5px; font-weight: 600; color: var(--text-muted); }
  .not-avail {
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 999px;
    padding: 5px 11px;
    font-size: 11.5px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: inherit;
  }
  .not-avail.on {
    border: 1.5px solid var(--primary);
    background: var(--primary-soft);
    color: var(--primary-hover);
  }
  .box {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 2px solid var(--border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .not-avail.on .box {
    background: var(--primary);
    border: none;
  }
  .body {
    display: flex;
    align-items: center;
    gap: 18px;
    transition: opacity .2s;
  }
  .body.unknown { opacity: 0.55; }
  .ring {
    position: relative;
    width: 116px;
    height: 116px;
    flex-shrink: 0;
  }
  .ring-val {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .num {
    font-family: var(--font-mono);
    font-size: 23px;
    font-weight: 700;
    color: var(--text);
  }
  .ring-val.high .num { color: var(--warn); }
  .body.unknown .num { color: var(--text-muted); }
  .unit {
    font-size: 10.5px;
    color: var(--text-muted);
  }
  .ctrl { flex: 1; }
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
    box-shadow: var(--shadow-sm);
  }
  .range:disabled::-webkit-slider-thumb { border-color: var(--border-strong); cursor: not-allowed; }
  .hint {
    margin-top: 10px;
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .hint.high { color: var(--warn); font-weight: 600; }
</style>

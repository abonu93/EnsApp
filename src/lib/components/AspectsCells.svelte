<script lang="ts">
  // ASPECTS 0-10 colored cells (red <=5, amber <=7, green >=8).
  interface Props {
    value: number | null;
    onChange?: (v: number) => void;
  }
  let { value = $bindable<number | null>(null), onChange }: Props = $props();

  function tone(v: number | null): "danger" | "warn" | "success" | "muted" {
    if (v == null) return "muted";
    if (v <= 5) return "danger";
    if (v <= 7) return "warn";
    return "success";
  }
  function label(v: number | null): string {
    if (v == null) return "";
    if (v <= 5) return "Core esteso";
    if (v <= 7) return "Core moderato";
    return "Core favorevole";
  }

  function set(i: number) {
    value = i;
    onChange?.(i);
  }
</script>

<div class="cells">
  <div class="head">
    <span class="val tone-{tone(value)}">
      {value == null ? "—" : value}<span class="den">/10</span>
    </span>
    {#if value != null}
      <span class="badge tone-{tone(value)}">{label(value)}</span>
    {/if}
  </div>
  <div class="grid" role="radiogroup" aria-label="ASPECTS">
    {#each Array(11) as _, i (i)}
      {@const on = value != null && i <= value}
      <button
        type="button"
        class="cell tone-{tone(value)}"
        class:on
        onclick={() => set(i)}
        aria-label="ASPECTS {i}"
        aria-pressed={on}
      >{i}</button>
    {/each}
  </div>
</div>

<style>
  .cells { display: block; }
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
    letter-spacing: -1px;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .val.tone-success { color: var(--success); }
  .val.tone-warn { color: var(--warn); }
  .val.tone-danger { color: var(--danger); }
  .den { font-size: 14px; color: var(--text-muted); margin-left: 1px; }
  .badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .badge.tone-success { color: var(--success); background: var(--success-soft); }
  .badge.tone-warn { color: var(--warn); background: var(--warn-soft); }
  .badge.tone-danger { color: var(--danger); background: var(--danger-soft); }
  .grid {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    gap: 4px;
  }
  .cell {
    height: 34px;
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  .cell:active { transform: scale(0.95); }
  .cell:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .cell.on.tone-success { background: var(--success); color: var(--text-inverted); }
  .cell.on.tone-warn { background: var(--warn); color: var(--text-inverted); }
  .cell.on.tone-danger { background: var(--danger); color: var(--text-inverted); }
</style>

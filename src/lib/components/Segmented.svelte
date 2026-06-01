<script lang="ts" generics="T extends string | number">
  // Segmented control: una scelta tra N opzioni in pill orizzontale.
  // Usato per: mRS 0-5, stroke type, yes/no, candidacy.
  interface Option {
    value: T;
    label: string;
  }
  interface Props {
    options: Option[];
    value: T | "";
    cols?: number;
    name?: string;
    label?: string;
    onChange?: (v: T) => void;
  }
  let { options, value = $bindable<T | "">(""), cols, name = "", label = "", onChange }: Props = $props();
  const gridCols = $derived(cols ?? options.length);

  function pick(v: T) {
    value = v;
    onChange?.(v);
  }
</script>

{#if label}
  <div class="lbl-row">
    <span class="lbl">{label}</span>
  </div>
{/if}
<div class="seg" role="radiogroup" aria-label={label || name} style="grid-template-columns: repeat({gridCols}, 1fr)">
  {#each options as o (o.value)}
    {@const on = value === o.value}
    <button
      type="button"
      role="radio"
      aria-checked={on}
      class="opt"
      class:on
      onclick={() => pick(o.value)}
    >{o.label}</button>
  {/each}
</div>

<style>
  .lbl-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 8px;
  }
  .lbl {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .seg {
    display: grid;
    gap: 7px;
  }
  .opt {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 11px;
    padding: 12px 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    transition: all var(--transition-fast);
    min-height: var(--touch-min);
  }
  .opt:active { transform: scale(0.98); }
  .opt:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .opt.on {
    border: 1.5px solid var(--primary);
    background: var(--primary-soft);
    color: var(--primary-hover);
  }
</style>

<script lang="ts">
  // Region drill-down vessel picker. Tabs ICA/MCA/ACA/Posterior con count
  // badge, lista grandi pulsanti per i vessels della regione, chip rimovibili
  // per i selezionati.
  import type { VesselCode } from "$lib/domain/acute-rules";
  import { VESSEL_OPTIONS } from "$lib/domain/vessels";
  import { t } from "$lib/i18n";

  interface Props {
    value: VesselCode[];
    onChange?: (v: VesselCode[]) => void;
  }
  let { value = $bindable<VesselCode[]>([]), onChange }: Props = $props();

  type Region = "ica" | "mca" | "aca" | "post";

  const REGIONS = $derived<Array<{ key: Region; label: string; codes: VesselCode[] }>>([
    { key: "ica", label: "ICA", codes: ["ica-intracranial", "ica-terminal"] },
    { key: "mca", label: "MCA", codes: ["m1", "m2-proxdom", "m2-any", "gt-m2"] },
    { key: "aca", label: "ACA", codes: ["a1", "a2", "gt-a2"] },
    { key: "post", label: $t.extras.regionPosterior, codes: ["va", "basilar", "p1", "p2", "gt-p2"] },
  ]);

  const LABEL = Object.fromEntries(VESSEL_OPTIONS.map((o) => [o.value, o.label])) as Record<VesselCode, string>;

  let region = $state<Region>("ica");

  function tap(k: VesselCode) {
    const next = value.includes(k) ? value.filter((x) => x !== k) : [...value, k];
    value = next;
    onChange?.(next);
  }

  const counts = $derived.by(() => {
    const set = new Set(value);
    return Object.fromEntries(
      REGIONS.map((r) => [r.key, r.codes.filter((c) => set.has(c)).length])
    ) as Record<Region, number>;
  });

  const currentList = $derived(REGIONS.find((r) => r.key === region)!.codes);
</script>

<div class="picker">
  <div class="chips">
    {#if value.length === 0}
      <span class="empty">{$t.extras.vesselsNone}</span>
    {:else}
      {#each value as k (k)}
        <button class="chip-sel" type="button" onclick={() => tap(k)}>
          <span>{LABEL[k]}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </button>
      {/each}
    {/if}
  </div>

  <div class="tabs" role="tablist">
    {#each REGIONS as r (r.key)}
      {@const on = region === r.key}
      {@const cnt = counts[r.key]}
      <button class="tab" class:on type="button" role="tab" aria-selected={on} onclick={() => (region = r.key)}>
        {r.label}
        {#if cnt > 0}<span class="cnt">{cnt}</span>{/if}
      </button>
    {/each}
  </div>

  <div class="list">
    {#each currentList as k (k)}
      {@const on = value.includes(k)}
      <button class="vessel" class:on type="button" onclick={() => tap(k)} aria-pressed={on}>
        {#if on}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        {/if}
        {LABEL[k]}
      </button>
    {/each}
  </div>
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 24px;
  }
  .empty {
    font-size: 12.5px;
    color: var(--text-muted);
    font-style: italic;
  }
  .chip-sel {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--primary-soft);
    color: var(--primary-hover);
    border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
    border-radius: 999px;
    padding: 5px 7px 5px 11px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .chip-sel:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  .tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: var(--bg);
    border-radius: 12px;
    padding: 4px;
  }
  .tab {
    border: none;
    border-radius: 9px;
    padding: 10px 4px;
    background: transparent;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    font-family: inherit;
    min-height: 40px;
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  .tab.on {
    background: var(--surface);
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.12);
    color: var(--text);
  }
  .tab:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .cnt {
    position: absolute;
    top: 3px;
    right: 5px;
    width: 15px;
    height: 15px;
    border-radius: 999px;
    background: var(--primary);
    color: var(--text-inverted);
    font-size: 9.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vessel {
    width: 100%;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 12px;
    padding: 13px 12px;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all var(--transition-fast);
    font-family: inherit;
    min-height: var(--touch-min);
  }
  .vessel:active { transform: scale(0.98); }
  .vessel:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .vessel.on {
    border: 1.5px solid var(--primary);
    background: var(--primary);
    color: var(--text-inverted);
  }
</style>

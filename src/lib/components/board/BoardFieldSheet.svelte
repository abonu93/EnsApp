<script lang="ts">
  // Foglio per un dato del board: slider (numeri), opzioni, vasi occlusi.
  import Sheet from "../Sheet.svelte";
  import { FIELD_BY_KEY, isMissing } from "$lib/domain/board";
  import { VESSEL_OPTIONS } from "$lib/domain/vessels";
  import { t } from "$lib/i18n";
  import { VESSEL_SHORT, fieldLabel, fill, optLabel } from "./format";

  interface Props {
    field: string;
    value: unknown;
    /** Tutti i valori (il selettore dei vasi legge e scrive anche `tandem`). */
    values?: Record<string, unknown>;
    onSet: (key: string, value: unknown) => void;
    onClose: () => void;
  }
  let { field, value, values = {}, onSet, onClose }: Props = $props();

  const def = $derived(FIELD_BY_KEY[field]);
  const label = $derived(fieldLabel($t, field));

  // svelte-ignore state_referenced_locally
  let num = $state<number>(typeof value === "number" ? value : (FIELD_BY_KEY[field]?.start ?? 0));
  // svelte-ignore state_referenced_locally
  let vessels = $state<string[]>(Array.isArray(value) ? [...value] : []);
  // ICA/CCA extracranica: con un'occlusione intracranica e' un tandem; da sola
  // e' un'occlusione cervicale. Si salva nel campo `tandem` che leggono le
  // regole (VANISH, PIVOTAL, NiVO, TENACITY, SAIL-MeVO).
  // svelte-ignore state_referenced_locally
  let extra = $state<boolean>(values.tandem === "yes");
  function saveVessels(v: string[]) {
    onSet("tandem", extra ? "yes" : "no");
    done(v);
  }

  const clamp = (v: number) => Math.max(def.min ?? 0, Math.min(def.max ?? 100, v));
  const unit = $derived(def?.unit === " mL" ? " mL" : "");
  const cols = $derived(def?.options ? Math.min(def.options.length, def.options.length > 4 ? 3 : def.options.length) : 1);

  function done(v: unknown) {
    onSet(field, v);
    onClose();
  }
  function toggleVessel(v: string) {
    vessels = vessels.includes(v) ? vessels.filter((x) => x !== v) : [...vessels, v];
  }
</script>

<Sheet open={true} ariaLabel={label} {onClose}>
  {#snippet children()}
    <div class="head">
      <h2 class="title">{label}</h2>
      {#if !isMissing(value)}
        <button type="button" class="clear ens-press" onclick={() => done(undefined)}>{$t.board.clear}</button>
      {/if}
    </div>

    {#if def.kind === "vessels"}
      <p class="hint">{$t.board.selectSegments}</p>
      <div class="vgrid">
        {#each VESSEL_OPTIONS as v (v.value)}
          {@const on = vessels.includes(v.value)}
          <button type="button" class="vbtn ens-press" class:on aria-pressed={on} aria-label={v.label} onclick={() => toggleVessel(v.value)}>
            {VESSEL_SHORT[v.value] ?? v.label}
          </button>
        {/each}
      </div>
      <button type="button" class="extra ens-press" class:on={extra} aria-pressed={extra} onclick={() => (extra = !extra)}>
        <span class="extra-l">{$t.board.extraLabel}</span>
        <span class="extra-h">{$t.board.extraHint}</span>
      </button>
      <div class="pair">
        <button type="button" class="big soft ens-press" onclick={() => saveVessels([])}>{$t.board.noOcclusion}</button>
        <button type="button" class="big ens-press" disabled={!vessels.length && !extra} onclick={() => saveVessels(vessels)}>{$t.board.set}</button>
      </div>
    {:else if def.kind === "num"}
      <div class="value" aria-hidden="true">{num}<span class="unit">{unit}</span></div>
      <input
        class="range"
        type="range"
        min={def.min}
        max={def.max}
        bind:value={num}
        aria-label={label}
      />
      <div class="steps">
        {#each [-5, -1, 1, 5] as s (s)}
          <button type="button" class="step ens-press" onclick={() => (num = clamp(num + s))}>{s > 0 ? `+${s}` : `−${-s}`}</button>
        {/each}
      </div>
      <button type="button" class="big ens-press" onclick={() => done(num)}>{fill($t.board.setValue, { v: `${num}${unit}` })}</button>
    {:else}
      <div class="ogrid" style="grid-template-columns: repeat({cols}, 1fr)">
        {#each def.options ?? [] as o (String(o))}
          {@const on = value === o}
          <button type="button" class="obtn ens-press" class:on class:mono={def.mono} aria-pressed={on} onclick={() => done(o)}>
            {def.mono ? String(o) : optLabel($t, o)}
          </button>
        {/each}
      </div>
    {/if}
  {/snippet}
</Sheet>

<style>
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 0 6px;
  }
  .title {
    margin: 0;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .clear {
    color: var(--text-muted);
    font-size: 13px;
    padding: 6px;
    min-height: 32px;
  }
  .hint {
    margin: 4px 6px 0;
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .vgrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin: 14px 6px 0;
  }
  .vbtn,
  .obtn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 10px;
    padding: 12px 2px;
    font-size: 13px;
  }
  .obtn {
    border-radius: 12px;
    padding: 16px 6px;
    font-size: 15px;
  }
  .obtn.mono { font-family: var(--font-mono); }
  .vbtn.on,
  .obtn.on {
    border-color: var(--primary-hover);
    background: var(--primary-hover);
    color: var(--text-inverted);
    font-weight: 600;
  }
  .extra {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: calc(100% - 12px);
    margin: 10px 6px 0;
    padding: 10px 12px;
    text-align: left;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
  }
  .extra.on {
    border-color: var(--primary-hover);
    background: var(--primary-hover);
    color: var(--text-inverted);
  }
  .extra-l { font-size: 14px; font-weight: 600; }
  .extra-h { font-size: 12px; opacity: 0.85; }
  .ogrid {
    display: grid;
    gap: 8px;
    margin: 16px 6px 4px;
  }
  .pair {
    display: flex;
    gap: 8px;
    margin: 0 6px;
  }
  .pair .big { flex: 1; }
  .big {
    width: calc(100% - 12px);
    margin: 16px 6px 0;
    border-radius: 13px;
    padding: 15px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-inverted);
    background: var(--primary-hover);
  }
  .pair .big { width: auto; margin: 16px 0 0; }
  .big.soft {
    background: var(--surface-elevated);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .big:disabled { opacity: 0.4; }
  .value {
    text-align: center;
    font-family: var(--font-mono);
    font-size: 52px;
    font-weight: 500;
    letter-spacing: -2.5px;
    line-height: 1;
    margin-top: 18px;
  }
  .unit {
    font-size: 18px;
    color: var(--text-muted);
    letter-spacing: 0;
  }
  .range {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 28px;
    width: calc(100% - 12px);
    margin: 16px 6px 0;
  }
  .range::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 99px;
    background: var(--border);
  }
  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 99px;
    background: var(--surface);
    border: 2px solid var(--primary);
    margin-top: -11px;
    box-shadow: 0 2px 8px rgba(15, 60, 80, 0.18);
  }
  .range::-moz-range-track {
    height: 4px;
    border-radius: 99px;
    background: var(--border);
  }
  .range::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 99px;
    background: var(--surface);
    border: 2px solid var(--primary);
  }
  .range:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: 8px; }
  .steps {
    display: flex;
    gap: 6px;
    margin: 8px 6px 0;
  }
  .step {
    flex: 1;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 10px;
    padding: 11px 0;
    font-size: 14px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
</style>

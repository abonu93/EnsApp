<script lang="ts">
  // Foglio per un dato del Paziente registrato: testo, numero, opzioni, vasi.
  import Sheet from "../Sheet.svelte";
  import { VESSEL_OPTIONS } from "$lib/domain/vessels";
  import { isMissing } from "$lib/domain/board";
  import { t } from "$lib/i18n";
  import { VESSEL_SHORT, fill } from "../board/format";
  import { REG_FIELDS, type RegFieldKey } from "./fields";
  import { regLabel, regOption } from "./format";

  interface Props {
    field: RegFieldKey;
    value: unknown;
    onSet: (key: RegFieldKey, value: unknown) => void;
    onClose: () => void;
  }
  let { field, value, onSet, onClose }: Props = $props();

  const def = $derived(REG_FIELDS[field]);
  const label = $derived(regLabel($t, field));
  // svelte-ignore state_referenced_locally
  let text = $state<string>(typeof value === "string" ? value : "");
  // svelte-ignore state_referenced_locally
  let num = $state<number>(typeof value === "number" ? value : (REG_FIELDS[field].start ?? 0));
  // svelte-ignore state_referenced_locally
  let vessels = $state<string[]>(Array.isArray(value) ? [...value] : []);
  const unit = $derived(def.unit ?? "");
  const n = $derived(def.options?.length ?? 0);
  const cols = $derived(n <= 4 ? n : n > 6 ? 4 : 3);
  const clamp = (v: number) => Math.max(def.min ?? 0, Math.min(def.max ?? 100, v));

  function done(v: unknown) {
    onSet(field, v);
    onClose();
  }
  let input: HTMLInputElement | HTMLTextAreaElement | null = $state(null);
  $effect(() => {
    if (input) setTimeout(() => input?.focus(), 320);
  });
</script>

<Sheet open={true} ariaLabel={label} {onClose}>
  {#snippet children()}
    <div class="head">
      <h2 class="title">{label}</h2>
      {#if !isMissing(value)}
        <button type="button" class="clear ens-press" onclick={() => done(undefined)}>{$t.board.clear}</button>
      {/if}
    </div>

    {#if def.kind === "text" || def.kind === "longtext"}
      {#if def.kind === "longtext"}
        <textarea bind:this={input} class="txt" rows="4" bind:value={text} placeholder={$t.registered.notesPlaceholder} aria-label={label}></textarea>
      {:else}
        <input
          bind:this={input}
          class="txt mono"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          bind:value={text}
          placeholder={$t.registered.idPlaceholder}
          aria-label={label}
          onkeydown={(e) => e.key === "Enter" && text.trim() && done(text.trim())}
        />
      {/if}
      <button type="button" class="big ens-press" disabled={!text.trim()} onclick={() => done(text.trim())}>{$t.board.set}</button>
    {:else if def.kind === "vessels"}
      <div class="vgrid">
        {#each VESSEL_OPTIONS as v (v.value)}
          {@const on = vessels.includes(v.value)}
          <button type="button" class="opt small ens-press" class:on aria-pressed={on} aria-label={v.label}
            onclick={() => (vessels = on ? vessels.filter((x) => x !== v.value) : [...vessels, v.value])}>{VESSEL_SHORT[v.value]}</button>
        {/each}
      </div>
      <div class="pair">
        <button type="button" class="big soft ens-press" onclick={() => done([])}>{$t.board.noOcclusion}</button>
        <button type="button" class="big ens-press" disabled={!vessels.length} onclick={() => done(vessels)}>{$t.board.set}</button>
      </div>
    {:else if def.kind === "num"}
      <div class="value" aria-hidden="true">{num}<span class="unit">{unit}</span></div>
      <input class="range" type="range" min={def.min} max={def.max} bind:value={num} aria-label={label} />
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
          <button type="button" class="opt ens-press" class:on class:mono={def.mono} aria-pressed={on} onclick={() => done(o)}>{regOption($t, field, o)}</button>
        {/each}
      </div>
    {/if}
  {/snippet}
</Sheet>

<style>
  .head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 6px; }
  .title { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .clear { color: var(--text-muted); font-size: 13px; padding: 6px; min-height: 32px; }
  .txt {
    width: calc(100% - 12px);
    margin: 14px 6px 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    font: inherit;
    font-size: 16px;
    background: var(--surface);
    color: var(--text);
    resize: none;
  }
  .txt.mono { font-family: var(--font-mono); font-size: 17px; }
  .txt:focus { outline: none; border-color: var(--primary); box-shadow: var(--focus-ring); }
  .vgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 14px 6px 0; }
  .ogrid { display: grid; gap: 8px; margin: 16px 6px 4px; }
  .opt {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 12px;
    padding: 16px 4px;
    font-size: 14.5px;
  }
  .opt.small { border-radius: 10px; padding: 12px 2px; font-size: 13px; }
  .opt.mono { font-family: var(--font-mono); }
  .opt.on { border-color: var(--primary-hover); background: var(--primary-hover); color: var(--text-inverted); font-weight: 600; }
  .pair { display: flex; gap: 8px; margin: 0 6px; }
  .pair .big { flex: 1; width: auto; margin: 16px 0 0; }
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
  .big.soft { background: var(--surface-elevated); color: var(--text); border: 1px solid var(--border); }
  .big:disabled { opacity: 0.4; }
  .value { text-align: center; font-family: var(--font-mono); font-size: 52px; font-weight: 500; letter-spacing: -2.5px; line-height: 1; margin-top: 18px; }
  .unit { font-size: 18px; color: var(--text-muted); letter-spacing: 0; }
  .range { -webkit-appearance: none; appearance: none; background: transparent; height: 28px; width: calc(100% - 12px); margin: 16px 6px 0; }
  .range::-webkit-slider-runnable-track { height: 4px; border-radius: 99px; background: var(--border); }
  .range::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 99px; background: var(--surface); border: 2px solid var(--primary); margin-top: -11px; box-shadow: 0 2px 8px rgba(15, 60, 80, 0.18); }
  .range::-moz-range-track { height: 4px; border-radius: 99px; background: var(--border); }
  .range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 99px; background: var(--surface); border: 2px solid var(--primary); }
  .steps { display: flex; gap: 6px; margin: 8px 6px 0; }
  .step { flex: 1; border: 1px solid var(--border); background: var(--surface); border-radius: 10px; padding: 11px 0; font-size: 14px; font-family: var(--font-mono); color: var(--text-muted); }
</style>

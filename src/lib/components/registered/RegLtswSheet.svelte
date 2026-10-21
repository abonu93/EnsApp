<script lang="ts">
  // LTSW alla visita: non scorre con l'orologio, si conta fino a quando il
  // paziente e' stato visto. Da data e ora dell'ultima volta visto bene,
  // oppure riferito in ore; piu' il risveglio / esordio ignoto.
  import Sheet from "../Sheet.svelte";
  import CalendarSpin from "./CalendarSpin.svelte";
  import { t, locale } from "$lib/i18n";
  import { now } from "$lib/stores/patient";
  import { fill, fmtMin } from "../board/format";
  import { dayWord, hm } from "./format";
  import type { LtswValue } from "./fields";

  interface Props {
    seenAt: number;
    current: { ltswMode?: "clock" | "hours"; ltswH?: number; lsw?: number; wakeup?: boolean };
    onSet: (v: LtswValue | null) => void;
    onClose: () => void;
  }
  let { seenAt, current, onSet, onClose }: Props = $props();

  // svelte-ignore state_referenced_locally
  let mode = $state<"clock" | "hours">(current.ltswMode ?? "clock");
  // svelte-ignore state_referenced_locally
  let at = $state<number>(current.lsw ?? seenAt - 3 * 3_600_000);
  // svelte-ignore state_referenced_locally
  let hrs = $state<number>(current.ltswH ?? 3);
  // svelte-ignore state_referenced_locally
  let wake = $state<boolean>(!!current.wakeup);
  const H = $derived(mode === "clock" ? Math.max(0, (seenAt - at) / 3_600_000) : hrs);
  const when = (ms: number) => `${dayWord($t, ms, $now, $locale)} ${hm(ms)}`;

  function save() {
    onSet({ ltswMode: mode, ltswH: Math.round(H * 100) / 100, lsw: mode === "clock" ? at : undefined, wakeup: wake });
    onClose();
  }
</script>

<Sheet open={true} tall ariaLabel={$t.registered.ltswTitle} {onClose}>
  {#snippet children()}
    <div class="head">
      <h2 class="title">{$t.registered.ltswTitle}</h2>
      {#if current.ltswH != null}
        <button type="button" class="clear ens-press" onclick={() => { onSet(null); onClose(); }}>{$t.board.clear}</button>
      {/if}
    </div>
    <p class="hint">{fill($t.registered.ltswHint, { t: when(seenAt) })}</p>
    <div class="modes" role="radiogroup" aria-label={$t.registered.ltswTitle}>
      {#each [["clock", $t.registered.modeClock], ["hours", $t.registered.modeHours]] as [k, l] (k)}
        <button type="button" role="radio" aria-checked={mode === k} class="mode ens-press" class:on={mode === k} onclick={() => (mode = k as "clock" | "hours")}>{l}</button>
      {/each}
    </div>

    {#if mode === "clock"}
      <CalendarSpin value={at} max={seenAt} onChange={(x) => (at = x)} />
      <div class="presets">
        {#each [[60, "−1h"], [180, "−3h"], [360, "−6h"], [720, "−12h"], [1440, "−24h"]] as [mn, l] (l)}
          <button type="button" class="preset ens-press" onclick={() => (at = seenAt - (mn as number) * 60_000)}>{l}</button>
        {/each}
      </div>
    {:else}
      <div class="hours">
        <button type="button" class="round ens-press" aria-label="−0.5 h" onclick={() => (hrs = Math.max(0, Math.round((hrs - 0.5) * 2) / 2))}>−</button>
        <span class="hval">{hrs}<span class="unit"> h</span></span>
        <button type="button" class="round ens-press" aria-label="+0.5 h" onclick={() => (hrs = Math.min(168, Math.round((hrs + 0.5) * 2) / 2))}>+</button>
      </div>
      <input class="range" type="range" min="0" max="72" step="0.5" value={Math.min(hrs, 72)} oninput={(e) => (hrs = Number(e.currentTarget.value))} aria-label={$t.registered.modeHours} />
      <div class="hgrid">
        {#each [1, 3, 4.5, 6, 8, 12, 16, 24, 48, 72] as v (v)}
          <button type="button" class="hbtn ens-press" class:on={hrs === v} aria-pressed={hrs === v} onclick={() => (hrs = v)}>{v}h</button>
        {/each}
      </div>
    {/if}

    <label class="wake">
      <input type="checkbox" bind:checked={wake} />
      <span>{$t.registered.wakeup}</span>
    </label>
    <p class="preview">
      {$t.registered.ltswAtEval} <strong>{fmtMin(H * 60)}</strong>
      {#if mode === "hours"}<br /><small>{fill($t.registered.approxLsw, { t: when(seenAt - H * 3_600_000) })}</small>{/if}
    </p>
    <button type="button" class="big ens-press" onclick={save}>{$t.board.set}</button>
  {/snippet}
</Sheet>

<style>
  .head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 6px; }
  .title { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .clear { color: var(--text-muted); font-size: 13px; padding: 6px; min-height: 32px; }
  .hint { margin: 4px 6px 0; font-size: 12.5px; line-height: 1.45; color: var(--text-muted); }
  .modes { display: flex; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 11px; padding: 3px; margin: 12px 6px; }
  .mode { flex: 1; border-radius: 9px; padding: 9px 0; font-size: 13px; color: var(--text-muted); }
  .mode.on { background: var(--surface); color: var(--text); font-weight: 600; box-shadow: 0 1px 3px rgba(15, 60, 80, 0.12); }
  .presets { display: flex; gap: 6px; margin-top: 8px; justify-content: center; flex-wrap: wrap; }
  .preset { border: 1px solid var(--border); background: var(--surface); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); }
  .hours { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
  .round { width: 52px; height: 52px; border: 1px solid var(--border); border-radius: 99px; font-size: 22px; color: var(--text-muted); }
  .hval { font-family: var(--font-mono); font-size: 56px; font-weight: 500; letter-spacing: -2.5px; min-width: 150px; text-align: center; }
  .unit { font-size: 20px; color: var(--text-muted); letter-spacing: 0; }
  .range { -webkit-appearance: none; appearance: none; background: transparent; height: 28px; width: calc(100% - 12px); margin: 14px 6px 0; }
  .range::-webkit-slider-runnable-track { height: 4px; border-radius: 99px; background: var(--border); }
  .range::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 99px; background: var(--surface); border: 2px solid var(--primary); margin-top: -11px; }
  .hgrid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 8px 6px 0; }
  .hbtn { border: 1px solid var(--border); background: var(--surface); border-radius: 10px; padding: 9px 0; font-size: 12.5px; font-family: var(--font-mono); color: var(--text-muted); }
  .hbtn.on { background: var(--primary-hover); border-color: var(--primary-hover); color: var(--text-inverted); }
  .wake { display: flex; align-items: center; gap: 10px; margin: 16px 6px 0; font-size: 14px; min-height: 36px; }
  .wake input { width: 20px; height: 20px; accent-color: var(--primary-hover); }
  .preview { text-align: center; margin: 12px 0 0; font-size: 13.5px; color: var(--text-muted); }
  .preview strong { font-family: var(--font-mono); font-weight: 600; color: var(--text); }
  .big { width: calc(100% - 12px); margin: 16px 6px 0; border-radius: 13px; padding: 15px 0; font-size: 15px; font-weight: 600; color: var(--text-inverted); background: var(--primary-hover); }
</style>

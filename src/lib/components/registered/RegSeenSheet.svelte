<script lang="ts">
  // "Visto": quando il paziente e' stato valutato (anche giorni prima).
  import Sheet from "../Sheet.svelte";
  import CalendarSpin from "./CalendarSpin.svelte";
  import { t, locale } from "$lib/i18n";
  import { now } from "$lib/stores/patient";
  import { fill, fmtMin } from "../board/format";
  import { dayWord, hm } from "./format";

  interface Props {
    value: number;
    onSet: (v: number) => void;
    onClose: () => void;
  }
  let { value, onSet, onClose }: Props = $props();
  // svelte-ignore state_referenced_locally
  let v = $state(value);
  const SHORTCUTS: [number, string][] = [[0, ""], [60, "−1h"], [180, "−3h"], [720, "−12h"], [1440, "−1 d"]];
  const ago = $derived(($now - v) / 60_000);
</script>

<Sheet open={true} tall ariaLabel={$t.registered.seen} {onClose}>
  {#snippet children()}
    <h2 class="title">{$t.registered.seen}</h2>
    <p class="hint">{$t.registered.seenHint}</p>
    <CalendarSpin value={v} max={Date.now()} onChange={(x) => (v = x)} />
    <div class="presets">
      {#each SHORTCUTS as [mn, l] (mn)}
        <button type="button" class="preset ens-press" onclick={() => (v = Date.now() - mn * 60_000)}>{l || $t.board.now}</button>
      {/each}
    </div>
    <p class="preview">
      <strong>{dayWord($t, v, $now, $locale)} {hm(v)}</strong><br />
      {ago < 1 ? $t.registered.justNow : fill($t.registered.ago, { t: fmtMin(ago) })}
    </p>
    <button type="button" class="big ens-press" onclick={() => { onSet(v); onClose(); }}>{$t.board.set}</button>
  {/snippet}
</Sheet>

<style>
  .title { margin: 0 6px; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .hint { margin: 4px 6px 10px; font-size: 12.5px; line-height: 1.45; color: var(--text-muted); }
  .presets { display: flex; gap: 6px; margin-top: 8px; justify-content: center; flex-wrap: wrap; }
  .preset { border: 1px solid var(--border); background: var(--surface); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); }
  .preview { text-align: center; margin: 14px 0 0; font-size: 13.5px; color: var(--text-muted); }
  .preview strong { font-family: var(--font-mono); font-weight: 600; color: var(--text); }
  .big { width: calc(100% - 12px); margin: 16px 6px 0; border-radius: 13px; padding: 15px 0; font-size: 15px; font-weight: 600; color: var(--text-inverted); background: var(--primary-hover); }
</style>

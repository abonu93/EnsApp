<script lang="ts">
  // Ultima volta visto bene: esordio noto oppure risveglio / ignoto
  // (visto bene + trovato con i sintomi). Calendario, ore/minuti, scorciatoie.
  import Sheet from "../Sheet.svelte";
  import { t, locale } from "$lib/i18n";
  import { now } from "$lib/stores/patient";
  import type { BoardClock, ClockMode } from "$lib/stores/board";
  import { fieldLabel, fmtClock, fmtMin } from "./format";

  interface Props {
    clock: BoardClock;
    onSet: (c: BoardClock) => void;
    onClose: () => void;
  }
  let { clock, onSet, onClose }: Props = $props();

  const opened = Date.now();
  // svelte-ignore state_referenced_locally
  let mode = $state<ClockMode>(clock.mode);
  // svelte-ignore state_referenced_locally
  let at = $state<number>(clock.at ?? opened - 2 * 3_600_000);
  // svelte-ignore state_referenced_locally
  let found = $state<number>(clock.found ?? opened);
  let tab = $state<"lsw" | "found">("lsw");

  const isWake = $derived(mode === "wakeup");
  const editingFound = $derived(isWake && tab === "found");
  const cur = $derived(editingFound ? found : at);

  // L'ora non puo' essere nel futuro; al risveglio "trovato" non precede "visto bene".
  function setCur(v: number) {
    const limit = Date.now();
    if (editingFound) found = Math.min(limit, Math.max(v, at));
    else at = Math.min(v, isWake ? found : limit);
  }

  // Calendario
  // svelte-ignore state_referenced_locally
  let view = $state({ y: new Date(at).getFullYear(), m: new Date(at).getMonth() });
  $effect(() => {
    const d = new Date(cur);
    view = { y: d.getFullYear(), m: d.getMonth() };
  });
  const startDow = $derived((new Date(view.y, view.m, 1).getDay() + 6) % 7);
  const days = $derived(new Date(view.y, view.m + 1, 0).getDate());
  const cells = $derived([...Array(startDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)] as (number | null)[]);
  const canNext = $derived.by(() => {
    const n = new Date($now);
    return view.y < n.getFullYear() || (view.y === n.getFullYear() && view.m < n.getMonth());
  });
  const monthName = $derived(new Date(view.y, view.m, 1).toLocaleString($locale, { month: "long" }));
  const weekdays = $derived(Array.from({ length: 7 }, (_, i) => new Date(2001, 0, 1 + i).toLocaleString($locale, { weekday: "narrow" })));
  const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();
  function shiftMonth(d: number) {
    const x = new Date(view.y, view.m + d, 1);
    view = { y: x.getFullYear(), m: x.getMonth() };
  }
  function pickDay(d: number) {
    const c = new Date(cur);
    setCur(new Date(view.y, view.m, d, c.getHours(), c.getMinutes()).getTime());
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const step = (ms: number) => setCur(cur + ms);

  const MODES = $derived<[ClockMode, string][]>([
    ["known", $t.board.modeKnown],
    ["wakeup", $t.board.modeWakeup],
  ]);

  function save() {
    onSet({ mode, at, found: isWake ? found : null });
    onClose();
  }
</script>

<Sheet open={true} tall ariaLabel={fieldLabel($t, "__clock")} {onClose}>
  {#snippet children()}
    <h2 class="title">{fieldLabel($t, "__clock")}</h2>
    <div class="modes" role="radiogroup" aria-label={fieldLabel($t, "__clock")}>
      {#each MODES as [k, l] (k)}
        <button type="button" role="radio" aria-checked={mode === k} class="mode ens-press" class:on={mode === k} onclick={() => { mode = k; tab = "lsw"; }}>{l}</button>
      {/each}
    </div>
    <p class="desc">{mode === "known" ? $t.board.modeKnownDesc : $t.board.modeWakeupDesc}</p>

    {#if isWake}
      <div class="tabs">
        {#each [["lsw", fieldLabel($t, "__clock"), at], ["found", $t.board.foundWithSymptoms, found]] as [k, l, v] (k)}
          <button type="button" class="tab ens-press" class:on={tab === k} aria-pressed={tab === k} onclick={() => (tab = k as "lsw" | "found")}>
            <span class="tab-l">{l}</span>
            <span class="tab-v">{fmtClock(v as number, $now, $t.board.yesterday, $locale)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="sub">{$t.board.symptomOnset}</div>
    {/if}

    <div class="cal-head">
      <button type="button" class="nav ens-press" aria-label={$t.board.prevMonth} onclick={() => shiftMonth(-1)}>‹</button>
      <span class="month">{monthName} {view.y}</span>
      <button type="button" class="nav ens-press" aria-label={$t.board.nextMonth} disabled={!canNext} onclick={() => canNext && shiftMonth(1)}>›</button>
    </div>
    <div class="cal">
      {#each weekdays as w, i (i)}<span class="dow" aria-hidden="true">{w}</span>{/each}
      {#each cells as d, i (i)}
        {#if d === null}
          <span></span>
        {:else}
          {@const dayStart = new Date(view.y, view.m, d).getTime()}
          {@const future = dayStart > $now}
          {@const sel = sameDay(dayStart, cur)}
          <button type="button" class="day ens-press" class:sel class:today={sameDay(dayStart, $now) && !sel} disabled={future} aria-pressed={sel} onclick={() => pickDay(d)}>{d}</button>
        {/if}
      {/each}
    </div>

    <div class="spin">
      <div class="col">
        <button type="button" class="arrow ens-press" aria-label={$t.board.hoursUp} onclick={() => step(3_600_000)}>▲</button>
        <span class="digits">{pad(new Date(cur).getHours())}</span>
        <button type="button" class="arrow ens-press" aria-label={$t.board.hoursDown} onclick={() => step(-3_600_000)}>▼</button>
      </div>
      <span class="colon" aria-hidden="true">:</span>
      <div class="col">
        <button type="button" class="arrow ens-press" aria-label={$t.board.minutesUp} onclick={() => step(5 * 60_000)}>▲</button>
        <span class="digits">{pad(new Date(cur).getMinutes())}</span>
        <button type="button" class="arrow ens-press" aria-label={$t.board.minutesDown} onclick={() => step(-5 * 60_000)}>▼</button>
      </div>
    </div>
    <div class="presets">
      {#each [[0, $t.board.now], [30, "−30m"], [60, "−1h"], [180, "−3h"]] as [mn, l] (l)}
        <button type="button" class="preset ens-press" onclick={() => setCur(Date.now() - (mn as number) * 60_000)}>{l}</button>
      {/each}
    </div>

    <p class="ago">
      <strong>{fmtMin(($now - at) / 60_000)}</strong> {mode === "known" ? $t.board.sinceOnset : $t.board.sinceLsw}
      {#if isWake}<br /><strong>{fmtMin(($now - found) / 60_000)}</strong> {$t.board.sinceFound}{/if}
    </p>
    <button type="button" class="big ens-press" onclick={save}>{$t.board.set}</button>
  {/snippet}
</Sheet>

<style>
  .title {
    margin: 0 6px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .modes {
    display: flex;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: 11px;
    padding: 3px;
    margin: 12px 6px 0;
  }
  .mode {
    flex: 1;
    border-radius: 9px;
    padding: 9px 0;
    font-size: 13px;
    color: var(--text-muted);
  }
  .mode.on {
    background: var(--surface);
    color: var(--text);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(15, 60, 80, 0.12);
  }
  .desc {
    margin: 8px 6px 0;
    font-size: 12.5px;
    line-height: 1.45;
    color: var(--text-muted);
  }
  .tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 10px 6px 4px;
  }
  .tab {
    text-align: left;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 9px 11px;
    background: var(--surface);
  }
  .tab.on { border-color: var(--primary-hover); }
  .tab-l {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
  }
  .tab.on .tab-l { color: var(--primary-hover); }
  .tab-v {
    display: block;
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 500;
    margin-top: 2px;
  }
  .sub {
    margin: 10px 6px 0;
    font-size: 11px;
    color: var(--text-muted);
  }
  .cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 6px;
  }
  .nav {
    width: 40px;
    height: 40px;
    font-size: 16px;
    color: var(--text-muted);
  }
  .nav:disabled { opacity: 0.25; }
  .month {
    font-size: 14px;
    font-weight: 600;
    text-transform: capitalize;
  }
  .cal {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin: 4px 6px 0;
  }
  .dow {
    text-align: center;
    font-size: 10.5px;
    color: var(--text-muted);
    padding: 2px 0;
    text-transform: uppercase;
  }
  .day {
    height: 36px;
    border-radius: 99px;
    font-family: var(--font-mono);
    font-size: 13.5px;
    color: var(--text);
  }
  .day:disabled { color: var(--text-muted); opacity: 0.45; }
  .day.today {
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .day.sel {
    background: var(--primary-hover);
    color: var(--text-inverted);
    font-weight: 600;
  }
  .spin {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 6px;
  }
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .arrow {
    width: 56px;
    height: 32px;
    font-size: 14px;
    color: var(--text-muted);
  }
  .digits {
    font-family: var(--font-mono);
    font-size: 40px;
    font-weight: 500;
    letter-spacing: -1.5px;
    line-height: 1;
  }
  .colon {
    font-family: var(--font-mono);
    font-size: 36px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  .presets {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    justify-content: center;
  }
  .preset {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
  .ago {
    text-align: center;
    margin: 14px 0 0;
    font-size: 13.5px;
    color: var(--text-muted);
  }
  .ago strong {
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--text);
  }
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
</style>

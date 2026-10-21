<script lang="ts">
  // Calendario mensile + ore/minuti, con un massimo (niente date future).
  import { t, locale } from "$lib/i18n";

  interface Props {
    /** ms */
    value: number;
    /** ms: limite superiore (es. adesso o l'ora della visita). */
    max: number;
    onChange: (v: number) => void;
  }
  let { value, max, onChange }: Props = $props();

  // svelte-ignore state_referenced_locally
  let view = $state({ y: new Date(value).getFullYear(), m: new Date(value).getMonth() });
  $effect(() => {
    const d = new Date(value);
    view = { y: d.getFullYear(), m: d.getMonth() };
  });

  const set = (v: number) => onChange(Math.min(max, v));
  const startDow = $derived((new Date(view.y, view.m, 1).getDay() + 6) % 7);
  const days = $derived(new Date(view.y, view.m + 1, 0).getDate());
  const cells = $derived([...Array(startDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)] as (number | null)[]);
  const canNext = $derived.by(() => {
    const n = new Date(max);
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
    const c = new Date(value);
    set(new Date(view.y, view.m, d, c.getHours(), c.getMinutes()).getTime());
  }
  const pad = (n: number) => String(n).padStart(2, "0");
</script>

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
      {@const sel = sameDay(dayStart, value)}
      <button type="button" class="day ens-press" class:sel class:today={sameDay(dayStart, Date.now()) && !sel} disabled={dayStart > max} aria-pressed={sel} onclick={() => pickDay(d)}>{d}</button>
    {/if}
  {/each}
</div>
<div class="spin">
  <div class="col">
    <button type="button" class="arrow ens-press" aria-label={$t.board.hoursUp} onclick={() => set(value + 3_600_000)}>▲</button>
    <span class="digits">{pad(new Date(value).getHours())}</span>
    <button type="button" class="arrow ens-press" aria-label={$t.board.hoursDown} onclick={() => set(value - 3_600_000)}>▼</button>
  </div>
  <span class="colon" aria-hidden="true">:</span>
  <div class="col">
    <button type="button" class="arrow ens-press" aria-label={$t.board.minutesUp} onclick={() => set(value + 5 * 60_000)}>▲</button>
    <span class="digits">{pad(new Date(value).getMinutes())}</span>
    <button type="button" class="arrow ens-press" aria-label={$t.board.minutesDown} onclick={() => set(value - 5 * 60_000)}>▼</button>
  </div>
</div>

<style>
  .cal-head { display: flex; align-items: center; justify-content: space-between; margin: 0 6px; }
  .nav { width: 40px; height: 40px; font-size: 17px; color: var(--text-muted); }
  .nav:disabled { opacity: 0.25; }
  .month { font-size: 14px; font-weight: 600; text-transform: capitalize; }
  .cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin: 4px 6px 0; }
  .dow { text-align: center; font-size: 10.5px; color: var(--text-muted); padding: 2px 0; text-transform: uppercase; }
  .day { height: 36px; border-radius: 99px; font-family: var(--font-mono); font-size: 13.5px; color: var(--text); }
  .day:disabled { color: var(--text-muted); opacity: 0.45; }
  .day.today { font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
  .day.sel { background: var(--primary-hover); color: var(--text-inverted); font-weight: 600; }
  .spin { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 6px; }
  .col { display: flex; flex-direction: column; align-items: center; }
  .arrow { width: 56px; height: 32px; font-size: 13px; color: var(--text-muted); }
  .digits { font-family: var(--font-mono); font-size: 40px; font-weight: 500; letter-spacing: -1.5px; line-height: 1; }
  .colon { font-family: var(--font-mono); font-size: 36px; color: var(--text-muted); margin-bottom: 4px; }
</style>

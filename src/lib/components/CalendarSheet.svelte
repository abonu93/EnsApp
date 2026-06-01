<script lang="ts">
  // Bottom-sheet con calendario (nav mese + grid giorni) + time picker (h/m).
  // Mobile-first, niente preset rapidi (il calendario comanda).
  import Sheet from "./Sheet.svelte";
  import { t } from "$lib/i18n";

  interface Props {
    open: boolean;
    /** ISO datetime string "YYYY-MM-DDTHH:MM" o "" */
    value: string;
    onClose: () => void;
    onSet: (iso: string) => void;
  }
  let { open, value, onClose, onSet }: Props = $props();

  function parseInit(v: string): Date {
    if (v) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date(Date.now() - 2 * 3_600_000);
  }

  let sel = $state<Date>(new Date());
  let view = $state<Date>(new Date());

  $effect(() => {
    if (open) {
      const d = parseInit(value);
      sel = d;
      view = new Date(d.getFullYear(), d.getMonth(), 1);
    }
  });

  const y = $derived(view.getFullYear());
  const m = $derived(view.getMonth());

  // Lunedi = 0
  const startDow = $derived((new Date(y, m, 1).getDay() + 6) % 7);
  const daysInMonth = $derived(new Date(y, m + 1, 0).getDate());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function monthName(month: number, locale: string): string {
    return new Date(2000, month, 1).toLocaleString(locale, { month: "long" });
  }
  const weekdays = ["L", "M", "M", "G", "V", "S", "D"];

  // griglia di 42 celle al massimo (6 settimane)
  const cells = $derived.by(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  });

  function pickDay(d: number) {
    const n = new Date(sel);
    n.setFullYear(y, m, d);
    sel = n;
  }

  function bumpHours(delta: number) {
    const n = new Date(sel);
    const h = (n.getHours() + delta + 24) % 24;
    n.setHours(h);
    sel = n;
  }
  function bumpMinutes(delta: number) {
    const n = new Date(sel);
    const mn = (n.getMinutes() + delta + 60) % 60;
    n.setMinutes(mn);
    sel = n;
  }

  function navMonth(delta: number) {
    view = new Date(y, m + delta, 1);
  }

  function toISO(d: Date): string {
    // Restituisce "YYYY-MM-DDTHH:MM" in local time
    const off = d.getTimezoneOffset() * 60_000;
    return new Date(d.getTime() - off).toISOString().slice(0, 16);
  }

  function confirmPick() {
    onSet(toISO(sel));
  }

  function selectedDay(d: number | null): boolean {
    if (d == null) return false;
    return sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d;
  }
  function isToday(d: number | null): boolean {
    if (d == null) return false;
    const x = new Date(y, m, d);
    x.setHours(0, 0, 0, 0);
    return x.getTime() === today.getTime();
  }
  function isFuture(d: number | null): boolean {
    if (d == null) return true;
    const x = new Date(y, m, d);
    x.setHours(0, 0, 0, 0);
    return x.getTime() > today.getTime();
  }

  function fmtConfirm(d: Date): string {
    const day = d.getDate();
    const monAbbr = d.toLocaleString(undefined, { month: "short" });
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${monAbbr} ${hh}:${mm}`;
  }
</script>

<Sheet {open} {onClose} title={$t.preImaging.ltswLabel}>
  {#snippet children()}
    <!-- Month navigation -->
    <div class="mnav">
      <button class="nav-btn" type="button" onclick={() => navMonth(-1)} aria-label="Mese precedente">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <span class="mname">{monthName(m, "default")} {y}</span>
      <button class="nav-btn" type="button" onclick={() => navMonth(1)} aria-label="Mese successivo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>

    <div class="dow">
      {#each weekdays as d, i (i)}
        <div>{d}</div>
      {/each}
    </div>

    <div class="grid" role="grid">
      {#each cells as d, i (i)}
        {#if d == null}
          <div></div>
        {:else}
          {@const on = selectedDay(d)}
          {@const future = isFuture(d)}
          {@const tdy = isToday(d)}
          <button
            type="button"
            class="day"
            class:on
            class:today={tdy && !on}
            disabled={future}
            onclick={() => pickDay(d)}
            aria-label={`${d}`}
          >{d}</button>
        {/if}
      {/each}
    </div>

    <!-- Time picker -->
    <div class="time">
      {#each [{ unit: "h", val: sel.getHours(), bump: bumpHours }, { unit: "m", val: sel.getMinutes(), bump: bumpMinutes }] as ctrl (ctrl.unit)}
        <div class="time-row">
          <button type="button" class="time-step" onclick={() => ctrl.bump(ctrl.unit === "m" ? -5 : -1)} aria-label="-{ctrl.unit === 'm' ? 5 : 1}">−</button>
          <span class="time-val">
            {String(ctrl.val).padStart(2, "0")}<span class="time-unit">{ctrl.unit}</span>
          </span>
          <button type="button" class="time-step" onclick={() => ctrl.bump(ctrl.unit === "m" ? 5 : 1)} aria-label="+{ctrl.unit === 'm' ? 5 : 1}">+</button>
        </div>
      {/each}
    </div>

    <button type="button" class="confirm" onclick={confirmPick}>
      {$t.common.confirm} · {fmtConfirm(sel)}
    </button>
  {/snippet}
</Sheet>

<style>
  .mnav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .mname {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    text-transform: capitalize;
  }
  .nav-btn {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--bg);
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .nav-btn:active { transform: scale(0.95); }
  .nav-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  .dow {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  .day {
    height: 38px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    transition: background var(--transition-fast);
  }
  .day:disabled {
    color: var(--border);
    cursor: not-allowed;
  }
  .day.today::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: var(--primary);
  }
  .day.on {
    background: var(--primary);
    color: var(--text-inverted);
    font-weight: 700;
  }
  .day:not(:disabled):not(.on):hover {
    background: var(--bg);
  }

  .time {
    display: flex;
    gap: 9px;
    margin-top: 16px;
  }
  .time-row {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 6px 8px;
  }
  .time-step {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: var(--bg);
    color: var(--text-muted);
    font-size: 19px;
    cursor: pointer;
    line-height: 1;
  }
  .time-step:active { transform: scale(0.95); }
  .time-val {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }
  .time-unit {
    font-size: 11px;
    color: var(--text-muted);
    margin-left: 2px;
  }

  .confirm {
    width: 100%;
    margin-top: 16px;
    border: none;
    border-radius: 13px;
    padding: 15px;
    cursor: pointer;
    background: var(--primary);
    color: var(--text-inverted);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 6px 16px rgba(45, 91, 215, 0.28);
  }
  .confirm:active { transform: scale(0.99); }
  .confirm:focus-visible { outline: none; box-shadow: var(--focus-ring), 0 6px 16px rgba(45, 91, 215, 0.28); }
</style>

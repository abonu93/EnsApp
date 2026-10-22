<script lang="ts">
  // Pre-arrivo: i dati che detta il SEM alla chiamata (codice ictus).
  // Basta l'ultima volta visto bene per salvare; il resto e' facoltativo.
  import { push } from "svelte-spa-router";
  import { t, locale } from "$lib/i18n";
  import { now } from "$lib/stores/patient";
  import { preArrival } from "$lib/stores/preArrival";
  import type { BoardClock } from "$lib/stores/board";
  import BoardClockSheet from "$lib/components/board/BoardClockSheet.svelte";
  import { fill, fmtClock, fmtMin } from "$lib/components/board/format";
  import {
    ANTITHROMBOTICS,
    ETA_OPTIONS,
    RACE_LVO,
    normalizeCip,
    type Antithrombotic,
    type PreArrival,
    type PreArrivalClock,
  } from "$lib/domain/pre-arrival";

  const draft = $preArrival;
  let cip = $state(draft?.cip ?? "");
  let age = $state<number | undefined>(draft?.age);
  let premrs = $state<number | undefined>(draft?.premrs);
  let race = $state<number | undefined>(draft?.race);
  let anti = $state<Antithrombotic[]>(draft ? [...draft.anti] : []);
  let clock = $state<PreArrivalClock | null>(draft?.clock ?? null);
  let eta = $state<number | undefined>(draft?.eta);
  let clockOpen = $state(false);

  const filled = $derived(
    [cip || undefined, age, clock, premrs, race].filter((v) => v !== undefined && v !== null).length + (anti.length ? 1 : 0)
  );
  const antiLabel: Record<Antithrombotic, () => string> = {
    none: () => $t.preArrival.antiNone,
    antiplatelet: () => $t.preArrival.antiAntiplatelet,
    doac: () => $t.preArrival.antiDoac,
    warfarin: () => $t.preArrival.antiWarfarin,
    lmwh: () => $t.preArrival.antiLmwh,
  };

  const toggle = <T,>(cur: T | undefined, v: T) => (cur === v ? undefined : v);
  function pickAnti(v: Antithrombotic) {
    if (v === "none") anti = anti.includes("none") ? [] : ["none"];
    else {
      const rest = anti.filter((x) => x !== "none");
      anti = rest.includes(v) ? rest.filter((x) => x !== v) : [...rest, v];
    }
  }
  function onAge(e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value.replace(/\D/g, "").slice(0, 3);
    age = raw === "" ? undefined : Number(raw);
  }
  function setClock(c: BoardClock) {
    if (c.at == null) return;
    clock = { mode: c.mode, at: c.at, found: c.mode === "wakeup" ? c.found : null };
  }
  function clockText(c: PreArrivalClock): string {
    const at = fmtClock(c.at, $now, $t.board.yesterday, $locale);
    if (c.mode === "known") return `${$t.board.onsetAt} ${at}`;
    const found = c.found != null ? ` · ${$t.board.foundAt} ${fmtClock(c.found, $now, $t.board.yesterday, $locale)}` : "";
    return `${$t.board.seenWellAt} ${at}${found}`;
  }

  function save() {
    if (!clock) return;
    // L'ora di arrivo si fissa al salvataggio; resta quella se l'ETA non cambia.
    const arriveAt = eta == null ? null : draft && draft.eta === eta && draft.arriveAt ? draft.arriveAt : Date.now() + eta * 60_000;
    const next: PreArrival = { cip: cip || undefined, age, premrs, race, anti, clock, eta, arriveAt };
    preArrival.set(next);
    push("/incoming");
  }
  function cancel() {
    push(draft ? "/incoming" : "/workflow");
  }
</script>

<div class="page">
  <div class="head">
    <div class="bar">
      <button type="button" class="link muted" onclick={cancel}>{$t.preArrival.cancel}</button>
      <span class="count">{filled}/6</span>
    </div>
    <h1>{$t.preArrival.title}</h1>
    <p class="sub">{$t.preArrival.sub}</p>
  </div>

  <label class="lbl" for="pa-cip">{$t.preArrival.cip}</label>
  <input
    id="pa-cip"
    class="input mono cip"
    value={cip}
    oninput={(e) => (cip = normalizeCip(e.currentTarget.value))}
    placeholder="ABCD0123456789"
    autocapitalize="characters"
    autocomplete="off"
    spellcheck="false"
  />
  <p class="note">{$t.preArrival.cipNote}</p>

  <label class="lbl" for="pa-age">{$t.preArrival.age}</label>
  <div class="age-row">
    <input id="pa-age" class="input mono age" value={age ?? ""} oninput={onAge} inputmode="numeric" placeholder="—" />
    <span class="unit">{$t.preArrival.years}</span>
  </div>

  <div class="lbl">
    <span id="pa-lsw">{$t.preArrival.lsw}</span>
    {#if clock}<span class="aside mono">{fill($t.preArrival.ago, { t: fmtMin(($now - clock.at) / 60_000) })}</span>{/if}
  </div>
  <button type="button" class="clock-btn" class:unset={!clock} aria-describedby="pa-lsw" onclick={() => (clockOpen = true)}>
    {#if clock}
      <span class="mono">{clockText(clock)}</span>{#if clock.mode === "wakeup"}<span class="wake"> · {$t.board.wakeupTag}</span>{/if}
    {:else}
      <span class="set">{$t.preArrival.setLsw}</span>
    {/if}
  </button>

  <div class="lbl" id="pa-mrs">{$t.preArrival.premrs}</div>
  <div class="seg" role="group" aria-labelledby="pa-mrs" style="--cols: 6">
    {#each [0, 1, 2, 3, 4, 5] as n (n)}
      <button type="button" class="opt mono" class:on={premrs === n} aria-pressed={premrs === n} onclick={() => (premrs = toggle(premrs, n))}>{n}</button>
    {/each}
  </div>

  <div class="lbl">
    <span id="pa-race">{$t.preArrival.race}</span>
    {#if race != null && race >= RACE_LVO}<span class="aside pri">{$t.preArrival.raceLvo}</span>{/if}
  </div>
  <div class="seg" role="group" aria-labelledby="pa-race" style="--cols: 5">
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as n (n)}
      <button type="button" class="opt mono" class:on={race === n} aria-pressed={race === n} onclick={() => (race = toggle(race, n))}>{n}</button>
    {/each}
  </div>

  <div class="lbl" id="pa-anti">{$t.preArrival.anti}</div>
  <div class="seg" role="group" aria-labelledby="pa-anti" style="--cols: 3">
    {#each ANTITHROMBOTICS as a (a)}
      <button type="button" class="opt" class:on={anti.includes(a)} aria-pressed={anti.includes(a)} onclick={() => pickAnti(a)}>{antiLabel[a]()}</button>
    {/each}
  </div>

  <div class="lbl"><span id="pa-eta">{$t.preArrival.arrivalIn}</span><span class="aside">{$t.preArrival.optional}</span></div>
  <div class="seg" role="group" aria-labelledby="pa-eta" style="--cols: 4">
    {#each ETA_OPTIONS as n (n)}
      <button type="button" class="opt mono" class:on={eta === n} aria-pressed={eta === n} onclick={() => (eta = toggle(eta, n))}>{n}′</button>
    {/each}
  </div>

  <div class="save-bar">
    <button type="button" class="save ens-press" disabled={!clock} onclick={save}>
      {clock ? $t.preArrival.save : $t.preArrival.saveDisabled}
    </button>
  </div>
</div>

{#if clockOpen}
  <BoardClockSheet
    clock={clock ?? { mode: "known", at: Date.now() - 3_600_000, found: null }}
    onSet={setClock}
    onClose={() => (clockOpen = false)}
  />
{/if}

<style>
  .page {
    padding: 4px 22px 8px;
    color: var(--text);
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
  }
  .count {
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
  h1 {
    margin: 4px 0 0;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.6px;
  }
  .sub {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--text-muted);
  }
  .link {
    padding: 8px 0;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--primary-hover);
  }
  .link.muted { color: var(--text-muted); font-weight: 400; }
  .lbl {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 20px 0 8px;
    font-size: 12px;
    color: var(--text-muted);
  }
  .aside.pri { color: var(--primary-hover); font-weight: 600; }
  .mono { font-family: var(--font-mono); }
  .input {
    width: 100%;
    height: 46px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
    outline: none;
  }
  .input:focus-visible { box-shadow: var(--focus-ring); }
  .cip { font-size: 16px; letter-spacing: 1px; }
  .note {
    margin: 6px 0 0;
    font-size: 11.5px;
    color: var(--text-muted);
  }
  .age-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .age { width: 84px; font-size: 20px; font-weight: 500; }
  .unit { font-size: 13px; color: var(--text-muted); }
  .clock-btn {
    width: 100%;
    min-height: 46px;
    padding: 10px 12px;
    text-align: left;
    font-size: 14.5px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
  }
  .clock-btn.unset {
    border-color: var(--primary);
    background: var(--primary-soft);
  }
  .set { color: var(--primary-hover); font-weight: 600; }
  .wake { color: var(--warn); font-weight: 600; }
  .seg {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    gap: 6px;
  }
  .opt {
    min-height: 44px;
    padding: 0 2px;
    font-size: 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
  }
  .opt.on {
    border-color: var(--primary-hover);
    background: var(--primary-hover);
    color: var(--text-inverted);
    font-weight: 600;
  }
  /* Lo spazio per la barra fluttuante lo riserva App.svelte. */
  .save-bar { padding: 24px 0 8px; }
  .save {
    width: 100%;
    padding: 15px 0;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    background: var(--primary-hover);
    color: var(--text-inverted);
  }
  .save:disabled { opacity: 0.4; cursor: default; }
</style>

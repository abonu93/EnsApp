<script lang="ts">
  // Paziente in arrivo (pre-arrivo dal SEM): conto alla rovescia all'arrivo,
  // dati del SEM e studi possibili con le finestre contate all'ora di arrivo.
  import { push } from "svelte-spa-router";
  import { t, locale } from "$lib/i18n";
  import { criterionLabel } from "$lib/i18n/criteria";
  import { now } from "$lib/stores/patient";
  import { arrivePreArrival, clearPreArrival, preArrival, preArrivalResult } from "$lib/stores/preArrival";
  import { CLOCK, type BoardJudgement } from "$lib/domain/board";
  import { RACE_LVO, evaluationTime, preArrivalBoardInput, type Antithrombotic } from "$lib/domain/pre-arrival";
  import BoardTrialSheet from "$lib/components/board/BoardTrialSheet.svelte";
  import { fieldLabel, fill, fmtClock, fmtMin } from "$lib/components/board/format";

  // Senza un paziente in arrivo (scartato, scaduto) si torna alla scelta.
  let arriving = false;
  $effect(() => {
    if (!$preArrival && !arriving) push("/workflow");
  });

  let showOut = $state(false);
  let sheet = $state<string | null>(null);

  const pre = $derived($preArrival);
  const res = $derived($preArrivalResult);
  const etaMin = $derived(pre?.arriveAt != null ? (pre.arriveAt - $now) / 60_000 : null);
  const tArr = $derived(pre ? evaluationTime(pre, $now) : $now);
  const isWake = $derived(pre?.clock.mode === "wakeup");
  // Valori per la scheda di uno studio (gli stessi dati che valuta il board).
  const values = $derived.by(() => {
    if (!pre) return {};
    const i = preArrivalBoardInput(pre, tArr);
    return { ...i.hem, ...i.acute } as Record<string, unknown>;
  });

  const antiLabel = (a: Antithrombotic) =>
    ({
      none: $t.preArrival.antiNone,
      antiplatelet: $t.preArrival.antiAntiplatelet,
      doac: $t.preArrival.antiDoac,
      warfarin: $t.preArrival.antiWarfarin,
      lmwh: $t.preArrival.antiLmwh,
    })[a];
  const antiText = $derived(pre?.anti.length ? pre.anti.map(antiLabel).join(" + ") : null);
  const clockRef = $derived.by(() => {
    if (!pre) return "";
    const c = pre.clock;
    const at = fmtClock(c.at, $now, $t.board.yesterday, $locale);
    if (c.mode === "known") return `${$t.board.onsetAt} ${at}`;
    const found = c.found != null ? ` · ${$t.board.foundAt} ${fmtClock(c.found, $now, $t.board.yesterday, $locale)}` : "";
    return `${$t.board.seenWellAt} ${at}${found}`;
  });

  const shortOf = (k: string) => (k === CLOCK ? fieldLabel($t, CLOCK) : fieldLabel($t, k, true));
  function reason(j: BoardJudgement): string {
    if (j.status === "out") {
      if (j.closed) return $t.board.windowClosed;
      if (j.early && j.window) return fill($t.board.opensIn, { t: fmtMin(j.window.opensInMin) });
      const f = j.fails[0];
      if (!f) return "";
      return f.kind === "type" ? (f.label === "hemorrhagic" ? $t.board.ruleHemorrhagic : $t.board.ruleIschemic) : criterionLabel(f.label, $locale);
    }
    if (j.needs.length) {
      const s = j.needs.map(shortOf);
      return fill($t.board.needs, { list: s.length > 3 ? `${s.slice(0, 3).join(", ")} +${s.length - 3}` : s.join(", ") });
    }
    return $t.board.allMet;
  }
  const trial = (name: string) => res && [...res.open, ...res.out].find((j) => j.name === name);

  function arrived() {
    if (!pre) return;
    arriving = true;
    arrivePreArrival(pre);
    push("/board");
  }
  function discard() {
    clearPreArrival();
  }
</script>

{#if pre && res}
  <div class="page">
    <div class="top">
      <div class="bar">
        <span class="cip mono" class:empty={!pre.cip}>{pre.cip || $t.preArrival.noCip}</span>
        <button type="button" class="link" onclick={() => push("/pre-arrival")}>{$t.preArrival.edit}</button>
      </div>
      <h1 class="since"><span class="live" aria-hidden="true"></span>{$t.preArrival.incoming}</h1>
      <div class="eta-row">
        <span class="eta mono">{etaMin == null ? $t.preArrival.etaUnknown : etaMin > 0.5 ? fmtMin(etaMin) : $t.preArrival.due}</span>
        <span class="ref mono">
          {pre.arriveAt == null ? $t.preArrival.arrivalUnknown : fill($t.preArrival.arrivesAt, { t: fmtClock(pre.arriveAt, $now, $t.board.yesterday, $locale) })}
        </span>
      </div>
      <div class="pair">
        <div class="box">
          <span class="box-l">{isWake ? $t.preArrival.sinceLswNow : $t.preArrival.sinceOnsetNow}</span>
          <span class="box-v mono">{fmtMin(($now - pre.clock.at) / 60_000)}</span>
        </div>
        <div class="box">
          <span class="box-l">{$t.preArrival.atArrival}</span>
          <span class="box-v mono">{fmtMin((tArr - pre.clock.at) / 60_000)}</span>
        </div>
      </div>
      <p class="clock-ref mono">{clockRef}{#if isWake}<span class="wake"> · {$t.board.wakeupTag}</span>{/if}</p>
      <dl class="cells">
        <div><dt>{$t.preArrival.age}</dt><dd class="mono" class:empty={pre.age == null}>{pre.age != null ? `${pre.age}` : "—"}</dd></div>
        <div><dt>mRS</dt><dd class="mono" class:empty={pre.premrs == null}>{pre.premrs ?? "—"}</dd></div>
        <div><dt>{$t.preArrival.race}</dt><dd class="mono" class:empty={pre.race == null}>{pre.race ?? "—"}</dd></div>
        <div class="wide"><dt>{$t.preArrival.anti}</dt><dd class:empty={!antiText}>{antiText ?? "—"}</dd></div>
      </dl>
      {#if pre.race != null && pre.race >= RACE_LVO}
        <p class="lvo">{$t.preArrival.race} {$t.preArrival.raceLvo}</p>
      {/if}
    </div>

    <hr class="divider" />

    <section class="list" aria-labelledby="inc-count">
      <h2 id="inc-count" class="count">
        {res.open.length ? fill($t.preArrival.possibleAt, { n: res.open.length }) : $t.preArrival.noneAt}
      </h2>
      <p class="hint">
        {pre.arriveAt != null ? fill($t.preArrival.windowsTo, { t: fmtClock(tArr, $now, $t.board.yesterday, $locale) }) : $t.preArrival.windowsNow}
      </p>
      <ul class="trials">
        {#each res.open as j (j.name)}
          <li>{@render row(j)}</li>
        {/each}
      </ul>
      {#if res.out.length}
        <button type="button" class="link muted out-toggle" aria-expanded={showOut} onclick={() => (showOut = !showOut)}>
          {fill($t.preArrival.outBefore, { n: res.out.length })} {showOut ? "▴" : "▾"}
        </button>
        {#if showOut}
          <ul class="trials">
            {#each res.out as j (j.name)}
              <li>{@render row(j)}</li>
            {/each}
          </ul>
        {/if}
      {/if}
    </section>

    <div class="actions">
      <button type="button" class="arrived ens-press" onclick={arrived}>{$t.preArrival.arrived}</button>
      <button type="button" class="link muted discard" onclick={discard}>{$t.preArrival.discard}</button>
    </div>
  </div>

  {#if sheet}
    {@const j = trial(sheet)}
    {#if j}
      <BoardTrialSheet trial={j} {values} alerts={[]} onField={() => {}} onClose={() => (sheet = null)} />
    {/if}
  {/if}
{/if}

{#snippet row(j: BoardJudgement)}
  {@const w = j.window}
  {@const urgent = !!w && j.status !== "out" && !j.early && w.leftMin <= 60}
  <button type="button" class="trial ens-press" onclick={() => (sheet = j.name)}>
    <span class="dot {j.status}" aria-hidden="true"></span>
    <span class="body">
      <span class="name" class:out={j.status === "out"}>{j.name}</span>
      <span class="reason">{reason(j)}</span>
      {#if w && j.status !== "out"}
        {#if j.early}
          <span class="opens">{fill($t.board.opensIn, { t: fmtMin(w.opensInMin) })}</span>
        {:else if Number.isFinite(w.leftMin)}
          <span class="win">
            <span class="track"><span class="fill" class:urgent style="width: {Math.round(w.elapsedFrac * 100)}%"></span></span>
            <span class="left" class:urgent>{fmtMin(w.leftMin)}</span>
          </span>
        {/if}
      {/if}
    </span>
  </button>
{/snippet}

<style>
  .page { padding: 4px 0 0; color: var(--text); }
  .top { padding: 8px 22px 0; }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
  }
  .mono { font-family: var(--font-mono); }
  .cip { font-size: 12.5px; color: var(--text-muted); letter-spacing: 0.5px; }
  .empty { color: var(--text-muted); }
  .link {
    padding: 8px 0;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--primary-hover);
  }
  .link.muted { color: var(--text-muted); font-weight: 400; font-size: 13px; }
  .since {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 400;
    color: var(--text-muted);
  }
  .live {
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: var(--warn);
    animation: inc-blink 1.6s ease-in-out infinite;
  }
  @keyframes inc-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  .eta-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-top: 2px;
  }
  .eta {
    font-size: 46px;
    font-weight: 500;
    letter-spacing: -2.4px;
    line-height: 1.05;
  }
  .ref { font-size: 12.5px; line-height: 1.4; color: var(--text-muted); }
  .pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 14px;
  }
  .box {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 12px;
    border-radius: 12px;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
  }
  .box-l { font-size: 11px; color: var(--text-muted); }
  .box-v { font-size: 17px; font-weight: 500; }
  .clock-ref { margin: 8px 0 0; font-size: 12px; color: var(--text-muted); }
  .wake { font-family: var(--font-sans); color: var(--warn); font-weight: 600; }
  .cells {
    display: grid;
    grid-template-columns: 0.7fr 0.7fr 0.8fr 1.6fr;
    gap: 8px;
    margin: 14px 0 0;
  }
  .cells div { min-width: 0; }
  .cells dt { font-size: 11px; color: var(--text-muted); }
  .cells dd {
    margin: 2px 0 0;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lvo { margin: 8px 0 0; font-size: 12.5px; font-weight: 500; color: var(--primary-hover); }
  .divider {
    border: none;
    height: 1px;
    background: var(--border);
    margin: 14px 22px 0;
  }
  .list { padding: 16px 22px 0; }
  .count { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.4px; }
  .hint { margin: 4px 0 0; font-size: 12.5px; line-height: 1.45; color: var(--text-muted); }
  .trials { list-style: none; margin: 8px 0 0; padding: 0; }
  .trial {
    width: 100%;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 13px 0;
    border-bottom: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    margin-top: 7px;
    flex-shrink: 0;
    background: var(--border-strong);
  }
  .dot.eligible { background: var(--success); }
  .dot.possible { background: var(--primary); }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .name { font-size: 15.5px; font-weight: 600; letter-spacing: -0.2px; }
  .name.out { color: var(--text-muted); }
  .reason { margin-top: 2px; font-size: 12.5px; line-height: 1.35; color: var(--text-muted); }
  .opens { margin-top: 7px; font-size: 11.5px; font-family: var(--font-mono); color: var(--text-muted); }
  .win { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .track { flex: 1; height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .fill { display: block; height: 100%; background: var(--primary); }
  .fill.urgent { background: var(--warn); }
  .left { font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); white-space: nowrap; }
  .left.urgent { color: var(--warn); }
  .out-toggle { padding-top: 14px; }
  /* Lo spazio per la barra fluttuante lo riserva App.svelte. */
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 22px 22px 8px;
  }
  .arrived {
    width: 100%;
    padding: 15px 0;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    background: var(--primary-hover);
    color: var(--text-inverted);
  }
  @media (prefers-reduced-motion: reduce) {
    .live { animation: none; }
  }
</style>

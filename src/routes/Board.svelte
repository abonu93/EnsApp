<script lang="ts">
  // Bedside Board: un'unica schermata con l'orologio dall'ultima volta visto
  // bene, gli 8 dati decisivi e tutti gli studi aperti in tre stati
  // (eleggibile, possibile con cosa manca, fuori con il motivo).
  import { CLOCK, BOARD_GRID, FIELD_BY_KEY, NOT_RECRUITING, isMissing, type BoardJudgement } from "$lib/domain/board";
  import { boardAlertInput, boardClock, boardElapsedMin, boardResult, boardValues, setBoardClock, setBoardField } from "$lib/stores/board";
  import { selectionAlerts } from "$lib/domain/open-questions";
  import BoardAlerts from "$lib/components/board/BoardAlerts.svelte";
  import { now, clearPatient, hasPatientInProgress } from "$lib/stores/patient";
  import { ensureLive, liveLocal, liveSupported } from "$lib/stores/liveBoard";
  import { preArrival } from "$lib/stores/preArrival";
  import { selectedStudies, toggleStudy, flowOrigin, clearSelection } from "$lib/stores/trialSelection";
  import { criterionLabel } from "$lib/i18n/criteria";
  import { push, replace } from "svelte-spa-router";
  import { t, locale } from "$lib/i18n";
  import BoardFieldSheet from "$lib/components/board/BoardFieldSheet.svelte";
  import BoardClockSheet from "$lib/components/board/BoardClockSheet.svelte";
  import BoardTrialSheet from "$lib/components/board/BoardTrialSheet.svelte";
  import Sheet from "$lib/components/Sheet.svelte";
  import { fieldLabel, fill, fmtClock, fmtMin, fmtValue } from "$lib/components/board/format";

  type SheetState =
    | { kind: "field"; key: string; returnTo?: string }
    | { kind: "clock"; returnTo?: string }
    | { kind: "trial"; name: string }
    | { kind: "compete"; names: string[] }
    | { kind: "all" }
    | { kind: "colimits" }
    | { kind: "new" }
    | null;
  let sheet = $state<SheetState>(null);
  let showOut = $state(false);

  // Indietro del telefono: con un foglio aperto chiude il foglio invece di
  // lasciare il board. Un'unica voce di cronologia finche' c'e' un foglio
  // aperto (anche passando da un foglio all'altro).
  let sheetInHistory = false;
  $effect(() => {
    if (sheet && !sheetInHistory) {
      history.pushState({ ...(history.state ?? {}), boardSheet: true }, "");
      sheetInHistory = true;
    } else if (!sheet && sheetInHistory) {
      sheetInHistory = false;
      if (history.state?.boardSheet) history.back();
    }
  });
  $effect(() => {
    const onPop = () => {
      if (sheetInHistory) {
        sheetInHistory = false;
        sheet = null;
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  });

  const res = $derived($boardResult);
  const values = $derived($boardValues);
  const clock = $derived($boardClock);
  const isWake = $derived(clock.mode === "wakeup");
  const grid = $derived(BOARD_GRID[values.strokeType === "hemorrhagic" ? "hemo" : "isch"]);
  const possibleCount = $derived(res.open.length - res.eligible.length);
  const competing = $derived(new Set(res.conflicts.flat()));
  // Dubbi aperti e avvertenze del vault (open-questions.ts) per ogni studio aperto.
  const trialAlerts = $derived(
    new Map(res.open.map((j) => [j.name, selectionAlerts([j.name], $boardAlertInput)]))
  );
  const needsCheck = (name: string) => trialAlerts.get(name)?.some((a) => a.relevant) ?? false;
  // Limiti di co-arruolamento dei protocolli fra gli studi eleggibili.
  const coLimits = $derived(
    selectionAlerts(res.eligible.map((j) => j.name), $boardAlertInput).filter((a) => a.kind === "coenrolment")
  );
  // Paziente arrivato dal pre-arrivo: CIP e antitrombotici detti dal SEM.
  const semAnti = $derived(
    Array.isArray(values.antithrombotics) && values.antithrombotics.length
      ? (values.antithrombotics as string[])
          .map((a) => ({ none: $t.preArrival.antiNone, antiplatelet: $t.preArrival.antiAntiplatelet, doac: $t.preArrival.antiDoac, warfarin: $t.preArrival.antiWarfarin, lmwh: $t.preArrival.antiLmwh })[a] ?? a)
          .join(" + ")
      : null
  );
  const fromSem = $derived(typeof values.cip === "string" || semAnti != null || typeof values.race === "number");

  // Il paziente del board si condivide con il team appena ha un dato.
  $effect(() => {
    if ($hasPatientInProgress) ensureLive();
  });

  // Nuovo paziente: pre-arrivo (chiamata del SEM) o gia' in PS (board vuoto).
  function newPreArrival() {
    // La voce di cronologia del foglio diventa la pagina del pre-arrivo
    // (chiudere il foglio con history.back() annullerebbe la navigazione).
    const replaceSheet = sheetInHistory;
    sheetInHistory = false;
    sheet = null;
    const route = $preArrival ? "/incoming" : "/pre-arrival";
    if (replaceSheet) replace(route);
    else push(route);
  }
  function newInEd() {
    clearPatient();
    clearSelection();
    sheet = null;
  }
  const extraSet = $derived(res.extra.filter((k) => !isMissing(values[k])).length);
  const notRecruiting = $derived(
    NOT_RECRUITING.map((n) => `${n.name} (${n.status === "paused" ? $t.board.pausedStatus : $t.board.closedStatus})`).join(", ")
  );

  function openField(key: string, returnTo?: string) {
    sheet = key === CLOCK ? { kind: "clock", returnTo } : { kind: "field", key, returnTo };
  }
  // Dopo un dato inserito dalla scheda di uno studio si torna alla scheda.
  function closeField() {
    const back = sheet && (sheet.kind === "field" || sheet.kind === "clock") ? sheet.returnTo : undefined;
    sheet = back ? { kind: "trial", name: back } : null;
  }
  const shortOf = (k: string) => (k === CLOCK ? fieldLabel($t, CLOCK) : fieldLabel($t, k, true));

  function needText(needs: string[]): string {
    const s = needs.map(shortOf);
    return fill($t.board.needs, { list: s.length > 3 ? `${s.slice(0, 3).join(", ")} +${s.length - 3}` : s.join(", ") });
  }
  function reason(j: BoardJudgement): string {
    if (j.status === "out") {
      if (j.closed) return $t.board.windowClosed;
      if (j.early && j.window) return fill($t.board.opensIn, { t: fmtMin(j.window.opensInMin) });
      const f = j.fails[0];
      if (!f) return "";
      return f.kind === "type" ? (f.label === "hemorrhagic" ? $t.board.ruleHemorrhagic : $t.board.ruleIschemic) : criterionLabel(f.label, $locale);
    }
    if (j.status === "possible") {
      if (j.needs.length) return needText(j.needs);
      return j.rows.filter((r) => r.kind === "time").map((r) => criterionLabel(r.label, $locale)).join(" · ");
    }
    return $t.board.allMet;
  }
  const trial = (name: string) => [...res.open, ...res.out].find((j) => j.name === name);

  // Selezione come nel Riepilogo: solo studi eleggibili; una selezione che non
  // e' piu' eleggibile (dati cambiati) non resta nel conteggio.
  const eligibleNames = $derived(new Set(res.eligible.map((j) => j.name)));
  const selectedHere = $derived($selectedStudies.filter((n) => eligibleNames.has(n)));
  // Avanti: alla schermata di invio (Share: ID paziente, TEV/mTICI/TIV, note).
  function next() {
    flowOrigin.set("board");
    push("/share");
  }
</script>

<div class="board">
  <h1 class="sr-only">{$t.board.title}</h1>

  <div class="top">
    <div class="bar">
      <span class="cip">
        {#if fromSem}
          <span class="mono">{typeof values.cip === "string" ? values.cip : $t.preArrival.noCip}</span>
          <span class="sem"> · {$t.preArrival.semTag}{semAnti ? ` · ${semAnti}` : ""}</span>
        {/if}
        {#if $liveLocal && $liveSupported}
          <span class="shared-live">{fromSem ? " · " : ""}{$t.board.liveOn}</span>
        {/if}
      </span>
      <button type="button" class="link new" onclick={() => (sheet = { kind: "new" })}>{$t.preArrival.newPatient}</button>
    </div>
    <button type="button" class="clock" onclick={() => (sheet = { kind: "clock" })}>
      <span class="since">
        <span class="live" aria-hidden="true"></span>
        {clock.mode === "known" ? $t.board.sinceOnset : $t.board.sinceLsw}
        {#if isWake}<span class="wake">· {$t.board.wakeupTag}</span>{/if}
      </span>
      {#if $boardElapsedMin != null && clock.at != null}
        <span class="clock-row">
          <span class="elapsed">{fmtMin($boardElapsedMin)}</span>
          <span class="ref">
            {clock.mode === "known" ? $t.board.onsetAt : $t.board.seenWellAt} {fmtClock(clock.at, $now, $t.board.yesterday, $locale)}
            {#if isWake && clock.found != null}<br />{$t.board.foundAt} {fmtClock(clock.found, $now, $t.board.yesterday, $locale)} · {fmtMin(($now - clock.found) / 60_000)} {$t.board.ago}{/if}
          </span>
        </span>
      {:else}
        <span class="clock-row">
          <span class="elapsed empty">—</span>
          <span class="ref set">{$t.board.setClock}</span>
        </span>
      {/if}
    </button>

    <div class="grid">
      {#each grid as k (k)}
        {@const def = FIELD_BY_KEY[k]}
        {@const v = k === "targetVessels" && values.tandem === "yes" ? [fmtValue($t, k, values[k]), $t.board.extraShort].filter((x) => x && x !== $t.board.noneValue).join(" + ") : fmtValue($t, k, values[k])}
        {@const isNext = res.next?.field === k}
        <button type="button" class="cell" onclick={() => openField(k)} aria-label={`${fieldLabel($t, k)}: ${v ?? "—"}`}>
          <span class="cell-l" class:next={isNext}>{fieldLabel($t, k, true)}{#if isNext}<span class="next-dot" aria-hidden="true"></span>{/if}</span>
          <span class="cell-v" class:empty={v == null} class:mono={def.kind === "num" || def.mono}>{v ?? (k === "strokeType" ? $t.board.preCt : "—")}</span>
        </button>
      {/each}
    </div>
    {#if res.extra.length}
      <button type="button" class="link muted" onclick={() => (sheet = { kind: "all" })}>{$t.board.otherData} · {extraSet}/{res.extra.length} →</button>
    {/if}

  </div>

  <hr class="divider" />

  <section class="list" aria-labelledby="board-count">
    <h2 id="board-count" class="count">
      {#if res.eligible.length}<span class="ok">{fill($t.board.eligibleN, { n: res.eligible.length })}</span>{/if}
      {#if res.eligible.length && possibleCount}<span class="sep"> · </span>{/if}
      {#if possibleCount}<span>{fill($t.board.possibleN, { n: possibleCount })}</span>{/if}
      {#if !res.open.length}<span class="muted">{$t.board.noneOpen}</span>{/if}
    </h2>
    <div class="hints">
      {#if res.next}
        <button type="button" class="link pri" onclick={() => openField(res.next!.field)}>
          {fill($t.board.next, { field: fieldLabel($t, res.next.field), n: res.next.decides })} →
        </button>
      {/if}
      {#each res.conflicts as g (g.join())}
        <button type="button" class="link warn" onclick={() => (sheet = { kind: "compete", names: g })}>{fill($t.board.compete, { names: g.join(", ") })} →</button>
      {/each}
      {#if coLimits.length}
        <button type="button" class="link warn" onclick={() => (sheet = { kind: "colimits" })}>{fill($t.board.coLimits, { n: coLimits.length })} →</button>
      {/if}
    </div>

    <ul class="trials">
      {#each res.open as j (j.name)}
        <li>{@render row(j)}</li>
      {/each}
    </ul>

    {#if res.out.length}
      <button type="button" class="link muted out-toggle" aria-expanded={showOut} onclick={() => (showOut = !showOut)}>
        {fill($t.board.outN, { n: res.out.length })} {showOut ? "▴" : "▾"}
      </button>
      {#if showOut}
        <ul class="trials">
          {#each res.out as j (j.name)}
            <li>{@render row(j)}</li>
          {/each}
        </ul>
      {/if}
    {/if}
    {#if notRecruiting}
      <p class="foot">{$t.board.notRecruiting}: {notRecruiting}</p>
    {/if}
  </section>

  <div class="send-bar">
    <button type="button" class="send ens-press" class:ready={selectedHere.length > 0} onclick={next}>
      {$t.common.next}{selectedHere.length ? ` · ${selectedHere.length}` : ""}
    </button>
  </div>
</div>

{#snippet row(j: BoardJudgement)}
  {@const w = j.window}
  {@const urgent = !!w && j.status !== "out" && !j.early && w.leftMin <= 60}
  {@const picked = $selectedStudies.includes(j.name)}
  <div class="row-wrap">
  <button type="button" class="trial ens-press" onclick={() => (sheet = { kind: "trial", name: j.name })}>
    <span class="dot {j.status}" aria-hidden="true"></span>
    <span class="body">
      <span class="name-row">
        <span class="name" class:out={j.status === "out"}>{j.name}</span>
        {#if competing.has(j.name)}<span class="tag">{$t.board.competing}</span>{/if}
        {#if j.status !== "out" && needsCheck(j.name)}<span class="tag check">{$t.board.checkTag}</span>{/if}
        <span class="sr-only">— {j.status === "eligible" ? $t.board.statusEligible : j.status === "possible" ? $t.board.statusPossible : $t.board.statusOut}</span>
      </span>
      <span class="reason" class:ok={j.status === "eligible"}>{reason(j)}</span>
      {#if w && j.status !== "out"}
        {#if j.early}
          <span class="opens">{fill($t.board.opensIn, { t: fmtMin(w.opensInMin) })}</span>
        {:else if Number.isFinite(w.leftMin)}
          <span class="win">
            <span class="track"><span class="fill {j.status}" class:urgent style="width: {Math.round(w.elapsedFrac * 100)}%"></span></span>
            <span class="left" class:urgent>{fmtMin(w.leftMin)}</span>
          </span>
        {/if}
      {/if}
    </span>
  </button>
  {#if j.status === "eligible"}
    <button type="button" class="pick-btn ens-press" class:on={picked} aria-pressed={picked} aria-label={fill($t.board.selectTrial, { name: j.name })} onclick={() => toggleStudy(j.name)}>
      {#if picked}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
      {/if}
    </button>
  {/if}
  </div>
{/snippet}

{#if sheet?.kind === "field"}
  {#key sheet.key}
    <BoardFieldSheet field={sheet.key} value={values[sheet.key]} {values} onSet={setBoardField} onClose={closeField} />
  {/key}
{:else if sheet?.kind === "clock"}
  <BoardClockSheet {clock} onSet={setBoardClock} onClose={closeField} />
{:else if sheet?.kind === "trial"}
  {@const j = trial(sheet.name)}
  {#if j}
    {@const from = j.name}
    <BoardTrialSheet trial={j} {values} alerts={selectionAlerts([j.name], $boardAlertInput)} onField={(k) => openField(k, from)} onClose={() => (sheet = null)} />
  {/if}
{:else if sheet?.kind === "compete"}
  {@const names = sheet.names}
  <Sheet open={true} tall ariaLabel={fill($t.board.competeTitle, { n: names.length })} onClose={() => (sheet = null)}>
    {#snippet children()}
      <h2 class="sheet-title">{fill($t.board.competeTitle, { n: names.length })}</h2>
      <p class="sheet-desc">{$t.board.competeDesc}</p>
      <ul class="trials">
        {#each names as name (name)}
          {@const j = trial(name)}
          <li>
            <button type="button" class="pick ens-press" onclick={() => (sheet = { kind: "trial", name })}>
              <span class="body"><span class="name">{name}</span><span class="reason">{j?.focus}</span></span>
              <span class="left" class:urgent={!!j?.window && j.window.leftMin <= 60}>
                {j?.window && Number.isFinite(j.window.leftMin) ? fill($t.board.left, { t: fmtMin(j.window.leftMin) }) : $t.board.noLimit}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {/snippet}
  </Sheet>
{:else if sheet?.kind === "all"}
  <Sheet open={true} tall ariaLabel={$t.board.otherData} onClose={() => (sheet = null)}>
    {#snippet children()}
      <h2 class="sheet-title">{$t.board.otherData}</h2>
      <p class="sheet-desc">{$t.board.otherDataSub}</p>
      <ul class="trials">
        {#each res.extra as k (k)}
          {@const v = fmtValue($t, k, values[k])}
          <li>
            <button type="button" class="pick ens-press" onclick={() => openField(k)}>
              <span class="body"><span class="extra-l">{fieldLabel($t, k)}</span></span>
              <span class="extra-v" class:empty={v == null}>{v ?? "—"}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/snippet}
  </Sheet>
{:else if sheet?.kind === "new"}
  <Sheet open={true} ariaLabel={$t.preArrival.newTitle} onClose={() => (sheet = null)}>
    {#snippet children()}
      <h2 class="sheet-title">{$t.preArrival.newTitle}</h2>
      <div class="new-opts">
        <button type="button" class="new-opt ens-press" onclick={newPreArrival}>
          <span class="new-t">{$t.preArrival.entryTitle}</span>
          <span class="new-d">{$t.preArrival.entryDesc}</span>
        </button>
        <button type="button" class="new-opt ens-press" onclick={newInEd}>
          <span class="new-t">{$t.preArrival.inEd}</span>
          <span class="new-d">{$t.preArrival.inEdDesc}</span>
        </button>
      </div>
    {/snippet}
  </Sheet>
{:else if sheet?.kind === "colimits"}
  <Sheet open={true} tall ariaLabel={fill($t.board.coLimits, { n: coLimits.length })} onClose={() => (sheet = null)}>
    {#snippet children()}
      <h2 class="sheet-title">{fill($t.board.coLimits, { n: coLimits.length })}</h2>
      <p class="sheet-desc">{$t.board.coLimitsDesc}</p>
      <BoardAlerts alerts={coLimits} />
    {/snippet}
  </Sheet>
{/if}

<style>
  .board {
    position: relative;
    padding: 4px 0 0;
    color: var(--text);
  }
  .top { padding: 8px 22px 0; }
  .shared-live { color: var(--success); font-weight: 600; }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 36px;
  }
  .cip {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .cip .mono { font-family: var(--font-mono); }
  .link.new { flex-shrink: 0; font-weight: 600; color: var(--primary-hover); }
  .new-opts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 14px 0 4px;
  }
  .new-opt {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 14px 16px;
    text-align: left;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    color: var(--text);
  }
  .new-t { font-size: 16px; font-weight: 600; }
  .new-d { font-size: 12.5px; line-height: 1.4; color: var(--text-muted); }
  .clock {
    width: 100%;
    text-align: left;
    padding: 0;
    color: var(--text);
  }
  .since {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
  }
  .live {
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: var(--danger);
    animation: board-blink 1.6s ease-in-out infinite;
  }
  @keyframes board-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  .wake { color: var(--warn); font-weight: 600; }
  .clock-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-top: 2px;
  }
  .elapsed {
    font-family: var(--font-mono);
    font-size: 46px;
    font-weight: 500;
    letter-spacing: -2.4px;
    line-height: 1.05;
  }
  .elapsed.empty { color: var(--text-muted); }
  .ref {
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.4;
    color: var(--text-muted);
  }
  .ref.set {
    font-family: var(--font-sans);
    color: var(--primary-hover);
    font-weight: 500;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    row-gap: 12px;
    column-gap: 8px;
    margin-top: 18px;
  }
  .cell {
    text-align: left;
    padding: 2px 0;
    min-height: 44px;
    min-width: 0;
    color: var(--text);
  }
  .cell-l {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-muted);
  }
  .cell-l.next { color: var(--primary-hover); font-weight: 600; }
  .next-dot {
    width: 5px;
    height: 5px;
    border-radius: 99px;
    background: var(--primary);
  }
  .cell-v {
    display: block;
    margin-top: 2px;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cell-v.mono { font-family: var(--font-mono); }
  .cell-v.empty { color: var(--text-muted); font-weight: 400; }
  .link {
    display: block;
    text-align: left;
    padding: 6px 0;
    font-size: 13.5px;
    font-weight: 500;
  }
  .link.muted { color: var(--text-muted); font-size: 12.5px; font-weight: 400; }
  .link.pri { color: var(--primary-hover); }
  .link.warn { color: var(--warn); }
  .divider {
    border: none;
    height: 1px;
    background: var(--border);
    margin: 12px 22px 0;
  }
  .list { padding: 16px 22px 0; }
  .count {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.4px;
  }
  .count .ok { color: var(--success); }
  .count .sep, .count .muted { color: var(--text-muted); }
  .hints {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 6px;
  }
  .trials {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
  }
  .trial,
  .pick {
    width: 100%;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 13px 0;
    border-bottom: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }
  .pick { align-items: baseline; }
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
  .body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .name-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .name {
    font-size: 15.5px;
    font-weight: 600;
    letter-spacing: -0.2px;
  }
  .name.out { color: var(--text-muted); }
  .tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--warn);
  }
  .tag.check { color: var(--danger); }
  .reason {
    margin-top: 2px;
    font-size: 12.5px;
    line-height: 1.35;
    color: var(--text-muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .reason.ok { color: var(--success); }
  .opens {
    margin-top: 7px;
    font-size: 11.5px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
  .win {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
  .track {
    flex: 1;
    height: 2px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    background: var(--primary);
    transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .fill.eligible { background: var(--success); }
  .fill.urgent { background: var(--warn); }
  .left {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    white-space: nowrap;
  }
  .left.urgent { color: var(--warn); }
  .pick .left { font-size: 12.5px; }
  .out-toggle { padding-top: 14px; }
  .foot {
    margin: 14px 0 0;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--text-muted);
  }
  /* In fondo alla pagina, dopo la lista (non segue la barra di navigazione).
     Lo spazio per la barra fluttuante lo riserva App.svelte. */
  .send-bar {
    padding: 22px 22px 8px;
  }
  .row-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--border);
  }
  .row-wrap .trial { border-bottom: none; flex: 1; min-width: 0; }
  .pick-btn {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 2px solid var(--success);
    color: var(--text-inverted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pick-btn::after { content: ""; position: absolute; inset: -8px; } /* bersaglio 44px */
  .pick-btn.on { background: var(--success); }
  .send.ready {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    color: var(--text-inverted);
  }
  .send {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 0;
    font-size: 14.5px;
    font-weight: 600;
    color: var(--primary-hover);
    background: var(--surface);
  }
  .sheet-title {
    margin: 0 6px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .sheet-desc {
    margin: 4px 6px 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--text-muted);
  }
  .extra-l { font-size: 14px; }
  .extra-v {
    font-size: 13px;
    font-family: var(--font-mono);
  }
  .extra-v.empty { color: var(--text-muted); }
  @media (prefers-reduced-motion: reduce) {
    .live { animation: none; }
    .fill { transition: none; }
  }
</style>

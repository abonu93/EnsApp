<script lang="ts">
  // Dettaglio di uno studio: criteri uno per uno, ognuno apre il suo dato.
  import Sheet from "../Sheet.svelte";
  import { CLOCK, type BoardJudgement, type BoardRow } from "$lib/domain/board";
  import { exclusiveWith } from "$lib/domain/trials-info";
  import { t, locale } from "$lib/i18n";
  import { criterionLabel } from "$lib/i18n/criteria";
  import type { SelectionAlert } from "$lib/domain/open-questions";
  import BoardAlerts from "./BoardAlerts.svelte";
  import { fill, fmtMin, fmtValue } from "./format";

  interface Props {
    trial: BoardJudgement;
    values: Record<string, unknown>;
    /** Dubbi aperti e avvertenze (open-questions.ts) per questo studio. */
    alerts: SelectionAlert[];
    onField: (key: string) => void;
    onClose: () => void;
  }
  let { trial, values, alerts, onField, onClose }: Props = $props();

  const status = $derived(
    trial.status === "eligible" ? $t.board.statusEligible : trial.status === "possible" ? $t.board.statusPossible : $t.board.statusOut
  );
  const partners = $derived(exclusiveWith(trial.name));

  function rowLabel(r: BoardRow): string {
    if (r.kind === "type") return r.label === "hemorrhagic" ? $t.board.ruleHemorrhagic : $t.board.ruleIschemic;
    return criterionLabel(r.label, $locale);
  }
  function rowValue(r: BoardRow): string {
    if (r.kind === "time" && trial.window) {
      if (trial.closed) return $t.board.windowClosed;
      if (trial.early) return fill($t.board.opensIn, { t: fmtMin(trial.window.opensInMin) });
      return Number.isFinite(trial.window.leftMin) ? fill($t.board.left, { t: fmtMin(trial.window.leftMin) }) : "";
    }
    if (!r.field || r.field === CLOCK) return r.res === null ? $t.board.set : "";
    return fmtValue($t, r.field, values[r.field]) ?? $t.board.set;
  }
  // Mark: ✓ soddisfatto, ✕ fallito, ? da sapere, – da confermare.
  function mark(r: BoardRow): "ok" | "fail" | "unk" | "pend" {
    if (r.pending) return "pend";
    if (r.kind === "time" && (trial.early || trial.closed)) return "fail";
    return r.res === true ? "ok" : r.res === false ? "fail" : "unk";
  }
</script>

<Sheet open={true} tall ariaLabel={trial.name} {onClose}>
  {#snippet children()}
    <div class="head">
      <div>
        <h2 class="name">{trial.name}</h2>
        <div class="focus">{trial.focus}</div>
      </div>
      <span class="status {trial.status}">{status}</span>
    </div>
    {#if trial.status !== "out"}
      <BoardAlerts {alerts} />
    {/if}
    <ul class="rows">
      {#each trial.rows as r, i (i)}
        {@const m = mark(r)}
        <li>
          <button type="button" class="row ens-press" disabled={!r.field} onclick={() => r.field && onField(r.field)}>
            <span class="mark {m}" aria-hidden="true">{m === "ok" ? "✓" : m === "fail" ? "✕" : m === "pend" ? "–" : "?"}</span>
            <span class="label" class:fail={m === "fail"}>{rowLabel(r)}</span>
            <span class="val" class:unk={r.res === null}>{rowValue(r)}</span>
          </button>
        </li>
      {/each}
    </ul>
    {#if partners.length}
      <p class="note">{fill($t.board.notCombinable, { names: partners.join(", ") })}</p>
    {/if}
    <p class="note">{$t.board.pendingNote}</p>
  {/snippet}
</Sheet>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 0 6px;
  }
  .name {
    margin: 0;
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
  .focus {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
  }
  .status {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .status.eligible { color: var(--success); }
  .status.possible { color: var(--primary-hover); }
  .rows {
    list-style: none;
    margin: 14px 6px 0;
    padding: 0;
  }
  .row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 0;
    border-bottom: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }
  .row:disabled { cursor: default; }
  .mark {
    width: 22px;
    height: 22px;
    border-radius: 99px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11.5px;
    font-weight: 700;
  }
  .mark.ok { background: var(--success-soft); color: var(--success); }
  .mark.fail { background: var(--danger-soft); color: var(--danger); }
  .mark.unk { background: var(--primary-soft); color: var(--primary-hover); }
  .mark.pend { background: var(--surface-elevated); color: var(--text-muted); border: 1px solid var(--border); }
  .label {
    flex: 1;
    font-size: 13.5px;
    line-height: 1.35;
  }
  .label.fail { color: var(--danger); }
  .val {
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    max-width: 110px;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .val.unk { color: var(--primary-hover); }
  .note {
    margin: 12px 6px 0;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--text-muted);
  }
</style>

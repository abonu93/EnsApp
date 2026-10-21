<script lang="ts">
  // "Arruolato in": studi aperti per gruppo, ricerca, disegno dello studio
  // (braccio noto / doppio cieco / braccio singolo) e conflitti del team.
  import Sheet from "../Sheet.svelte";
  import { exclusiveWith } from "$lib/domain/trials-info";
  import { studyDesign } from "$lib/domain/sheet-payload";
  import { t } from "$lib/i18n";
  import { fill } from "../board/format";
  import { REG_TRIALS, designNote, type RegTrialGroup } from "./trials";

  interface Props {
    selected: string[];
    strokeType?: string;
    onDone: (names: string[]) => void;
    onClose: () => void;
  }
  let { selected, strokeType, onDone, onClose }: Props = $props();
  // svelte-ignore state_referenced_locally
  let sel = $state<string[]>([...selected]);
  let q = $state("");
  const order = $derived<RegTrialGroup[]>(strokeType === "hemorrhagic" ? ["hemo", "isch", "other"] : ["isch", "hemo", "other"]);
  const groupLabel = (g: RegTrialGroup) => (g === "isch" ? $t.registered.groupIsch : g === "hemo" ? $t.registered.groupHemo : $t.registered.groupOther);
  const match = (name: string, focus: string) => !q || `${name} ${focus}`.toLowerCase().includes(q.toLowerCase());
  const toggle = (n: string) => (sel = sel.includes(n) ? sel.filter((x) => x !== n) : [...sel, n]);
</script>

<Sheet open={true} tall ariaLabel={$t.registered.enrolledIn} {onClose}>
  {#snippet children()}
    <div class="head">
      <h2 class="title">{$t.registered.enrolledIn}</h2>
      <span class="count">{fill($t.registered.selectedN, { n: sel.length })}</span>
    </div>
    <input class="search" type="search" bind:value={q} placeholder={$t.registered.searchTrials} aria-label={$t.registered.searchTrials} />
    {#each order as g (g)}
      {@const list = REG_TRIALS.filter((tr) => tr.group === g && match(tr.name, tr.focus))}
      {#if list.length}
        <h3 class="group">{groupLabel(g)}</h3>
        {#each list as tr (tr.name)}
          {@const on = sel.includes(tr.name)}
          {@const clash = sel.find((s) => s !== tr.name && exclusiveWith(tr.name).includes(s))}
          {@const note = designNote($t, studyDesign(tr.name))}
          <button type="button" class="row ens-press" aria-pressed={on} onclick={() => toggle(tr.name)}>
            <span class="box" class:on aria-hidden="true">{on ? "✓" : ""}</span>
            <span class="body">
              <span class="name" class:on>{tr.name}</span>
              <span class="sub" class:clash={!!clash}>
                {clash ? fill($t.registered.notCombinableWith, { name: clash }) : note ? `${tr.focus} · ${note}` : tr.focus}
              </span>
            </span>
          </button>
        {/each}
      {/if}
    {/each}
    <button type="button" class="big ens-press" onclick={() => { onDone(sel); onClose(); }}>{$t.registered.done}</button>
  {/snippet}
</Sheet>

<style>
  .head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 0 6px; }
  .title { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .count { font-size: 13px; color: var(--text-muted); }
  .search {
    width: calc(100% - 12px);
    margin: 12px 6px 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 11px 13px;
    font: inherit;
    font-size: 15px;
    background: var(--surface);
    color: var(--text);
  }
  .group { margin: 14px 6px 2px; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-muted); }
  .row {
    width: calc(100% - 12px);
    margin: 0 6px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }
  .box {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 6px;
    border: 1.5px solid var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--text-inverted);
  }
  .box.on { background: var(--primary-hover); border-color: var(--primary-hover); }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .name { font-size: 15px; font-weight: 500; }
  .name.on { font-weight: 600; }
  .sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .sub.clash { color: var(--warn); }
  .big { width: calc(100% - 12px); margin: 16px 6px 0; border-radius: 13px; padding: 15px 0; font-size: 15px; font-weight: 600; color: var(--text-inverted); background: var(--primary-hover); }
</style>

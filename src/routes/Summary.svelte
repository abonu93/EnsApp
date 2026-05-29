<script lang="ts">
  import { push, link } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { acuteEligibility, hemEligibility } from "$lib/stores/eligibility";
  import { selectedStudies } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";

  // Mappa nome di display -> nome usato in Sheet payload
  // (consistente con buildTrialsForSheet)
  interface EligibleEntry { display: string; eligible: boolean; tone: "ischemic" | "hemorrhagic" | "post-acute" }

  const acuteEligible = $derived<EligibleEntry[]>([
    { display: "WeTrust", eligible: $acuteEligibility.weTrust, tone: "ischemic" },
    { display: "ATHENA", eligible: $acuteEligibility.athena, tone: "ischemic" },
    { display: "VANISH", eligible: $acuteEligibility.vanish, tone: "ischemic" },
    { display: "PIVOTAL", eligible: $acuteEligibility.pivotal, tone: "ischemic" },
    { display: "PROMISE", eligible: $acuteEligibility.promise, tone: "ischemic" },
    { display: "MOSTE", eligible: $acuteEligibility.moste, tone: "ischemic" },
    { display: "TWIN-2-WIN 2", eligible: $acuteEligibility.twin2win2, tone: "ischemic" },
    { display: "ARTEMIS", eligible: $acuteEligibility.artemis, tone: "ischemic" },
    { display: "HYBERNIA", eligible: $acuteEligibility.hybernia, tone: "ischemic" },
    { display: "DONE SYMPLE", eligible: $acuteEligibility.doneSymple, tone: "ischemic" },
    { display: "SHIONOGI", eligible: $acuteEligibility.shionogi, tone: "ischemic" },
    { display: "SOVATELTIDE", eligible: $acuteEligibility.sovateltide, tone: "ischemic" },
    { display: "ORION", eligible: $acuteEligibility.orion, tone: "ischemic" },
    { display: "NiVO", eligible: $acuteEligibility.nivo, tone: "ischemic" },
    { display: "DO-IT", eligible: $acuteEligibility.doit, tone: "ischemic" },
    { display: "REMEDY", eligible: $acuteEligibility.remedy, tone: "ischemic" },
  ]);

  const hemEligibleList = $derived<EligibleEntry[]>([
    { display: "FASTEST", eligible: $hemEligibility.fastest.eligible, tone: "hemorrhagic" },
    { display: "TICH-3", eligible: $hemEligibility.tich3, tone: "hemorrhagic" },
  ]);

  const eligibleItems = $derived(
    [...acuteEligible, ...hemEligibleList].filter((e) => e.eligible)
  );

  function toggle(name: string) {
    selectedStudies.update((arr) =>
      arr.includes(name) ? arr.filter((n) => n !== name) : [...arr, name]
    );
  }

  const selectedCount = $derived($selectedStudies.length);
</script>

<h1>{$t.summary.title}</h1>
<p class="lead">{$t.summary.subtitle}</p>

{#if eligibleItems.length === 0}
  <Card title={$t.summary.noneTitle}>
    {#snippet children()}<p class="muted">{$t.summary.noneDesc}</p>{/snippet}
  </Card>
  <div class="actions">
    <Button variant="secondary" fullWidth onclick={() => push("/post-imaging")}>
      {#snippet children()}{$t.common.back}{/snippet}
    </Button>
    <a href="/post-acute" use:link class="full">
      <Button variant="primary" fullWidth>
        {#snippet children()}{$t.summary.goToPostAcute}{/snippet}
      </Button>
    </a>
  </div>
{:else}
  <Card>
    {#snippet children()}
      <ul class="trial-list">
        {#each eligibleItems as item (item.display)}
          {@const checked = $selectedStudies.includes(item.display)}
          <li>
            <label class="row" class:checked>
              <input type="checkbox" {checked} onchange={() => toggle(item.display)} />
              <div class="row-text">
                <strong>{item.display}</strong>
                <Pill tone={item.tone}>{#snippet children()}{item.tone}{/snippet}</Pill>
              </div>
              <Pill tone="success">{#snippet children()}{$t.common.eligible}{/snippet}</Pill>
            </label>
          </li>
        {/each}
      </ul>
    {/snippet}
  </Card>

  <div class="actions">
    <Button variant="secondary" fullWidth onclick={() => push("/post-imaging")}>
      {#snippet children()}{$t.common.back}{/snippet}
    </Button>
    <Button variant="primary" fullWidth disabled={selectedCount === 0} onclick={() => push("/share")}>
      {#snippet children()}{$t.summary.proceed} ({selectedCount}){/snippet}
    </Button>
  </div>

  <a href="/post-acute" use:link class="post-link">
    {$t.summary.goToPostAcute} →
  </a>
{/if}

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .muted { color: var(--text-muted); margin: 0; }
  .trial-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--sp-2); }
  .row {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: var(--touch-min);
  }
  .row:hover { border-color: var(--primary); }
  .row.checked { background: var(--primary-soft); border-color: var(--primary); }
  .row input { width: 20px; height: 20px; accent-color: var(--primary); }
  .row-text {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
  .row-text strong { font-size: var(--fs-base); }
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-2);
    margin-top: var(--sp-4);
    position: sticky;
    bottom: var(--bottom-nav-h);
    background: var(--surface-elevated);
    padding: var(--sp-3);
    margin-inline: calc(-1 * var(--sp-4));
    border-top: 1px solid var(--border);
  }
  .full { grid-column: 1 / -1; text-decoration: none; color: inherit; }
  .full :global(button) { color: var(--text-inverted); }
  .post-link {
    display: block;
    text-align: center;
    margin-top: var(--sp-4);
    padding: var(--sp-3);
    color: var(--post-acute);
    font-weight: var(--fw-medium);
    text-decoration: none;
  }
  .post-link:hover { text-decoration: underline; }
</style>

<script lang="ts">
  import { push, link } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { acuteEligibility, hemEligibility } from "$lib/stores/eligibility";
  import { selectedStudies } from "$lib/stores/trialSelection";
  import { acuteInput } from "$lib/stores/patient";
  import { REASON_BY_TRIAL } from "$lib/domain/acute-reasons";
  import { t } from "$lib/i18n";

  let showIneligible = $state(false);

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

  const ineligibleItems = $derived(
    acuteEligible.filter((e) => !e.eligible)
  );

  function toggle(name: string) {
    selectedStudies.update((arr) =>
      arr.includes(name) ? arr.filter((n) => n !== name) : [...arr, name]
    );
  }

  function reasonsFor(name: string): string[] {
    const fn = REASON_BY_TRIAL[name];
    if (!fn) return [];
    return fn($acuteInput as Parameters<typeof fn>[0]).fail;
  }

  const selectedCount = $derived($selectedStudies.length);

  function proceedSkip() {
    push("/share");
  }
</script>

<h1>{$t.summary.title}</h1>
<p class="lead">{$t.summary.subtitle}</p>

{#if eligibleItems.length === 0}
  <Card title={$t.summary.noneTitle}>
    {#snippet children()}<p class="muted">{$t.summary.noneDesc}</p>{/snippet}
  </Card>
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
{/if}

{#if ineligibleItems.length > 0}
  <div class="toggle-row">
    <button class="toggle-btn" type="button" onclick={() => (showIneligible = !showIneligible)} aria-expanded={showIneligible}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class:rot={showIneligible}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
      {showIneligible ? "Nascondi" : "Mostra"} non eleggibili ({ineligibleItems.length})
    </button>
  </div>

  {#if showIneligible}
    <Card>
      {#snippet children()}
        <ul class="trial-list">
          {#each ineligibleItems as item (item.display)}
            {@const fails = reasonsFor(item.display)}
            <li class="inel">
              <div class="row no-touch">
                <div class="row-text">
                  <strong>{item.display}</strong>
                  <Pill tone="ischemic">{#snippet children()}{item.tone}{/snippet}</Pill>
                </div>
                <Pill tone="danger">{#snippet children()}{$t.common.notEligible}{/snippet}</Pill>
              </div>
              {#if fails.length > 0}
                <details class="reasons">
                  <summary>Criteri mancanti ({fails.length})</summary>
                  <ul>
                    {#each fails as f}
                      <li>{f}</li>
                    {/each}
                  </ul>
                </details>
              {/if}
            </li>
          {/each}
        </ul>
      {/snippet}
    </Card>
  {/if}
{/if}

<div class="actions">
  <Button variant="secondary" fullWidth onclick={() => push("/post-imaging")}>
    {#snippet children()}{$t.common.back}{/snippet}
  </Button>
  {#if selectedCount > 0}
    <Button variant="primary" fullWidth onclick={() => push("/share")}>
      {#snippet children()}{$t.summary.proceed} ({selectedCount}){/snippet}
    </Button>
  {:else}
    <Button variant="primary" fullWidth onclick={proceedSkip}>
      {#snippet children()}Continua senza selezione{/snippet}
    </Button>
  {/if}
</div>

<a href="/post-acute" use:link class="post-link">
  {$t.summary.goToPostAcute} →
</a>

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
  .row:not(.no-touch):hover { border-color: var(--primary); }
  .row.checked { background: var(--primary-soft); border-color: var(--primary); }
  .row.no-touch { cursor: default; }
  .row input { width: 20px; height: 20px; accent-color: var(--primary); }
  .row-text {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
  .row-text strong { font-size: var(--fs-base); }
  .toggle-row { margin-top: var(--sp-4); }
  .toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: var(--sp-2) var(--sp-3);
    color: var(--text-muted);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    min-height: var(--touch-min);
  }
  .toggle-btn:hover { color: var(--text); }
  .toggle-btn svg { transition: transform var(--transition-fast); }
  .toggle-btn svg.rot { transform: rotate(90deg); }
  .inel {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }
  .reasons {
    padding: var(--sp-2) var(--sp-3);
    background: var(--surface);
    border-radius: var(--radius-md);
    font-size: var(--fs-sm);
  }
  .reasons summary {
    cursor: pointer;
    color: var(--text-muted);
    font-weight: var(--fw-medium);
    padding: var(--sp-1) 0;
  }
  .reasons ul { margin: var(--sp-2) 0 0; padding-left: var(--sp-5); color: var(--danger); }
  .reasons li { margin-bottom: 2px; }
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
  .post-link {
    display: block;
    text-align: center;
    margin-top: var(--sp-4);
    padding: var(--sp-3);
    color: var(--post-acute-text);
    font-weight: var(--fw-medium);
    text-decoration: none;
  }
  .post-link:hover { text-decoration: underline; }
</style>

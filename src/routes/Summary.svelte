<script lang="ts">
  import { push, link } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
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

  const eligibleItems = $derived([...acuteEligible, ...hemEligibleList].filter((e) => e.eligible));
  const ineligibleItems = $derived(acuteEligible.filter((e) => !e.eligible));

  function toggle(name: string) {
    selectedStudies.update((arr) => arr.includes(name) ? arr.filter((n) => n !== name) : [...arr, name]);
  }
  function reasonsFor(name: string): string[] {
    const fn = REASON_BY_TRIAL[name];
    if (!fn) return [];
    return fn($acuteInput as Parameters<typeof fn>[0]).fail;
  }

  const selectedCount = $derived($selectedStudies.length);
</script>

<AppHeader title="Risultati" sub={`${eligibleItems.length} ${eligibleItems.length === 1 ? 'trial eleggibile' : 'trial eleggibili'}`} step={2} steps={3} onBack={() => push("/post-imaging")} />

<div class="body">
  {#if eligibleItems.length === 0}
    <Card title="Nessun trial eleggibile">
      {#snippet children()}<p class="muted">Il paziente non soddisfa i criteri di nessun trial attivo.</p>{/snippet}
    </Card>
  {:else}
    <div class="list">
      {#each eligibleItems as item (item.display)}
        {@const checked = $selectedStudies.includes(item.display)}
        <button class="card-pick" class:on={checked} type="button" onclick={() => toggle(item.display)}>
          <span class="check" class:on={checked} aria-hidden="true">
            {#if checked}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            {/if}
          </span>
          <span class="card-pick-text">
            <span class="name">{item.display}</span>
            <Pill tone={item.tone}>{#snippet children()}{item.tone}{/snippet}</Pill>
          </span>
        </button>
      {/each}
    </div>
  {/if}

  {#if ineligibleItems.length > 0}
    <button class="ineligible-toggle" type="button" onclick={() => (showIneligible = !showIneligible)} aria-expanded={showIneligible}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:rot={showIneligible}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
      {showIneligible ? "Nascondi" : "Mostra"} non eleggibili ({ineligibleItems.length})
    </button>

    {#if showIneligible}
      <Card>
        {#snippet children()}
          <ul class="inel-list">
            {#each ineligibleItems as item (item.display)}
              {@const fails = reasonsFor(item.display)}
              <li class="inel">
                <div class="inel-head">
                  <strong>{item.display}</strong>
                  <Pill tone="danger">{#snippet children()}Non elegg.{/snippet}</Pill>
                </div>
                {#if fails.length > 0}
                  <details class="reasons">
                    <summary>Criteri mancanti ({fails.length})</summary>
                    <ul>{#each fails as f}<li>{f}</li>{/each}</ul>
                  </details>
                {/if}
              </li>
            {/each}
          </ul>
        {/snippet}
      </Card>
    {/if}
  {/if}

  <a href="/post-acute" use:link class="post-link">{$t.summary.goToPostAcute} →</a>
</div>

<BottomBar
  onBack={() => push("/post-imaging")}
  onNext={() => push("/share")}
  nextLabel={selectedCount > 0 ? `Revisione · ${selectedCount}` : "Continua senza selezione"}
/>

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .muted { color: var(--text-muted); margin: 0; font-size: 13px; }

  .list {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .card-pick {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    font-family: inherit;
    color: var(--text);
    transition: all var(--transition-fast);
    min-height: var(--touch-min);
  }
  .card-pick:hover { border-color: var(--primary); }
  .card-pick:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .card-pick.on {
    border: 1.5px solid var(--success);
    background: var(--success-soft);
  }
  .check {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--surface);
    border: 2px solid var(--border-strong);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    transition: all var(--transition-fast);
  }
  .check.on {
    background: var(--success);
    border-color: var(--success);
    color: var(--text-inverted);
  }
  .card-pick-text {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .name { font-size: 15px; font-weight: 600; }

  .ineligible-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin: 0 auto;
    font-family: inherit;
  }
  .ineligible-toggle svg { transition: transform var(--transition-fast); }
  .ineligible-toggle svg.rot { transform: rotate(90deg); }
  .inel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .inel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .reasons {
    margin-top: 8px;
    font-size: 12.5px;
  }
  .reasons summary { cursor: pointer; color: var(--text-muted); font-weight: 600; }
  .reasons ul { margin: 8px 0 0; padding-left: 18px; color: var(--danger); }

  .post-link {
    display: block;
    text-align: center;
    padding: 14px;
    color: var(--post-acute-text);
    font-weight: 500;
    text-decoration: none;
    font-size: 13.5px;
  }
  .post-link:hover { text-decoration: underline; }
</style>

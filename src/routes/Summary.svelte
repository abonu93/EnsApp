<script lang="ts">
  import { push, link } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { acuteEligibility, hemEligibility } from "$lib/stores/eligibility";
  import { selectedStudies } from "$lib/stores/trialSelection";
  import { acuteInput, hemInput, postData } from "$lib/stores/patient";
  import { REASON_BY_TRIAL } from "$lib/domain/acute-reasons";
  import { REASON_BY_HEM_TRIAL } from "$lib/domain/hem-reasons";
  import { exclusiveWith, isTrialOpen } from "$lib/domain/trials-info";
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
    { display: "TENACITY", eligible: $acuteEligibility.tenacity, tone: "ischemic" },
    { display: "SAIL-MeVO", eligible: $acuteEligibility.sailMevo, tone: "ischemic" },
    { display: "NORA HOME", eligible: $acuteEligibility.noraHome, tone: "post-acute" },
  ]);

  const hemEligibleList = $derived<EligibleEntry[]>([
    { display: "FASTEST", eligible: $hemEligibility.fastest.eligible, tone: "hemorrhagic" },
    { display: "TICH-3", eligible: $hemEligibility.tich3, tone: "hemorrhagic" },
  ]);

  // I trial con reclutamento chiuso o in pausa (es. SHIONOGI) restano nel
  // catalogo ma non sono selezionabili: vengono esclusi dai risultati di arruolamento.
  // Solo i trial del tipo di ictus scelto: un'emorragia non deve elencare gli
  // studi ischemici fra i "non eleggibili" (e viceversa).
  // WeTrust (randomizzato prima dell'imaging) resta anche per l'emorragico.
  const candidates = $derived(
    $postData.strokeType === "ischemic" ? acuteEligible
      : $postData.strokeType === "hemorrhagic" ? [...acuteEligible.filter((e) => e.display === "WeTrust"), ...hemEligibleList]
      : []
  );
  // Una selezione fatta con l'altro tipo di ictus non e' piu' visibile qui, ma
  // resterebbe nel conteggio e nel foglio: la si toglie.
  $effect(() => {
    if (!$postData.strokeType) return;
    const allowed = new Set(candidates.map((e) => e.display));
    const known = new Set([...acuteEligible, ...hemEligibleList].map((e) => e.display));
    if ($selectedStudies.some((n) => known.has(n) && !allowed.has(n))) {
      selectedStudies.update((arr) => arr.filter((n) => !known.has(n) || allowed.has(n)));
    }
  });
  const eligibleItems = $derived(
    candidates.filter((e) => e.eligible && isTrialOpen(e.display))
  );
  // Include anche i trial emorragici: prima comparivano solo gli acuti, quindi
  // FASTEST e TICH-3 sparivano senza spiegazione quando non eleggibili.
  const ineligibleItems = $derived(
    candidates.filter((e) => !e.eligible && isTrialOpen(e.display))
  );

  function toggle(name: string) {
    // Selezionare uno studio di un gruppo esclusivo toglie gli altri del gruppo.
    const partners = exclusiveWith(name);
    selectedStudies.update((arr) =>
      arr.includes(name)
        ? arr.filter((n) => n !== name)
        : [...arr.filter((n) => !partners.includes(n)), name]
    );
  }
  function reasonsFor(name: string): string[] {
    const acuteFn = REASON_BY_TRIAL[name];
    if (acuteFn) return acuteFn($acuteInput as Parameters<typeof acuteFn>[0]).fail;
    const hemFn = REASON_BY_HEM_TRIAL[name];
    if (hemFn) return hemFn($hemInput as Parameters<typeof hemFn>[0]).fail;
    return [];
  }

  const selectedCount = $derived($selectedStudies.length);
</script>

<AppHeader title={$t.extras.results} sub={`${eligibleItems.length} ${$t.extras.eligibleTrialsCount}`} step={2} steps={3} onBack={() => push("/post-imaging")} />

<div class="body">
  {#if eligibleItems.length === 0}
    <Card title={$t.extras.noEligibleTitle}>
      {#snippet children()}<p class="muted">{$t.extras.noEligibleDesc}</p>{/snippet}
    </Card>
  {:else}
    <div class="list">
      {#each eligibleItems as item (item.display)}
        {@const checked = $selectedStudies.includes(item.display)}
        {@const rivals = exclusiveWith(item.display).filter((n) => eligibleItems.some((e) => e.display === n))}
        <button class="card-pick" class:on={checked} type="button" onclick={() => toggle(item.display)}>
          <span class="check" class:on={checked} aria-hidden="true">
            {#if checked}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            {/if}
          </span>
          <span class="card-pick-text">
            <span class="name-col">
              <span class="name">{item.display}</span>
              {#if rivals.length > 0}
                <span class="exclusive">{$t.extras.exclusiveWith} {rivals.join(", ")}</span>
              {/if}
            </span>
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
      {showIneligible ? $t.extras.hide : $t.extras.show} {$t.common.notEligible.toLowerCase()} ({ineligibleItems.length})
    </button>

    {#if showIneligible}
      <Card>
        {#snippet children()}
          <ul class="inel-list">
            {#each ineligibleItems as item (item.display)}
              {@const fails = reasonsFor(item.display)}
              <li class="inel">
                <div class="inel-head">
                  <span class="inel-name">
                    <strong>{item.display}</strong>
                    <Pill tone={item.tone}>{#snippet children()}{item.tone}{/snippet}</Pill>
                  </span>
                  <Pill tone="danger">{#snippet children()}{$t.common.notEligible}{/snippet}</Pill>
                </div>
                {#if fails.length > 0}
                  <details class="reasons">
                    <summary>{$t.extras.criteriaMissing} ({fails.length})</summary>
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

  <!-- Librexia (unico trial post-acuto) chiuso: niente link alla valutazione. -->
  {#if isTrialOpen("Librexia")}
    <a href="/post-acute" use:link class="post-link">{$t.summary.goToPostAcute} →</a>
  {/if}
</div>

<BottomBar
  onBack={() => push("/post-imaging")}
  onNext={() => push("/share")}
  nextLabel={selectedCount > 0 ? `${$t.extras.review} · ${selectedCount}` : $t.extras.continueWithoutSelection}
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
  .name-col { display: flex; flex-direction: column; gap: 2px; text-align: left; }
  .exclusive { font-size: 12.5px; color: var(--text-muted); }

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
  .inel-name {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
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

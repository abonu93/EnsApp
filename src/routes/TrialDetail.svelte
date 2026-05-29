<script lang="ts">
  import { link } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import Button from "$lib/components/Button.svelte";
  import { TRIALS_INFO, getTrialCategory, randomizationLinks } from "$lib/domain/trials-info";
  import { t } from "$lib/i18n";

  interface Props {
    params?: { name?: string };
  }
  let { params }: Props = $props();
  const name = $derived(params?.name ? decodeURIComponent(params.name) : "");
  const info = $derived(TRIALS_INFO[name]);

  function statusTone(status: string) {
    if (status === "active") return "success" as const;
    if (status === "paused") return "warn" as const;
    return "info" as const;
  }
</script>

{#if !info}
  <h1>{$t.trials.notFoundTitle}</h1>
  <p class="lead">"{name}" {$t.trials.notFoundDesc}</p>
  <a href="/trials" use:link>
    <Button>{#snippet children()}{$t.trials.backCatalog}{/snippet}</Button>
  </a>
{:else}
  <div class="head">
    <a href="/trials" use:link class="back" aria-label={$t.trials.backToCatalog}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>{$t.trials.backToCatalog}</span>
    </a>
  </div>

  <h1>{name}</h1>
  <div class="badges">
    <Pill tone={statusTone(info.status)}>{#snippet children()}{info.status}{/snippet}</Pill>
    <Pill tone={getTrialCategory(name)}>{#snippet children()}{getTrialCategory(name)}{/snippet}</Pill>
    <Pill tone="neutral">{#snippet children()}{info.category}{/snippet}</Pill>
  </div>

  <div class="stack">
    <Card title={$t.trials.keyCriteria}>
      {#snippet children()}
        <dl class="criteria">
          <div><dt>{$t.trials.fieldWindow}</dt><dd>{info.key.window}</dd></div>
          <div><dt>{$t.trials.fieldAge}</dt><dd>{info.key.age}</dd></div>
          <div><dt>{$t.trials.fieldMrs}</dt><dd>{info.key.mrs}</dd></div>
          <div><dt>{$t.trials.fieldNihss}</dt><dd>{info.key.nihss}</dd></div>
          <div><dt>{$t.trials.fieldAspects}</dt><dd>{info.key.aspects}</dd></div>
        </dl>
      {/snippet}
    </Card>

    <Card title={$t.trials.imaging}>
      {#snippet children()}<p lang="en">{info.imaging}</p>{/snippet}
    </Card>

    <Card title={$t.trials.intervention}>
      {#snippet children()}<p lang="en">{info.intervention}</p>{/snippet}
    </Card>

    <Card title={$t.trials.treatment}>
      {#snippet children()}
        <dl class="kv">
          <div><dt>{$t.trials.thrombolytic}</dt><dd lang="en">{info.thrombolytic}</dd></div>
          <div><dt>{$t.trials.thrombectomy}</dt><dd lang="en">{info.thrombectomy}</dd></div>
          <div><dt>{$t.trials.preEvtLabs}</dt><dd lang="en">{info.preEvtLabs}</dd></div>
          <div><dt>{$t.trials.consent}</dt><dd lang="en">{info.consent}</dd></div>
        </dl>
      {/snippet}
    </Card>

    {#if info.notes.length > 0}
      <Card title={$t.trials.notes}>
        {#snippet children()}
          <ul class="notes" lang="en">
            {#each info.notes as note}
              <li>{note}</li>
            {/each}
          </ul>
        {/snippet}
      </Card>
    {/if}

    {#if info.visits && info.visits.length > 0}
      <Card title={$t.trials.visits}>
        {#snippet children()}
          <ol class="visits" lang="en">
            {#each info.visits as v}
              <li>{v}</li>
            {/each}
          </ol>
        {/snippet}
      </Card>
    {/if}

    {#if randomizationLinks[name]}
      <a href={randomizationLinks[name]} target="_blank" rel="noopener noreferrer" class="rand-link">
        <Button variant="primary" fullWidth>
          {#snippet children()}{$t.trials.openRandomizer}{/snippet}
        </Button>
      </a>
    {/if}
  </div>
{/if}

<style>
  h1 { font-size: var(--fs-3xl); margin: var(--sp-3) 0 var(--sp-3); }
  .lead { color: var(--text-muted); margin-bottom: var(--sp-4); }
  .head { margin-bottom: var(--sp-3); }
  .back {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    color: var(--primary);
    text-decoration: none;
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    min-height: var(--touch-min);
  }
  .back:hover { text-decoration: underline; }
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
    margin-bottom: var(--sp-6);
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
  .criteria, .kv {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    margin: 0;
  }
  .criteria div, .kv div {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-3);
    align-items: flex-start;
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }
  .criteria div:last-child, .kv div:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  dt {
    color: var(--text-muted);
    font-size: var(--fs-sm);
    flex-shrink: 0;
  }
  dd {
    margin: 0;
    text-align: right;
    font-weight: var(--fw-medium);
  }
  .notes, .visits {
    margin: 0;
    padding-left: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }
  .visits { padding-left: var(--sp-5); }
  .notes li, .visits li { color: var(--text); }
  .rand-link {
    text-decoration: none;
    color: inherit;
  }
</style>

<script lang="ts">
  import { link, push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
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
  <AppHeader title={$t.trials.notFoundTitle} sub={`"${name}" ${$t.trials.notFoundDesc}`} onBack={() => push("/trials")} />
{:else}
  <AppHeader title={name} sub={info.category} onBack={() => push("/trials")} />
  <div class="body">
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
  </div>
{/if}

<style>
  .body { padding: 6px 16px 16px; }
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

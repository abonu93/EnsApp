<script lang="ts">
  import { link } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { OPEN_QUESTIONS, COENROLMENT_RULES } from "$lib/domain/open-questions";
  import { EXCLUSIVE_GROUPS, findTrialKey } from "$lib/domain/trials-info";
  import { t } from "$lib/i18n";

  // Raggruppati per studio, nell'ordine in cui compaiono.
  const byTrial = $derived.by(() => {
    const groups = new Map<string, typeof OPEN_QUESTIONS[number][]>();
    for (const q of OPEN_QUESTIONS) {
      for (const trial of q.trials) {
        groups.set(trial, [...(groups.get(trial) ?? []), q]);
      }
    }
    return [...groups.entries()];
  });
  const coenrolment = Object.entries(COENROLMENT_RULES);
</script>

<AppHeader title={$t.extras.openQuestionsTitle} sub={`${OPEN_QUESTIONS.length} ${$t.extras.openQuestionsCount}`} />

<div class="body">
  <p class="intro">{$t.extras.openQuestionsIntro}</p>

  {#each byTrial as [trial, questions] (trial)}
    {@const key = findTrialKey(trial)}
    <Card title={trial}>
      {#snippet children()}
        <ul class="qs" lang="en">
          {#each questions as q (q.id)}
            <li>
              <div class="q-head">
                <strong>{q.question}</strong>
                <Pill tone={q.owner === "sponsor" ? "info" : "warn"}>
                  {#snippet children()}{q.owner === "sponsor" ? $t.extras.askSponsor : $t.extras.askTeam}{/snippet}
                </Pill>
              </div>
              <p>{q.detail}</p>
            </li>
          {/each}
        </ul>
        {#if key}
          <a href={`/trial/${encodeURIComponent(key)}`} use:link class="trial-link">{$t.extras.openTrialCard}</a>
        {/if}
      {/snippet}
    </Card>
  {/each}

  <Card title={$t.extras.coenrolmentTitle} subtitle={$t.extras.coenrolmentDesc}>
    {#snippet children()}
      <ul class="qs">
        {#each EXCLUSIVE_GROUPS as g, i (i)}
          <li><strong>{$t.extras.coenrolmentDecided}</strong> {g.join(", ")}</li>
        {/each}
        {#each coenrolment as [trial, rule] (trial)}
          <li lang="en"><strong>{trial}</strong> {rule.text}.</li>
        {/each}
      </ul>
    {/snippet}
  </Card>
</div>

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .intro { margin: 0; color: var(--text-muted); font-size: 14px; }
  .qs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
  .qs p { margin: 4px 0 0; font-size: 13.5px; color: var(--text-muted); }
  .q-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .trial-link { display: inline-block; margin-top: 12px; font-size: 13.5px; font-weight: 600; }
</style>

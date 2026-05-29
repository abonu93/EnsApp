<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { preData } from "$lib/stores/patient";
  import { acuteEligibility } from "$lib/stores/eligibility";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  const weTrust = $derived($acuteEligibility.weTrust);
  const doac = $derived($preData.doac === "yes");

  $effect(() => {
    announce(weTrust ? $t.preResult.weTrustEligibleAnnounce : $t.preResult.weTrustNotEligibleAnnounce);
  });

  function openRandomization() {
    window.open("https://app.studyrandomizer.com/dashboard/", "_blank", "noopener");
  }

  function continueToPostImaging() {
    push("/post-imaging");
  }
</script>

<h1>{$t.preResult.title}</h1>

<div class="stack">
  <Card>
    {#snippet children()}
      <div class="result">
        <div class="result-head">
          <strong>WeTrust</strong>
          {#if weTrust}
            <Pill tone="success">{#snippet children()}{$t.common.eligible}{/snippet}</Pill>
          {:else}
            <Pill tone="danger">{#snippet children()}{$t.common.notEligible}{/snippet}</Pill>
          {/if}
        </div>
        <p class="muted">
          {weTrust ? $t.preResult.weTrustEligible : $t.preResult.weTrustNotEligible}
        </p>
      </div>
    {/snippet}
  </Card>

  {#if doac}
    <Card>
      {#snippet children()}
        <div class="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>{$t.preResult.doacAlertTitle}</strong>
            <p>{$t.preResult.doacAlertDesc}</p>
          </div>
        </div>
      {/snippet}
    </Card>
  {/if}

  <div class="actions">
    <Button variant="secondary" fullWidth onclick={() => push("/pre-imaging")}>
      {#snippet children()}{$t.common.back}{/snippet}
    </Button>
    {#if weTrust}
      <Button variant="primary" fullWidth onclick={openRandomization}>
        {#snippet children()}{$t.preResult.randomize}{/snippet}
      </Button>
    {/if}
    <Button variant={weTrust ? "ghost" : "primary"} fullWidth onclick={continueToPostImaging}>
      {#snippet children()}{$t.preResult.continue}{/snippet}
    </Button>
  </div>
</div>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0 0 var(--sp-4); }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .result-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    margin-bottom: var(--sp-2);
  }
  .result-head strong { font-size: var(--fs-lg); }
  .muted { margin: 0; color: var(--text-muted); font-size: var(--fs-sm); }
  .alert {
    display: flex;
    gap: var(--sp-3);
    align-items: flex-start;
    color: var(--warn);
    background: var(--warn-soft);
    padding: var(--sp-3);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--warn);
  }
  .alert svg { flex-shrink: 0; margin-top: 2px; }
  .alert strong { display: block; color: var(--text); }
  .alert p { margin: 4px 0 0; color: var(--text); font-size: var(--fs-sm); }
  .actions { display: grid; gap: var(--sp-2); }
</style>

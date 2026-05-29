<script lang="ts">
  import { link, push } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import { hasPatientInProgress, preData, clearPatient } from "$lib/stores/patient";
  import { clearSelection } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";

  function startNew() {
    clearPatient();
    clearSelection();
    push("/workflow");
  }

  function discardPatient() {
    clearPatient();
    clearSelection();
  }

  function resume() {
    push("/workflow");
  }
</script>

<div class="hero">
  <div class="brand-mark" aria-hidden="true">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z" />
      <path d="M12 14v8" />
      <path d="M8 22h8" />
    </svg>
  </div>
  <h1>{$t.common.appName}</h1>
  <p class="lead">{$t.landing.tagline}</p>
</div>

<div class="actions">
  <Button variant="primary" size="lg" fullWidth onclick={startNew}>
    {#snippet children()}{$t.landing.newPatient}{/snippet}
  </Button>

  {#if $hasPatientInProgress}
    <Card title={$t.landing.inProgressTitle} subtitle={$t.landing.inProgressSubtitle}>
      {#snippet children()}
        <dl class="resume">
          {#if $preData.patientId}<div><dt>{$t.landing.patientId}</dt><dd>{$preData.patientId}</dd></div>{/if}
          {#if $preData.age != null}<div><dt>{$t.landing.age}</dt><dd>{$preData.age}</dd></div>{/if}
          {#if $preData.nihss != null}<div><dt>{$t.landing.nihss}</dt><dd>{$preData.nihss}</dd></div>{/if}
          {#if $preData.ltsw != null}<div><dt>{$t.landing.ltsw}</dt><dd>{$preData.ltsw}h</dd></div>{/if}
        </dl>
        <div class="resume-actions">
          <Button variant="ghost" onclick={discardPatient}>{#snippet children()}{$t.landing.discard}{/snippet}</Button>
          <Button variant="primary" onclick={resume}>{#snippet children()}{$t.landing.resume}{/snippet}</Button>
        </div>
      {/snippet}
    </Card>
  {/if}

  <a href="/trials" use:link class="link-card">
    <Card title={$t.landing.catalogTitle} subtitle={$t.landing.catalogSubtitle}>
      {#snippet children()}<p class="muted">{$t.landing.catalogDesc}</p>{/snippet}
    </Card>
  </a>
</div>

<style>
  .hero {
    text-align: center;
    padding-block: var(--sp-6) var(--sp-6);
  }
  .brand-mark {
    width: 72px;
    height: 72px;
    margin: 0 auto var(--sp-4);
    border-radius: 24px;
    background: linear-gradient(135deg, var(--primary), var(--hemorrhagic));
    color: var(--text-inverted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
  }
  h1 { font-size: var(--fs-3xl); margin: 0; }
  .lead {
    color: var(--text-muted);
    margin: var(--sp-2) 0 0;
    font-size: var(--fs-base);
  }
  .actions { display: flex; flex-direction: column; gap: var(--sp-4); }
  .link-card {
    text-decoration: none;
    color: inherit;
    transition: transform var(--transition-fast);
  }
  .link-card:hover { text-decoration: none; transform: translateY(-2px); }
  .muted { margin: 0; color: var(--text-muted); font-size: var(--fs-sm); }
  .resume {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--sp-3);
    margin: 0 0 var(--sp-4);
  }
  .resume div { display: flex; flex-direction: column; gap: 2px; }
  .resume dt {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .resume dd { margin: 0; font-size: var(--fs-base); font-weight: var(--fw-semibold); }
  .resume-actions { display: flex; gap: var(--sp-2); justify-content: flex-end; }
</style>

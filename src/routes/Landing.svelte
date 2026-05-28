<script lang="ts">
  import { link } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { hasPatientInProgress, preData, clearPatient } from "$lib/stores/patient";
</script>

<h1>EnsApp</h1>
<p class="lead">Assegnazione paziente a trial clinici - foundation Svelte 5.</p>

{#if $hasPatientInProgress}
  <Card title="Paziente in lavorazione" subtitle="Ripreso da localStorage">
    {#snippet children()}
      <dl class="resume">
        {#if $preData.patientId}<div><dt>ID</dt><dd>{$preData.patientId}</dd></div>{/if}
        {#if $preData.age != null}<div><dt>Età</dt><dd>{$preData.age}</dd></div>{/if}
        {#if $preData.nihss != null}<div><dt>NIHSS</dt><dd>{$preData.nihss}</dd></div>{/if}
        {#if $preData.ltsw != null}<div><dt>LTSW</dt><dd>{$preData.ltsw}h</dd></div>{/if}
      </dl>
      <div class="resume-actions">
        <Button variant="ghost" onclick={clearPatient}>Scarta</Button>
        <Button variant="primary">
          {#snippet children()}Riprendi{/snippet}
        </Button>
      </div>
    {/snippet}
  </Card>
{/if}

<div class="stack-lg">
  <Card title="Stato del redesign">
    {#snippet children()}
      <ul class="status">
        <li><Pill tone="success">{#snippet children()}Fase 0{/snippet}</Pill> Setup tooling</li>
        <li><Pill tone="success">{#snippet children()}In corso{/snippet}</Pill> Fase 1 - componenti + router</li>
        <li><Pill tone="neutral">{#snippet children()}Prossima{/snippet}</Pill> Fase 2 - migrazione schermate</li>
      </ul>
    {/snippet}
  </Card>

  <div class="cta-grid">
    <a href="/components" use:link class="cta-link">
      <Card title="Component gallery" subtitle="Tutti gli atomi del design system">
        {#snippet children()}<p class="cta-desc">Button, TextField, RadioGroup, Modal, ProgressBar, Pill...</p>{/snippet}
      </Card>
    </a>
    <a href="/form-demo" use:link class="cta-link">
      <Card title="Form demo" subtitle="Mini wizard di esempio con validazione live">
        {#snippet children()}<p class="cta-desc">Età, NIHSS, mRS - con persistenza in localStorage.</p>{/snippet}
      </Card>
    </a>
  </div>
</div>

<style>
  h1 {
    font-size: var(--fs-3xl);
    margin: 0;
  }

  .lead {
    color: var(--text-muted);
    margin-block: var(--sp-2) var(--sp-6);
  }

  .stack-lg {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);
  }

  .status {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    color: var(--text);
  }

  .status li {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    font-size: var(--fs-sm);
  }

  .cta-grid {
    display: grid;
    gap: var(--sp-4);
  }

  @media (min-width: 640px) {
    .cta-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .cta-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform var(--transition-fast);
  }

  .cta-link:hover {
    text-decoration: none;
    transform: translateY(-2px);
  }

  .cta-desc {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }

  .resume {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--sp-3);
    margin: 0 0 var(--sp-4);
  }

  .resume div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .resume dt {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .resume dd {
    margin: 0;
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
  }

  .resume-actions {
    display: flex;
    gap: var(--sp-2);
    justify-content: flex-end;
  }
</style>

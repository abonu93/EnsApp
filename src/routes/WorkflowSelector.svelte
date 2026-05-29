<script lang="ts">
  import { push } from "svelte-spa-router";
  import { t } from "$lib/i18n";

  const choices = $derived([
    { key: "eligibility", title: $t.workflow.eligibilityTitle, desc: $t.workflow.eligibilityDesc, icon: "stethoscope", route: "/pre-imaging" },
    { key: "trials", title: $t.workflow.trialsTitle, desc: $t.workflow.trialsDesc, icon: "book", route: "/trials" },
    { key: "quick", title: $t.workflow.quickTitle, desc: $t.workflow.quickDesc, icon: "zap", route: "/trial-patient" },
  ]);

  function pick(route: string) { push(route); }
</script>

<h1>{$t.workflow.title}</h1>
<p class="lead">{$t.workflow.subtitle}</p>

<div class="grid">
  {#each choices as c (c.key)}
    <button class="tile" type="button" onclick={() => pick(c.route)}>
      <span class="tile-icon" aria-hidden="true">
        {#if c.icon === "stethoscope"}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2v6a4 4 0 0 0 8 0V2" />
            <path d="M10 12v3a5 5 0 0 0 10 0v-2" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        {:else if c.icon === "book"}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        {:else}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        {/if}
      </span>
      <span class="tile-text">
        <span class="tile-title">{c.title}</span>
        <span class="tile-desc">{c.desc}</span>
      </span>
      <svg class="tile-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  {/each}
</div>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-6); }
  .grid { display: flex; flex-direction: column; gap: var(--sp-3); }
  .tile {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-4);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface-elevated);
    color: var(--text);
    text-align: left;
    cursor: pointer;
    min-height: 80px;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
  }
  .tile:hover {
    border-color: var(--primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .tile-icon {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--primary-soft);
    color: var(--primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .tile-text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .tile-title { font-size: var(--fs-base); font-weight: var(--fw-semibold); }
  .tile-desc { font-size: var(--fs-sm); color: var(--text-muted); }
  .tile-chevron { color: var(--text-muted); flex: 0 0 auto; }
</style>

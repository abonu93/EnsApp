<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import { t } from "$lib/i18n";

  const choices = $derived([
    {
      key: "check",
      title: $t.workflow.eligibilityTitle,
      desc: $t.workflow.eligibilityDesc,
      tag: $t.extras.guidedTag,
      accent: "var(--primary)",
      bg: "var(--primary-soft)",
      route: "/pre-imaging",
      icon: "stetho" as const,
    },
    {
      key: "direct",
      title: $t.extras.directEnroll,
      desc: $t.extras.directEnrollDesc,
      tag: $t.extras.fastTag,
      accent: "var(--post-acute)",
      bg: "var(--post-acute-soft)",
      route: "/trial-patient",
      icon: "bolt" as const,
    },
  ]);

  function pick(route: string) { push(route); }
</script>

<AppHeader />

<div class="page">
  <div class="intro">
    <h2>{$t.landing.newPatient}</h2>
    <p>{$t.extras.proceedHow}</p>
  </div>

  <div class="opts">
    {#each choices as o (o.key)}
      <button class="opt ens-press ens-rise" type="button" onclick={() => pick(o.route)} style="animation-delay: 140ms">
        <div class="opt-top">
          <span class="opt-icon" style="background: {o.bg}; color: {o.accent}">
            {#if o.icon === "stetho"}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2v6a4 4 0 0 0 8 0V2" />
                <path d="M10 12v3a5 5 0 0 0 10 0v-2" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            {:else}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            {/if}
          </span>
          <span class="opt-tag" style="color: {o.accent}; background: {o.bg}">{o.tag}</span>
        </div>
        <div class="opt-body">
          <div class="opt-title">
            {o.title}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div class="opt-desc">{o.desc}</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .page {
    padding: 8px 22px 0;
  }
  .intro {
    margin-bottom: 22px;
  }
  h2 {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.6px;
    margin: 0;
    color: var(--text);
  }
  .intro p {
    font-size: 14px;
    color: var(--text-muted);
    margin: 6px 0 0;
  }

  .opts {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .opt {
    text-align: left;
    cursor: pointer;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    background: var(--surface);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: inherit;
    color: var(--text);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }
  .opt:active { transform: scale(0.99); }
  .opt:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .opt:hover { box-shadow: var(--shadow-lg); }

  .opt-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .opt-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .opt-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .opt-title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text);
  }
  .opt-desc {
    font-size: 13.5px;
    color: var(--text-muted);
    margin-top: 5px;
    line-height: 1.45;
  }
</style>

<script lang="ts">
  import Router, { location, link } from "svelte-spa-router";
  import { routes, setupRouterA11y } from "$lib/router";
  import BottomNav from "$lib/components/BottomNav.svelte";
  import { t, locale, cycleLocale } from "$lib/i18n";

  setupRouterA11y();

  // animKey forza il re-mount della sezione main ad ogni cambio di route
  // per scatenare l'animazione ens-screen-in
  const animKey = $derived($location);

  const navItems = $derived([
    { href: "/", label: $t.nav.home, icon: "home" as const },
    { href: "/workflow", label: $t.nav.new, icon: "user-plus" as const },
    { href: "/saved", label: $t.nav.saved, icon: "archive" as const },
    { href: "/trials", label: $t.nav.trials, icon: "list" as const },
  ]);
</script>

<a href="#main" class="skip-link">{$t.common.skipToContent}</a>

<header class="hdr">
  <a href="/" use:link class="brand">
    <span class="brand-dot" aria-hidden="true">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v6" />
        <path d="M12 22v-6" />
        <path d="M5.6 5.6l4.2 4.2" />
        <path d="M14.2 14.2l4.2 4.2" />
      </svg>
    </span>
    <span class="brand-name">EnsApp</span>
  </a>
  <button class="lang-btn" type="button" onclick={cycleLocale} aria-label="{$t.common.language}: {$locale.toUpperCase()}">
    {$locale.toUpperCase()}
  </button>
</header>

<main id="main" tabindex="-1">
  {#key animKey}
    <div class="ens-screen-in">
      <Router {routes} />
    </div>
  {/key}
</main>

<BottomNav items={navItems} />

<style>
  :global(html) {
    background: var(--bg);
    padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0));
  }
  :global(body) {
    background: var(--bg);
    margin: 0;
  }

  .hdr {
    padding: env(safe-area-inset-top, 12px) 20px 4px 24px;
    padding-top: max(12px, env(safe-area-inset-top, 12px));
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    color: var(--text);
  }
  .brand:hover { text-decoration: none; }
  .brand-dot {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: var(--primary);
    color: var(--text-inverted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .lang-btn {
    color: var(--text-muted);
    font-size: 12.5px;
    font-weight: 600;
    font-family: var(--font-mono);
    letter-spacing: 0.3px;
    padding: 6px;
    cursor: pointer;
    min-height: 32px;
    min-width: 32px;
    border-radius: 6px;
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  .lang-btn:hover { background: var(--primary-soft); color: var(--primary); }
  .lang-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  main {
    outline: none;
  }
</style>

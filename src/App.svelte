<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes, setupRouterA11y } from "$lib/router";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import BottomNav from "$lib/components/BottomNav.svelte";

  setupRouterA11y();

  const navItems = [
    { href: "/", label: "Home", icon: "home" as const },
    { href: "/components", label: "Componenti", icon: "list" as const },
    { href: "/form-demo", label: "Demo form", icon: "user-plus" as const },
  ];
</script>

<a href="#main" class="skip-link">Vai al contenuto</a>

<header>
  <div class="container header-row">
    <a href="/" class="brand">
      <span class="brand-dot" aria-hidden="true"></span>
      EnsApp
    </a>
    <ThemeToggle />
  </div>
</header>

<main id="main" class="container" tabindex="-1">
  <Router {routes} />
</main>

<BottomNav items={navItems} />

<style>
  :global(html) {
    /* Padding bottom = bottom-nav-h + safe-area */
    padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0));
  }

  header {
    position: sticky;
    top: 0;
    background: var(--surface-elevated);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(8px) saturate(180%);
    z-index: var(--z-header);
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: var(--header-h);
    gap: var(--sp-3);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text);
    text-decoration: none;
  }

  .brand:hover {
    text-decoration: none;
  }

  .brand-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--hemorrhagic));
    box-shadow: 0 0 0 2px var(--surface-elevated), 0 0 0 3px var(--primary-soft);
  }

  main {
    padding-block: var(--sp-6) var(--sp-8);
    outline: none;
  }
</style>

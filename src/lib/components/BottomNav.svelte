<script lang="ts">
  import { location } from "svelte-spa-router";
  import { link } from "svelte-spa-router";

  interface NavItem {
    href: string;
    label: string;
    icon: "home" | "user-plus" | "list";
  }

  interface Props {
    items: NavItem[];
  }

  let { items }: Props = $props();
</script>

<nav class="bottom-nav" aria-label="Navigazione principale">
  {#each items as item (item.href)}
    {@const active = $location === item.href || $location.startsWith(item.href + "/")}
    <a
      href={item.href}
      use:link
      class="nav-item"
      class:active
      aria-current={active ? "page" : undefined}
    >
      <span class="icon" aria-hidden="true">
        {#if item.icon === "home"}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" />
          </svg>
        {:else if item.icon === "user-plus"}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        {:else if item.icon === "list"}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        {/if}
      </span>
      <span class="label">{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface-elevated);
    border-top: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    z-index: var(--z-bottom-nav);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: var(--bottom-nav-h);
    padding-block: var(--sp-2);
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .nav-item:hover {
    color: var(--text);
    text-decoration: none;
  }

  .nav-item.active {
    color: var(--primary);
  }

  .icon {
    display: inline-flex;
  }

  .label {
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
  }
</style>

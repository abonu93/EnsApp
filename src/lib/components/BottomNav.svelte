<script lang="ts">
  import { link, location } from "svelte-spa-router";

  interface NavItem {
    href: string;
    label: string;
    icon: "home" | "user-plus" | "list" | "archive";
  }

  interface Props {
    items: NavItem[];
  }

  let { items }: Props = $props();
</script>

<nav class="dock" aria-label="Navigazione principale">
  <div class="pill">
    {#each items as item (item.href)}
      {@const active = $location === item.href || $location.startsWith(item.href + "/")}
      <a
        href={item.href}
        use:link
        class="item"
        class:active
        aria-current={active ? "page" : undefined}
      >
        <span class="icon" aria-hidden="true">
          {#if item.icon === "home"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" />
            </svg>
          {:else if item.icon === "user-plus"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          {:else if item.icon === "archive"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          {:else if item.icon === "list"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          {/if}
        </span>
        {#if active}
          <span class="label">{item.label}</span>
        {/if}
      </a>
    {/each}
  </div>
</nav>

<style>
  .dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0));
    padding-top: 6px;
    pointer-events: none;
    z-index: var(--z-bottom-nav);
  }

  .pill {
    display: flex;
    gap: 4px;
    background: var(--surface-elevated);
    border-radius: 999px;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.05);
    pointer-events: auto;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 13px;
    border-radius: 999px;
    color: var(--text-muted);
    text-decoration: none;
    transition: background var(--transition-fast), color var(--transition-fast), padding var(--transition-fast);
    min-height: 36px;
  }

  .item:hover { color: var(--text); text-decoration: none; }

  .item.active {
    background: var(--text);
    color: var(--text-inverted);
    padding: 9px 16px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
  }
</style>

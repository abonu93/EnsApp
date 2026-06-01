<script lang="ts">
  import { theme, cycleTheme } from "$lib/stores/theme";

  const labels = { auto: "Auto", light: "Light", dark: "Dark" } as const;
</script>

<button
  type="button"
  class="toggle"
  onclick={cycleTheme}
  aria-label="Cambia tema (attuale: {labels[$theme]})"
  title="Tema attuale: {labels[$theme]}"
>
  {#if $theme === "auto"}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 3v9l6 6" />
    </svg>
  {:else if $theme === "light"}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  {:else}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  {/if}
  <span class="label">{labels[$theme]}</span>
</button>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--text);
    font-weight: var(--fw-medium);
    font-size: var(--fs-sm);
    transition:
      background var(--transition-fast),
      border-color var(--transition-fast);
  }

  .toggle:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .label {
    line-height: 1;
  }
</style>

<script lang="ts">
  import { locale, LOCALES, setLocale, t } from "$lib/i18n";

  let menuOpen = $state(false);
  let menuRef: HTMLDivElement | null = $state(null);

  function toggle() {
    menuOpen = !menuOpen;
  }

  function pick(code: typeof LOCALES[number]["code"]) {
    setLocale(code);
    menuOpen = false;
  }

  function onDocClick(e: MouseEvent) {
    if (!menuOpen) return;
    if (menuRef && !menuRef.contains(e.target as Node)) menuOpen = false;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && menuOpen) menuOpen = false;
  }

  $effect(() => {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  });

  const current = $derived(LOCALES.find((l) => l.code === $locale) ?? LOCALES[0]);
</script>

<div class="locale" bind:this={menuRef}>
  <button
    type="button"
    class="toggle"
    onclick={toggle}
    aria-haspopup="menu"
    aria-expanded={menuOpen}
    aria-label={$t.common.language}
    title={$t.common.language}
  >
    <span class="flag" aria-hidden="true">{current.flag}</span>
    <span class="code">{current.code.toUpperCase()}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>

  {#if menuOpen}
    <ul class="menu" role="menu">
      {#each LOCALES as l (l.code)}
        <li role="none">
          <button
            type="button"
            role="menuitem"
            class:active={$locale === l.code}
            onclick={() => pick(l.code)}
          >
            <span class="flag" aria-hidden="true">{l.flag}</span>
            <span>{l.label}</span>
            {#if $locale === l.code}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .locale {
    position: relative;
  }

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
    transition: border-color var(--transition-fast), background var(--transition-fast);
  }

  .toggle:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .flag {
    font-size: 16px;
    line-height: 1;
  }

  .code {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    letter-spacing: 0.5px;
  }

  .menu {
    position: absolute;
    top: calc(100% + var(--sp-1));
    right: 0;
    list-style: none;
    margin: 0;
    padding: var(--sp-1);
    min-width: 180px;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: var(--z-header);
  }

  .menu button {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    width: 100%;
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: var(--fs-sm);
    text-align: left;
    transition: background var(--transition-fast);
    min-height: 40px;
  }

  .menu button:hover {
    background: var(--surface);
  }

  .menu button.active {
    background: var(--primary-soft);
    color: var(--primary);
    font-weight: var(--fw-semibold);
  }

  .menu button svg {
    margin-left: auto;
  }
</style>

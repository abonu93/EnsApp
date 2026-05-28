<script lang="ts">
  import { theme, cycleTheme } from "$lib/stores/theme";

  const swatches: { label: string; var: string; on: "bg" | "text" }[] = [
    { label: "primary", var: "--primary", on: "bg" },
    { label: "success / eligible", var: "--success", on: "bg" },
    { label: "danger / not eligible", var: "--danger", on: "bg" },
    { label: "warn", var: "--warn", on: "bg" },
    { label: "info", var: "--info", on: "bg" },
    { label: "ischemic", var: "--ischemic", on: "bg" },
    { label: "hemorrhagic", var: "--hemorrhagic", on: "bg" },
    { label: "post-acute", var: "--post-acute", on: "bg" },
  ];

  const fontScale: { label: string; var: string }[] = [
    { label: "xs", var: "--fs-xs" },
    { label: "sm", var: "--fs-sm" },
    { label: "base", var: "--fs-base" },
    { label: "lg", var: "--fs-lg" },
    { label: "xl", var: "--fs-xl" },
    { label: "2xl", var: "--fs-2xl" },
    { label: "3xl (fluid)", var: "--fs-3xl" },
  ];

  const spacingScale: { label: string; var: string }[] = [
    { label: "1 (4px)", var: "--sp-1" },
    { label: "2 (8px)", var: "--sp-2" },
    { label: "3 (12px)", var: "--sp-3" },
    { label: "4 (16px)", var: "--sp-4" },
    { label: "6 (24px)", var: "--sp-6" },
    { label: "8 (32px)", var: "--sp-8" },
    { label: "10 (40px)", var: "--sp-10" },
  ];
</script>

<a href="#main" class="skip-link">Vai al contenuto</a>

<header>
  <div class="container header-row">
    <h1>EnsApp - design tokens</h1>
    <button class="theme-btn" onclick={cycleTheme} aria-label="Cambia tema: attuale {$theme}">
      {$theme === "auto" ? "Auto" : $theme === "light" ? "Light" : "Dark"}
    </button>
  </div>
</header>

<main id="main" tabindex="-1" class="container">
  <section class="stack-lg">
    <p class="muted">
      Foundation pronta. Questa pagina mostra i token del design system. La SPA reale
      arrivera' con la Fase 2 (migrazione schermate).
    </p>

    <section>
      <h2>Palette</h2>
      <div class="swatches">
        {#each swatches as s (s.var)}
          <div class="swatch" style="background: var({s.var}); color: white;">
            <strong>{s.label}</strong>
            <code>{s.var}</code>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <h2>Tipografia</h2>
      <div class="stack-sm">
        {#each fontScale as f (f.var)}
          <p style="font-size: var({f.var}); margin: 0;">
            {f.label} - Esempio di testo con scala {f.var}
          </p>
        {/each}
      </div>
    </section>

    <section>
      <h2>Spacing (4pt)</h2>
      <div class="spacing-demo">
        {#each spacingScale as s (s.var)}
          <div class="spacing-row">
            <span class="spacing-label">{s.label}</span>
            <span class="spacing-bar" style="width: var({s.var});"></span>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <h2>Stati semantici</h2>
      <div class="pill-row">
        <span class="pill pill-success">Eligible</span>
        <span class="pill pill-danger">Not eligible</span>
        <span class="pill pill-warn">In progress</span>
        <span class="pill pill-info">Info</span>
      </div>
    </section>
  </section>
</main>

<style>
  header {
    position: sticky;
    top: 0;
    background: var(--surface-elevated);
    border-bottom: 1px solid var(--border);
    z-index: var(--z-header);
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: var(--header-h);
  }

  h1 {
    font-size: var(--fs-lg);
    margin: 0;
  }

  h2 {
    font-size: var(--fs-xl);
    margin-bottom: var(--sp-3);
    color: var(--text);
  }

  main {
    padding-block: var(--sp-6) var(--sp-12);
  }

  .muted {
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }

  .theme-btn {
    min-height: var(--touch-min);
    min-width: var(--touch-min);
    padding-inline: var(--sp-4);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--text);
    font-weight: var(--fw-medium);
    transition: background var(--transition-fast);
  }

  .theme-btn:hover {
    background: var(--primary-soft);
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--sp-3);
  }

  .swatch {
    padding: var(--sp-4);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    min-height: 88px;
    box-shadow: var(--shadow-sm);
  }

  .swatch code {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    opacity: 0.85;
  }

  .spacing-demo {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    background: var(--surface);
    padding: var(--sp-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .spacing-row {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  .spacing-label {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--text-muted);
    min-width: 80px;
  }

  .spacing-bar {
    height: 16px;
    background: var(--primary);
    border-radius: var(--radius-sm);
  }

  .pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  .pill {
    display: inline-flex;
    align-items: center;
    padding: var(--sp-1) var(--sp-3);
    border-radius: var(--radius-pill);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
  }

  .pill-success {
    background: var(--success-soft);
    color: var(--success);
  }

  .pill-danger {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .pill-warn {
    background: var(--warn-soft);
    color: var(--warn);
  }

  .pill-info {
    background: var(--info-soft);
    color: var(--info);
  }
</style>

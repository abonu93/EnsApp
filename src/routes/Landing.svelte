<script lang="ts">
  import { push } from "svelte-spa-router";
  import { hasPatientInProgress, preData, hoursSince, clearPatient } from "$lib/stores/patient";
  import { clearSelection } from "$lib/stores/trialSelection";
  import { t } from "$lib/i18n";

  function startNew() {
    clearPatient();
    clearSelection();
    push("/workflow");
  }
  function resume() { push("/workflow"); }
  function goCatalog() { push("/trials"); }
  function goPast() { push("/saved"); }

  // Active session timer (mm:ss da LTSW)
  const ltswHours = $derived(hoursSince($preData.ltswDate) ?? $preData.ltsw);
  function fmtElapsed(hours: number | undefined): string {
    if (hours === undefined || hours < 0) return "—";
    const totalMin = Math.floor(hours * 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}` : `${m}m`;
  }
  const elapsedLabel = $derived(fmtElapsed(ltswHours));
  // Frazione finestra terapeutica (4.5h IV thrombolysis)
  const windowFrac = $derived(
    ltswHours !== undefined ? Math.min(1, (ltswHours * 60) / (4.5 * 60)) : 0
  );
</script>

<div class="page">
  <div class="intro">
    <h1>{$t.landing.heroTitle}</h1>
    <p class="tagline">{$t.landing.tagline}</p>
  </div>

  <button class="hero ens-press" type="button" onclick={startNew}>
    <span class="hero-text">
      <span class="hero-title">{$t.landing.newPatient}</span>
      <span class="hero-sub">{$t.workflow.eligibilityDesc}</span>
    </span>
    <span class="hero-arrow" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  </button>

  {#if $hasPatientInProgress}
    <button class="resume" type="button" onclick={resume}>
      <div class="resume-head">
        <span class="resume-status">
          <span class="dot" aria-hidden="true"></span>
          <span>{$t.landing.inProgressTitle}</span>
        </span>
        <span class="resume-cta">{$t.landing.resume} →</span>
      </div>
      <div class="resume-meta">
        <span class="elapsed">{elapsedLabel}</span>
        <span class="since">da LTSW</span>
      </div>
      <div class="window">
        <div class="window-fill" style="width: {Math.round(windowFrac * 100)}%"></div>
      </div>
    </button>
    <button class="discard" type="button" onclick={() => { clearPatient(); clearSelection(); }}>
      {$t.landing.discard}
    </button>
  {/if}

  <div class="spacer"></div>

  <div class="footer-links">
    <button class="footer-link" type="button" onclick={goCatalog}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      <span>{$t.landing.catalogTitle}</span>
    </button>
    <button class="footer-link" type="button" onclick={goPast}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      </svg>
      <span>{$t.landing.pastPatients}</span>
    </button>
  </div>
</div>

<style>
  .page {
    padding: 12px 24px 0;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 200px);
  }
  .intro {
    margin-top: 18px;
    margin-bottom: 26px;
  }
  h1 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.8px;
    line-height: 1.12;
    margin: 0;
    color: var(--text);
    white-space: pre-line;
  }
  .tagline {
    font-size: 14px;
    color: var(--text-muted);
    margin: 10px 0 0;
    line-height: 1.4;
  }

  .hero {
    border: none;
    cursor: pointer;
    border-radius: 22px;
    padding: 22px;
    background: var(--primary);
    color: var(--text-inverted);
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: 0 8px 22px rgba(45, 91, 215, 0.30);
    font-family: inherit;
    transition: transform var(--transition-fast), filter var(--transition-fast);
  }
  .hero:active { transform: scale(0.99); filter: brightness(0.96); }
  .hero:focus-visible { outline: none; box-shadow: var(--focus-ring), 0 8px 22px rgba(45, 91, 215, 0.30); }
  .hero-text { display: block; }
  .hero-title {
    display: block;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }
  .hero-sub {
    display: block;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 3px;
  }
  .hero-arrow {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .resume {
    margin-top: 14px;
    border: none;
    border-radius: 20px;
    padding: 18px;
    background: var(--surface);
    box-shadow: var(--shadow-md);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: var(--text);
    transition: transform var(--transition-fast);
  }
  .resume:active { transform: scale(0.99); }
  .resume:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .resume-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
  }
  .resume-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--success);
  }
  .resume-cta {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--primary);
  }
  .resume-meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .elapsed {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.4px;
    font-variant-numeric: tabular-nums;
  }
  .since {
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .window {
    margin-top: 12px;
    height: 4px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
  }
  .window-fill {
    height: 100%;
    background: var(--primary);
    transition: width var(--transition-base);
  }

  .discard {
    margin-top: 8px;
    background: transparent;
    color: var(--text-muted);
    font-size: 13px;
    padding: 8px;
    cursor: pointer;
    align-self: flex-end;
  }
  .discard:hover { color: var(--danger); }

  .spacer { flex: 1; min-height: 24px; }

  .footer-links {
    display: flex;
    margin-bottom: 8px;
  }
  .footer-link {
    flex: 1;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 0;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
  }
  .footer-link + .footer-link {
    border-left: 1px solid var(--border);
  }
  .footer-link:hover { color: var(--text); }
</style>

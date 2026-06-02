<script lang="ts">
  import { push } from "svelte-spa-router";
  import Logo from "$lib/components/Logo.svelte";
  import { hasPatientInProgress, preData, hoursSince, clearPatient } from "$lib/stores/patient";
  import { clearSelection } from "$lib/stores/trialSelection";
  import { fmtHoursAsClock } from "$lib/utils/time";
  import { t, locale, cycleLocale } from "$lib/i18n";
  import { pendingQuestion } from "$lib/stores/assistantAsk";

  function startNew() {
    clearPatient();
    clearSelection();
    push("/workflow");
  }
  function resume() { push("/workflow"); }
  function goCatalog() { push("/trials"); }
  function goPast() { push("/saved"); }
  function ask(q = "") {
    pendingQuestion.set(q);
    push("/assistant");
  }

  const ltswHours = $derived(hoursSince($preData.ltswDate) ?? $preData.ltsw);
  const elapsedLabel = $derived(fmtHoursAsClock(ltswHours));
  const windowFrac = $derived(
    ltswHours !== undefined ? Math.min(1, (ltswHours * 60) / (4.5 * 60)) : 0
  );
</script>

<div class="home">
  <!-- Banda gradiente: assistente in primo piano -->
  <section class="band">
    <div class="band-glow" aria-hidden="true"></div>
    <div class="band-top">
      <span class="brand">
        <span class="logo-tile"><Logo size={17} variant="white" /></span>
        <span class="brand-name">Eligo</span>
      </span>
      <button class="lang" type="button" onclick={cycleLocale} aria-label="{$t.common.language}: {$locale.toUpperCase()}">
        {$locale.toUpperCase()}
      </button>
    </div>

    <h1 class="hero-title">{$t.landing.assistantHeroTitle}</h1>

    <button class="ask" type="button" onclick={() => ask()}>
      <span class="ask-text">{$t.landing.askCta}</span>
      <span class="ask-send" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </span>
    </button>

    <div class="chips">
      {#each $t.landing.suggestions as s (s)}
        <button class="chip" type="button" onclick={() => ask(s)}>{s}</button>
      {/each}
    </div>
  </section>

  <!-- Corpo -->
  <div class="body">
    <button class="np ens-press" type="button" onclick={startNew}>
      <span class="np-text">
        <span class="np-title">{$t.landing.newPatient}</span>
        <span class="np-sub">{$t.landing.newPatientDesc}</span>
      </span>
      <span class="np-arrow" aria-hidden="true">
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
            <span>{$t.extras.activeSession}</span>
          </span>
          <span class="resume-cta">{$t.landing.resume} →</span>
        </div>
        <div class="resume-meta">
          <span class="elapsed">{elapsedLabel}</span>
          <span class="since">{$t.extras.sinceLtsw}</span>
        </div>
        <div class="window">
          <div class="window-fill" style="width: {Math.round(windowFrac * 100)}%"></div>
        </div>
      </button>
      <button class="discard" type="button" onclick={() => { clearPatient(); clearSelection(); }}>
        {$t.landing.discard}
      </button>
    {/if}
  </div>

  <!-- Utility -->
  <div class="util">
    <button class="util-link" type="button" onclick={goCatalog}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      <span>{$t.landing.catalogTitle}</span>
    </button>
    <button class="util-link" type="button" onclick={goPast}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      </svg>
      <span>{$t.landing.pastPatients}</span>
    </button>
  </div>
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    min-height: calc(100dvh - var(--bottom-nav-h) - 28px);
  }

  /* ---- banda gradiente ---- */
  .band {
    position: relative;
    overflow: hidden;
    background: var(--grad-hero);
    color: #fff;
    padding: calc(env(safe-area-inset-top, 14px) + 38px) 24px 26px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
  .band-glow {
    position: absolute;
    top: -40px;
    right: -30px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
  .band-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .logo-tile {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .lang {
    color: rgba(255, 255, 255, 0.85);
    font-size: 12.5px;
    font-weight: 600;
    font-family: var(--font-mono);
    padding: 6px;
    cursor: pointer;
    border-radius: 6px;
    min-height: 32px;
  }
  .lang:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6); }

  .hero-title {
    position: relative;
    font-family: var(--font-display);
    font-size: 23px;
    font-weight: 700;
    letter-spacing: -0.4px;
    line-height: 1.18;
    margin: 22px 0 0;
    color: #fff;
    white-space: pre-line;
  }

  .ask {
    position: relative;
    margin-top: 18px;
    width: 100%;
    background: #fff;
    border: none;
    border-radius: 17px;
    padding: 6px 6px 6px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 14px 30px rgba(15, 33, 42, 0.22);
    cursor: pointer;
    font-family: inherit;
  }
  .ask-text {
    flex: 1;
    text-align: left;
    font-size: 14.5px;
    color: var(--text-muted);
  }
  .ask-send {
    width: 40px;
    height: 40px;
    border-radius: 13px;
    background: var(--primary);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ask:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6); }

  .chips {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 13px;
  }
  .chip {
    font-size: 12.5px;
    font-weight: 500;
    color: #fff;
    background: rgba(255, 255, 255, 0.18);
    border: none;
    border-radius: 999px;
    padding: 7px 12px;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  }
  .chip:active { transform: scale(0.97); }
  .chip:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7); }

  /* ---- corpo ---- */
  .body {
    padding: 20px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .np {
    border: none;
    cursor: pointer;
    border-radius: 22px;
    padding: 22px;
    background: var(--primary);
    color: #fff;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: var(--shadow-hero);
    font-family: inherit;
    transition: transform var(--transition-fast), filter var(--transition-fast);
  }
  .np:active { transform: scale(0.99); filter: brightness(0.97); }
  .np:focus-visible { outline: none; box-shadow: var(--focus-ring), var(--shadow-hero); }
  .np-title { display: block; font-size: 19px; font-weight: 600; letter-spacing: -0.3px; }
  .np-sub { display: block; font-size: 13px; color: rgba(255, 255, 255, 0.82); margin-top: 3px; }
  .np-arrow {
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
    border: none;
    border-radius: 20px;
    padding: 16px;
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
  .resume-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; }
  .resume-status { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
  .dot { width: 7px; height: 7px; border-radius: 999px; background: var(--success); }
  .resume-cta { font-size: 13.5px; font-weight: 600; color: var(--primary); }
  .resume-meta { display: flex; align-items: baseline; gap: 8px; }
  .elapsed { font-family: var(--font-mono); font-size: 23px; font-weight: 500; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; }
  .since { font-size: 12.5px; color: var(--text-muted); }
  .window { margin-top: 12px; height: 4px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .window-fill { height: 100%; background: var(--primary); transition: width var(--transition-base); }
  .discard { background: transparent; color: var(--text-muted); font-size: 13px; padding: 4px 8px; cursor: pointer; align-self: flex-end; }
  .discard:hover { color: var(--danger); }

  /* ---- utility ---- */
  .util {
    margin-top: auto;
    padding: 16px 24px 8px;
    display: flex;
  }
  .util-link {
    flex: 1;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 0;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
  }
  .util-link + .util-link { border-left: 1px solid var(--border); }
  .util-link:hover { color: var(--text); }
  .util-link:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: 8px; }
</style>

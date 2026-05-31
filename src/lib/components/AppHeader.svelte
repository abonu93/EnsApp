<script lang="ts">
  // Page header con back + opzionale step indicator + title + sub.
  // Sostituisce il layout precedente per le route che sono "pagine di flusso".
  import { pop } from "svelte-spa-router";

  interface Props {
    title?: string;
    sub?: string;
    step?: number;
    steps?: number;
    onBack?: () => void;
    onClose?: () => void;
  }

  let { title = "", sub = "", step, steps, onBack, onClose }: Props = $props();

  function handleBack() {
    if (onBack) onBack();
    else pop();
  }
</script>

<div class="hdr">
  <div class="row">
    <button class="iconbtn" type="button" onclick={handleBack} aria-label="Indietro">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div class="spacer"></div>
    {#if step != null && steps}
      <div class="dots" role="progressbar" aria-valuemin={1} aria-valuemax={steps} aria-valuenow={step + 1}>
        {#each Array(steps) as _, i (i)}
          <span class="dot" class:done={i <= step} class:current={i === step}></span>
        {/each}
      </div>
    {/if}
    {#if onClose}
      <button class="iconbtn" type="button" onclick={onClose} aria-label="Chiudi">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    {/if}
  </div>
  {#if title}
    <div class="titles">
      <h1>{title}</h1>
      {#if sub}<p class="sub">{sub}</p>{/if}
    </div>
  {/if}
</div>

<style>
  .hdr {
    padding: 12px 16px 12px;
    background: var(--bg);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .iconbtn {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    background: var(--surface-elevated);
    box-shadow: var(--shadow-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    cursor: pointer;
    flex-shrink: 0;
    transition: transform var(--transition-fast), background var(--transition-fast);
  }
  .iconbtn:active { transform: scale(0.95); }
  .iconbtn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .spacer { flex: 1; }
  .dots {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--border);
    transition: width var(--transition-base), background var(--transition-base);
  }
  .dot.done { background: var(--primary); }
  .dot.current { width: 18px; }
  .titles {
    padding-left: 4px;
  }
  .titles h1 {
    font-size: 25px;
    font-weight: 600;
    letter-spacing: -0.6px;
    margin: 0;
    color: var(--text);
    line-height: 1.2;
  }
  .sub {
    font-size: 13.5px;
    color: var(--text-muted);
    margin: 4px 0 0;
  }
</style>

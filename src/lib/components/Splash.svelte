<script lang="ts">
  // Splash screen Eligo: 2 cerchi che convergono + lens pop + ring pulse
  // + wordmark Hanken con letter-spacing animato + tagline mono.
  // Auto-dismiss dopo ~2.25s. Tap per skip.
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";

  interface Props {
    onDone?: () => void;
  }
  let { onDone }: Props = $props();

  let out = $state(false);

  onMount(() => {
    const t1 = setTimeout(() => (out = true), 1750);
    const t2 = setTimeout(() => onDone?.(), 2250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  });

  function skip() {
    out = true;
    setTimeout(() => onDone?.(), 380);
  }
</script>

<div
  class="splash"
  class:splash-out={out}
  onclick={skip}
  onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") skip(); }}
  role="button"
  tabindex="-1"
  aria-label="Skip splash"
>
  <div class="mark-wrap">
    <div class="ring"></div>
    <svg width="132" height="132" viewBox="0 0 24 24" fill="none" class="mark">
      <path
        class="lens"
        d="M12 7.45 A5.25 5.25 0 0 1 12 16.55 A5.25 5.25 0 0 1 12 7.45 Z"
        fill="#fff"
        fill-opacity="0.95"
      />
      <circle class="circle-left" cx="9.375" cy="12" r="5.25" stroke="#fff" stroke-width="2.1" />
      <circle class="circle-right" cx="14.625" cy="12" r="5.25" stroke="#fff" stroke-width="2.1" stroke-opacity="0.82" />
    </svg>
  </div>
  <div class="text">
    <div class="word">{$t.common.appName}</div>
    <div class="tag">TRIAL ELIGIBILITY, IN SECONDS</div>
  </div>
</div>

<style>
  .splash {
    position: fixed;
    inset: 0;
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 26px;
    cursor: pointer;
    background: radial-gradient(120% 110% at 50% 16%, var(--primary) 0%, var(--primary-hover) 78%);
    color: #fff;
  }
  .splash-out {
    animation: ens-sp-out 0.45s ease 0.15s both;
  }
  @keyframes ens-sp-out {
    0% { opacity: 1; }
    100% { opacity: 0; visibility: hidden; }
  }

  .mark-wrap {
    position: relative;
    width: 132px;
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring {
    position: absolute;
    width: 86px;
    height: 86px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.55);
    animation: ens-sp-ring 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) 0.62s both;
  }
  @keyframes ens-sp-ring {
    0% { opacity: 0.5; transform: scale(0.6); }
    100% { opacity: 0; transform: scale(1.6); }
  }

  .mark { position: relative; }
  .lens {
    transform-origin: center;
    animation: ens-sp-lens 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.5) 0.58s both;
  }
  @keyframes ens-sp-lens {
    0% { opacity: 0; transform: scale(0.4); }
    60% { transform: scale(1.12); }
    100% { opacity: 1; transform: scale(1); }
  }
  .circle-left {
    transform-origin: center;
    animation: ens-sp-left 0.62s cubic-bezier(0.2, 0.85, 0.25, 1) 0.05s both;
  }
  @keyframes ens-sp-left {
    0% { transform: translateX(38px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .circle-right {
    transform-origin: center;
    animation: ens-sp-right 0.62s cubic-bezier(0.2, 0.85, 0.25, 1) 0.05s both;
  }
  @keyframes ens-sp-right {
    0% { transform: translateX(-38px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  .text { text-align: center; }
  .word {
    font-family: var(--font-display);
    font-size: 42px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    animation: ens-sp-word 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) 0.72s both;
  }
  @keyframes ens-sp-word {
    0% { opacity: 0; transform: translateY(12px); letter-spacing: 0.12em; }
    100% { opacity: 1; transform: translateY(0); letter-spacing: -0.045em; }
  }
  .tag {
    font-family: var(--font-mono);
    font-size: 11.5px;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 12px;
    text-transform: uppercase;
    animation: ens-sp-tag 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.92s both;
  }
  @keyframes ens-sp-tag {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 0.9; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .splash {
      animation: ens-sp-out 0.3s ease 0.8s both;
    }
    .ring,
    .lens,
    .circle-left,
    .circle-right,
    .word,
    .tag {
      animation: none !important;
      opacity: 1;
    }
  }
</style>

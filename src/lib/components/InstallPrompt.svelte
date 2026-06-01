<script lang="ts">
  // Bottone "Installa Eligo" che cattura beforeinstallprompt di Chrome.
  // Su iOS Safari non c'e' questo evento: mostra un hint per "Aggiungi alla
  // schermata Home". Si nasconde se l'app gia gira in standalone.
  import { onMount, onDestroy } from "svelte";

  type BIP = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  };

  let deferred = $state<BIP | null>(null);
  let isStandalone = $state(false);
  let isIos = $state(false);
  let showIosHint = $state(false);
  let dismissed = $state(false);

  function handleBeforeInstall(e: Event) {
    e.preventDefault();
    deferred = e as BIP;
  }
  function handleInstalled() {
    deferred = null;
    isStandalone = true;
  }

  onMount(() => {
    if (typeof window === "undefined") return;
    // gia in standalone? niente prompt
    const mql = window.matchMedia("(display-mode: standalone)");
    isStandalone = mql.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    // iOS Safari sniff
    isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator as Navigator & { MSStream?: unknown }).MSStream;

    // Hide se gia dismesso in questa sessione
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("eligo:installPromptDismissed")) {
      dismissed = true;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    window.removeEventListener("appinstalled", handleInstalled);
  });

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
  }

  function close() {
    dismissed = true;
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("eligo:installPromptDismissed", "1");
    }
  }

  function showIosInstructions() {
    showIosHint = true;
  }

  const show = $derived(!isStandalone && !dismissed && (deferred !== null || (isIos && !showIosHint)));
</script>

{#if show}
  <div class="bar" role="region" aria-label="Install app">
    {#if deferred}
      <button class="btn primary" type="button" onclick={install}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Installa Eligo
      </button>
    {:else if isIos}
      <button class="btn" type="button" onclick={showIosInstructions}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
        Aggiungi alla Home
      </button>
    {/if}
    <button class="close" type="button" onclick={close} aria-label="Chiudi">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
{/if}

{#if showIosHint}
  <div class="modal-bg" onclick={() => (showIosHint = false)} role="presentation">
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ios-title">
      <h3 id="ios-title">Aggiungi Eligo alla Home</h3>
      <ol>
        <li>Tap sull'icona <strong>Condividi</strong> in basso (□ con freccia su)</li>
        <li>Scorri e tap <strong>"Aggiungi alla schermata Home"</strong></li>
        <li>Tap <strong>Aggiungi</strong> in alto a destra</li>
      </ol>
      <button class="btn primary" type="button" onclick={() => (showIosHint = false)}>OK</button>
    </div>
  </div>
{/if}

<style>
  .bar {
    position: fixed;
    top: env(safe-area-inset-top, 0);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-toast);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px 8px 16px;
    background: var(--surface);
    box-shadow: var(--shadow-md);
    border-radius: 999px;
    margin-top: 8px;
    animation: ens-rise 320ms cubic-bezier(.2, .8, .2, 1) both;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 999px;
    background: var(--surface);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn.primary {
    background: var(--primary);
    color: var(--text-inverted);
    box-shadow: 0 4px 12px rgba(79, 143, 188, 0.32);
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: transparent;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .close:hover { background: var(--bg); color: var(--text); }

  .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(15, 33, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: 20px;
    animation: ens-fade 200ms ease both;
  }
  .modal {
    background: var(--surface);
    border-radius: 18px;
    padding: 22px;
    max-width: 360px;
    width: 100%;
    box-shadow: var(--shadow-lg);
  }
  .modal h3 {
    font-family: var(--font-display);
    font-weight: 800;
    margin: 0 0 14px;
    color: var(--text);
  }
  .modal ol {
    margin: 0 0 18px;
    padding-left: 22px;
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.7;
  }
  .modal ol strong { color: var(--text); }
  .modal .btn.primary {
    width: 100%;
    justify-content: center;
    padding: 14px;
    font-size: 15px;
  }
</style>

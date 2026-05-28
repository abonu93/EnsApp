<script lang="ts">
  import type { Snippet } from "svelte";
  import { focusTrap } from "$lib/a11y/focusTrap";

  interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let { open, title, onClose, children, footer }: Props = $props();
  let dialog: HTMLDivElement | null = $state(null);
  let trap: ReturnType<typeof focusTrap> | null = null;

  $effect(() => {
    if (open && dialog) {
      trap = focusTrap(dialog, { onEscape: onClose });
      document.body.style.overflow = "hidden";
      return () => {
        trap?.destroy();
        trap = null;
        document.body.style.overflow = "";
      };
    }
  });

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }
</script>

{#if open}
  <div
    class="backdrop"
    onclick={onBackdrop}
    role="presentation"
  >
    <div
      bind:this={dialog}
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <header class="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button class="close" onclick={onClose} aria-label="Chiudi">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>
      <div class="modal-body">{@render children()}</div>
      {#if footer}
        <footer class="modal-footer">{@render footer()}</footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    z-index: var(--z-modal);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: var(--sp-4);
    animation: fade-in var(--transition-base);
  }

  @media (min-width: 640px) {
    .backdrop {
      align-items: center;
    }
  }

  .dialog {
    background: var(--surface-elevated);
    color: var(--text);
    border-radius: var(--radius-xl) var(--radius-xl) var(--radius-md) var(--radius-md);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 520px;
    max-height: calc(100dvh - var(--sp-8));
    display: flex;
    flex-direction: column;
    animation: slide-up var(--transition-base);
  }

  @media (min-width: 640px) {
    .dialog {
      border-radius: var(--radius-xl);
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    padding: var(--sp-4);
    border-bottom: 1px solid var(--border);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--fs-lg);
    color: var(--text);
  }

  .close {
    width: var(--touch-min);
    height: var(--touch-min);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--text-muted);
    transition: background var(--transition-fast);
  }

  .close:hover {
    background: var(--surface);
    color: var(--text);
  }

  .modal-body {
    padding: var(--sp-4);
    overflow-y: auto;
    flex: 1;
  }

  .modal-footer {
    padding: var(--sp-4);
    border-top: 1px solid var(--border);
    display: flex;
    gap: var(--sp-2);
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { transform: translateY(40px); opacity: 0.5; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop, .dialog {
      animation: none;
    }
  }
</style>

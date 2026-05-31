<script lang="ts">
  // Bottom-sheet generico: backdrop + pannello che sale dal fondo.
  // Usato da CalendarSheet (e qualsiasi altro picker mobile-first).
  import type { Snippet } from "svelte";
  import { focusTrap } from "$lib/a11y/focusTrap";

  interface Props {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: Snippet;
  }

  let { open, title = "", onClose, children }: Props = $props();
  let panel: HTMLDivElement | null = $state(null);
  let trap: ReturnType<typeof focusTrap> | null = null;

  $effect(() => {
    if (open && panel) {
      trap = focusTrap(panel, { onEscape: onClose });
      document.body.style.overflow = "hidden";
      return () => {
        trap?.destroy();
        trap = null;
        document.body.style.overflow = "";
      };
    }
  });
</script>

{#if open}
  <div class="backdrop ens-fade" onclick={onClose} role="presentation">
    <div
      bind:this={panel}
      class="panel ens-sheet-up"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="grip" aria-hidden="true"></div>
      {#if title}<div class="title">{title}</div>{/if}
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: rgba(14, 23, 38, 0.32);
  }
  .panel {
    position: relative;
    background: var(--surface);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 10px 16px calc(30px + env(safe-area-inset-bottom, 0));
    max-height: 76vh;
    overflow: auto;
    color: var(--text);
  }
  .grip {
    width: 38px;
    height: 5px;
    border-radius: 999px;
    background: var(--border);
    margin: 0 auto 14px;
  }
  .title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-left: 4px;
  }
</style>

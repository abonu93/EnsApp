<script lang="ts">
  // Bottom-sheet generico: backdrop + pannello che sale dal fondo.
  // Usato da CalendarSheet (e qualsiasi altro picker mobile-first).
  import type { Snippet } from "svelte";
  import { focusTrap } from "$lib/a11y/focusTrap";
  import { portal } from "$lib/actions/portal";
  import { t } from "$lib/i18n";

  interface Props {
    open: boolean;
    title?: string;
    /** Nome accessibile quando il titolo e' disegnato dentro il contenuto. */
    ariaLabel?: string;
    /** Foglio alto (88%) per liste lunghe. */
    tall?: boolean;
    onClose: () => void;
    children: Snippet;
  }

  let { open, title = "", ariaLabel = "", tall = false, onClose, children }: Props = $props();
  let panel: HTMLDivElement | null = $state(null);
  let trap: ReturnType<typeof focusTrap> | null = null;

  // Trascinare giu' la barra in alto chiude il foglio (oltre 90 px).
  let dragY = $state(0);
  let startY: number | null = null;
  function dragStart(e: PointerEvent) {
    if (e.pointerType === "touch") return; // il touch e' gestito su tutto il foglio
    startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function dragMove(e: PointerEvent) {
    if (startY !== null) dragY = Math.max(0, e.clientY - startY);
  }
  function dragEnd() {
    if (startY === null) return;
    startY = null;
    if (dragY > 90) onClose();
    dragY = 0;
  }

  // Swipe verso il basso ovunque sul foglio (quando il contenuto e' in cima):
  // segue il dito e oltre 90 px chiude. Non interferisce con slider e campi.
  $effect(() => {
    const el = panel;
    if (!open || !el) return;
    let y0: number | null = null;
    let x0 = 0;
    let dragging = false;
    const skip = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("input, select, textarea, [data-no-swipe]");
    const start = (e: TouchEvent) => {
      if (el.scrollTop > 0 || skip(e.target)) { y0 = null; return; }
      y0 = e.touches[0].clientY;
      x0 = e.touches[0].clientX;
      dragging = false;
    };
    const move = (e: TouchEvent) => {
      if (y0 === null) return;
      const dy = e.touches[0].clientY - y0;
      const dx = Math.abs(e.touches[0].clientX - x0);
      if (!dragging) {
        if (dy > 8 && dy > dx && el.scrollTop <= 0) dragging = true;
        else if (dy < -4 || dx > 12) { y0 = null; return; }
      }
      if (dragging) {
        e.preventDefault();
        dragY = Math.max(0, dy);
      }
    };
    const end = () => {
      if (dragging && dragY > 90) onClose();
      y0 = null;
      dragging = false;
      dragY = 0;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  });

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
  <div class="backdrop ens-fade" onclick={onClose} role="presentation" use:portal>
    <div
      bind:this={panel}
      class="panel ens-sheet-up"
      class:tall
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      style={dragY ? `transform: translateY(${dragY}px); transition: none` : ""}
    >
      <div
        class="top"
        role="presentation"
        onpointerdown={dragStart}
        onpointermove={dragMove}
        onpointerup={dragEnd}
        onpointercancel={dragEnd}
      >
        <div class="grip" aria-hidden="true"></div>
        <button type="button" class="close" aria-label={$t.common.close} onclick={onClose} onpointerdown={(e) => e.stopPropagation()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
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
    max-height: 76dvh;
    overflow: auto;
    color: var(--text);
  }
  .panel.tall {
    max-height: 88vh;
    max-height: 88dvh;
  }
  .top {
    position: sticky;
    top: -10px;
    z-index: 1;
    margin: -10px -16px 6px;
    padding: 10px 16px 4px;
    height: 44px;
    background: var(--surface);
    touch-action: none;
    cursor: grab;
  }
  .grip {
    width: 38px;
    height: 5px;
    border-radius: 999px;
    background: var(--border-strong);
    margin: 0 auto;
  }
  .close {
    position: absolute;
    top: 6px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    background: var(--surface-elevated);
    cursor: pointer;
  }
  .close:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-left: 4px;
  }
</style>

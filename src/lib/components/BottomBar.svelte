<script lang="ts">
  import { t } from "$lib/i18n";

  interface Props {
    onBack?: () => void;
    onNext?: () => void;
    nextLabel?: string;
    backLabel?: string;
    nextDisabled?: boolean;
  }

  let { onBack, onNext, nextLabel = "", backLabel = "", nextDisabled = false }: Props = $props();
</script>

<div class="bar">
  {#if onBack}
    <button class="btn back" type="button" onclick={onBack}>
      {backLabel || $t.common.back}
    </button>
  {/if}
  <button
    class="btn next"
    class:disabled={nextDisabled}
    type="button"
    disabled={nextDisabled}
    onclick={() => !nextDisabled && onNext && onNext()}
  >
    {nextLabel || $t.common.next}
  </button>
</div>

<style>
  .bar {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
    padding: 12px 16px calc(28px + env(safe-area-inset-bottom, 0));
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .btn {
    border: none;
    border-radius: 14px;
    padding: 15px 18px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background var(--transition-base), transform var(--transition-fast);
  }
  .btn:active:not(:disabled) { transform: scale(0.98); }
  .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .back {
    flex: 0 0 auto;
    min-width: 96px;
    background: var(--surface-elevated);
    box-shadow: var(--shadow-sm);
    color: var(--text-muted);
  }
  .next {
    flex: 1;
    background: var(--primary);
    color: var(--text-inverted);
    box-shadow: 0 6px 16px rgba(45, 91, 215, 0.28);
  }
  .next.disabled,
  .next:disabled {
    background: var(--border-strong);
    box-shadow: none;
    cursor: not-allowed;
  }
</style>

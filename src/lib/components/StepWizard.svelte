<script lang="ts">
  // Container per form multi-step (mobile-first). Mostra ProgressBar interno,
  // sticky header con titolo step, e CTA "Indietro" / "Avanti" full-width.
  import type { Snippet } from "svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import Button from "./Button.svelte";

  interface Props {
    steps: string[];
    current: number;
    canGoNext: boolean;
    nextLabel?: string;
    onPrev: () => void;
    onNext: () => void;
    children: Snippet;
  }

  let {
    steps,
    current,
    canGoNext,
    nextLabel = "Avanti",
    onPrev,
    onNext,
    children,
  }: Props = $props();

  const isFirst = $derived(current === 0);
  const isLast = $derived(current === steps.length - 1);
</script>

<div class="wizard">
  <ProgressBar {steps} {current} />
  <div class="wizard-body">{@render children()}</div>
  <div class="wizard-actions">
    <Button variant="secondary" fullWidth onclick={onPrev} disabled={isFirst}>{"<"}</Button>
    <Button variant="primary" fullWidth onclick={onNext} disabled={!canGoNext}>
      {isLast ? "Conferma" : nextLabel}
    </Button>
  </div>
</div>

<style>
  .wizard {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .wizard-body {
    flex: 1;
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .wizard-actions {
    position: sticky;
    bottom: 0;
    background: var(--surface-elevated);
    border-top: 1px solid var(--border);
    padding: var(--sp-3) var(--sp-4) calc(var(--sp-3) + env(safe-area-inset-bottom, 0));
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-2);
  }
</style>

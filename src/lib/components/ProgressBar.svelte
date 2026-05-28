<script lang="ts">
  interface Props {
    steps: string[];
    current: number;
    /** Index della tappa da considerare "completata" (default = current - 1). */
    completedThrough?: number;
  }

  let { steps, current, completedThrough }: Props = $props();
  const completed = $derived(completedThrough ?? current - 1);
</script>

<nav
  class="progress"
  role="progressbar"
  aria-valuemin={1}
  aria-valuemax={steps.length}
  aria-valuenow={current + 1}
  aria-label={`Step ${current + 1} di ${steps.length}: ${steps[current]}`}
>
  <ol class="steps">
    {#each steps as label, i (label)}
      {@const isCurrent = i === current}
      {@const isDone = i <= completed}
      <li class="step" class:current={isCurrent} class:done={isDone}>
        <span class="circle" aria-hidden="true">
          {#if isDone && !isCurrent}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          {:else}
            {i + 1}
          {/if}
        </span>
        <span class="lbl">{label}</span>
      </li>
    {/each}
  </ol>
</nav>

<style>
  .progress {
    background: var(--surface);
    border-block: 1px solid var(--border);
    padding: var(--sp-3) var(--sp-4);
  }

  .steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-2);
    position: relative;
  }

  .step {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sp-1);
    min-width: 0;
    position: relative;
  }

  .step:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 14px;
    left: calc(50% + 16px);
    right: calc(-50% + 16px);
    height: 2px;
    background: var(--border-strong);
  }

  .step.done:not(:last-child)::after {
    background: var(--primary);
  }

  .circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--surface-elevated);
    border: 2px solid var(--border-strong);
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--fw-semibold);
    font-size: var(--fs-sm);
    z-index: 1;
    transition: all var(--transition-fast);
  }

  .step.done .circle {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--text-inverted);
  }

  .step.current .circle {
    box-shadow: 0 0 0 4px var(--primary-soft);
  }

  .lbl {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .step.current .lbl,
  .step.done .lbl {
    color: var(--text);
    font-weight: var(--fw-medium);
  }

  @media (max-width: 380px) {
    .lbl {
      display: none;
    }
  }
</style>

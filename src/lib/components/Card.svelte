<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    padded?: boolean;
    children: Snippet;
    actions?: Snippet;
  }

  let { title = "", subtitle = "", padded = true, children, actions }: Props = $props();
</script>

<section class="card" class:padded>
  {#if title || subtitle || actions}
    <header class="card-header">
      <div>
        {#if title}<h3 class="card-title">{title}</h3>{/if}
        {#if subtitle}<p class="card-subtitle">{subtitle}</p>{/if}
      </div>
      {#if actions}<div class="card-actions">{@render actions()}</div>{/if}
    </header>
  {/if}
  <div class="card-body">{@render children()}</div>
</section>

<style>
  .card {
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .card.padded .card-header,
  .card.padded .card-body {
    padding: var(--sp-4);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-3);
    border-bottom: 1px solid var(--border);
  }

  .card-title {
    font-size: var(--fs-lg);
    font-weight: var(--fw-semibold);
    margin: 0;
    color: var(--text);
  }

  .card-subtitle {
    margin: 4px 0 0;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  .card-actions {
    display: flex;
    gap: var(--sp-2);
    flex-shrink: 0;
  }
</style>

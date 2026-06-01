<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    children: Snippet;
    actions?: Snippet;
    padded?: boolean;
  }

  let { title = "", subtitle = "", children, actions, padded = true }: Props = $props();
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
    background: var(--surface);
    border-radius: 18px;
    box-shadow: var(--shadow-md);
    overflow: hidden;
  }
  .card.padded .card-body { padding: 16px; }
  .card.padded .card-header {
    padding: 16px 16px 0;
  }
  .card.padded .card-header + .card-body { padding-top: 12px; }
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .card-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
    margin: 0;
    color: var(--text);
  }
  .card-subtitle {
    margin: 3px 0 0;
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }
  .card-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
</style>

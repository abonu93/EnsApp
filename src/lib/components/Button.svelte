<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Variant = "primary" | "secondary" | "ghost" | "danger";
  type Size = "md" | "lg";

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
    children: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    type = "button",
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class="btn btn-{variant} btn-{size}"
  class:full={fullWidth}
  class:loading
  disabled={disabled || loading}
  aria-busy={loading || undefined}
  {...rest}
>
  {#if loading}
    <span class="spinner" aria-hidden="true"></span>
  {/if}
  <span class="label"><!---->{@render children()}</span>
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-2);
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-5);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    font-weight: var(--fw-semibold);
    font-size: var(--fs-base);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition:
      background var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast);
    user-select: none;
  }

  .btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .btn:not(:disabled):active {
    transform: scale(0.98);
  }

  .btn-lg {
    min-height: 56px;
    padding-inline: var(--sp-6);
    font-size: var(--fs-lg);
  }

  .full {
    width: 100%;
  }

  .btn-primary {
    background: var(--primary);
    color: var(--text-inverted);
  }
  .btn-primary:not(:disabled):hover {
    background: var(--primary-hover);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text);
    border-color: var(--border-strong);
  }
  .btn-secondary:not(:disabled):hover {
    background: var(--primary-soft);
    border-color: var(--primary);
    color: var(--primary);
  }

  .btn-ghost {
    background: transparent;
    color: var(--primary);
  }
  .btn-ghost:not(:disabled):hover {
    background: var(--primary-soft);
  }

  .btn-danger {
    background: var(--danger);
    color: var(--text-inverted);
  }
  .btn-danger:not(:disabled):hover {
    filter: brightness(0.92);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-top-color: transparent;
    animation: spin 600ms linear infinite;
  }

  .loading .label {
    opacity: 0.6;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
  }
</style>

<script lang="ts">
  import type { Snippet } from "svelte";

  type Tone = "neutral" | "primary" | "success" | "danger" | "warn" | "info" | "ischemic" | "hemorrhagic" | "post-acute";

  interface Props {
    tone?: Tone;
    children: Snippet;
  }

  let { tone = "neutral", children }: Props = $props();
</script>

<span class="pill pill-{tone}">{@render children()}</span>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    padding: var(--sp-1) var(--sp-3);
    border-radius: var(--radius-pill);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    line-height: 1.3;
    white-space: nowrap;
  }

  .pill-neutral {
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .pill-primary {
    background: var(--primary-soft);
    color: var(--primary);
  }
  .pill-success {
    background: var(--success-soft);
    color: var(--success);
  }
  .pill-danger {
    background: var(--danger-soft);
    color: var(--danger);
  }
  .pill-warn {
    background: var(--warn-soft);
    color: var(--warn);
  }
  .pill-info {
    background: var(--info-soft);
    color: var(--info);
  }
  .pill-ischemic {
    background: var(--ischemic-soft);
    color: var(--ischemic-text);
  }
  .pill-hemorrhagic {
    background: var(--hemorrhagic-soft);
    color: var(--hemorrhagic-text);
  }
  .pill-post-acute {
    background: var(--post-acute-soft);
    color: var(--post-acute-text);
  }
</style>

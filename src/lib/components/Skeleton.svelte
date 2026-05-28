<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
    radius?: string;
    inline?: boolean;
  }

  let {
    width = "100%",
    height = "1rem",
    radius = "var(--radius-sm)",
    inline = false,
  }: Props = $props();
</script>

<span
  class="skeleton"
  class:inline
  style="width: {width}; height: {height}; border-radius: {radius};"
  aria-hidden="true"
></span>

<style>
  .skeleton {
    display: block;
    background: linear-gradient(
      90deg,
      var(--surface) 0%,
      var(--border) 50%,
      var(--surface) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  .skeleton.inline {
    display: inline-block;
    vertical-align: middle;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton {
      animation: none;
      background: var(--border);
    }
  }
</style>

<script lang="ts">
  // Eligo logo mark: due cerchi sovrapposti con lens filled.
  // Variant: "white" (su sfondo cobalt brand) | "color" (su superficie chiara)
  interface Props {
    size?: number;
    variant?: "white" | "color";
  }
  let { size = 26, variant = "white" }: Props = $props();

  const ringStroke = $derived(variant === "white" ? "#fff" : "var(--primary)");
  const lensFill = $derived(variant === "white" ? "rgba(255,255,255,0.92)" : "var(--primary-hover)");
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <!-- lens (intersection) -->
  <path d="M12 7.45 A5.25 5.25 0 0 1 12 16.55 A5.25 5.25 0 0 1 12 7.45 Z" fill={lensFill} />
  <!-- two overlapping circles -->
  <circle cx="9.375" cy="12" r="5.25" stroke={ringStroke} stroke-width="2.4" />
  <circle cx="14.625" cy="12" r="5.25" stroke={ringStroke} stroke-width="2.4" />
</svg>

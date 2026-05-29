<script lang="ts">
  // Input datetime-local per "Last Seen Well" (LTSW). Lo store salva
  // l'ISO timestamp; la conversione in ore (per le regole) avviene
  // nel derived `ltswHours` del patient store.
  import type { HTMLInputAttributes } from "svelte/elements";
  import Field from "./Field.svelte";

  interface Props extends Omit<HTMLInputAttributes, "id" | "type" | "value"> {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    /** ISO string (es. "2025-05-29T08:30") o "" */
    value: string;
  }

  let {
    id,
    label,
    hint = "",
    error = "",
    required = false,
    value = $bindable(""),
    ...rest
  }: Props = $props();
</script>

<Field {label} fieldId={id} {hint} {error} {required}>
  {#snippet children({ describedBy, invalid })}
    <input
      {id}
      type="datetime-local"
      class="input"
      class:invalid
      bind:value
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy || undefined}
      aria-required={required || undefined}
      {...rest}
    />
  {/snippet}
</Field>

<style>
  .input {
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    color: var(--text);
    font-size: var(--fs-base);
    transition: border-color var(--transition-fast);
    font-family: inherit;
  }
  .input:hover { border-color: var(--primary); }
  .invalid { border-color: var(--danger); }
</style>

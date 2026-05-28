<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import Field from "./Field.svelte";

  interface Props extends Omit<HTMLInputAttributes, "id" | "type" | "value" | "min" | "max" | "step"> {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    value: number | null;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
  }

  let {
    id,
    label,
    hint = "",
    error = "",
    required = false,
    value = $bindable<number | null>(null),
    min,
    max,
    step = 1,
    suffix = "",
    inputmode = "decimal",
    ...rest
  }: Props = $props();

  let raw = $state(value === null || value === undefined ? "" : String(value));

  $effect(() => {
    const incoming = value === null || value === undefined ? "" : String(value);
    if (incoming !== raw) raw = incoming;
  });

  function handleInput(e: Event) {
    const t = e.currentTarget as HTMLInputElement;
    raw = t.value;
    if (raw === "" || raw === "-") {
      value = null;
      return;
    }
    const n = Number(raw.replace(",", "."));
    value = Number.isNaN(n) ? null : n;
  }
</script>

<Field {label} fieldId={id} {hint} {error} {required}>
  {#snippet children({ describedBy, invalid })}
    <div class="wrap" class:invalid>
      <input
        {id}
        type="text"
        {inputmode}
        class="input"
        value={raw}
        oninput={handleInput}
        {min}
        {max}
        {step}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy || undefined}
        aria-required={required || undefined}
        {...rest}
      />
      {#if suffix}<span class="suffix" aria-hidden="true">{suffix}</span>{/if}
    </div>
  {/snippet}
</Field>

<style>
  .wrap {
    display: flex;
    align-items: stretch;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    transition: border-color var(--transition-fast);
    overflow: hidden;
  }

  .wrap:hover {
    border-color: var(--primary);
  }

  .wrap:focus-within {
    border-color: var(--primary);
  }

  .invalid {
    border-color: var(--danger);
  }

  .input {
    flex: 1;
    min-width: 0;
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: none;
    background: transparent;
    color: var(--text);
    font-size: var(--fs-base);
  }

  .input:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .suffix {
    display: flex;
    align-items: center;
    padding-inline: var(--sp-3);
    background: var(--surface);
    color: var(--text-muted);
    font-size: var(--fs-sm);
    border-left: 1px solid var(--border);
  }
</style>

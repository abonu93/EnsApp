<script lang="ts" generics="T extends string">
  import Field from "./Field.svelte";

  interface Option {
    value: T;
    label: string;
    description?: string;
  }

  interface Props {
    id: string;
    label: string;
    name: string;
    options: Option[];
    value: T | "";
    hint?: string;
    error?: string;
    required?: boolean;
    columns?: 1 | 2 | "auto";
  }

  let {
    id,
    label,
    name,
    options,
    value = $bindable<T | "">(""),
    hint = "",
    error = "",
    required = false,
    columns = "auto",
  }: Props = $props();
</script>

<Field {label} fieldId={id} {hint} {error} {required}>
  {#snippet children({ describedBy, invalid })}
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-describedby={describedBy || undefined}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      class="group cols-{columns}"
    >
      {#each options as opt (opt.value)}
        {@const optId = `${id}-${opt.value}`}
        {@const checked = value === opt.value}
        <label class="chip" class:checked for={optId}>
          <input
            id={optId}
            type="radio"
            {name}
            value={opt.value}
            checked={checked}
            onchange={() => (value = opt.value)}
            class="sr-only"
          />
          <span class="dot" aria-hidden="true">
            {#if checked}<span class="dot-inner"></span>{/if}
          </span>
          <span class="chip-text">
            <span class="chip-label">{opt.label}</span>
            {#if opt.description}<span class="chip-desc">{opt.description}</span>{/if}
          </span>
        </label>
      {/each}
    </div>
  {/snippet}
</Field>

<style>
  .group {
    display: grid;
    gap: var(--sp-2);
  }
  .cols-1 {
    grid-template-columns: 1fr;
  }
  .cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .cols-auto {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .chip {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    min-height: var(--touch-min);
    padding: var(--sp-2) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    cursor: pointer;
    transition:
      border-color var(--transition-fast),
      background var(--transition-fast);
  }

  .chip:hover {
    border-color: var(--primary);
  }

  .chip:focus-within {
    box-shadow: var(--focus-ring);
    border-color: var(--primary);
  }

  .chip.checked {
    border-color: var(--primary);
    background: var(--primary-soft);
  }

  .dot {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--transition-fast);
  }

  .chip.checked .dot {
    border-color: var(--primary);
  }

  .dot-inner {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary);
  }

  .chip-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    color: var(--text);
  }

  .chip-label {
    font-size: var(--fs-base);
    font-weight: var(--fw-medium);
  }

  .chip-desc {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
</style>

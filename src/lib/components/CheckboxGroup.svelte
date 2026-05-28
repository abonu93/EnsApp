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
    options: Option[];
    value: T[];
    hint?: string;
    error?: string;
    required?: boolean;
    columns?: 1 | 2 | "auto";
  }

  let {
    id,
    label,
    options,
    value = $bindable<T[]>([]),
    hint = "",
    error = "",
    required = false,
    columns = "auto",
  }: Props = $props();

  function toggle(v: T) {
    value = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
  }
</script>

<Field {label} fieldId={id} {hint} {error} {required}>
  {#snippet children({ describedBy, invalid })}
    <div
      role="group"
      aria-describedby={describedBy || undefined}
      data-invalid={invalid || undefined}
      class="group cols-{columns}"
    >
      {#each options as opt (opt.value)}
        {@const optId = `${id}-${opt.value}`}
        {@const checked = value.includes(opt.value)}
        <label class="chip" class:checked for={optId}>
          <input
            id={optId}
            type="checkbox"
            value={opt.value}
            checked={checked}
            onchange={() => toggle(opt.value)}
            class="sr-only"
          />
          <span class="box" aria-hidden="true">
            {#if checked}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            {/if}
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

  .box {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-strong);
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-inverted);
    transition:
      background var(--transition-fast),
      border-color var(--transition-fast);
  }

  .chip.checked .box {
    background: var(--primary);
    border-color: var(--primary);
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

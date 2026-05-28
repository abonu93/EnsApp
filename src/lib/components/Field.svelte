<script lang="ts">
  // Wrapper riusabile per qualunque input: gestisce label, help text, errore.
  // Usato da TextField / NumberField / Select / RadioGroup / CheckboxGroup.
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    fieldId: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: Snippet<[{ describedBy: string; invalid: boolean }]>;
  }

  let { label, fieldId, hint = "", error = "", required = false, children }: Props = $props();

  const hintId = $derived(`${fieldId}-hint`);
  const errorId = $derived(`${fieldId}-err`);
  const describedBy = $derived(
    [error ? errorId : "", hint ? hintId : ""].filter(Boolean).join(" ")
  );
  const invalid = $derived(Boolean(error));
</script>

<div class="field" class:invalid>
  <label for={fieldId} class="label">
    {label}
    {#if required}<span class="req" aria-hidden="true">*</span>{/if}
  </label>

  {@render children({ describedBy, invalid })}

  {#if hint && !error}
    <small id={hintId} class="hint">{hint}</small>
  {/if}
  {#if error}
    <small id={errorId} class="err" role="alert">{error}</small>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  .label {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text);
  }

  .req {
    color: var(--danger);
    margin-left: 2px;
  }

  .hint {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }

  .err {
    font-size: var(--fs-xs);
    color: var(--danger);
    font-weight: var(--fw-medium);
  }
</style>

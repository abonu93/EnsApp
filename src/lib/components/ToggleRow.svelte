<script lang="ts">
  import Switch from "./Switch.svelte";

  interface Props {
    title: string;
    sub?: string;
    checked: boolean;
    onChange?: (v: boolean) => void;
  }
  let { title, sub = "", checked = $bindable(false), onChange }: Props = $props();
</script>

<div class="row">
  <div class="text">
    <span class="t">{title}</span>
    {#if sub}<span class="s">{sub}</span>{/if}
  </div>
  <Switch bind:checked label={title} {onChange} />
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
  }
  .text { flex: 1; min-width: 0; }
  .t {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }
  .s {
    display: block;
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 1px;
  }
</style>

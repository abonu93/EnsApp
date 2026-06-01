<script lang="ts">
  // Pulsante che apre il CalendarSheet del design. Sostituisce il
  // datetime-local nativo per allinearsi al prototype.
  import CalendarSheet from "./CalendarSheet.svelte";
  import { t } from "$lib/i18n";

  interface Props {
    id: string;
    label?: string;
    /** ISO datetime string "YYYY-MM-DDTHH:MM" o "" */
    value: string;
    onChange?: (v: string) => void;
  }
  let { id, label = "", value = $bindable(""), onChange }: Props = $props();

  let open = $state(false);

  function humanAgo(dateStr: string): string {
    if (!dateStr) return "";
    const t = new Date(dateStr).getTime();
    if (Number.isNaN(t)) return "";
    const ms = Date.now() - t;
    const m = Math.max(0, Math.round(ms / 60_000));
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? `${h}h ${mm.toString().padStart(2, "0")}m` : `${mm}m`;
  }

  function fmt(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const monAbbr = d.toLocaleString(undefined, { month: "short" });
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${dd} ${monAbbr} · ${hh}:${mm}`;
  }

  function onSet(iso: string) {
    value = iso;
    onChange?.(iso);
    open = false;
  }
</script>

<button {id} type="button" class="trigger" class:filled={!!value} onclick={() => (open = true)} aria-label={label || $t.preImaging.ltswLabel}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
  <span class="text">
    {value ? fmt(value) : $t.preImaging.ltswLabel}
  </span>
  {#if value}
    <span class="ago">{humanAgo(value)}</span>
  {/if}
</button>

<CalendarSheet
  {open}
  {value}
  onClose={() => (open = false)}
  {onSet}
/>

<style>
  .trigger {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px 14px;
    background: var(--surface);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 15px;
    font-weight: 400;
    transition: border-color var(--transition-fast);
  }
  .trigger:hover { border-color: var(--primary); }
  .trigger:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .trigger:active { transform: scale(0.99); }
  .trigger.filled { color: var(--text); }
  .trigger.filled .text { font-weight: 600; }
  .text { flex: 1; text-align: left; }
  .ago {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-muted);
  }
</style>

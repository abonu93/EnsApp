<script lang="ts">
  // Avvisi da open-questions.ts (dubbi aperti, avvertenze, co-arruolamento),
  // come il riquadro del Riepilogo. Testi in inglese come il catalogo.
  import type { SelectionAlert } from "$lib/domain/open-questions";
  import { t } from "$lib/i18n";

  interface Props {
    alerts: SelectionAlert[];
    title?: string;
  }
  let { alerts, title = "" }: Props = $props();
</script>

{#if alerts.length}
  <div class="alerts" role="status">
    <h3 class="title">{title || $t.extras.selectionAlertsTitle}</h3>
    <ul lang="en">
      {#each alerts as a (a.kind + a.title)}
        <li class="alert" class:relevant={a.relevant}>
          <span class="tag">{a.kind === "coenrolment" ? $t.extras.coenrolmentTag : a.kind === "warning" ? $t.extras.warningTag : a.relevant ? $t.extras.relevantTag : $t.extras.questionTag}</span>
          <strong>{a.title}</strong>
          <span>{a.detail}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .alerts {
    border: 1px solid var(--warn);
    background: var(--warn-soft);
    border-radius: 14px;
    padding: 12px 14px;
    margin: 14px 6px 0;
  }
  .title { margin: 0 0 8px; font-size: 14px; color: var(--warn); }
  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .alert { display: flex; flex-direction: column; gap: 2px; font-size: 13px; line-height: 1.4; color: var(--text); }
  .tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); }
  .alert.relevant .tag { color: var(--danger); }
</style>

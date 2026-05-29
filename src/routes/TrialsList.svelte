<script lang="ts">
  import { link } from "svelte-spa-router";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import { filterTrials, type TrialFilter, getTrialCategory } from "$lib/domain/trials-info";

  let query = $state("");
  let filter = $state<TrialFilter>("all");

  const items = $derived(filterTrials(filter, query));

  const filters: { value: TrialFilter; label: string }[] = [
    { value: "all", label: "Tutti" },
    { value: "ischemic", label: "Ischemico" },
    { value: "hemorrhagic", label: "Emorragico" },
    { value: "post-acute", label: "Post-acuto" },
  ];

  function statusTone(status: string) {
    if (status === "active") return "success" as const;
    if (status === "paused") return "warn" as const;
    return "info" as const;
  }

  function categoryTone(name: string) {
    const cat = getTrialCategory(name);
    return cat === "ischemic" ? "ischemic" : cat === "hemorrhagic" ? "hemorrhagic" : "post-acute";
  }
</script>

<h1>Trial clinici</h1>
<p class="lead">{items.length} di {Object.keys($state.snapshot(items)).length === 0 ? "0" : "totali"}.</p>

<div class="filters">
  <TextField
    id="trials-search"
    label="Cerca"
    placeholder="nome, categoria, intervento..."
    bind:value={query}
  />
  <div class="pills" role="tablist" aria-label="Filtro categoria">
    {#each filters as f (f.value)}
      <button
        class="filter-pill"
        class:active={filter === f.value}
        type="button"
        role="tab"
        aria-selected={filter === f.value}
        onclick={() => (filter = f.value)}
      >
        {f.label}
      </button>
    {/each}
  </div>
</div>

{#if items.length === 0}
  <Card>
    {#snippet children()}
      <p class="empty">Nessun trial corrisponde ai filtri.</p>
    {/snippet}
  </Card>
{:else}
  <ul class="trial-list">
    {#each items as t (t.name)}
      <li>
        <a href={`/trial/${encodeURIComponent(t.name)}`} use:link class="trial-link">
          <Card>
            {#snippet children()}
              <div class="trial-row">
                <div class="trial-main">
                  <div class="trial-head">
                    <strong class="trial-name">{t.name}</strong>
                    <Pill tone={categoryTone(t.name)}>{#snippet children()}{getTrialCategory(t.name)}{/snippet}</Pill>
                  </div>
                  <p class="trial-cat">{t.info.category}</p>
                  <div class="trial-meta">
                    <span><strong>Window:</strong> {t.info.key.window}</span>
                    <span><strong>NIHSS:</strong> {t.info.key.nihss}</span>
                  </div>
                </div>
                <div class="trial-status">
                  <Pill tone={statusTone(t.info.status)}>{#snippet children()}{t.info.status}{/snippet}</Pill>
                  <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            {/snippet}
          </Card>
        </a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); font-size: var(--fs-sm); }
  .filters {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    margin-bottom: var(--sp-4);
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }
  .filter-pill {
    min-height: 36px;
    padding: var(--sp-1) var(--sp-3);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    background: var(--surface-elevated);
    color: var(--text);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .filter-pill:hover {
    border-color: var(--primary);
  }
  .filter-pill.active {
    background: var(--primary);
    color: var(--text-inverted);
    border-color: var(--primary);
  }
  .trial-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }
  .trial-link {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: transform var(--transition-fast);
  }
  .trial-link:hover {
    text-decoration: none;
    transform: translateY(-1px);
  }
  .trial-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-3);
  }
  .trial-main { flex: 1; min-width: 0; }
  .trial-head {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
  .trial-name { font-size: var(--fs-lg); }
  .trial-cat { margin: var(--sp-1) 0 0; font-size: var(--fs-sm); color: var(--text-muted); }
  .trial-meta {
    margin-top: var(--sp-2);
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .trial-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--sp-2);
    flex-shrink: 0;
  }
  .chev { color: var(--text-muted); }
  .empty { color: var(--text-muted); text-align: center; padding-block: var(--sp-4); }
</style>

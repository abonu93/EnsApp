<script lang="ts">
  // Pagina admin (non in navigazione): l'admin carica i PDF, genera e scarica
  // la base di conoscenza (protocols-index.json) da committare in public/.
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { t } from "$lib/i18n";
  import {
    chatDocuments,
    addDocument,
    removeDocument,
    reconcileDocuments,
    exportMergedIndex,
    type DocStatus,
  } from "$lib/stores/chatDocuments";

  let dragOver = $state(false);
  let exporting = $state(false);
  let fileInput: HTMLInputElement;

  const hasReady = $derived($chatDocuments.some((d) => d.status === "ready"));

  reconcileDocuments();

  function statusLabel(status: DocStatus): string {
    switch (status) {
      case "extracting":
        return $t.assistant.statusExtracting;
      case "indexing":
        return $t.assistant.statusIndexing;
      case "ready":
        return $t.assistant.statusReady;
      case "error":
        return $t.assistant.statusError;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        await addDocument(file);
      }
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    handleFiles(e.dataTransfer?.files ?? null);
  }

  async function exportKb() {
    exporting = true;
    try {
      const data = await exportMergedIndex();
      if (!data) return;
      const payload = JSON.stringify({ version: 1, builtAt: Date.now(), ...data });
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "protocols-index.json";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      exporting = false;
    }
  }
</script>

<AppHeader title={$t.kbAdmin.title} sub={$t.kbAdmin.subtitle} />

<div class="page">
  <div
    class="drop"
    class:over={dragOver}
    role="button"
    tabindex="0"
    onclick={() => fileInput.click()}
    onkeydown={(e) => (e.key === "Enter" || e.key === " ") && fileInput.click()}
    ondragover={(e) => {
      e.preventDefault();
      dragOver = true;
    }}
    ondragleave={() => (dragOver = false)}
    ondrop={onDrop}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
    <span class="drop-cta">{$t.assistant.uploadCta}</span>
    <span class="drop-hint">{$t.assistant.dropHint}</span>
  </div>
  <input
    bind:this={fileInput}
    type="file"
    accept="application/pdf"
    multiple
    class="sr-only"
    aria-label={$t.assistant.uploadCta}
    onchange={(e) => {
      handleFiles(e.currentTarget.files);
      e.currentTarget.value = "";
    }}
  />

  {#if $chatDocuments.length > 0}
    <ul class="doclist">
      {#each $chatDocuments as doc (doc.docId)}
        <li class="docitem">
          <span class="docname" title={doc.name}>{doc.name}</span>
          <span class="docmeta">
            {#if doc.status === "ready"}
              <Pill tone="success">{doc.pageCount} p · {doc.chunkCount}</Pill>
            {:else if doc.status === "error"}
              <Pill tone="danger">{statusLabel(doc.status)}</Pill>
            {:else}
              <Pill tone="info">{statusLabel(doc.status)}</Pill>
            {/if}
          </span>
          <button
            class="docdel"
            type="button"
            aria-label={$t.assistant.removeDoc}
            onclick={() => removeDocument(doc.docId)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <button class="export" type="button" onclick={exportKb} disabled={!hasReady || exporting}>
    {exporting ? $t.common.loading : $t.kbAdmin.export}
  </button>

  <ol class="steps">
    <li>{$t.kbAdmin.step1}</li>
    <li>{$t.kbAdmin.step2}</li>
    <li>{$t.kbAdmin.step3}</li>
  </ol>
</div>

<style>
  .page {
    padding: 4px 16px 40px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px;
    border: 1.5px dashed var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--surface);
    color: var(--text-muted);
    cursor: pointer;
    transition: border-color var(--transition-fast), background var(--transition-fast);
  }
  .drop.over,
  .drop:hover {
    border-color: var(--primary);
    background: var(--primary-soft);
    color: var(--primary);
  }
  .drop:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .drop-cta {
    font-weight: var(--fw-semibold);
    font-size: var(--fs-base);
    color: var(--text);
  }
  .drop-hint {
    font-size: var(--fs-sm);
  }
  .doclist {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .docitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--surface-elevated);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
  .docname {
    flex: 1;
    min-width: 0;
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .docdel {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }
  .docdel:hover {
    background: var(--danger-soft);
    color: var(--danger);
  }
  .docdel:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .export {
    margin-top: 16px;
    width: 100%;
    min-height: var(--touch-min);
    border: none;
    border-radius: var(--radius-md);
    background: var(--primary);
    color: var(--text-inverted);
    font-weight: var(--fw-semibold);
    font-size: var(--fs-base);
    cursor: pointer;
  }
  .export:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .export:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .steps {
    margin: 18px 0 0;
    padding-left: 20px;
    color: var(--text-muted);
    font-size: var(--fs-sm);
    line-height: 1.5;
  }
  .steps li {
    margin-bottom: 6px;
  }
</style>

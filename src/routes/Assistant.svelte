<script lang="ts">
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { t, locale } from "$lib/i18n";
  import { chatMessages, appendMessage, clearChat } from "$lib/stores/chatMessages";
  import {
    chatDocuments,
    addDocument,
    removeDocument,
    retrieveContext,
    reconcileDocuments,
    type DocStatus,
  } from "$lib/stores/chatDocuments";
  import { askAssistant, AssistantError, type ChatTurn } from "$lib/chat/api";

  let input = $state("");
  let sending = $state(false);
  let dragOver = $state(false);
  let fileInput: HTMLInputElement;

  const hasReady = $derived($chatDocuments.some((d) => d.status === "ready"));
  const canSend = $derived(hasReady && input.trim().length > 0 && !sending);

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

  async function send() {
    const question = input.trim();
    if (!question || !hasReady || sending) return;

    appendMessage({ role: "user", content: question });
    input = "";
    sending = true;

    try {
      const context = await retrieveContext(question);
      const history: ChatTurn[] = $chatMessages
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await askAssistant({
        messages: history,
        context: context.map(({ docId, docName, chunkId, page, text }) => ({
          docId,
          docName,
          chunkId,
          page,
          text,
        })),
        locale: $locale,
      });

      appendMessage({
        role: "assistant",
        content: res.answer || $t.assistant.dontKnow,
        citations: res.citations,
      });
    } catch (e) {
      const reason = e instanceof AssistantError ? e.message : $t.assistant.errorGeneric;
      appendMessage({ role: "assistant", content: `⚠️ ${$t.assistant.errorGeneric} (${reason})` });
    } finally {
      sending = false;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<AppHeader title={$t.assistant.title} sub={$t.assistant.subtitle} />

<div class="page">
  <!-- Pannello documenti -->
  <section class="docs" aria-label={$t.assistant.documents}>
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
  </section>

  <!-- Conversazione -->
  <section class="chat" aria-live="polite" aria-label={$t.assistant.title}>
    {#if $chatMessages.length === 0}
      <div class="empty">
        <p>{hasReady ? $t.assistant.emptyReady : $t.assistant.noProtocols}</p>
      </div>
    {:else}
      {#each $chatMessages as msg (msg.id)}
        <div class="msg msg-{msg.role}">
          <div class="bubble">{msg.content}</div>
          {#if msg.role === "assistant" && msg.citations && msg.citations.length > 0}
            <div class="cites">
              <span class="cites-label">{$t.assistant.sources}:</span>
              {#each msg.citations as c (c.chunkId)}
                <Pill tone="neutral">{c.docName} · p.{c.page}</Pill>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
    {#if sending}
      <div class="msg msg-assistant">
        <div class="bubble typing">{$t.assistant.thinking}</div>
      </div>
    {/if}
  </section>
</div>

<!-- Barra di input -->
<div class="composer">
  {#if $chatMessages.length > 0}
    <button class="clear" type="button" onclick={clearChat} aria-label={$t.assistant.clearChat}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  {/if}
  <input
    class="ask"
    type="text"
    bind:value={input}
    onkeydown={onKeydown}
    placeholder={hasReady ? $t.assistant.askPlaceholder : $t.assistant.noProtocols}
    aria-label={$t.assistant.askPlaceholder}
    disabled={!hasReady}
  />
  <button class="send" type="button" onclick={send} disabled={!canSend} aria-label={$t.assistant.send}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  </button>
</div>

<style>
  .page {
    padding: 4px 16px 0;
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

  .docs {
    margin-bottom: 14px;
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

  .chat {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 96px;
  }
  .empty {
    text-align: center;
    color: var(--text-muted);
    font-size: var(--fs-sm);
    padding: 32px 12px;
  }
  .msg {
    display: flex;
    flex-direction: column;
    max-width: 88%;
  }
  .msg-user {
    align-self: flex-end;
    align-items: flex-end;
  }
  .msg-assistant {
    align-self: flex-start;
    align-items: flex-start;
  }
  .bubble {
    padding: 10px 14px;
    border-radius: var(--radius-lg);
    font-size: var(--fs-base);
    line-height: var(--lh-base);
    white-space: pre-wrap;
    word-break: break-word;
  }
  .msg-user .bubble {
    background: var(--primary);
    color: var(--text-inverted);
    border-bottom-right-radius: var(--radius-sm);
  }
  .msg-assistant .bubble {
    background: var(--surface-elevated);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    border-bottom-left-radius: var(--radius-sm);
  }
  .typing {
    color: var(--text-muted);
    font-style: italic;
  }
  .cites {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
  }
  .cites-label {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    font-weight: var(--fw-medium);
  }

  .composer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0) + 8px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    max-width: var(--container-max);
    margin: 0 auto;
    z-index: var(--z-bottom-nav);
  }
  .ask {
    flex: 1;
    min-width: 0;
    min-height: var(--touch-min);
    padding: 0 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--surface-elevated);
    box-shadow: var(--shadow-md);
    color: var(--text);
    font-size: var(--fs-base);
    font-family: inherit;
  }
  .ask:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .ask:disabled {
    opacity: 0.6;
  }
  .send,
  .clear {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--touch-min);
    height: var(--touch-min);
    border-radius: 999px;
    cursor: pointer;
    box-shadow: var(--shadow-md);
  }
  .send {
    background: var(--primary);
    color: var(--text-inverted);
  }
  .send:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .clear {
    background: var(--surface-elevated);
    color: var(--text-muted);
  }
  .send:focus-visible,
  .clear:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
</style>

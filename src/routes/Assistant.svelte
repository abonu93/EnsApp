<script lang="ts">
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import { t, locale } from "$lib/i18n";
  import { chatMessages, appendMessage, clearChat } from "$lib/stores/chatMessages";
  import {
    loadKnowledgeBase,
    retrieveContext,
    kbStatus,
    kbDocNames,
  } from "$lib/stores/knowledgeBase";
  import { askAssistant, AssistantError, type ChatTurn } from "$lib/chat/api";

  let input = $state("");
  let sending = $state(false);

  const kbReady = $derived($kbStatus === "ready");
  const canSend = $derived(kbReady && input.trim().length > 0 && !sending);

  loadKnowledgeBase();

  async function send() {
    const question = input.trim();
    if (!question || !kbReady || sending) return;

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
  {#if kbReady && $kbDocNames.length > 0}
    <div class="kb-bar">
      <span class="kb-label">{$t.assistant.loadedProtocols}:</span>
      {#each $kbDocNames as name (name)}
        <Pill tone="primary">{name}</Pill>
      {/each}
    </div>
  {/if}

  <section class="chat" aria-live="polite" aria-label={$t.assistant.title}>
    {#if $chatMessages.length === 0}
      <div class="empty">
        {#if $kbStatus === "loading" || $kbStatus === "idle"}
          <p>{$t.common.loading}</p>
        {:else if kbReady}
          <p>{$t.assistant.emptyReady}</p>
        {:else}
          <p>{$t.assistant.kbEmpty}</p>
        {/if}
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
    placeholder={kbReady ? $t.assistant.askPlaceholder : $t.assistant.kbEmpty}
    aria-label={$t.assistant.askPlaceholder}
    disabled={!kbReady}
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

  .kb-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 14px;
  }
  .kb-label {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    font-weight: var(--fw-medium);
  }

  .chat {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 8px;
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

  /* sticky (non fixed): il contenitore di route ha un transform di animazione
     che romperebbe position:fixed facendolo sovrapporre ai messaggi. */
  .composer {
    position: sticky;
    bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0) + 8px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    margin: 8px auto 0;
    max-width: var(--container-max);
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

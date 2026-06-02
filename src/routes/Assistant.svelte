<script lang="ts">
  import { get } from "svelte/store";
  import Pill from "$lib/components/Pill.svelte";
  import { t, locale } from "$lib/i18n";
  import { chatMessages, appendMessage, clearChat } from "$lib/stores/chatMessages";
  import { loadKnowledgeBase, retrieveContext, kbStatus, kbDocNames } from "$lib/stores/knowledgeBase";
  import { askAssistant, AssistantError, type ChatTurn } from "$lib/chat/api";
  import { pendingQuestion } from "$lib/stores/assistantAsk";

  // Precompila dalla home (campo "Chiedi" o chip suggerito)
  let input = $state(get(pendingQuestion));
  pendingQuestion.set("");

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
      const history: ChatTurn[] = $chatMessages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const res = await askAssistant({
        messages: history,
        context: context.map(({ docId, docName, chunkId, page, text }) => ({ docId, docName, chunkId, page, text })),
        locale: $locale,
      });
      appendMessage({ role: "assistant", content: res.answer || $t.assistant.dontKnow, citations: res.citations });
    } catch (e) {
      const reason = e instanceof AssistantError ? e.message : $t.assistant.errorGeneric;
      appendMessage({ role: "assistant", content: `⚠️ ${$t.assistant.errorGeneric} (${reason})` });
    } finally {
      sending = false;
    }
  }

  function quickAsk(q: string) {
    if (!kbReady || sending) return;
    input = q;
    send();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<!-- Header chat (stile V5) -->
<div class="chat-head">
  <span class="avatar" aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
      <path d="M18.5 4.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" opacity=".7" />
    </svg>
  </span>
  <span class="head-text">
    <span class="head-title">{$t.assistant.title}</span>
    <span class="head-status" class:on={kbReady}>● {kbReady ? $t.assistant.knowsProtocols : $t.assistant.kbEmpty}</span>
  </span>
  <span class="ai-pill" aria-hidden="true"><span class="shimmer"></span>AI</span>
</div>

<div class="page">
  {#if kbReady && $kbDocNames.length > 0}
    <div class="kb-bar">
      <span class="kb-label">{$t.assistant.loadedProtocols}:</span>
      {#each $kbDocNames as name (name)}<Pill tone="primary">{name}</Pill>{/each}
    </div>
  {/if}

  <section class="chat" aria-live="polite" aria-label={$t.assistant.title}>
    {#if $chatMessages.length === 0}
      <div class="empty">
        {#if $kbStatus === "loading" || $kbStatus === "idle"}
          <p>{$t.common.loading}</p>
        {:else if kbReady}
          <p>{$t.assistant.emptyReady}</p>
          <div class="sugg">
            {#each $t.landing.suggestions as s (s)}
              <button class="sugg-chip" type="button" onclick={() => quickAsk(s)}>{s}</button>
            {/each}
          </div>
        {:else}
          <p>{$t.assistant.kbEmpty}</p>
        {/if}
      </div>
    {:else}
      {#each $chatMessages as msg (msg.id)}
        <div class="msg msg-{msg.role}">
          {#if msg.role === "assistant"}
            <div class="bubble-out"><div class="bubble bubble-ai">{msg.content}</div></div>
          {:else}
            <div class="bubble bubble-user">{msg.content}</div>
          {/if}
          {#if msg.role === "assistant" && msg.citations && msg.citations.length > 0}
            <div class="cites">
              <span class="cites-label">{$t.assistant.sources}:</span>
              {#each msg.citations as c (c.chunkId)}<Pill tone="neutral">{c.docName} · p.{c.page}</Pill>{/each}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
    {#if sending}
      <div class="msg msg-assistant">
        <div class="bubble-out"><div class="bubble bubble-ai typing"><span class="dots"><span></span><span></span><span></span></span></div></div>
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  </button>
</div>

<style>
  .chat-head {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 18px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: var(--grad-ai);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .head-text { flex: 1; min-width: 0; }
  .head-title { display: block; font-size: 15.5px; font-weight: 700; font-family: var(--font-display); color: var(--text); }
  .head-status { display: block; font-size: 11.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .head-status.on { color: var(--success); }

  .ai-pill {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: var(--primary-hover);
    background: rgba(79, 143, 188, 0.12);
    border-radius: 999px;
    padding: 5px 10px;
    flex-shrink: 0;
  }
  .ai-pill .shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: ai-shimmer 2.6s linear infinite;
  }
  @keyframes ai-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .page { padding: 4px 16px 0; }

  .kb-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 12px 0 4px; }
  .kb-label { font-size: var(--fs-xs); color: var(--text-muted); font-weight: var(--fw-medium); }

  .chat { display: flex; flex-direction: column; gap: 14px; padding: 12px 0 8px; }
  .empty { text-align: center; color: var(--text-muted); font-size: var(--fs-sm); padding: 28px 8px; }
  .sugg { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; }
  .sugg-chip {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-hover);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 8px 13px;
    cursor: pointer;
    font-family: inherit;
    box-shadow: var(--shadow-sm);
  }
  .sugg-chip:active { transform: scale(0.97); }
  .sugg-chip:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  .msg { display: flex; flex-direction: column; max-width: 88%; }
  .msg-user { align-self: flex-end; align-items: flex-end; }
  .msg-assistant { align-self: flex-start; align-items: flex-start; }

  .bubble { padding: 11px 15px; font-size: 14.5px; line-height: var(--lh-base); white-space: pre-wrap; word-break: break-word; }
  .bubble-user {
    background: var(--grad-ai);
    color: #fff;
    border-radius: 20px;
    border-bottom-right-radius: 7px;
    box-shadow: 0 8px 20px rgba(58, 111, 168, 0.30);
  }
  /* bolla assistente: contorno gradiente con interno bianco */
  .bubble-out {
    background: var(--grad-ai);
    border-radius: 20px;
    border-bottom-left-radius: 7px;
    padding: 1.5px;
    box-shadow: var(--shadow-md);
  }
  .bubble-ai {
    background: var(--surface);
    color: var(--text);
    border-radius: 18.5px;
    border-bottom-left-radius: 6px;
  }

  .typing { display: flex; align-items: center; }
  .dots { display: inline-flex; gap: 4px; align-items: center; }
  .dots span { width: 6px; height: 6px; border-radius: 999px; background: var(--primary); display: inline-block; animation: ai-dot 1.1s infinite ease-in-out; }
  .dots span:nth-child(2) { animation-delay: 0.16s; }
  .dots span:nth-child(3) { animation-delay: 0.32s; }
  @keyframes ai-dot { 0%, 70%, 100% { opacity: 0.3; transform: translateY(0); } 35% { opacity: 1; transform: translateY(-3px); } }

  .cites { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 8px; }
  .cites-label { font-size: var(--fs-xs); color: var(--text-muted); font-weight: var(--fw-medium); }

  /* composer sticky (il contenitore di route ha un transform di animazione che romperebbe fixed) */
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
    background: var(--surface);
    box-shadow: var(--shadow-md);
    color: var(--text);
    font-size: var(--fs-base);
    font-family: inherit;
  }
  .ask:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .ask:disabled { opacity: 0.6; }
  .send, .clear {
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
  .send { background: var(--grad-ai); color: #fff; }
  .send:disabled { opacity: 0.45; cursor: not-allowed; }
  .clear { background: var(--surface-elevated); color: var(--text-muted); }
  .send:focus-visible, .clear:focus-visible { outline: none; box-shadow: var(--focus-ring); }

  @media (prefers-reduced-motion: reduce) {
    .ai-pill .shimmer, .dots span { animation: none; }
  }
</style>

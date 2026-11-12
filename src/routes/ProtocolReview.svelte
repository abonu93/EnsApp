<script lang="ts">
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import Segmented from "$lib/components/Segmented.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import {
    REVIEW_ITEMS,
    REVIEW_NOTE_MAX,
    REVIEW_BY_MAX,
    reviewByTrial,
    statusOf,
    type ReviewItem,
    type ReviewSeverity,
    type ReviewSource,
    type ReviewStatus,
  } from "$lib/domain/protocol-review";
  import { reviewer, reviewMarks, reviewShared, setReview, watchReviews } from "$lib/stores/protocolReview";
  import { locale, t } from "$lib/i18n";

  $effect(() => watchReviews());

  let filter = $state<"all" | "open">("all");

  const tr = $derived($t.protocolReview);
  const statusLabel = $derived<Record<ReviewStatus, string>>({
    pending: tr.statusPending,
    agree: tr.statusAgree,
    done: tr.statusDone,
    disagree: tr.statusDisagree,
  });
  const statusOptions = $derived(
    (["pending", "agree", "done", "disagree"] as const).map((v) => ({ value: v, label: statusLabel[v] }))
  );
  const sevLabel = $derived<Record<ReviewSeverity, string>>({
    high: tr.sevHigh, medium: tr.sevMedium, low: tr.sevLow, note: tr.sevNote,
  });
  const sevTone = { high: "danger", medium: "warn", low: "neutral", note: "info" } as const;
  const srcLabel = $derived<Record<ReviewSource, string>>({
    app: tr.srcApp, sheet: tr.srcSheet, summary: tr.srcSummary, drive: tr.srcDrive, registry: tr.srcRegistry,
  });

  const reviewed = $derived(REVIEW_ITEMS.filter((i) => statusOf($reviewMarks, i.id) !== "pending").length);
  const groups = $derived(
    reviewByTrial(
      filter === "open" ? REVIEW_ITEMS.filter((i) => statusOf($reviewMarks, i.id) === "pending") : REVIEW_ITEMS
    )
  );

  function fmtWhen(ms: number): string {
    return new Date(ms).toLocaleString($locale, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  function saveNote(item: ReviewItem, value: string) {
    if (value !== ($reviewMarks[item.id]?.note ?? "")) setReview(item.id, { note: value });
  }
</script>

<AppHeader title={tr.title} sub={`${REVIEW_ITEMS.length} ${tr.count} · ${reviewed} ${tr.progress}`} />

<div class="body">
  <p class="intro">{tr.intro}</p>

  <p class="sync" class:local={$reviewShared === false} role="status">
    {$reviewShared === null ? tr.checking : $reviewShared ? tr.shared : tr.localOnly}
  </p>

  <TextField id="reviewer" label={tr.reviewerLabel} placeholder={tr.reviewerPlaceholder} maxlength={REVIEW_BY_MAX} bind:value={$reviewer} />

  <Segmented
    name="review-filter"
    label=""
    options={[{ value: "all", label: tr.filterAll }, { value: "open", label: tr.filterOpen }]}
    bind:value={filter}
  />

  {#each groups as [trial, items] (trial)}
    <Card title={trial}>
      {#snippet children()}
        <ul class="items">
          {#each items as item (item.id)}
            {@const mark = $reviewMarks[item.id]}
            <li class="item" data-id={item.id} data-status={statusOf($reviewMarks, item.id)}>
              <div class="tags">
                <Pill tone={sevTone[item.severity]}>{#snippet children()}{sevLabel[item.severity]}{/snippet}</Pill>
                <Pill tone="neutral">{#snippet children()}{srcLabel[item.source]}{/snippet}</Pill>
              </div>
              <p class="finding">{item.finding[$locale]}</p>
              {#if item.protocol}
                <p class="protocol"><strong>{tr.protocolSays}:</strong> {item.protocol[$locale]}</p>
              {/if}
              <Segmented
                name={`status-${item.id}`}
                label={tr.status}
                cols={2}
                options={statusOptions}
                value={statusOf($reviewMarks, item.id)}
                onChange={(v) => setReview(item.id, { status: v })}
              />
              <label class="note">
                <span>{tr.noteLabel}</span>
                <textarea
                  rows="2"
                  maxlength={REVIEW_NOTE_MAX}
                  placeholder={tr.notePlaceholder}
                  value={mark?.note ?? ""}
                  onchange={(e) => saveNote(item, (e.currentTarget as HTMLTextAreaElement).value)}
                ></textarea>
              </label>
              {#if mark}
                <p class="meta">{tr.lastBy}: {mark.by || "—"} · {fmtWhen(mark.t)}</p>
              {/if}
            </li>
          {/each}
        </ul>
      {/snippet}
    </Card>
  {/each}
</div>

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .intro { margin: 0; color: var(--text-muted); font-size: 14px; }
  .sync { margin: 0; font-size: 13px; color: var(--text-muted); }
  .sync.local { color: var(--warn, var(--text)); }
  .items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 18px; }
  .item { display: flex; flex-direction: column; gap: 8px; }
  .item + .item { border-top: 1px solid var(--border, rgba(127, 127, 127, 0.25)); padding-top: 14px; }
  .tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .finding { margin: 0; font-size: 14.5px; font-weight: 600; }
  .protocol { margin: 0; font-size: 13.5px; color: var(--text-muted); }
  .note { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-muted); }
  .note textarea {
    font: inherit;
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border, rgba(127, 127, 127, 0.35));
    border-radius: 10px;
    padding: 8px 10px;
    resize: vertical;
  }
  .meta { margin: 0; font-size: 12px; color: var(--text-muted); }
</style>

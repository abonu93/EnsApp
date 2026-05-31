<script lang="ts">
  import { push } from "svelte-spa-router";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import BottomBar from "$lib/components/BottomBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import { preData } from "$lib/stores/patient";
  import { acuteEligibility } from "$lib/stores/eligibility";
  import { announce } from "$lib/a11y/liveRegion";
  import { t } from "$lib/i18n";

  const weTrust = $derived($acuteEligibility.weTrust);
  const doac = $derived($preData.doac === "yes");

  $effect(() => {
    announce(weTrust ? $t.preResult.weTrustEligibleAnnounce : $t.preResult.weTrustNotEligibleAnnounce);
  });

  function openRandomization() {
    window.open("https://app.studyrandomizer.com/dashboard/", "_blank", "noopener");
  }
</script>

<AppHeader title={$t.preResult.title} step={0} steps={3} onBack={() => push("/pre-imaging")} />

<div class="body">
  <Card>
    {#snippet children()}
      <div class="status tone-{weTrust ? 'success' : 'danger'}">
        <div class="status-icon">
          {#if weTrust}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          {:else}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          {/if}
        </div>
        <div class="status-body">
          <div class="status-name">WeTrust</div>
          <div class="status-label">{weTrust ? $t.common.eligible : $t.common.notEligible}</div>
        </div>
      </div>
      <p class="hint">{weTrust ? $t.preResult.weTrustEligible : $t.preResult.weTrustNotEligible}</p>
    {/snippet}
  </Card>

  {#if doac}
    <Card>
      {#snippet children()}
        <div class="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>{$t.preResult.doacAlertTitle}</strong>
            <p>{$t.preResult.doacAlertDesc}</p>
          </div>
        </div>
      {/snippet}
    </Card>
  {/if}

  {#if weTrust}
    <button class="rand-btn" type="button" onclick={openRandomization}>
      {$t.preResult.randomize}
    </button>
  {/if}
</div>

<BottomBar onBack={() => push("/pre-imaging")} onNext={() => push("/post-imaging")} nextLabel={$t.preResult.continue} />

<style>
  .body {
    flex: 1;
    overflow: auto;
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .status-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-inverted);
    flex-shrink: 0;
  }
  .tone-success .status-icon { background: var(--success); }
  .tone-danger .status-icon { background: var(--danger); }
  .status-name { font-size: 18px; font-weight: 700; color: var(--text); }
  .status-label {
    font-size: 13px;
    font-weight: 600;
    margin-top: 2px;
  }
  .tone-success .status-label { color: var(--success); }
  .tone-danger .status-label { color: var(--danger); }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.5;
  }
  .alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    color: var(--warn);
  }
  .alert svg { flex-shrink: 0; margin-top: 2px; }
  .alert strong { display: block; color: var(--text); font-size: 14px; }
  .alert p { margin: 4px 0 0; color: var(--text-muted); font-size: 13px; }
  .rand-btn {
    border: none;
    background: var(--primary);
    color: var(--text-inverted);
    padding: 15px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(45, 91, 215, 0.28);
    font-family: inherit;
  }
</style>

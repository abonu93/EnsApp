<script lang="ts">
  // Live ICH score (0-6) calcolato dai parametri emorragici.
  // Se volume sconosciuto, mostra range "base-(base+1)".
  interface Patient {
    gcs?: number | null;
    ivh?: boolean | string;
    age?: number | null;
    hemVolume?: number | null;
    volUnknown?: boolean;
  }
  interface Props { patient: Patient }
  let { patient }: Props = $props();

  function score(p: Patient) {
    let base = 0;
    const gcs = p.gcs == null ? 15 : p.gcs;
    if (gcs <= 4) base += 2;
    else if (gcs <= 12) base += 1;
    const ivhTruthy = p.ivh === true || p.ivh === "yes";
    if (ivhTruthy) base += 1;
    const age = Number(p.age) || 0;
    if (age >= 80) base += 1;
    const volKnown = !p.volUnknown && p.hemVolume != null;
    if (volKnown && (p.hemVolume as number) >= 30) base += 1;
    return { base, maxBonus: volKnown ? 0 : 1, volKnown };
  }

  const s = $derived(score(patient));
  const tone = $derived(s.base <= 1 ? "success" : s.base <= 2 ? "warn" : "danger");
  const MORTALITY = ["0%", "13%", "26%", "72%", "97%", "100%", "100%"];
  const display = $derived(s.maxBonus ? `${s.base}-${s.base + s.maxBonus}` : String(s.base));
</script>

<div class="ich tone-{tone}">
  <div class="badge tone-{tone}">
    <span class="big">{display}</span>
    <span class="den">/ 6</span>
  </div>
  <div class="info">
    <div class="title tone-{tone}">ICH Score {display}</div>
    <div class="sub">
      {#if s.volKnown}
        Mortalita a 30gg: <strong>{MORTALITY[s.base]}</strong>
      {:else}
        Volume in attesa — score parziale
      {/if}
    </div>
  </div>
</div>

<style>
  .ich {
    border-radius: 18px;
    padding: 16px;
    background: var(--surface);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid;
  }
  .tone-success { border-color: color-mix(in srgb, var(--success) 20%, transparent); }
  .tone-warn { border-color: color-mix(in srgb, var(--warn) 20%, transparent); }
  .tone-danger { border-color: color-mix(in srgb, var(--danger) 20%, transparent); }

  .badge {
    width: 56px;
    height: 56px;
    border-radius: 15px;
    color: var(--text-inverted);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .badge.tone-success { background: var(--success); }
  .badge.tone-warn { background: var(--warn); }
  .badge.tone-danger { background: var(--danger); }
  .big {
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
  }
  .den { font-size: 8px; opacity: 0.85; }

  .info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .title {
    font-size: 14.5px;
    font-weight: 700;
  }
  .title.tone-success { color: var(--success); }
  .title.tone-warn { color: var(--warn); }
  .title.tone-danger { color: var(--danger); }
  .sub {
    font-size: 12px;
    color: var(--text-muted);
  }
  .sub strong { color: var(--text); }
</style>

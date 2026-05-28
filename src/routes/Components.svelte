<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import CheckboxGroup from "$lib/components/CheckboxGroup.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pill from "$lib/components/Pill.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Skeleton from "$lib/components/Skeleton.svelte";
  import { announce } from "$lib/a11y/liveRegion";

  let text = $state("");
  let age = $state<number | null>(null);
  let stroke = $state<"ischemic" | "hemorrhagic" | "">("");
  let vessels = $state<string[]>([]);
  let modalOpen = $state(false);
  let loading = $state(false);

  function fakeSave() {
    loading = true;
    setTimeout(() => {
      loading = false;
      announce("Salvato correttamente");
    }, 1200);
  }
</script>

<h1>Component gallery</h1>
<p class="lead">Tutti i componenti atomici disponibili. Clicca, tappa, naviga con tastiera per verificare a11y.</p>

<section>
  <h2>Buttons</h2>
  <div class="row">
    <Button variant="primary">{#snippet children()}Primary{/snippet}</Button>
    <Button variant="secondary">{#snippet children()}Secondary{/snippet}</Button>
    <Button variant="ghost">{#snippet children()}Ghost{/snippet}</Button>
    <Button variant="danger">{#snippet children()}Danger{/snippet}</Button>
  </div>
  <div class="row">
    <Button variant="primary" size="lg" {loading} onclick={fakeSave}>
      {#snippet children()}{loading ? "Saving" : "Save to Sheet"}{/snippet}
    </Button>
    <Button variant="secondary" disabled>{#snippet children()}Disabled{/snippet}</Button>
  </div>
</section>

<section>
  <h2>ProgressBar (5 step)</h2>
  <ProgressBar
    steps={["Patient", "Pre-Imaging", "Post-Imaging", "Trials", "Save"]}
    current={2}
  />
</section>

<section>
  <h2>Pill</h2>
  <div class="row">
    <Pill tone="success">{#snippet children()}Eligible{/snippet}</Pill>
    <Pill tone="danger">{#snippet children()}Not eligible{/snippet}</Pill>
    <Pill tone="warn">{#snippet children()}In progress{/snippet}</Pill>
    <Pill tone="info">{#snippet children()}Info{/snippet}</Pill>
    <Pill tone="ischemic">{#snippet children()}Ischemic{/snippet}</Pill>
    <Pill tone="hemorrhagic">{#snippet children()}Hemorrhagic{/snippet}</Pill>
    <Pill tone="post-acute">{#snippet children()}Post-acute{/snippet}</Pill>
  </div>
</section>

<section>
  <h2>Form inputs</h2>
  <Card>
    {#snippet children()}
      <div class="stack">
        <TextField
          id="demo-name"
          label="Patient ID"
          placeholder="es. PRN-2025-001"
          bind:value={text}
          hint="ID interno del paziente (non PII)"
        />

        <NumberField
          id="demo-age"
          label="Età"
          bind:value={age}
          min={0}
          max={120}
          suffix="anni"
          required
          error={age !== null && (age < 18 || age > 100) ? "Età fuori range (18-100)" : ""}
        />

        <RadioGroup
          id="demo-stroke"
          label="Tipo di stroke"
          name="stroke"
          bind:value={stroke}
          columns={2}
          options={[
            { value: "ischemic", label: "Ischemico", description: "LVO o non-LVO" },
            { value: "hemorrhagic", label: "Emorragico", description: "ICH spontanea" },
          ]}
        />

        <CheckboxGroup
          id="demo-vessels"
          label="Target vessels"
          bind:value={vessels}
          columns={2}
          options={[
            { value: "ica-terminal", label: "ICA terminal" },
            { value: "m1", label: "M1" },
            { value: "m2-proxdom", label: "M2 prox/dom" },
            { value: "basilar", label: "Basilar" },
          ]}
        />
      </div>
    {/snippet}
  </Card>
</section>

<section>
  <h2>Modal</h2>
  <Button onclick={() => (modalOpen = true)}>{#snippet children()}Apri modal{/snippet}</Button>
  <Modal
    open={modalOpen}
    title="Conferma azione"
    onClose={() => (modalOpen = false)}
  >
    {#snippet children()}
      <p>Stai per chiudere il caso senza salvare. Sei sicuro?</p>
      <p class="muted">Premi Esc o tappa fuori per annullare. Focus trapped dentro.</p>
    {/snippet}
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (modalOpen = false)}>
        {#snippet children()}Annulla{/snippet}
      </Button>
      <Button variant="danger" onclick={() => (modalOpen = false)}>
        {#snippet children()}Conferma{/snippet}
      </Button>
    {/snippet}
  </Modal>
</section>

<section>
  <h2>Skeleton</h2>
  <Card>
    {#snippet children()}
      <div class="stack-sm">
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1rem" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="40%" />
      </div>
    {/snippet}
  </Card>
</section>

<style>
  h1 { font-size: var(--fs-3xl); margin: 0; }
  h2 { font-size: var(--fs-xl); margin: 0 0 var(--sp-3); }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-6); }
  section { margin-bottom: var(--sp-8); }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    margin-bottom: var(--sp-3);
  }
  .stack { display: flex; flex-direction: column; gap: var(--sp-4); }
  .stack-sm { display: flex; flex-direction: column; gap: var(--sp-2); }
  .muted { color: var(--text-muted); font-size: var(--fs-sm); }
</style>

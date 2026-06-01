<script lang="ts">
  import { link } from "svelte-spa-router";
  import Button from "$lib/components/Button.svelte";
</script>

<h1>Pagina non trovata</h1>
<p class="lead">La route richiesta non esiste.</p>
<a href="/" use:link>
  <Button>{#snippet children()}Torna alla home{/snippet}</Button>
</a>

<style>
  h1 { font-size: var(--fs-2xl); margin: 0; }
  .lead { color: var(--text-muted); margin: var(--sp-2) 0 var(--sp-4); }
</style>

<script>
  import Header from '../shared/components/header.component.svelte';
</script>

<Header />

<slot />

<style>
  :root {
    --border: 2px solid #000;
    font-family: sans-serif;
    font-size: 0.9em;
  }

  :global(body) {
    min-height: 100vh;
  }
</style>

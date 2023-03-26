<script>
  import '$lib/client/styles/global.styles.css';
  import { Header } from '$lib/client/components';
</script>

<Header />

<main>
  <slot />
</main>

<style>
  :global(body) {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
  }

  main {
    flex-grow: 1;
  }
</style>

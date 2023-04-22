<script lang="ts">
  import { Header } from '$lib/client/components';

  export let data;
</script>

<Header username={data.sessionContext.user.username} />

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

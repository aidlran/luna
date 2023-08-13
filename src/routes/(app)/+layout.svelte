<script lang="ts">
  import { Session } from '@enclavetech/api';
  import { init as initAPI } from '@enclavetech/svelte';
  import { goto } from '$app/navigation';
  import { Drawer, Header } from '$lib/client/components';
  import { drawer } from '$lib/client/utils/stores';

  export let data;

  const init = Session.resume().catch(() => goto('/login'));

  initAPI();
</script>

<div role="none" class="app" on:click={drawer.close}>
  <Header username={data.sessionContext.user.username} />

  {#await init then}
    <main>
      <slot />
    </main>
  {/await}

  <Drawer control={drawer} />
</div>

<style>
  :global(body) {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
  }

  .app {
    display: contents;
  }

  main {
    flex-grow: 1;
    overflow: hidden;
  }
</style>

<script lang="ts">
  import { SignedIn } from '@enclavetech/svelte';
  import { Drawer, Header } from '$lib/client/components';
  import { drawer } from '$lib/client/utils/stores';

  export let data;
</script>

<SignedIn noAuthRedirect={'/login'}>
  <div role="none" class="app" on:click={drawer.close}>
    <Header username={data.sessionContext.user.username} />
    <main>
      <slot />
    </main>
    <Drawer control={drawer} />
  </div>
</SignedIn>

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

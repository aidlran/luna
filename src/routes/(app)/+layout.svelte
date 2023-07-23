<script lang="ts">
  import { goto } from '$app/navigation';
  import { Header } from '$lib/client/components';
  import { Session } from '@enclavetech/lib-web';

  export let data;

  async function init(): Promise<void> {
    await Session.resume().catch(() => {
      goto('/login');
    });
  }
</script>

<Header username={data.sessionContext.user.username} />

<main>
  {#await init() then}
    <slot />
  {/await}
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

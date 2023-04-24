<script lang="ts">
  import { goto } from '$app/navigation';
  import { Header } from '$lib/client/components';
  import { getServices } from '$lib/client/utils/services';

  export let data;

  const { keysService } = getServices();

  async function init(): Promise<void> {
    // TODO: need to figure out if keyService has already imported keys
    await keysService.resumeSession().catch(() => {
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

<script lang="ts">
  import { MemoryDriver } from 'trusync';
  import { TrusyncApp } from 'trusync-svelte';
  import { Authenticate } from '$lib/client/components';
</script>

<TrusyncApp drivers={[new MemoryDriver()]} let:app>
  {#if app.signedIn}
    <slot />
  {:else}
    <Authenticate />
  {/if}
</TrusyncApp>

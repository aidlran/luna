<script lang="ts">
  import { LocalStorageDriver, MemoryDriver } from 'trusync';
  import { TrusyncApp } from 'trusync-svelte';

  // TODO: remember last sessionID, prompt for password to useSession
</script>

<TrusyncApp drivers={[new MemoryDriver(), new LocalStorageDriver()]}>
  <slot />
</TrusyncApp>

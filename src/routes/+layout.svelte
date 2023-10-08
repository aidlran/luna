<script lang="ts">
  import { LocalStorageDriver, MemoryDriver } from 'trusync';
  import { TrusyncApp } from 'trusync-svelte';
</script>

<TrusyncApp drivers={[new MemoryDriver(), new LocalStorageDriver()]}>
  <slot />
</TrusyncApp>

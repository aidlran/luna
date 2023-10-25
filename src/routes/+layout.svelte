<script>
  import { LocalStorageDriver, MemoryDriver } from 'trusync';
  import { TrusyncApp } from 'trusync-svelte';
  import { Drawer } from '$lib/client/components';
</script>

<TrusyncApp drivers={[new MemoryDriver(), new LocalStorageDriver()]}>
  <Drawer>
    <slot />
  </Drawer>
</TrusyncApp>

<style>
  @import './style.css';
</style>

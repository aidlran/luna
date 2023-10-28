<script>
  import { LocalStorageChannel, MemoryChannel } from 'trusync/channel';
  import { TrusyncApp } from 'trusync-svelte';
  import { Drawer } from '$lib/client/components';
</script>

<TrusyncApp channels={[new MemoryChannel(), new LocalStorageChannel()]}>
  <Drawer>
    <slot />
  </Drawer>
</TrusyncApp>

<style>
  @import './style.css';
</style>

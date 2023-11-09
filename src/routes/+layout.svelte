<script>
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';
</script>

<svelte:head>
  <title>LUNA</title>
</svelte:head>

<Drawer>
  <UrlState>
    <slot />
  </UrlState>
</Drawer>

<style>
  @import './style.css';
</style>

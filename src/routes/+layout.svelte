<script>
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';
</script>

<Drawer>
  <UrlState>
    <slot />
  </UrlState>
</Drawer>

<style>
  @import './style.css';
</style>

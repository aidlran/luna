<script>
  import { Drawer, UrlState } from '$lib/client/components';
</script>

<Drawer>
  <UrlState>
    <slot />
  </UrlState>
</Drawer>

<style>
  @import './style.css';
</style>

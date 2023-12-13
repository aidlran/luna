<script>
  import Header from '$lib/client/components/header/header.svelte';
  import SessionMenu from './session-menu.svelte';
</script>

<Header activeApp="session" />

<div class="narrow-only">
  <SessionMenu />
</div>

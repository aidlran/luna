<script>
  import Header from '$lib/client/components/header/header.svelte';
  import SessionMenu from './session-menu.svelte';
</script>

<Header activeApp="sessions" />

<div class="ion-hide-lg-up" style="display:contents">
  <SessionMenu />
</div>

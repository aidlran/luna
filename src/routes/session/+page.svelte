<script>
  import { allSessions } from 'trusync-svelte';
  import Header from '$lib/client/components/header/header.svelte';
  import SessionMenu from './session-menu.svelte';
  import { goto } from '$app/navigation';

  let hasSessions = false;

  allSessions().subscribe((sessions) => {
    if (!Object.keys(sessions).length) goto('create');
    else hasSessions = true;
  })();
</script>

<Header activeApp="sessions" />

{#if hasSessions}
  <div class="ion-hide-lg-up" style="display:contents">
    <SessionMenu />
  </div>
{/if}

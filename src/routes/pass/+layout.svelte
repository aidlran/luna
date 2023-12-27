<script lang="ts">
  import { activeSession } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { APPS } from '$lib/client/components/header/apps';
  import { fragmentParam } from '$lib/client/components/url-state';

  const activeSessionStore = activeSession();
  const sessionIdParam = fragmentParam('sid');

  $: {
    if (!$activeSessionStore && !$sessionIdParam) {
      goto(APPS.find(({ id }) => id === 'sessions').path);
    }
  }
</script>

<svelte:head>
  <title>LUNA Pass</title>
  <meta name="description" content="Manage passwords and credentials with LUNA." />
</svelte:head>

<slot />

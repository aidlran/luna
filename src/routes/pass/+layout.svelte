<script lang="ts">
  import { activeSession } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APPS } from '$lib/client/components/header/apps';

  const activeSessionStore = activeSession();

  $: if (!$activeSessionStore) {
    goto(`${APPS.find(({ id }) => id === 'sessions').path}#then=${$page.url.pathname}`);
  }
</script>

<svelte:head>
  <title>LUNA Pass</title>
  <meta name="description" content="Manage passwords and credentials with LUNA." />
</svelte:head>

<slot />

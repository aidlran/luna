<script lang="ts">
  import { activeKeyring } from '@librebase/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APPS } from '$lib/client/components/header/apps';

  const activeSessionStore = activeKeyring();

  $: if (!$activeSessionStore) {
    goto(`${APPS.find(({ id }) => id === 'sessions').path}#then=${$page.url.pathname}`);
  }
</script>

<svelte:head>
  <title>LUNA Pass</title>
  <meta name="description" content="Manage passwords and credentials with LUNA." />
</svelte:head>

<slot />

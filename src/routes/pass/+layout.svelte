<script lang="ts">
  import { activeSession } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { APPS } from '$lib/client/components/header/apps';

  const activeSessionStore = activeSession();

  $: !$activeSessionStore && goto(APPS.find(({ id }) => id === 'sessions').path);
</script>

<svelte:head>
  <title>LUNA Pass</title>
  <meta name="description" content="Manage passwords and credentials with LUNA." />
</svelte:head>

<slot />

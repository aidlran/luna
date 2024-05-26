<script lang="ts">
  import { init as initJSON } from '@librebase/codec-json/recommended';
  import { IdentifierRegistry } from '@librebase/core';
  import { init as initIDB } from '@librebase/driver-indexeddb/recommended';
  import { init as initFS } from '@librebase/fs/recommended';
  import { browser } from '$app/environment';
  import { LocalTaskListIdentifierSchema } from '$lib/client/projects/local-task-list';

  let ready = false;

  if (browser) {
    const instanceID = 'localonly';
    initFS(instanceID);
    initJSON({ instanceID });
    IdentifierRegistry.register(LocalTaskListIdentifierSchema, { instanceID, force: true });
    initIDB({ instanceID }).then(() => (ready = true));
  }
</script>

<svelte:head>
  <title>LUNA Projects</title>
  <meta name="description" content="Manage projects and tasks with LUNA." />
</svelte:head>

{#if ready}
  <slot />
{/if}

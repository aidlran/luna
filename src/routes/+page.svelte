<script lang="ts">
  import { activeSessionStore } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  if (!$activeSessionStore?.identities) {
    goto(`session${$page.url.hash}`);
  }
</script>

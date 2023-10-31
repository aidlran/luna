<script lang="ts">
  import { activeSessionStore } from 'trusync-svelte';
  import { goto } from '$app/navigation';

  if (!$activeSessionStore?.identities) {
    goto('session');
  }
</script>

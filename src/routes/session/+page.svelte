<script>
  import { session } from 'trusync';
  import { goto } from '$app/navigation';
  import Header from '$lib/client/components/header/Header.svelte';

  session().getSessions((sessions) => {
    if (!Object.values(sessions).length) {
      goto('create');
    }
  });
</script>

<Header activeApp="sessions" />

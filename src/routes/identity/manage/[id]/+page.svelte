<script>
  import { getIdentity } from 'trusync-svelte';
  import { goto } from '$app/navigation';

  const identity = getIdentity();
  const id = location.pathname.split('/').pop();

  if (id && !$identity.publicKeys.includes(id)) {
    goto('./');
  }
</script>

<h1>Manage</h1>

<h2>{id}</h2>

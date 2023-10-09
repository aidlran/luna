<script>
  import { base64Url } from 'trusync';
  import { getIdentity } from 'trusync-svelte';
  import { goto } from '$app/navigation';

  const identity = getIdentity();
  const id = base64Url.decode(location.pathname.split('/')[2]);

  if (!$identity.publicKeys.includes(id)) {
    goto('./');
  }
</script>

<h1>Manage</h1>

<h2>{id}</h2>

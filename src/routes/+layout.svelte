<script lang="ts">
  import { MemoryDriver } from 'trusync';
  import { SignedIn, TrusyncApp } from 'trusync-svelte';
  import { Authenticate } from '$lib/client/components';
</script>

<TrusyncApp drivers={[new MemoryDriver()]}>
  <SignedIn>
    <slot slot="auth" />
    <Authenticate slot="noauth" />
  </SignedIn>
</TrusyncApp>

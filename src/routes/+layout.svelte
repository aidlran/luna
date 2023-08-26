<script lang="ts">
  import { MemoryDriver } from 'trusync';
  import { TrusyncApp } from 'trusync-svelte';
</script>

<TrusyncApp drivers={[new MemoryDriver()]}>
  <slot />
</TrusyncApp>

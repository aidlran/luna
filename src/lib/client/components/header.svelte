<script lang="ts">
  import SessionSwitcher from './session-switcher.svelte';
</script>

<header>
  <SessionSwitcher />
</header>

<style>
  header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    padding: 16px;
  }
</style>

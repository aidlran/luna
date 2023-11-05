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
    border-bottom: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
</style>

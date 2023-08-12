<script lang="ts">
  export let username: string;
</script>

<header>
  <span>{username}</span>
  <div class="button">
    <a data-sveltekit-preload-data="tap" href="/logout">Log Out</a>
  </div>
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

  header div.button {
    display: flex;
    height: 100%;
    border-radius: 4px;
    cursor: pointer;
  }

  header div.button:hover {
    background: var(--colour-hover);
  }

  div.button a {
    margin: auto;
    text-align: center;
    font-size: 0.9rem;
  }
</style>

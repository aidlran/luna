<script lang="ts">
  import '$lib/styles/form.styles.css';

  export let messageText = '';
  export let messageIsError = false;
  export let submitButtonText = 'Submit';
</script>

<div class="container">
  <form method="post">
    <slot name="form" />
    <input type="submit" value={submitButtonText} />
  </form>

  {#if messageText}
    <p class:error={messageIsError}>{messageText}</p>
  {/if}

  <slot name="footer" />
</div>

<style>
  .container {
    width: 300px;
    margin: auto;
    padding: 20px;
    border: var(--border);
    border-radius: 5px;
  }

  .container :global(p) {
    text-align: center;
  }
</style>

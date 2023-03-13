<script>
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

  :global(label) {
    display: block;
    margin: 8px auto;
  }

  :global(input) {
    width: 100%;
    margin: 1px auto;
    padding: 5px;
    border: var(--border);
    font-size: 1.1rem;
  }

  :global(input:not([type='submit'])) {
    width: calc(100% - 14px);
  }

  :global(input[type='submit']) {
    margin-top: 18px;
  }

  :global(p) {
    text-align: center;
  }
</style>

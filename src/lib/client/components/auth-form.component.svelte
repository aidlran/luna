<script lang="ts">
  export let errors: Record<string, string[]> = {};
</script>

<div class="container">
  <slot name="form" />

  {#if errors && Object.keys(errors).length}
    {#each Object.keys(errors) as inputName}
      {#each errors[inputName] as errorString}
        <p class="error">{errorString}</p>
      {/each}
    {/each}
  {/if}

  <slot name="footer" />
</div>

<style>
  .container {
    width: calc(100% - 40px);
    padding: 20px;
  }

  @media (min-width: 600px) {
    .container {
      width: calc(100% - 44px);
      max-width: 300px;
      margin: 20px auto;
      border: var(--border);
      border-radius: 5px;
    }
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
    padding: 10px 5px;
  }

  :global(p) {
    text-align: center;
  }
</style>

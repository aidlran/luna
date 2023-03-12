<script lang="ts">
  import '../../shared/styles/form.styles.css';

  let identifier: string;
  let passphrase: string;

  let disabled = false;

  let messageText = '';
  let messageIsError = false;
</script>

<div style="display: flex">
  <div class="container">
    <form method="post">
      <label>
        <span>Username or email</span>
        <input name="identifier" placeholder="Username or email" required bind:value={identifier} />
      </label>
      <label>
        <span>Passphrase</span>
        <input type="password" name="passphrase" placeholder="Passphrase" required bind:value={passphrase} />
      </label>
      <input type="submit" value="Log In" {disabled} />
    </form>

    {#if messageText}
      <p class:error={messageIsError}>{messageText}</p>
    {/if}

    <p>
      Don't have an account?
      <br />
      <a href="signup">Sign up</a> here.
    </p>
  </div>
</div>

<style>
  .container {
    width: 300px;
    margin: auto;
    padding: 20px;
    border: var(--border);
    border-radius: 5px;
  }

  p {
    text-align: center;
  }
</style>

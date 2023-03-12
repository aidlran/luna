<script lang="ts">
  import '../../shared/styles/form.styles.css';

  let email: string;
  let username: string;
  let passphrase: string;

  let disabled = false;

  let messageText = '';
  let messageIsError = false;
</script>

<div style="display: flex">
  <div class="container">
    <form method="post">
      <label>
        <span>Email</span>
        <input type="email" name="email" placeholder="Email" required bind:value={email} />
      </label>
      <label>
        <span>Username</span>
        <input name="username" placeholder="Username" required bind:value={username} />
      </label>
      <label>
        <span>Passphrase</span>
        <input type="password" name="passphrase" placeholder="Passphrase" required bind:value={passphrase} />
      </label>
      <input type="submit" value="Sign Up" {disabled} />
    </form>

    {#if messageText}
      <p class:error={messageIsError}>{messageText}</p>
    {/if}

    <p>
      Already have an account?
      <br />
      <a href="login">Log in</a> here.
    </p>
  </div>
</div>

<style>
  .container {
    margin: auto;
    padding: 20px;
    border: var(--border);
    border-radius: 5px;
  }

  p {
    text-align: center;
  }
</style>

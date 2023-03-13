<script lang="ts">
  import { AuthForm } from '$lib/components';

  let email: string;
  let username: string;
  let passphrase: string;

  let messageText = '';
  let messageIsError = false;
</script>

<AuthForm {messageText} {messageIsError} submitButtonText="Sign Up">
  <div slot="form" style="display: contents">
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
  </div>

  <p slot="footer">
    Already have an account?
    <br />
    <a href="login">Log in</a> here.
  </p>
</AuthForm>

<script lang="ts">
  import '$lib/styles/form.styles.css';

  import AuthForm from '$lib/components/auth-form.component.svelte';

  let identifier: string;
  let passphrase: string;

  let messageText = '';
  let messageIsError = false;
</script>

<AuthForm {messageText} {messageIsError} submitButtonText="Log In">
  <div slot="form" style="display: contents">
    <label>
      <span>Username or email</span>
      <input name="identifier" placeholder="Username or email" required bind:value={identifier} />
    </label>
    <label>
      <span>Passphrase</span>
      <input type="password" name="passphrase" placeholder="Passphrase" required bind:value={passphrase} />
    </label>
  </div>

  <p slot="footer">
    Don't have an account?
    <br />
    <a href="signup">Sign up</a> here.
  </p>
</AuthForm>

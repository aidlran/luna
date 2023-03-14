<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';

  import { AuthForm } from '$lib/components';

  export let form;

  let identifier: string;
  let passphrase: string;

  let initialFocus: HTMLInputElement;

  onMount(() => initialFocus.focus());
</script>

<AuthForm errors={form?.errors}>
  <form slot="form" method="POST" use:enhance>
    <label>
      <span>Username or email</span>
      <input
        name="identifier"
        placeholder="Username or email"
        required
        bind:value={identifier}
        bind:this={initialFocus}
      />
    </label>
    <label>
      <span>Passphrase</span>
      <input type="password" name="passphrase" placeholder="Passphrase" bind:value={passphrase} />
    </label>
    <input type="submit" value="Log In" />
  </form>

  <p slot="footer">
    Don't have an account?
    <br />
    <a href="signup">Sign up</a> here.
  </p>
</AuthForm>

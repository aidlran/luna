<script lang="ts">
  import 'ionic-svelte/components/ion-button.js';
  import 'ionic-svelte/components/ion-card.js';
  import 'ionic-svelte/components/ion-card-header.js';
  import 'ionic-svelte/components/ion-card-subtitle.js';
  import 'ionic-svelte/components/ion-card-title.js';
  import 'ionic-svelte/components/ion-input.js';
  import 'ionic-svelte/components/ion-item.js';
  import 'ionic-svelte/components/ion-label.js';
  import 'ionic-svelte/components/ion-list.js';
  import 'ionic-svelte/components/ion-note.js';
  import 'ionic-svelte/components/ion-row.js';
  import { session } from 'trusync';
  import { page } from '$app/stores';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/header.svelte';
  import { fade, slide } from 'svelte/transition';

  /* eslint no-undef: 0 -- HTMLIonInputElement is a web component */

  let passphraseInput: HTMLIonInputElement;
  let passphraseError: string | undefined;

  let confirmInput: HTMLIonInputElement;
  let confirmError: string | undefined;

  let displayNameInput: HTMLIonInputElement;

  let mnemonic: string[] | undefined;
  $: mnemonic && (disabled = true);

  let disabled = false;

  async function onSubmit(): Promise<void> {
    disabled = true;

    passphraseError = confirmError = undefined;

    const passphrase = passphraseInput.value as string;
    const confirm = confirmInput.value as string;
    const displayName = (displayNameInput.value as string).trim();

    if (!passphrase.length) {
      passphraseError = 'Please enter a passphrase';
    }

    if (confirm !== passphrase) {
      confirmError = 'Passphrases do not match';
    }

    if (passphraseError) {
      disabled = false;
      passphraseInput.setFocus();
      return;
    }

    if (confirmError) {
      disabled = false;
      confirmInput.setFocus();
      return;
    }

    mnemonic = await session()
      .createSession.asPromise({ passphrase, metadata: { displayName } })
      .then((mnemonic) => mnemonic.split(' '))
      .finally(() => (disabled = false));

    // TODO: redirect to dedicated session edit/manage screen
    //       to display recovery phrase now and at a later date

    // TODO: verify recovery phrase, ask for each word in random order
  }
</script>

<Header activeApp="sessions" backHref={`.${$page.url.hash}`}>
  <ion-title>Create a session</ion-title>
</Header>

<ion-content style:max-width="1000px">
  {#if !mnemonic}
    <ion-card style:--color="var(--ion-text-color)" out:slide>
      <ion-card-header>
        <ion-card-title>Create a session</ion-card-title>
        <ion-card-subtitle></ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <form class="ion-padding" on:submit|preventDefault={onSubmit}>
          <!-- TODO: wrapper component, lotta boilerplate input props here -->

          <div class="row">
            <ion-input
              required
              {disabled}
              class="ion-margin-bottom"
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Passphrase"
              label-placement="stacked"
              class:ion-touched={passphraseError || confirmError}
              class:ion-invalid={passphraseError || confirmError}
              error-text={passphraseError}
              helper-text="Choose a strong passphrase to protect your keys."
              use:ionFocus={12}
              bind:this={passphraseInput}
            />

            <ion-input
              required
              {disabled}
              class="ion-margin-bottom"
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Confirm passphrase"
              label-placement="stacked"
              class:ion-touched={confirmError}
              class:ion-invalid={confirmError}
              error-text={confirmError}
              bind:this={confirmInput}
            />
          </div>

          <ion-input
            required
            {disabled}
            class="ion-margin-bottom"
            fill="outline"
            label="Display name"
            label-placement="stacked"
            helper-text="Enter a name to help identify the session."
            bind:this={displayNameInput}
          />

          <ion-button type="submit" expand="block" class="ion-margin-bottom" {disabled}
            >Create session</ion-button
          >
        </form>
      </ion-card-content>
    </ion-card>
  {:else}
    <ion-card in:fade>
      <ion-card-header>
        <ion-card-title>Your recovery phrase</ion-card-title>
        <ion-card-subtitle>
          This {mnemonic.length} word recovery phrase is needed to restore access to the session if it
          is deleted, or to use the session in another client. Keep it safe.
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          {#each mnemonic as word, i}
            <ion-item>
              <ion-note slot="start">{(i + 1).toString().padStart(2, '0')}</ion-note>
              <ion-label>{word}</ion-label>
            </ion-item>
          {/each}
        </ion-list>
      </ion-card-content>
    </ion-card>
  {/if}
</ion-content>

<style>
  @media only screen and (min-width: 680px) {
    .row {
      gap: 16px;
      display: flex;
    }
  }
</style>

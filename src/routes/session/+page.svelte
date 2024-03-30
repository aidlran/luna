<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonInputElement is a custom component */

  import 'ionic-svelte/components/ion-avatar';
  import 'ionic-svelte/components/ion-text';
  import { activateKeyring, getAllKeyrings, type Keyring } from 'librebase';
  import { activeKeyring } from 'librebase-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';
  import type { KeyringMetadata } from '$lib/client/types/keyring-metadata';

  const activeSessionStore = activeKeyring();
  const thenParam = fragmentParam('then');

  let target: Keyring<KeyringMetadata> | undefined;

  const keyringsPromise = getAllKeyrings<KeyringMetadata>().then((keyrings) => {
    if (keyrings.length == 1) target = keyrings[0];
    return keyrings;
  });

  let passphraseInput: HTMLIonInputElement;
  let passphraseError: string | undefined;

  async function submit() {
    if (target) {
      await activateKeyring(target.id, passphraseInput.value as string);
      if ($thenParam) goto($thenParam);
    }
  }
</script>

<Header activeApp="sessions" />

<ion-content class="ion-padding">
  {#if !$activeSessionStore}
    <ion-card>
      {#if target}
        <ion-card-header>
          <ion-card-title style:text-align="center">Unlock session</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="flex" style:flex-flow="column">
            <ion-avatar>
              <ion-text color="light">
                {target.metadata?.displayName.charAt(0).toLocaleUpperCase()}
              </ion-text>
            </ion-avatar>
            <span>{target.metadata?.displayName}</span>
          </div>

          <form class="ion-margin" on:submit|preventDefault={submit}>
            <ion-input
              class="ion-margin-vertical"
              required
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Passphrase"
              label-placement="stacked"
              class:ion-touched={!!passphraseError}
              class:ion-invalid={!!passphraseError}
              error-text={passphraseError}
              use:ionFocus={13}
              bind:this={passphraseInput}
            />

            <ion-button class="ion-margin-vertical" type="submit" expand="block">
              Unlock session
            </ion-button>
          </form>
        </ion-card-content>

        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <ion-button
          fill="clear"
          expand="block"
          class="ion-margin-top"
          on:click={() => (target = undefined)}
        >
          Use a different session
        </ion-button>
      {:else}
        <ion-card-header>
          <ion-card-title style:text-align="center">Choose a session</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            {#await keyringsPromise then keyrings}
              {#each keyrings as keyring}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                <ion-item button on:click={() => (target = keyring)}>
                  <ion-label class="flex">
                    <ion-avatar>
                      <ion-text color="light">
                        {keyring.metadata?.displayName.charAt(0).toLocaleUpperCase()}
                      </ion-text>
                    </ion-avatar>
                    <span>{keyring.metadata?.displayName}</span>
                  </ion-label>
                </ion-item>
              {/each}
            {/await}
          </ion-list>
        </ion-card-content>

        <div class="flex ion-margin-top" style:justify-content="space-between">
          <ion-button fill="clear" href={`session/import${$page.url.hash}`}>Import</ion-button>
          <ion-button fill="clear" href={`session/create${$page.url.hash}`}>Create</ion-button>
        </div>
      {/if}
    </ion-card>
  {/if}
</ion-content>

<style>
  ion-card {
    margin: auto;
    max-width: 500px;
  }

  ion-avatar {
    height: 32px;
    width: 32px;
    display: flex;
    background: gray;
  }

  ion-avatar > ion-text {
    margin: auto;
  }

  .flex {
    display: flex !important;
    align-items: center;
    gap: 16px;
  }
</style>

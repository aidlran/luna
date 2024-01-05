<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonInputElement is a custom component */

  import 'ionic-svelte/components/ion-avatar';
  import 'ionic-svelte/components/ion-text';
  import { session } from 'trusync';
  import { activeSession, allSessions } from 'trusync-svelte';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import type { SessionMetadata } from '$lib/client/types/session-metadata';

  const activeSessionStore = activeSession();
  const allSessionsStore = allSessions<SessionMetadata>();
  let passphraseInput: HTMLIonInputElement;
  let passphraseError: string | undefined;
  let targetSession: number | undefined;

  const { getSessions, load: loadSession } = session();

  getSessions((sessions) => {
    const sessionsArray = Object.values(sessions);
    if (sessionsArray.length == 1) {
      targetSession = sessionsArray[0].id;
    }
  });

  function submit() {
    if (targetSession) {
      loadSession(targetSession, passphraseInput.value as string);
    }
  }
</script>

<Header activeApp="sessions" />

<ion-content class="ion-padding">
  {#if !$activeSessionStore}
    <ion-card>
      {#if $allSessionsStore[targetSession]}
        {@const session = $allSessionsStore[targetSession]}
        <ion-card-header>
          <ion-card-title style:text-align="center">Unlock session</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label class="flex" style:justify-content="center">
              <ion-avatar>
                <ion-text color="light">
                  {session.metadata?.displayName.charAt(0).toLocaleUpperCase()}
                </ion-text>
              </ion-avatar>
              <span>{session.metadata?.displayName}</span>
            </ion-label>
          </ion-item>

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
          on:click={() => (targetSession = undefined)}
        >
          Use a different session
        </ion-button>
      {:else}
        <ion-card-header>
          <ion-card-title style:text-align="center">Choose a session</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            {#each Object.values($allSessionsStore) as session}
              <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
              <ion-item button on:click={() => (targetSession = session.id)}>
                <ion-label class="flex">
                  <ion-avatar>
                    <ion-text color="light">
                      {session.metadata?.displayName.charAt(0).toLocaleUpperCase()}
                    </ion-text>
                  </ion-avatar>
                  <span>{session.metadata?.displayName}</span>
                </ion-label>
              </ion-item>
            {/each}
          </ion-list>
        </ion-card-content>

        <div class="flex ion-margin-top" style:justify-content="space-between">
          <ion-button fill="clear" href="session/import">Import</ion-button>
          <ion-button fill="clear" href="session/create">Create</ion-button>
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

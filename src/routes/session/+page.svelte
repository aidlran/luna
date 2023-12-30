<script lang="ts">
  import 'ionic-svelte/components/ion-avatar';
  import 'ionic-svelte/components/ion-text';
  import { session, type Session } from 'trusync';
  import { allSessions } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import Header from '$lib/client/components/header/Header.svelte';
  import type { SessionMetadata } from '$lib/client/types/session-metadata';

  const allSessionsStore = allSessions<SessionMetadata>();

  let sessions: Session<SessionMetadata>[];
  $: sessions = Object.values($allSessionsStore);

  session().getSessions((sessions) => {
    if (!Object.values(sessions).length) {
      goto('create');
    }
  });
</script>

<Header activeApp="sessions" />

{#if sessions.length}
  <ion-content class="ion-padding">
    <ion-card>
      <ion-card-header>
        <ion-card-title style:text-align="center">Choose a session</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          {#each sessions as session}
            <ion-item>
              <ion-label>
                <ion-avatar style:background="gray" style:display="flex">
                  <ion-text color="light" style:margin="auto">
                    {session.metadata?.displayName.charAt(0).toLocaleUpperCase()}
                  </ion-text>
                </ion-avatar>
                <span>{session.metadata?.displayName}</span>
              </ion-label>
            </ion-item>
          {/each}
        </ion-list>
      </ion-card-content>

      <div class="buttons">
        <ion-button fill="clear" href="import" class="ion-margin-top">Import</ion-button>
        <ion-button fill="clear" href="create" class="ion-margin-top">Create</ion-button>
      </div>
    </ion-card>
  </ion-content>
{/if}

<style>
  ion-card {
    margin: auto;
    max-width: 500px;
  }

  ion-label {
    display: flex !important;
    align-items: center;
    gap: 16px;
  }

  ion-avatar {
    height: 32px;
    width: 32px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>

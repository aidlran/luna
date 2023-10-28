<script lang="ts">
  import { useSession, type Session, type ActiveSession } from 'trusync/session';
  import { activeSessionStore, allSessionsStore, getApp } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { focus } from '$lib/client/actions/focus';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  const app = getApp();
  let activeSession: ActiveSession<SessionMetadata> | undefined;
  let desiredSession: Session<SessionMetadata> | undefined;
  let selectElement: HTMLSelectElement;
  let modalInputElement: HTMLInputElement;
  let modalInputError = false;
  let displayConfirmResetModal = false;

  // TODO: individual session stores

  $: {
    if ($allSessionsStore) {
      if (!Object.values($allSessionsStore).length) {
        goto('/session/create');
      }
    }
    if ($activeSessionStore) {
      activeSession = $activeSessionStore as ActiveSession<SessionMetadata> | undefined;
    }
  }

  // onMount(() => {
  //   // TODO: the frag state should persist between pages
  //   // need a standard way to do this
  //   for (const [k, v] of $page.url.hash
  //     .slice(1)
  //     .split('&')
  //     .map((param) => param.split('=')) as [key?: string, value?: string][]) {
  //     if (v && k === 'session') {
  //       const asInt = Number.parseInt(v);
  //       if (asInt !== $identity.activeSession) {
  //         switchSession(asInt);
  //       }
  //     }
  //   }
  // });

  function sessionName(session?: Session<SessionMetadata | unknown>): string {
    return (session?.metadata as SessionMetadata)?.displayName ?? session?.id?.toString() ?? '?';
  }

  function switchSession(sessionID: number): void {
    desiredSession = $allSessionsStore?.[sessionID] as Session<SessionMetadata>;
  }

  async function onChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ): Promise<void> {
    const selectedValue = event.currentTarget.value;
    const asInt = Number.parseInt(selectedValue);
    if (asInt) {
      switchSession(asInt);
      return;
    } else {
      switch (selectedValue) {
        case 'create':
          goto(`/session/create`);
          return;
        case 'anon':
          if (activeSession) {
            displayConfirmResetModal = true;
          }
          return;
      }
    }
    cancel();
  }

  function onModalPasswordSubmit(): void {
    // TODO: display error message on modal
    if (desiredSession) {
      useSession(desiredSession.id, modalInputElement.value, (error) => {
        if (error && error instanceof Error) {
          modalInputError = true;
          modalInputElement.focus();
          return;
        }
      });
    }
    cancel();
  }

  function cancel(): void {
    selectElement.value = sessionName(activeSession);
    desiredSession = undefined;
    displayConfirmResetModal = false;
  }
</script>

<label>
  Active session
  <select on:change={onChange} bind:this={selectElement}>
    <optgroup label="Active session">
      <option selected disabled value={$activeSessionStore?.id.toString() ?? 'anon'}>
        {#if activeSession}
          {sessionName(activeSession)}
        {:else}
          {'Anonymous'}
        {/if}
      </option>
    </optgroup>
    {#if $allSessionsStore}
      <optgroup label="Switch session">
        {#each Object.values($allSessionsStore) as session}
          {#if session && session !== activeSession}
            <option value={session.id.toString()}>{sessionName(session)}</option>
          {/if}
        {/each}
      </optgroup>
    {/if}
    <optgroup label="Actions">
      {#if activeSession}
        <option value="anon">Go Anonymous</option>
      {/if}
      <option value="create">Create a new session</option>
    </optgroup>
  </select>
</label>

{#if desiredSession}
  <div
    role="presentation"
    class="modal-overlay"
    on:click={cancel}
    on:keydown={(event) => event.key === 'Escape' && cancel()}
  >
    <div role="none" class="card" style:margin="auto" on:click|stopPropagation>
      <h1>Switch to session {sessionName(desiredSession)}</h1>
      <form on:submit|preventDefault={onModalPasswordSubmit}>
        <label class:error={modalInputError} use:focus>
          Enter your password (required)
          <input required type="password" bind:this={modalInputElement} />
        </label>
        <input type="submit" value="Switch session" />
      </form>
    </div>
  </div>
{:else if displayConfirmResetModal}
  <div
    role="presentation"
    class="modal-overlay"
    on:click={cancel}
    on:keydown={(event) => event.key === 'Escape' && cancel()}
  >
    <div role="none" class="card" style:margin="auto" on:click|stopPropagation>
      <h1>Are you sure you want to continue?</h1>
      <p>Your session will end and you will enter anonymous mode.</p>
      <button on:click={cancel} use:focus>Cancel</button>
      <button
        on:click={() => {
          // TODO
          app.identity.reset();
          displayConfirmResetModal = false;
        }}>Continue</button
      >
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #0002;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
</style>

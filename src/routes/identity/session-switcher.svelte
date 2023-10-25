<script lang="ts">
  import type { GetSessionsResult } from 'trusync';
  import { getApp, getIdentity } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { focus } from '$lib/client/actions/focus';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  type Session = GetSessionsResult<SessionMetadata>[0];

  const app = getApp();
  const identity = getIdentity();

  // TODO: reactive sessions store
  let allSessionsPromise: Promise<GetSessionsResult<SessionMetadata>>;

  $: {
    allSessionsPromise = $identity.getSessions<SessionMetadata>().then((sessions) => {
      if (!sessions.length) {
        goto('/identity/create/session');
      }
      return sessions as GetSessionsResult<SessionMetadata>;
    });
  }

  let selectElement: HTMLSelectElement;
  let desiredSession: Session | undefined;

  let displayPasswordModal = false;
  let modalInputElement: HTMLInputElement;
  let modalInputError = false;

  let displayConfirmResetModal = false;

  function findSession(sessionID: number): Promise<Session | undefined> {
    return allSessionsPromise.then((sessions) =>
      sessions.find((session) => session.id === sessionID),
    );
  }

  function sessionName(session?: GetSessionsResult<SessionMetadata>[0]): string {
    return session?.metadata?.displayName ?? session?.id.toString() ?? '?';
  }

  function activeSessionSelectValue(): string {
    return $identity.activeSession?.toString() ?? 'anon';
  }

  async function onChange(): Promise<void> {
    const selectedValue = selectElement.value;
    const asNumber = Number(selectedValue);
    const isInt = Number.isInteger(asNumber);

    if (isInt) {
      desiredSession = await findSession(asNumber);
      if (desiredSession) {
        displayPasswordModal = true;
        return;
      }
      // TODO: it should set a query param, modal is shown if present. Allows refresh or redirect here to show it.
    } else {
      switch (selectedValue) {
        case 'create':
          goto('/identity/create/session');
          break;
        case 'anon':
          if ($identity.activeSession)
            if ($identity.activeSession) {
              displayConfirmResetModal = true;
            } else if ($identity.importedAddresses.length) {
              // TODO: warn they'll be lost
              displayConfirmResetModal = true;
            }
      }
    }

    // selectElement.value = activeSessionSelectValue();
  }

  async function onModalPasswordSubmit(): Promise<void> {
    // TODO: display error message on modal
    if (desiredSession) {
      try {
        await app.identity.useSession(desiredSession.id, modalInputElement.value);
      } catch (error) {
        modalInputError = true;
        modalInputElement.focus();
        return;
      }
    }
    displayPasswordModal = false;
  }

  function cancel(): void {
    selectElement.value = activeSessionSelectValue();
    desiredSession = undefined;
    displayConfirmResetModal = false;
    displayPasswordModal = false;
  }
</script>

<label>
  Active session
  <select on:change={onChange} bind:this={selectElement}>
    {#await allSessionsPromise then allSessions}
      <optgroup label="Active session">
        <option selected disabled value={activeSessionSelectValue()}>
          {$identity.activeSession
            ? sessionName(allSessions.find((session) => session.id === $identity.activeSession))
            : 'Anonymous'}
        </option>
      </optgroup>
      {#if allSessions.length > 1 || (allSessions.length === 1 && !$identity.activeSession)}
        <optgroup label="Switch session">
          {#each allSessions as session}
            {#if session.id !== $identity.activeSession}
              <option value={session.id.toString()}>{sessionName(session)}</option>
            {/if}
          {/each}
        </optgroup>
      {/if}
      <optgroup label="Actions">
        {#if $identity.activeSession}
          <option value="anon">Go Anonymous</option>
        {/if}
        <option value="create">Create a new session</option>
      </optgroup>
    {/await}
  </select>
</label>

{#if displayPasswordModal}
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

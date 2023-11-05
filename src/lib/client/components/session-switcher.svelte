<script lang="ts">
  import { tick } from 'svelte';
  import { useSession, type Session, clearSession, type InactiveSession } from 'trusync/session';
  import { activeSessionStore, allSessionsStore } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { focus } from '$lib/client/actions/focus';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  let desiredSession: Session<SessionMetadata> | undefined;
  let selectElement: HTMLSelectElement;
  let modalInputElement: HTMLInputElement;
  let modalInputError = false;
  let displayConfirmResetModal = false;
  let fragState: Partial<Record<string, string>>;

  // TODO: individual session stores

  $: if ($allSessionsStore) {
    if (!Object.values($allSessionsStore).length) {
      goto(`/session/create${$page.url.hash}`);
    } else {
      fragState = {};
      for (const param of $page.url.hash.slice(1).split('&')) {
        if (!param) {
          continue;
        }
        const [key, value] = param.split('=');
        if (key === 'session') {
          const sessionID = Number.parseInt(value);
          if (sessionID && $activeSessionStore?.id !== sessionID) {
            switchSession(sessionID);
            continue;
          }
        }
        fragState[key] = value;
      }
      if (!fragState['session'] && $activeSessionStore?.id) {
        fragState['session'] = $activeSessionStore?.id?.toString();
      }
      let hash = '';
      let once = false;
      for (const [key, value] of Object.entries(fragState)) {
        if (once) hash += '&';
        hash += `${key}=${value}`;
        once = true;
      }
      window.location.hash = hash;
    }
  }

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
          goto(`/session/create${$page.url.hash}`);
          break;
        case 'anon':
          if ($activeSessionStore) {
            displayConfirmResetModal = true;
          }
          return;
      }
    }
    cancel();
  }

  function onModalPasswordSubmit(): void {
    if (desiredSession) {
      useSession((desiredSession as InactiveSession).id, modalInputElement.value, (error) => {
        if (error && error instanceof Error) {
          // TODO: display error message on modal
          modalInputError = true;
          modalInputElement.focus();
        } else {
          // Await tick - the select options will be updated and we need to keep the
          // "active session" <option> not-disabled so it doesn't get unselected
          tick().then(() => (desiredSession = undefined));
        }
        return;
      });
    }
  }

  function cancel(): void {
    selectElement.value = $activeSessionStore?.id?.toString() ?? 'anon';
    desiredSession = undefined;
    displayConfirmResetModal = false;
  }
</script>

<label>
  Active session
  <select on:change={onChange} bind:this={selectElement}>
    <optgroup label="Active session">
      <option
        selected
        disabled={!desiredSession}
        value={$activeSessionStore?.id?.toString() ?? 'anon'}
      >
        {#if $activeSessionStore}
          {sessionName($activeSessionStore)}
        {:else}
          {'Anonymous'}
        {/if}
      </option>
    </optgroup>
    {#if $allSessionsStore && Object.keys($allSessionsStore).length}
      <optgroup label="Switch session">
        {#each Object.values($allSessionsStore) as session}
          {#if session && session !== $activeSessionStore}
            <option value={session.id?.toString()}>{sessionName(session)}</option>
          {/if}
        {/each}
      </optgroup>
    {/if}
    <optgroup label="Actions">
      {#if $activeSessionStore}
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
      <button on:click={() => clearSession(() => (displayConfirmResetModal = false))}
        >Continue</button
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

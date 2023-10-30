<script lang="ts">
  import { tick } from 'svelte';
  import { useSession, type Session } from 'trusync/session';
  import { activeSessionStore, allSessionsStore, getApp } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { focus } from '$lib/client/actions/focus';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  const app = getApp();
  let desiredSession: Session<SessionMetadata> | undefined;
  let selectElement: HTMLSelectElement;
  let modalInputElement: HTMLInputElement;
  let modalInputError = false;
  let displayConfirmResetModal = false;

  // TODO: individual session stores

  $: if ($allSessionsStore && !Object.values($allSessionsStore).length) {
    goto('/session/create');
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
      useSession(desiredSession.id, modalInputElement.value, (error) => {
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
    selectElement.value = $activeSessionStore?.id.toString() ?? 'anon';
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
        value={$activeSessionStore?.id.toString() ?? 'anon'}
      >
        {#if $activeSessionStore}
          {sessionName($activeSessionStore)}
        {:else}
          {'Anonymous'}
        {/if}
      </option>
    </optgroup>
    {#if $allSessionsStore}
      <optgroup label="Switch session">
        {#each Object.values($allSessionsStore) as session}
          {#if session && session !== $activeSessionStore}
            <option value={session.id.toString()}>{sessionName(session)}</option>
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

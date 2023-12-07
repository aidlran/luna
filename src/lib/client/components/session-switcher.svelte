<script lang="ts">
  import { type Session, session } from 'trusync/session';
  import { activeSession, allSessions } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { focus } from '../actions/focus';
  import { fragmentParam } from './url-state';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  const activeSessionStore = activeSession();
  const allSessionsStore = allSessions();
  const sessionParamStore = fragmentParam('sid');

  let selectElement: HTMLSelectElement;
  let displayConfirmResetModal = false;

  $: selectElement && (selectElement.value = $sessionParamStore ?? 'anon');

  function sessionName(session?: Session): string {
    return (
      (session?.metadata as SessionMetadata)?.displayName ?? session?.id?.toString() ?? 'Anonymous'
    );
  }

  async function onChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ): Promise<void> {
    const selectedValue = event.currentTarget.value;
    const asInt = Number.parseInt(selectedValue);
    if (asInt) {
      sessionParamStore.set(selectedValue);
      return;
    } else {
      switch (selectedValue) {
        case 'manage':
          goto(`/session/${$page.url.hash}`);
          break;
        case 'create':
          goto(`/session/create${$page.url.hash}`);
          break;
        case 'anon':
          $activeSessionStore && (displayConfirmResetModal = true);
          return;
      }
    }
    cancel();
  }

  function cancel(): void {
    selectElement.value = $sessionParamStore ?? 'anon';
    displayConfirmResetModal = false;
  }
</script>

<label>
  Active session
  <select on:change={onChange} bind:this={selectElement}>
    <optgroup label="Active session">
      <option selected value={$activeSessionStore?.id?.toString() ?? 'anon'}>
        {sessionName($activeSessionStore)}
      </option>
    </optgroup>
    <!-- TODO: hide if only one session and it is active -->
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
        <option value="manage">Manage session</option>
        <option value="anon">Go Anonymous</option>
      {/if}
      <option value="create">Create a new session</option>
    </optgroup>
  </select>
</label>

<!-- TODO: common modal component or system -->
{#if displayConfirmResetModal}
  <div
    role="presentation"
    class="modal"
    on:click={cancel}
    on:keydown={(event) => event.key === 'Escape' && cancel()}
  >
    <div role="none" class="card" style:margin="auto" on:click|stopPropagation>
      <h1>Are you sure you want to continue?</h1>
      <p>Your session will end and you will enter anonymous mode.</p>
      <button on:click={cancel} use:focus>Cancel</button>
      <button
        on:click={() =>
          session().clearSession(() => {
            sessionParamStore.set(undefined);
            displayConfirmResetModal = false;
          })}>Continue</button
      >
    </div>
  </div>
{/if}

<script lang="ts">
  import type { GetSessionsResult } from 'trusync';
  import { getApp, getIdentity } from 'trusync-svelte';
  import { goto } from '$app/navigation';

  const app = getApp();
  const identity = getIdentity();

  let selected: HTMLOptionElement;

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  // TODO: reactive sessions store
  const allSessionsPromise = app.identity.getSessions<SessionMetadata>().then((sessions) => {
    if (!sessions.length) {
      goto('/identity/create/session');
    }
    return sessions as GetSessionsResult<SessionMetadata>;
  });

  function sessionName(session?: GetSessionsResult<SessionMetadata>[0]) {
    return session?.metadata?.displayName ?? session?.id ?? '?';
  }

  function onChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }): void {
    const value = event.currentTarget.value;
    event.currentTarget.value = selected.value;

    if (Number.isInteger(Number(value))) {
      // TODO: if session selected -> show password modal -> useSession
      // TODO: it should set a query param, modal is shown if present. Allows refresh or redirect here to show it.
    } else
      switch (value) {
        case 'create':
          goto('/identity/create/session');
          break;
        case 'anon':
          // TODO: if anon selected -> show confirm modal -> clearSession
          // TODO: if anon selected but identities exist, warn they'll be lost
          break;
      }
  }
</script>

<label>
  Active session
  <select on:change={onChange}>
    {#await allSessionsPromise then allSessions}
      <optgroup label="Active session">
        <option selected disabled value={$identity.activeSession} bind:this={selected}>
          {$identity.activeSession
            ? sessionName(allSessions.find((session) => session.id === $identity.activeSession))
            : 'Anonymous'}
        </option>
      </optgroup>
      {#if allSessions.length > 1 || (allSessions.length === 1 && !$identity.activeSession)}
        <optgroup label="Switch session">
          {#each allSessions as session}
            {#if session.id !== $identity.activeSession}
              <option value={session.id}>{sessionName(session)}</option>
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

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

  function getSessionName(session: GetSessionsResult<SessionMetadata>[0]) {
    return session.metadata?.displayName ?? session.id;
  }

  async function onChange(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
    // TODO
    // if session selected -> show password modal -> useSession
    // if anon selected -> show confirm modal -> clearSession
    // if anon selected but identities exist, warn they'll be lost
    const value = event.currentTarget.value;
    event.currentTarget.value = selected.value;
    if (value === 'create') {
      await goto('/identity/create/session');
    }
  }
</script>

{#await allSessionsPromise then allSessions}
  <select on:change={onChange}>
    <optgroup label="Active">
      <option selected disabled bind:this={selected}>
        {$identity.activeSession
          ? (() => {
              const session = allSessions.find((session) => session.id === $identity.activeSession);
              return session ? getSessionName(session) : '?';
            })()
          : 'Anonymous'}
      </option>
    </optgroup>
    {#if allSessions.length > 1 || (allSessions.length === 1 && !$identity.activeSession)}
      <optgroup label="Switch">
        {#each allSessions as session}
          {#if session.id !== $identity.activeSession}
            <option>{getSessionName(session)}</option>
          {/if}
        {/each}
      </optgroup>
    {/if}
    <optgroup>
      {#if $identity.activeSession}
        <option>Go Anonymous</option>
      {/if}
      <option value="create">Create New Session</option>
    </optgroup>
  </select>
{/await}

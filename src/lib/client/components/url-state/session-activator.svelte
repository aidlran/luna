<script lang="ts">
  import { useSession, type Session } from 'trusync';
  import { activeSessionStore, allSessionsStore } from 'trusync-svelte';
  import { focus } from '../../actions/focus';
  import { fragmentParam } from './fragment-param-function';
    import { tick } from 'svelte';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  const sessionParam = fragmentParam('sid');
  let password: string;
  let targetSession: Session<SessionMetadata> | undefined;
  let error: string | undefined;

  $: if ($sessionParam && $allSessionsStore && Object.keys($allSessionsStore).length) {
    const sessionID = Number.parseInt($sessionParam);
    if (sessionID && sessionID !== $activeSessionStore?.id) {
      targetSession = $allSessionsStore[sessionID] as Session<SessionMetadata>;
    }
  }

  function close(): void {
    targetSession = undefined;
    sessionParam.set($activeSessionStore?.id?.toString());
  }

  function submit(): void {
    targetSession?.id && useSession(targetSession.id, password, (result) => {
      if (result instanceof Error) {
        error = result.message;
      } else {
        tick().then(close);
      }
    });
  }
</script>

{#if targetSession}
  <div
    role="presentation"
    class="modal"
    on:click={close}
    on:keydown={(event) => event.key === 'Escape' && close()}
  >
    <div role="none" class="card" style:margin="auto" on:click|stopPropagation>
      <h1>Switch to session {targetSession.metadata?.displayName ?? targetSession.id}</h1>
      <form on:submit|preventDefault={submit}>
        <label class:error={!!error} use:focus>
          Enter your password (required)
          <input required type="password" bind:value={password} />
        </label>
        <input type="submit" value="Activate session" />
      </form>
    </div>
  </div>
{/if}

<style>
  /* TODO: common modal component or system */
  .modal {
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

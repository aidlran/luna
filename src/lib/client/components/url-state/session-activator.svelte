<script lang="ts">
  import { tick } from 'svelte';
  import { type Session, session } from 'trusync';
  import { activeSession, allSessions } from 'trusync-svelte';
  import { focus } from '../../actions/focus';
  import { fragmentParam } from './fragment-param-function';

  // TODO: find a home
  interface SessionMetadata {
    displayName?: string;
  }

  const activeSessionStore = activeSession();
  const allSessionsStore = allSessions();
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
    password = '';
    targetSession = error = undefined;
    sessionParam.set($activeSessionStore?.id?.toString());
  }

  function submit(): void {
    if (targetSession?.id) {
      session().useSession(targetSession.id, password, (result) => {
        if (result instanceof Error) {
          error = result.message;
        } else {
          tick().then(close);
        }
      });
    }
  }
</script>

<!-- TODO: common modal component or system -->
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
        <label class:error={!!error} style:margin-bottom="50px" use:focus>
          Enter your password (required)
          <input required type="password" bind:value={password} />
        </label>
        <input type="submit" value="Activate session" />
      </form>
    </div>
  </div>
{/if}

<script lang="ts">
  import { Data } from '@enclavetech/lib-web';
  import { createEventDispatcher } from 'svelte';
  import type { ITodo } from '../interfaces/todo.interface';

  export let task: ITodo;

  const dispatch = createEventDispatcher();

  $: display = 'block';

  function onDelete() {
    if (task.id) {
      display = 'none';
      Data.deleteByID(task.id)
        .then(() => dispatch('delete', task.id))
        .catch((e) => (display = 'block'));
    }
  }
</script>

<div class="task" style:display>
  <span>{task.name}</span>
  {#if task.id}
    <button on:click={onDelete}>Delete</button>
  {/if}
</div>

<style>
  .task {
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
  }
</style>

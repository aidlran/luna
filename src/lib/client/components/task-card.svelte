<script lang="ts">
  import { Data } from '@enclavetech/lib-web';
  import { createEventDispatcher } from 'svelte';
  import type { ITodo } from '../interfaces/todo.interface';
  import { drawer } from '../utils/stores';
  import TaskDetail from './task-detail.svelte';

  export let task: ITodo;

  const dispatch = createEventDispatcher();

  $: display = 'flex';

  function onDelete() {
    if (task.id) {
      display = 'none';
      Data.deleteByID(task.id)
        .catch((error) => {
          display = 'flex';
          throw error;
        })
        .then(() => dispatch('delete', task.id));
    }
  }

  function onActivate() {
    drawer.update(
      (value) =>
        (value = {
          component: TaskDetail,
          props: { task },
        }),
    );
  }
</script>

<div
  role="button"
  class="task"
  style:display
  tabindex="0"
  on:click|stopPropagation={onActivate}
  on:keypress|stopPropagation={onActivate}
>
  <span>{task.name}</span>
  {#if task.id}
    <button on:click|stopPropagation={onDelete} on:keypress|stopPropagation>Delete</button>
  {/if}
</div>

<style>
  .task {
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
</style>

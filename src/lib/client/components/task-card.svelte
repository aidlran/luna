<script lang="ts">
  import { Data } from '@enclavetech/api';
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '../interfaces/task';
  import type { OptionalID } from '../types/optional-id';
  import { drawer } from '../utils/stores';
  import TaskDetail from './task-detail.svelte';

  export let task: OptionalID<Task>;

  const dispatch = createEventDispatcher();

  $: display = 'flex';

  function onDelete() {
    if (!task.id) return;

    // TODO: Data items will be stores in future.
    // The TaskDetail component would subscribe to the item.
    // on delete, it will handle closing the drawer/itself.
    drawer.close();

    display = 'none';
    Data.deleteByID(task.id)
      .catch((error) => {
        display = 'flex';
        throw error;
      })
      .then(() => dispatch('delete', task.id));

    // TODO: fix double delete bug
  }

  function onActivate() {
    drawer.open(TaskDetail, { task });
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
    <button on:click|stopPropagation={onDelete}>Delete</button>
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

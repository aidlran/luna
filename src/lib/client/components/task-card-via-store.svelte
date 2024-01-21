<script lang="ts">
  // import { data } from 'librebase-svelte';
  // import type { Task } from '../interfaces/task';
  import { drawerControl } from './drawer';
  import TaskDetail from './task-detail/task-detail.svelte';

  // export let id: string;

  // const task = data<Task>(id);

  function onActivate() {
    drawerControl().open(TaskDetail);
  }
</script>

<div
  role="button"
  class="task"
  tabindex="0"
  on:click|stopPropagation={onActivate}
  on:keypress|stopPropagation={onActivate}
>
  <!-- <span>{$task?.name}</span> -->
</div>

<style>
  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
</style>

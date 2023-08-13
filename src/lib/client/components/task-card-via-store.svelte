<script lang="ts">
  import { data } from '@enclavetech/svelte';
  import type { Task } from '../interfaces/task';
  import { drawer } from '../utils/stores';
  import TaskDetail from './task-detail-via-store.svelte';

  export let id: string;

  const task = data<Task>(id);

  function onActivate() {
    drawer.open(TaskDetail, { id });
  }
</script>

<div
  role="button"
  class="task"
  tabindex="0"
  on:click|stopPropagation={onActivate}
  on:keypress|stopPropagation={onActivate}
>
  <span>{$task.name}</span>
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

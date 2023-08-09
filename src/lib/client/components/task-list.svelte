<script lang="ts">
  import { Data } from '@enclavetech/api';
  import type { Task } from '../interfaces/task';
  import type { OptionalID } from '../types/optional-id';
  import TaskCard from './task-card.svelte';

  export let taskList: Task;
  let childTasks: OptionalID<Task>[];

  let isAddingItem = false;
  let newItemName: string;

  async function initChildTasks() {
    debugger;
    if (taskList.children?.length) {
      childTasks = await Promise.all(
        taskList.children.map((taskID) => Data.getByID(taskID) as Promise<Task>),
      );
    } else {
      childTasks = [];
    }
  }

  function focus(e: HTMLElement) {
    e.focus();
  }

  function cancel() {
    isAddingItem = false;
    newItemName = '';
  }

  async function sort() {
    childTasks = childTasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  async function onAddItemClick() {
    if (isAddingItem) await onSubmit();
    isAddingItem = true;
  }

  async function onSubmit() {
    if (!newItemName) return;

    const newTask: OptionalID<Task> = {
      type: 'task',
      name: newItemName,
      parent: taskList.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add item to top of list
    childTasks = [newTask].concat(childTasks);
    newItemName = '';

    // Push change
    await Data.create(newTask)
      .then((result) => {
        if (result.errors || result.message) throw new Error();

        // Add ID to todo
        newTask.id = result.id;
        childTasks = childTasks;
      })
      .catch(() => {
        // Remove item if push failed
        childTasks = childTasks.filter((todo) => todo !== newTask);
      });
  }

  function onDelete({ detail: id }: CustomEvent<string>) {
    childTasks = childTasks.filter((todo) => todo.id !== id);
  }

  sort();
</script>

<section class="task-list">
  <header>
    <h1>{taskList.name}</h1>
    <button on:click={onAddItemClick}>+</button>
  </header>
  <div class="task-entries">
    {#if isAddingItem}
      <form class="task" on:submit|preventDefault={onSubmit}>
        <input required use:focus on:blur={cancel} bind:value={newItemName} />
      </form>
    {/if}
    {#await initChildTasks()}
      {#each childTasks as task}
        <TaskCard {task} on:delete={onDelete} />
      {/each}
    {/await}
  </div>
</section>

<style>
  .task-list {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    box-shadow: var(--shadow);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-2));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 10px 18px 8px;
  }

  h1 {
    margin: 3px 0 0;
  }

  .task-entries {
    flex-grow: 1;
    padding: 2px 8px;
    border: var(--border);
    border-top: none;
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  @media only screen and (min-width: 600px) {
    .task-list {
      width: 360px;
      border-radius: 18px;
    }

    header {
      border-radius: 18px 18px 0 0;
    }

    .task-entries {
      border-radius: 0 0 18px 18px;
    }
  }

  .task {
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
  }
</style>

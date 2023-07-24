<script lang="ts">
  import { Data } from '@enclavetech/lib-web';
  import type { ITodo } from '../interfaces/todo.interface';
  import TaskListEntry from './task-list-entry.svelte';

  export let listName: string;
  export let items = Array<ITodo>();

  let isAddingItem = false;
  let disabled = false;
  let newItemName: string;

  function focus(e: HTMLElement) {
    e.focus();
  }

  function sort(): void {
    items = items.sort((a, b) => b.createdAt - a.createdAt);
  }

  async function onAddItemClick() {
    await onSubmit();
    isAddingItem = true;
  }

  async function onSubmit() {
    if (newItemName) {
      const newTodo: ITodo = {
        type: 'todo',
        name: newItemName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Add item to top of list
      items = [newTodo].concat(items);
      newItemName = '';

      // Push change
      await Data.create(JSON.stringify(newTodo))
        .then((result) => {
          if (result.errors || result.message) throw new Error();

          // Add ID to todo
          newTodo.id = result.id;
          items = items; // Assign to trigger Svelte change detection
        })
        .catch(() => {
          // Remove item if push failed
          items = items.filter((todo) => todo !== newTodo);
        });
    }
  }

  function onDelete({ detail: id }: CustomEvent<string>) {
    items = items.filter((todo) => todo.id !== id);
  }

  sort();
</script>

<section class="task-list">
  <header>
    <h1>{listName}</h1>
    <button on:click={onAddItemClick}>+</button>
  </header>
  <div class="task-entries">
    {#if isAddingItem}
      <form class="task" on:submit|preventDefault={onSubmit}>
        <input
          required
          use:focus
          on:blur={() => (isAddingItem = false)}
          bind:value={newItemName}
          {disabled}
        />
      </form>
    {/if}
    {#each items as task}
      <TaskListEntry {task} on:delete={onDelete} />
    {/each}
  </div>
</section>

<style>
  .task-list {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    box-shadow: -4px -4px 24px 4px #5a5a7010;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-2));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 8px;
  }

  h1 {
    margin: 0;
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
</style>

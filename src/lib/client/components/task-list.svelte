<script lang="ts">
  // import type { Hash } from 'librebase';
  import type { Task } from '../interfaces/task';
  // import type { OptionalID } from '../types/optional-id';
  // import TaskCard from './task-card.svelte';
  // import TaskCardViaStore from './task-card-via-store.svelte';

  // export let hash: Hash;
  let taskList: Task;
  // let childTasks: OptionalID<Task>[];

  let isAddingItem = false;
  let newItemName: string;

  // app.data.getJSON<Task>(hash).then((value) => (taskList = value));

  function cancel() {
    isAddingItem = false;
    newItemName = '';
  }

  // async function sort() {
  //   childTasks = childTasks.sort((a, b) => b.createdAt - a.createdAt);
  // }

  async function onAddItemClick() {
    if (isAddingItem) await onSubmit();
    isAddingItem = true;
  }

  async function onSubmit() {
    // if (!newItemName) return;
    // const newTask: OptionalID<Task> = {
    //   type: 'task',
    //   name: newItemName,
    //   parent: taskList.id,
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    // };
    // // Add item to top of list
    // childTasks = [newTask].concat(childTasks);
    // newItemName = '';
    // // Push change
    // await Data.create(newTask)
    //   .then((result) => {
    //     if (result.errors || result.message) throw new Error();
    //     // Add ID to todo
    //     newTask.id = result.id;
    //     if (!taskList.children) {
    //       taskList.children = [result.id];
    //     } else {
    //       taskList.children.push(result.id);
    //     }
    //     childTasks = childTasks;
    //   })
    //   .catch((e) => {
    //     // Remove item if push failed
    //     childTasks = childTasks.filter((todo) => todo !== newTask);
    //     throw e;
    //   });
    // const { id: taskListID, ...taskListData } = taskList;
    // await Data.replaceByID(taskListID, taskListData)
    //   .then(({ id }) => {
    //     taskList.id = id;
    //   })
    //   .catch((e) => {
    //     // Remove item if push failed
    //     if (newTask.id) {
    //       Data.deleteByID(newTask.id);
    //     }
    //     childTasks = childTasks.filter((todo) => todo !== newTask);
    //     throw e;
    //   });
    // dispatch('update', {
    //   id: taskListID,
    //   new: taskList,
    // });
  }

  // function onDelete({ detail: id }: CustomEvent<string>) {
  //   childTasks = childTasks.filter((todo) => todo.id !== id);
  // }

  // TODO: move to `svelte-stuff`.
  export function autofocus(node: HTMLElement) {
    node.focus();
  }
</script>

{#if taskList}
  <section>
    <header>
      <h1>{taskList.name}</h1>
      <button on:click={onAddItemClick}>+</button>
    </header>
    <div class="entries">
      {#if isAddingItem}
        <form on:submit|preventDefault={onSubmit}>
          <input required use:autofocus on:blur={cancel} bind:value={newItemName} />
        </form>
      {/if}
      <!-- {#each childTasks as task} -->
      <!-- <TaskCard {task} on:delete={onDelete} /> -->
      <!-- {#if task.id} -->
      <!-- <TaskCardViaStore id={task.id}></TaskCardViaStore> -->
      <!-- {/if} -->
      <!-- {/each} -->
    </div>
  </section>
{/if}

<style>
  section {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    margin-top: 8px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
  }

  h1 {
    margin: 3px 0 0;
    font-size: 1.2em;
  }

  .entries {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-flow: column nowrap;
    gap: 8px;
    padding: 6px 4px;
  }

  form {
    padding: 8px;
    border-radius: 8px;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    cursor: pointer;
  }

  @media only screen and (min-width: 480px) {
    section {
      width: 340px;
    }

    header {
      border-bottom: var(--border);
    }
  }
</style>

<script lang="ts">
  import type { KeyboardEventHandler } from 'svelte/elements';
  import { Data } from 'trusync';
  import { autofocus, data, root, type DataStore } from 'trusync-svelte';
  import type { Task } from '$lib/client/interfaces/task';
  import type { RootNode } from '$lib/client/types/root-node';

  // TODO: can we make it so that lib-svelte automatically converts references to data stores?
  const rootStore = root<RootNode>(0);
  let childTaskLists = new Array<DataStore<Task>>();
  let isCreatingList = false;
  let newListName = '';

  $: {
    if ($rootStore?.children?.length) {
      childTaskLists = [];
      for (const child of $rootStore.children) {
        childTaskLists.push(data<Task>(child));
      }
    }
  }

  function onNewListClick() {
    isCreatingList = true;
  }

  function onNewListCreate() {
    if (isCreatingList && newListName) {
      const now = Date.now();
      Data.create({
        type: 'task',
        name: newListName,
        parent: $rootStore.id,
        createdAt: now,
        updatedAt: now,
      })
        // TODO: bruh the library needs to automagically do this for the whole graph
        .then(({ id }) =>
          rootStore.put({
            ...$rootStore,
            children: $rootStore.children?.concat(id) ?? [id],
          }),
        );
    }

    isCreatingList = false;
  }

  const onInputKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case 'Escape':
        isCreatingList = false;
        newListName = '';
        event.currentTarget.blur();
        break;
      case 'Enter':
        event.currentTarget.blur();
        break;
    }
  };

  async function init() {
    // rootNode = (await Data.pullRootData(0).catch((e) => {
    //   if (e) {
    //     if (!(e instanceof HttpResponseError && e.status == 404)) {
    //       throw e;
    //     }
    //   }
    //   const date = Date.now();
    //   return Data.pushRootData(
    //     {
    //       createdAt: date,
    //       updatedAt: date,
    //     },
    //     0,
    //   );
    // })) as RootNode;
    // if (!rootNode.children?.length) {
    //   const date = Date.now();
    //   const defaultTaskListPOJO: OptionalID<Task> = {
    //     name: 'My Tasks',
    //     parent: rootNode.id,
    //     type: 'task',
    //     createdAt: date,
    //     updatedAt: date,
    //   };
    //   const defaultTaskList = await Data.create(defaultTaskListPOJO);
    //   rootNode.children = [defaultTaskList.id];
    //   rootNode.updatedAt = Date.now();
    //   Data.pushRootData(rootNode, 0);
    //   rootNode = rootNode;
    // }
    // if (rootNode.children?.length) {
    //   childTaskLists = await Promise.allSettled(
    //     rootNode.children.map((taskListID) => Data.getByID(taskListID) as Promise<Task>),
    //   ).then((results) => {
    //     const childTaskLists = [];
    //     for (const promise of results) {
    //       if (promise.status === 'fulfilled') {
    //         childTaskLists.push(promise.value);
    //       }
    //     }
    //     return childTaskLists;
    //   });
    // } else {
    //   childTaskLists = [];
    // }
  }

  async function onUpdateTaskListID({ detail }: CustomEvent<{ id: string; new: Task }>) {
    // const childTaskListIndex = childTaskLists.findIndex((value) => value.id === detail.id);
    // if (childTaskListIndex >= 0) {
    //   childTaskLists[childTaskListIndex] = detail.new;
    // }
    // if (rootNode.children) {
    //   const rootChildIndex = rootNode.children.findIndex((value) => value === detail.id);
    //   if (rootChildIndex >= 0) {
    //     rootNode.children[rootChildIndex] = detail.new.id;
    //   }
    // }
    // rootNode.updatedAt = Date.now();
    // Data.pushRootData(rootNode, 0);
  }
</script>

<div class="task-list-container">
  {#await init() then}
    {#if childTaskLists}
      {#each childTaskLists as taskList}
        <!-- <TaskList {taskList} on:update={onUpdateTaskListID} /> -->
      {/each}
    {/if}
    <h1>
      {#if isCreatingList}
        <input
          bind:value={newListName}
          use:autofocus
          on:blur={onNewListCreate}
          on:keydown={onInputKeyPress}
        />
      {:else}
        <span role="button" tabindex="0" on:click={onNewListClick} on:keydown={onNewListClick}
          >+ Create list</span
        >
      {/if}
    </h1>
  {/await}
</div>

<style>
  .task-list-container {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: row nowrap;
  }

  @media only screen and (min-width: 480px) {
    .task-list-container {
      gap: 16px;
      margin: 0 16px;
    }
  }

  h1 {
    margin: 0;
  }

  h1 * {
    font-size: 1em;
  }

  h1 input {
    width: calc(100% - 43px);
    margin-top: -12px;
    margin-left: -2px;
    font-weight: bold;
    padding: 0 2px;
    border: none;
    border-bottom: 1px solid #666;
    background: #0000;
  }

  h1 span {
    padding: 12px 12px 6px;
    margin-left: -12px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
  }

  h1 span:hover {
    background: #0001;
  }

  input {
    border: 1px solid black;
  }
</style>

<script lang="ts">
  import { Data, HttpResponseError } from '@enclavetech/api';
  import { TaskList } from '$lib/client/components';
  import type { Task } from '$lib/client/interfaces/task';
  import type { OptionalID } from '$lib/client/types/optional-id';
  import type { RootNode } from '$lib/client/types/root-node';

  let root: RootNode;
  let childTaskLists: Task[];

  async function init() {
    root = (await Data.pullRootData(0).catch((e) => {
      if (e) {
        if (!(e instanceof HttpResponseError && e.status == 404)) {
          throw e;
        }
      }

      const date = Date.now();
      return Data.pushRootData(
        {
          createdAt: date,
          updatedAt: date,
        },
        0,
      );
    })) as RootNode;

    if (!root.children?.length) {
      const date = Date.now();
      const defaultTaskListPOJO: OptionalID<Task> = {
        name: 'My Tasks',
        parent: root.id,
        type: 'task',
        createdAt: date,
        updatedAt: date,
      };
      const defaultTaskList = await Data.create(defaultTaskListPOJO);
      root.children = [defaultTaskList.id];
      root.updatedAt = Date.now();
      Data.pushRootData(root, 0);
      root = root;
    }

    if (root.children?.length) {
      childTaskLists = await Promise.all(
        root.children.map((taskListID) => Data.getByID(taskListID) as Promise<Task>),
      );
    } else {
      childTaskLists = [];
    }
  }

  async function onUpdateTaskListID({ detail }: CustomEvent<{ id: string; new: Task }>) {
    const childTaskListIndex = childTaskLists.findIndex((value) => value.id === detail.id);
    if (childTaskListIndex >= 0) {
      childTaskLists[childTaskListIndex] = detail.new;
    }

    if (root.children) {
      const rootChildIndex = root.children.findIndex((value) => value === detail.id);
      if (rootChildIndex >= 0) {
        root.children[rootChildIndex] = detail.new.id;
      }
    }

    root.updatedAt = Date.now();
    Data.pushRootData(root, 0);
  }
</script>

<div class="task-list-container">
  {#await init() then}
    {#if childTaskLists}
      {#each childTaskLists as taskList}
        <TaskList {taskList} on:update={onUpdateTaskListID} />
      {/each}
    {/if}
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
</style>

<script lang="ts">
  import type { Hash } from 'trusync';
  import { getApp } from 'trusync-svelte';
  import { TaskList } from '$lib/client/components';

  interface ProjexRootData {
    children: Hash[];
  }

  interface ITaskList {
    name: string;
    parent: Hash;
  }

  const app = getApp();
  const rootKey = 'projex';
  let rootHash: Hash;
  let root: ProjexRootData;
  let newListName: string;

  async function updateRoot(payload: ProjexRootData): Promise<void> {
    rootHash = await app.data.putNamedJSON(root, rootKey);
    root = payload;
  }

  async function createTaskList(taskList: ITaskList): Promise<void> {
    const hash = await app.data.putJSON(taskList);
    let newRoot: ProjexRootData;
    if (!root) {
      newRoot = { children: [hash] };
    } else {
      newRoot = structuredClone(root);
      if (!newRoot.children) {
        newRoot.children = [hash];
      } else {
        newRoot.children.push(hash);
      }
    }
    await updateRoot(newRoot);
  }

  app.data.getNamedJSON<ProjexRootData>(rootKey).then((data) => (root = data));
</script>

<div class="board-view">
  {#if root?.children}
    {#each root.children as hash}
      <TaskList {hash} />
    {/each}
  {/if}
  <input
    placeholder="+ Create List"
    bind:value={newListName}
    on:blur={() => (newListName = '')}
    on:keydown={({ currentTarget, key }) => {
      switch (key) {
        case 'Enter':
          createTaskList({
            parent: rootHash,
            name: currentTarget.value,
          });
          currentTarget.blur();
          break;
        case 'Escape':
          currentTarget.blur();
          break;
      }
    }}
  />
</div>

<style>
  .board-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: row nowrap;
  }

  @media only screen and (min-width: 480px) {
    .board-view {
      gap: 16px;
      margin: 0 16px;
    }
  }
</style>

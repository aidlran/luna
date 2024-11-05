<script lang="ts">
  import { deleteContent, File, getContent, putImmutable } from '@astrobase/core';
  import EditableText from '$lib/client/components/editable-text/editable-text.svelte';
  import type { Entity } from '$lib/client/data/entity.svelte';
  import { getRoot, setRoot } from '$lib/client/data/root';

  let root = $state.raw<Entity>({});

  let addingTask = $state(false);

  const pull = () => getRoot().then((r) => (root = r ?? {}));
  pull();

  async function addTask(name: string) {
    if (name) {
      const entity: Entity = { name };
      const file = await new File().setMediaType('application/json').setValue(entity);
      const cid = await putImmutable(file);
      (root.children ??= []).push(cid);
      await setRoot(root);
      pull();
    }
    addingTask = false;
  }
</script>

<table class="w-full">
  <thead>
    <tr>
      <th class="text-left">Task</th>
      <th class="text-right">
        <button disabled={!!addingTask} onclick={() => (addingTask = true)}>Add task</button>
      </th>
    </tr>
  </thead>
  <tbody>
    {#if addingTask}
      <tr>
        <td colspan="2">
          <EditableText editing={true} placeholder="New task" onedit={addTask} />
        </td>
      </tr>
    {/if}
    {#if root.children}
      {#each root.children as cid, i}
        <tr>
          <td class="border" colspan="2">
            {#await getContent<File<Entity>>(cid).then((file) => file?.getValue() as Promise<Entity>)}
              Loading...
            {:then task}
              {#if task}
                <EditableText
                  value={task.name}
                  onedit={async (newName) => {
                    task.name = newName;
                    const file = await new File().setMediaType('application/json').setValue(task);
                    (root.children ??= [])[i] = await putImmutable(file);
                    await setRoot(root);
                    pull();
                    deleteContent(cid);
                  }}
                />
              {:else}
                <span>Returned nothing :o</span>
              {/if}
            {:catch err}
              {err}
            {/await}
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

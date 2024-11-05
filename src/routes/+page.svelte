<script lang="ts">
  import { deleteContent, File, getContent, putImmutable } from '@astrobase/core';
  import { scale } from 'svelte/transition';
  import EditableText from '$lib/client/components/editable-text/editable-text.svelte';
  import type { Entity } from '$lib/client/data/entity.svelte';
  import { root } from '$lib/client/data/root.svelte';

  let addingTask = $state(false);

  async function addTask(name: string) {
    if (name) {
      const entity: Entity = { name };
      const file = await new File().setMediaType('application/json').setValue(entity);
      const cid = await putImmutable(file);
      (root.children ??= []).push(cid);
      root.save();
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
      <tr in:scale>
        <td colspan="2">
          <EditableText editing={true} placeholder="New task" onedit={addTask} />
        </td>
      </tr>
    {/if}
    {#if root.children}
      {#each root.children as cid, i}
        <tr out:scale>
          <td class="border">
            {#await getContent<File<Entity>>(cid).then((file) => file?.getValue() as Promise<Entity>)}
              Loading...
            {:then task}
              {#if task}
                <EditableText
                  value={task.name}
                  onedit={async (newName) => {
                    if (typeof newName === 'string' && newName !== task.name && root.children) {
                      task.name = newName;
                      const file = await new File().setMediaType('application/json').setValue(task);
                      root.children[i] = await putImmutable(file);
                      root.save();
                      deleteContent(cid);
                    }
                  }}
                />
              {:else}
                Returned nothing :o
              {/if}
            {:catch err}
              {err}
            {/await}
          </td>
          <td class="border text-right">
            <button
              onclick={() => {
                if (root.children) {
                  root.children.splice(i, 1);
                  root.save();
                  deleteContent(cid);
                }
              }}>Delete</button
            >
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

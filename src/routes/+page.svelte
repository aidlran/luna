<script lang="ts">
  import { deleteContent } from '@astrobase/core';
  import EditableDate from '$lib/client/components/editable/editable-date.svelte';
  import EditableText from '$lib/client/components/editable/editable-text.svelte';
  import { ImmutableEntity } from '$lib/client/data/entity.svelte';
  import { root } from '$lib/client/data/root.svelte';

  let addingTask = $state(false);

  async function addTask(name: string) {
    if (name) {
      const entity = new ImmutableEntity();
      entity.name = name;
      const cid = await entity.save();
      if (cid) {
        (root.children ??= []).unshift(cid);
        root.save();
      }
    }
    addingTask = false;
  }
</script>

<table class="w-full">
  <thead>
    <tr>
      <th class="text-left border">Task</th>
      <th class="text-left border">Start</th>
      <th class="text-left border">End</th>
      <th class="text-left border">Created</th>
      <th class="text-left border">Updated</th>
      <th class="text-right border">
        <button disabled={!!addingTask} onclick={() => (addingTask = true)}>Add task</button>
      </th>
    </tr>
  </thead>
  <tbody>
    {#if addingTask}
      <tr>
        <td colspan="6">
          <EditableText
            editing={true}
            placeholder="New task"
            transform={(v) => v.trim()}
            onedit={addTask}
          />
        </td>
      </tr>
    {/if}
    {#if root.children}
      {#each root.children as cid, i}
        {@const ent = new ImmutableEntity(cid)}
        <tr>
          <td class="border">
            <EditableText
              value={ent.name}
              transform={(v) => v.trim()}
              onedit={async (newName) => {
                if (typeof newName === 'string' && newName !== ent.name && root.children) {
                  ent.name = newName;
                  root.children[i] = await ent.save();
                  root.save();
                  deleteContent(cid);
                }
              }}
            />
          </td>
          <td class="border">
            <EditableDate
              value={ent.start?.toISOString()}
              onedit={async (start) => {
                const newDate = new Date(start);
                if (newDate.getTime() !== ent.start?.getTime() && root.children) {
                  ent.start = newDate;
                  root.children[i] = await ent.save();
                  root.save();
                  deleteContent(cid);
                }
              }}
            />
            {#if ent.start}
              <button
                onclick={async () => {
                  if (root.children) {
                    ent.start = undefined;
                    root.children[i] = await ent.save();
                    root.save();
                    deleteContent(cid);
                  }
                }}>x</button
              >
            {/if}
          </td>
          <td class="border">
            <EditableDate
              value={ent.end?.toISOString()}
              onedit={async (end) => {
                const newDate = new Date(end);
                if (newDate.getTime() !== ent.start?.getTime() && root.children) {
                  ent.end = newDate;
                  root.children[i] = await ent.save();
                  root.save();
                  deleteContent(cid);
                }
              }}
            />
            {#if ent.end}
              <button
                onclick={async () => {
                  if (root.children) {
                    ent.end = undefined;
                    root.children[i] = await ent.save();
                    root.save();
                    deleteContent(cid);
                  }
                }}>x</button
              >
            {/if}
          </td>
          <td class="border">
            {ent.created?.toLocaleDateString()}
          </td>
          <td class="border">
            {ent.updated?.toLocaleDateString()}
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

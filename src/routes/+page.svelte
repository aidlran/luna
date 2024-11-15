<script lang="ts">
  import { deleteContent } from '@astrobase/core';
  import EditableDate from '$lib/client/components/editable/editable-date.svelte';
  import EditableText from '$lib/client/components/editable/editable-text.svelte';
  import { Entity } from '$lib/client/data/entity.svelte';
  import { root, rootCID } from '$lib/client/data/root.svelte';
  import EntityDependencies from './entity-dependencies.svelte';

  let addingTask = $state(false);
  let hideBlocked = $state(true);
  let hideFuture = $state(true);

  let loaded = $derived(root.children.map((cid) => new Entity(cid)));
  let blocked = $derived(loaded.filter((ent) => !!ent.dependencies.length));

  async function addTask(name: string) {
    if (name) {
      const entity = new Entity();
      entity.name = name;
      entity.parent = rootCID;
      const cid = await entity.save();
      if (cid) {
        root.children.unshift(cid);
        root.save();
      }
    }
    addingTask = false;
  }
</script>

<label>
  <input type="checkbox" bind:checked={hideFuture} />
  Hide future tasks
</label>

<label>
  <input type="checkbox" bind:checked={hideBlocked} />
  Hide blocked
</label>

<table class="w-full">
  <thead>
    <tr>
      <th class="text-left border">Task</th>
      <th class="text-left border">Start</th>
      <th class="text-left border">End</th>
      <th class="text-left border">Dependencies</th>
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
        <td colspan="7">
          <EditableText
            editing={true}
            placeholder="New task"
            transform={(v) => v.trim()}
            onedit={addTask}
          />
        </td>
      </tr>
    {/if}
    {#each loaded as ent, i}
      {#if (!hideFuture || !ent.start || ent.start.getTime() <= Date.now()) && (!hideBlocked || !blocked.includes(ent))}
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
                    }
                  }}>x</button
                >
              {/if}
            </td>
            <td class="border">
              <EntityDependencies {ent} />
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
                if (root.children && ent.cid) {
                    root.children.splice(i, 1);
                  deleteContent(ent.cid);
                    root.save();
                    // TODO: delete previous generations
                  }
                }}>Delete</button
              >
            </td>
          </tr>
        {/if}
      {/each}
  </tbody>
</table>

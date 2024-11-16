<script lang="ts">
  import EditableDate from '$lib/client/components/editable/editable-date.svelte';
  import EditableText from '$lib/client/components/editable/editable-text.svelte';
  import { deleteEntity } from '$lib/client/data/entity';
  import { Entity } from '$lib/client/data/entity.svelte';
  import { root, rootCID } from '$lib/client/data/root.svelte';
  import EntityDependencies from './entity-dependencies.svelte';

  let addingTask = $state(false);
  let hideBlocked = $state(true);
  let hideFuture = $state(true);

  let blocked = $derived(root.childrenEnt.filter((ent) => !!ent.dependencies.length));

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

<label class="m-2">
  <input type="checkbox" bind:checked={hideFuture} />
  Hide future tasks
</label>

<label class="m-2">
  <input type="checkbox" bind:checked={hideBlocked} />
  Hide blocked tasks
</label>

<label class="m-2">
  <input type="checkbox" bind:checked={hideCompleted} />
  Hide completed tasks
</label>

<table class="w-full">
  <thead>
    <tr>
      <th>Task</th>
      <th>Start</th>
      <th>End</th>
      <th>Dependencies</th>
      <th>Created</th>
      <th>Updated</th>
      <th class="text-right">
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
    {#each root.childrenEnt as ent, i}
      {#if (!hideFuture || !ent.start || ent.start.getTime() <= Date.now()) && (!hideBlocked || !blocked.includes(ent))}
        <tr>
          <td>
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
          <td>
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
          <td>
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
          <td>
            <EntityDependencies {ent} />
          </td>
          <td>
            {ent.created?.toLocaleDateString()}
          </td>
          <td>
            {ent.updated?.toLocaleDateString()}
          </td>
          <td class="text-right">
            <button onclick={() => ent.cid && deleteEntity(ent.cid, i)}>Delete</button>
          </td>
        </tr>
      {/if}
    {/each}
  </tbody>
</table>

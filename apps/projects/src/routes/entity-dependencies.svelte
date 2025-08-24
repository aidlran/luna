<script lang="ts">
  import { tick } from 'svelte';
  import { type Entity, getEntity } from '$lib/client/data/entity.svelte';
  import { root } from '$lib/client/data/root.svelte';

  let { ent }: { ent: Entity } = $props();

  let adding = $state(false);

  let index = $derived(root.children.findIndex((cid) => cid.toString() === ent.cid?.toString()));

  let options = $derived(
    root.children
      .filter(
        (optCID) =>
          ent.cid?.toString() !== optCID.toString() &&
          !ent.dependencies.find((depCID) => depCID.toString() === optCID.toString()),
      )
      .map(getEntity),
  );

  let input = $state<HTMLInputElement>();
</script>

<div class="flex justify-between">
  <div>
    {#each ent.dependencies as depCID, i}
      {@const depEnt = getEntity(depCID)}
      <div class="border">
        {depEnt.name}
        <button
          onclick={async () => {
            if (index > -1) {
              ent.dependencies.splice(i, 1);
              root.children[index] = await ent.save();
              await root.save();
            }
          }}>x</button
        >
      </div>
    {/each}
  </div>

  {#if adding}
    <input
      list="tasks"
      bind:this={input}
      onchange={async () => {
        if (input && index > -1) {
          const cid = options.find((e) => e.name === input?.value)?.cid;
          if (cid) {
            ent.dependencies.push(cid);
            root.children[index] = await ent.save();
            await root.save();
          }
          input.blur();
        }
      }}
      onblur={() => (adding = false)}
      onkeydown={(e) => e.key == 'Escape' && input?.blur()}
    />
    <datalist id="tasks">
      {#each options as option}
        <option>{option.name}</option>
      {/each}
    </datalist>
  {:else}
    <button
      onclick={async () => {
        adding = true;
        await tick();
        input?.focus();
      }}>+</button
    >
  {/if}
</div>

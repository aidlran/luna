<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    editing?: boolean;
    placeholder?: string;
    value?: string;
    onedit?: (value: string) => void;
  }

  let { editing = $bindable(false), placeholder, value = $bindable(''), onedit }: Props = $props();

  let input = $state<HTMLInputElement>();

  if (editing) {
    startEditing();
  }

  async function startEditing() {
    editing = true;
    await tick();
    input?.focus();
  }

  function stopEditing() {
    value = value.trim();
    onedit?.(value);
    editing = false;
  }
</script>

{#if editing}
  <form>
    <input
      class="w-full"
      {placeholder}
      bind:this={input}
      bind:value
      onblur={stopEditing}
      onkeydown={(e) => e.key == 'Escape' && stopEditing()}
    />
  </form>
{:else}
  <button class="text-left w-full" onclick={startEditing}>{value}</button>
{/if}

<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    editing?: boolean;
    placeholder?: string;
    value?: string;
    validate?: (value: string) => boolean;
    transform?: (value: string) => string;
    render?: (value: string) => string;
    onedit?: (value: string) => void;
  }

  let {
    editing = $bindable(false),
    placeholder,
    value = $bindable(''),
    render,
    transform,
    validate,
    onedit,
  }: Props = $props();

  let rendered = $derived(render ? render(value) : value);

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
    if (input && validate?.(input.value) !== false) {
      value = transform ? transform(input.value) : input.value;
      onedit?.(value);
    }
    editing = false;
  }
</script>

{#if editing}
  <form>
    <input
      class="w-full"
      {placeholder}
      bind:this={input}
      {value}
      onblur={stopEditing}
      onkeydown={(e) => e.key == 'Escape' && stopEditing()}
    />
  </form>
{:else}
  <button class="text-left w-full min-h-8 cursor-pointer" onclick={startEditing}>{rendered}</button>
{/if}

<script lang="ts">
  // import type { DataStore } from 'trusync-svelte';
  import type { KeyboardEventHandler } from 'svelte/elements';
  // import type { Task } from '../../interfaces/task';

  // TODO: reuse this

  // export let task: DataStore<Task>;
  let isEditingName = false;
  let newName: string;

  // function onClick() {
  //   // newName = $task.name;
  //   isEditingName = true;
  // }

  const onInputKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case 'Escape':
        isEditingName = false;
        // newName = $task.name;
        event.currentTarget.blur();
        break;
      case 'Enter':
        event.currentTarget.blur();
        break;
    }
  };

  function onUpdate() {
    // const currentTask = $task;

    // if (isEditingName && newName && currentTask.name !== newName) {
    //   task.put({ ...currentTask, name: newName });
    // }

    isEditingName = false;
  }

  // TODO: move to svelte-stuff
  export function autofocus(node: HTMLElement) {
    node.focus();
  }
</script>

<h1>
  {#if isEditingName}
    <input bind:value={newName} use:autofocus on:blur={onUpdate} on:keydown={onInputKeyPress} />
  {:else}
    <!-- <span role="button" tabindex="0" on:click={onClick} on:keydown={onClick}>{$task.name}</span> -->
  {/if}
</h1>

<style>
  h1 {
    margin: 0;
  }

  h1 * {
    font-size: 1em;
  }

  h1 input {
    width: calc(100% - 43px);
    margin-top: -12px;
    margin-left: -2px;
    font-weight: bold;
    padding: 0 2px;
    border: none;
    border-bottom: 1px solid #666;
    background: #0000;
  }

  /* h1 span {
    padding: 12px 12px 6px;
    margin-left: -12px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
  } */

  /* h1 span:hover {
    background: #0001;
  } */

  input {
    border: 1px solid black;
  }
</style>

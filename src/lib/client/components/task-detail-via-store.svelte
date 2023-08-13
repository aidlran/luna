<script lang="ts">
  import { data } from '@enclavetech/svelte';
  import type { Task } from '../interfaces/task';

  export let id: string;
  const task = data<Task>(id);
</script>

<h1>{$task.name}</h1>

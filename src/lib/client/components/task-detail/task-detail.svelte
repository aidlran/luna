<script lang="ts">
  import { data } from '@enclavetech/svelte';
  import type { Task } from '../../interfaces/task';
  import TaskDetailName from './task-detail-name.svelte';

  export let id: string;

  const task = data<Task>(id);
</script>

<section>
  <TaskDetailName {task} />
</section>

<script lang="ts">
  import type { Task } from '../interfaces/task';
  import type { OptionalID } from '../types/optional-id';

  export let task: OptionalID<Task>;
</script>

<h1>{task.name}</h1>

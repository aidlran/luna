<script lang="ts">
  import { Data } from '@enclavetech/lib-web';
  import { TaskList } from '$lib/client/components';
  import type { ITodo } from '$lib/client/interfaces/todo.interface';

  function getOwnTasks() {
    return Data.getAllOwn() as Promise<ITodo[]>;
  }
</script>

<div class="task-list-container">
  {#await getOwnTasks() then items}
    <TaskList listName="My Tasks" {items} />
  {/await}
</div>

<style>
  .task-list-container {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  @media only screen and (min-width: 600px) {
    .task-list-container {
      height: calc(100% - 48px);
      margin: 24px;
    }
  }
</style>

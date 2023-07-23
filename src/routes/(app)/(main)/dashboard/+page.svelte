<script lang="ts">
  import { Data } from '@enclavetech/lib-web';
  import { TaskList } from '$lib/client/components';
  import type { ITodo } from '$lib/client/interfaces/todo.interface';

  async function getData(): Promise<ITodo[]> {
    const allData = await Data.getAllOwn();
    return (
      await Promise.all(
        allData.map(async (data) => {
          const { id } = data;
          try {
            return {
              id,
              ...JSON.parse(await Data.decrypt(data)),
            };
          } catch (e) {
            return null;
          }
        }),
      )
    ).filter((item) => item !== null) as ITodo[];
  }
</script>

<div class="task-list-container">
  {#await getData() then items}
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

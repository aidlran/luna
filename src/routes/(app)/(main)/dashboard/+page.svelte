<script lang="ts">
  import { TaskList } from '$lib/client/components';
  import type { ITodo } from '$lib/client/interfaces/todo.interface';
  import { getServices } from '$lib/client/utils/services';

  const { keysService, meApiService } = getServices();

  async function getData(): Promise<ITodo[]> {
    const allData = await meApiService.getAllEncryptedData();
    return (
      await Promise.all(
        allData.map(async (data) => {
          try {
            return JSON.parse(await keysService.decrypt(data));
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

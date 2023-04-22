<script>
  import { TaskList } from '$lib/client/components';
</script>

<div class="task-list-container">
  <TaskList />
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

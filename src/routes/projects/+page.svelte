<script lang="ts">
  import { IonPage } from 'ionic-svelte';
  import { closeOutline, trash } from 'ionicons/icons';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import { getLocalTaskList, setLocalTaskList } from '$lib/client/projects/local-task-list';
  import type { Task } from '$lib/client/projects/task';
  import type { TaskList } from '$lib/client/projects/task-list';

  let ready = false;
  let taskList: TaskList | void;
  let activeTask: Task;
  let addingTask = false;
  // eslint-disable-next-line no-undef
  let input: HTMLIonInputElement;

  getLocalTaskList().then((localTaskList) => {
    taskList = localTaskList;
    ready = true;
  });

  async function replaceTaskList(newTaskList: TaskList) {
    taskList = await setLocalTaskList(newTaskList);
    activeTask = undefined;
    addingTask = false;
  }

  function deleteActiveTask() {
    if (taskList) {
      replaceTaskList(taskList.filter((entry) => entry !== activeTask));
    }
  }

  function addTask() {
    const newList = [{ name: input.value as string }];
    taskList && newList.push(...taskList);
    replaceTaskList(newList);
  }
</script>

<IonPage>
  <ion-menu side="end" type="overlay" content-id="main">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-menu-toggle>
            <ion-button>
              <ion-icon icon={closeOutline} />
            </ion-button>
          </ion-menu-toggle>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    {#if activeTask}
      <ion-content class="ion-padding">
        <ion-title>{activeTask.name}</ion-title>
      </ion-content>
      <ion-footer class="ion-padding">
        <ion-menu-toggle auto-hide={false}>
          <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
          <ion-button shape="round" expand="full" color="danger" on:click={deleteActiveTask}>
            <ion-icon icon={trash}></ion-icon>
          </ion-button>
        </ion-menu-toggle>
      </ion-footer>
    {/if}
  </ion-menu>

  <div class="ion-page" id="main">
    <Header activeApp="projects" />
    <ion-content class="ion-padding">
      {#if ready}
        {#if addingTask}
          <form on:submit|preventDefault={addTask}>
            <ion-input
              required
              fill="outline"
              bind:this={input}
              use:ionFocus
              on:ionBlur={() => (addingTask = false)}
            />
            <input type="submit" style:display="none" />
          </form>
        {:else}
          <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
          <ion-button expand="full" on:click={() => (addingTask = true)}> Add TODO </ion-button>
        {/if}

        {#if taskList}
          {#each taskList as task}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ion-menu-toggle
              role="button"
              tabindex="0"
              style:cursor="pointer"
              on:click={() => (activeTask = task)}
            >
              <ion-card style="margin: 10px 0">
                <ion-text color="dark">{task.name}</ion-text>
              </ion-card>
            </ion-menu-toggle>
          {/each}
        {/if}
      {/if}
    </ion-content>
  </div>
</IonPage>

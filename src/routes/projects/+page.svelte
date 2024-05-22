<script lang="ts">
  import { Base58 } from '@librebase/core';
  import { Hash, deleteFile, getFile, putFile } from '@librebase/fs';
  import { IonPage } from 'ionic-svelte';
  import { closeOutline, trash } from 'ionicons/icons';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import type { Task } from '$lib/client/projects/interfaces/task';

  let tasksRef = localStorage.getItem('tasksRef');
  let taskList: Task[];
  let activeTask: Task;

  let addingTask = false;
  // eslint-disable-next-line no-undef
  let input: HTMLIonInputElement;

  if (tasksRef) {
    // TODO: getFile accepts base58 string and has generic type
    const hashbuf = Base58.decode(tasksRef);
    getFile(new Hash(hashbuf[0], hashbuf.subarray(1))).then(
      (result) => (taskList = result as Task[]),
    );
  }

  function replaceTaskList(newTaskList: Task[]) {
    putFile(newTaskList, 'application/json').then((hash) => {
      if (tasksRef) {
        deleteFile(Base58.decode(tasksRef));
      }
      const b58Hash = hash.toBase58();
      localStorage.setItem('tasksRef', b58Hash);
      taskList = newTaskList;
      tasksRef = b58Hash;
      activeTask = undefined;
      addingTask = false;
    });
  }

  function deleteActiveTask() {
    replaceTaskList(taskList.filter((entry) => entry !== activeTask));
  }

  function addTask() {
    replaceTaskList([{ name: input.value as string }, ...(taskList ?? [])]);
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
    </ion-content>
  </div>
</IonPage>

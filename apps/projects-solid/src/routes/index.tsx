import { Title } from '@solidjs/meta';
import { createSignal, For, Show, Signal } from 'solid-js';
import EditableText from '~/components/editable-text';

interface Task {
  name: Signal<string>;
  completed: Signal<boolean>;
  start: Signal<number | undefined>;
  end: Signal<number | undefined>;
  dependencies: Signal<Task[]>;
  created: number;
  updated: Signal<number>;
}

export default () => {
  // Adding new task state
  const [addingTask, setAddingTask] = createSignal(false);

  // Filters state
  // const [hideBlocked, setHideBlocked] = createSignal(true);
  const [hideCompleted, setHideCompleted] = createSignal(true);
  // const [hideFuture, setHideFuture] = createSignal(true);

  // Task list
  const [tasks, setTasks] = createSignal<Task[]>([]);

  let newTaskInput!: HTMLInputElement;

  return (
    <main>
      <Title>Home | Luna Projects</Title>

      {/* <label class="m-2">
        <input
          type="checkbox"
          checked={hideBlocked()}
          on:change={() => setHideBlocked(!hideBlocked())}
        />
        Hide blocked tasks
      </label> */}

      <label class="m-2">
        <input
          type="checkbox"
          checked={hideCompleted()}
          on:change={() => setHideCompleted(!hideCompleted())}
        />
        Hide completed tasks
      </label>

      {/* <label class="m-2">
        <input
          type="checkbox"
          checked={hideFuture()}
          on:change={() => setHideFuture(!hideFuture())}
        />
        Hide future tasks
      </label> */}

      <table class="w-full">
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            {/* <th>Start</th> */}
            {/* <th>End</th> */}
            {/* <th>Dependencies</th> */}
            <th>Created</th>
            <th>Updated</th>
            <th class="text-right">
              <button
                disabled={addingTask()}
                on:click={() => {
                  setAddingTask(true);
                  newTaskInput.focus();
                }}
              >
                Add task
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <Show when={addingTask()}>
            <tr>
              <td colspan="8">
                <input
                  ref={newTaskInput}
                  class="w-full"
                  placeholder="New task"
                  on:blur={(e) => {
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      const now = Date.now();
                      setTasks([
                        {
                          name: createSignal(value),
                          completed: createSignal(false),
                          start: createSignal(),
                          end: createSignal(),
                          dependencies: createSignal<Task[]>([]),
                          created: now,
                          updated: createSignal(now),
                        },
                        ...tasks(),
                      ]);
                    }
                    setAddingTask(false);
                  }}
                  on:keydown={(e) =>
                    (e.key === 'Escape' || e.key === 'Enter') && e.currentTarget.blur()
                  }
                />
              </td>
            </tr>
          </Show>
          <For each={tasks()}>
            {(task, i) => {
              const [name, setName] = task.name;
              const [completed, setCompleted] = task.completed;
              const [updated, setUpdated] = task.updated;
              return (
                <Show when={!hideCompleted() || !completed()}>
                  <tr>
                    <td>
                      <EditableText
                        value={[name, (v) => (setUpdated(Date.now()), setName(v))]}
                        transform={(v) => v.trim()}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={completed()}
                        on:change={() => (setUpdated(Date.now()), setCompleted(!completed()))}
                      />
                    </td>

                    {/* TODO: start */}
                    {/* TODO: end */}
                    {/* TODO: dependencies */}

                    <td>{new Date(task.created).toLocaleDateString()}</td>
                    <td>{new Date(updated()).toLocaleDateString()}</td>
                    <td class="text-right">
                      <button on:click={() => setTasks(tasks().toSpliced(i(), 1))}>Delete</button>
                    </td>
                  </tr>
                </Show>
              );
            }}
          </For>
        </tbody>
      </table>
    </main>
  );
};

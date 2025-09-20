import { Title } from '@solidjs/meta';
// prettier-ignore
import { type Accessor, createMemo, createSignal, For, type JSX, type ParentProps, type Setter, Show, type Signal } from 'solid-js';
import EditableDate from '~/components/editable-date';
import EditableText from '~/components/editable-text';

interface Task {
  name: Signal<string>;
  completed: Signal<boolean>;
  start: Signal<string | undefined>;
  end: Signal<string | undefined>;
  dependencies: Signal<Task[]>;
  blocked: Accessor<boolean>;
  created: number;
  updated: Signal<number>;
}

const FilterCheckbox = ({
  children,
  get,
  set,
}: ParentProps<{ get: Accessor<boolean>; set: Setter<boolean> }>): JSX.Element => (
  <label class="m-2">
    <input type="checkbox" checked={get()} on:change={(e) => set(e.target.checked)} />
    {children}
  </label>
);

export default () => {
  // Adding new task state
  const [addingTask, setAddingTask] = createSignal(false);

  // Filters state
  const [hideBlocked, setHideBlocked] = createSignal(true);
  const [hideCompleted, setHideCompleted] = createSignal(true);
  const [hideFuture, setHideFuture] = createSignal(true);

  // Task list
  const [tasks, setTasks] = createSignal<Task[]>([]);

  let newTaskInput!: HTMLInputElement;

  return (
    <main>
      <Title>Home | Luna Projects</Title>

      <FilterCheckbox get={hideBlocked} set={setHideBlocked}>
        Hide blocked tasks
      </FilterCheckbox>

      <FilterCheckbox get={hideCompleted} set={setHideCompleted}>
        Hide completed tasks
      </FilterCheckbox>

      <FilterCheckbox get={hideFuture} set={setHideFuture}>
        Hide future tasks
      </FilterCheckbox>

      <table class="w-full">
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Start</th>
            <th>End</th>
            <th>Dependencies</th>
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
                      const dependencies = createSignal<Task[]>([]);
                      setTasks([
                        {
                          name: createSignal(value),
                          completed: createSignal(false),
                          start: createSignal(),
                          end: createSignal(),
                          dependencies,
                          blocked: createMemo(() =>
                            dependencies[0]().some((dep) => !dep.completed[0]() || dep.blocked()),
                          ),
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
              const [start] = task.start;
              const created = new Date(task.created);
              const [, setUpdated] = task.updated;
              const updated = createMemo(() => new Date(task.updated[0]()));

              const [dependencies, setDependencies] = task.dependencies;
              const [addingDependency, setAddingDependency] = createSignal(false);
              let dependencyInput!: HTMLInputElement;

              const EditableDateCell = ({
                value: [get, set],
              }: {
                value: Signal<string | undefined>;
              }): JSX.Element => (
                <td>
                  <div class="flex">
                    <EditableDate
                      class="grow"
                      value={get}
                      on:change={(e) => {
                        setUpdated(Date.now());
                        set(new Date(e.target.value).toISOString());
                      }}
                    />
                    <Show when={get()}>
                      <button on:click={() => set(undefined)}>x</button>
                    </Show>
                  </div>
                </td>
              );

              return (
                <Show
                  when={
                    (!hideBlocked() || !task.blocked()) &&
                    (!hideCompleted() || !completed()) &&
                    (!hideFuture() || !start() || Date.parse(start()!) <= Date.now())
                  }
                >
                  <tr>
                    <td>
                      <EditableText
                        class="w-full"
                        value={name}
                        on:change={(e) => {
                          const v = e.target.value.trim();
                          if (v) {
                            setUpdated(Date.now());
                            setName(e.target.value.trim());
                          }
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={completed()}
                        on:change={(e) => (setUpdated(Date.now()), setCompleted(e.target.checked))}
                      />
                    </td>

                    <EditableDateCell value={task.start} />

                    <EditableDateCell value={task.end} />

                    <td>
                      <div class="flex justify-between">
                        <div>
                          <For each={dependencies()}>
                            {({ name: [name] }, i) => (
                              <div class="border inline">
                                {name()}
                                <button
                                  on:click={() => {
                                    setDependencies((v) => v.toSpliced(i(), 1));
                                  }}
                                >
                                  x
                                </button>
                              </div>
                            )}
                          </For>
                        </div>

                        <Show
                          when={addingDependency()}
                          fallback={
                            <button
                              on:click={() => {
                                setAddingDependency(true);
                                dependencyInput.focus();
                              }}
                            >
                              +
                            </button>
                          }
                        >
                          <input
                            class="grow"
                            list="tasks"
                            ref={dependencyInput}
                            on:change={(e) => {
                              e.target.blur();
                              const dependency = tasks().find(
                                ({ name: [name] }) => name() === e.target.value,
                              );
                              if (dependency) {
                                setDependencies((v) => [...v, dependency]);
                              }
                            }}
                            on:blur={() => setAddingDependency(false)}
                            on:keydown={(e) =>
                              (e.key === 'Escape' || e.key === 'Enter') && dependencyInput.blur()
                            }
                          />

                          <datalist id="tasks">
                            <For each={tasks()}>
                              {(datalistTask) => (
                                <Show
                                  when={
                                    // TODO: need to hide it if the entry's dependency chain includes `task`
                                    //       need to propagate dependencies up
                                    task !== datalistTask &&
                                    !dependencies().some(
                                      (dependencyTask) => dependencyTask === datalistTask,
                                    )
                                  }
                                >
                                  <option>{datalistTask.name[0]()}</option>
                                </Show>
                              )}
                            </For>
                          </datalist>
                        </Show>
                      </div>
                    </td>

                    <td title={created.toLocaleString()}>{created.toLocaleDateString()}</td>

                    <td title={updated().toLocaleString()}>{updated().toLocaleDateString()}</td>

                    <td class="text-right">
                      <button
                        on:click={() => {
                          setTasks((v) => v.toSpliced(i(), 1));
                          for (const {
                            dependencies: [, setDependencies],
                          } of tasks()) {
                            setDependencies((dependencies) =>
                              dependencies.filter((dependency) => dependency !== task),
                            );
                          }
                        }}
                      >
                        Delete
                      </button>
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

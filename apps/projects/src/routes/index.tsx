import { Title } from '@solidjs/meta';
// prettier-ignore
import { type Accessor, createMemo, createSignal, For, type JSX, type ParentProps, type Setter, Show, type Signal } from 'solid-js';
import EditableDate from '~/components/editable-date';
import EditableText from '~/components/editable-text';
// prettier-ignore
import { entities, entityDependencies, objectToEntity, setEntities, setEntityDependencies } from '~/lib/entities';

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
  const [addingTask, setAddingTask] = createSignal(false);

  const [hideBlocked, setHideBlocked] = createSignal(true);
  const [hideCompleted, setHideCompleted] = createSignal(true);
  const [hideFuture, setHideFuture] = createSignal(true);

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
                    const name = e.currentTarget.value.trim();
                    if (name) {
                      setEntities((entities) => [objectToEntity({ name }), ...entities]);
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
          <For each={entities()}>
            {(entity, i) => {
              const [name, setName] = entity.name;
              const [completed, setCompleted] = entity.completed;
              const [start] = entity.start;
              const created = new Date(entity.created);
              const [, setUpdated] = entity.updated;
              const updated = createMemo(() => new Date(entity.updated[0]()));

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
                    (!hideBlocked() || !entity.blocked()) &&
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

                    <EditableDateCell value={entity.start} />

                    <EditableDateCell value={entity.end} />

                    <td>
                      <div class="flex justify-between">
                        <div>
                          <For each={entityDependencies()}>
                            {([dependent, dependee], i) => (
                              <Show when={dependent === entity}>
                                <div class="border inline">
                                  {dependee.name[0]()}
                                  <button
                                    on:click={() =>
                                      setEntityDependencies((v) => v.toSpliced(i(), 1))
                                    }
                                  >
                                    x
                                  </button>
                                </div>
                              </Show>
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
                              const dependee = entities().find(
                                ({ name: [name] }) => name() === e.target.value,
                              );
                              if (dependee) {
                                setEntityDependencies((v) => [...v, [entity, dependee]]);
                              }
                            }}
                            on:blur={() => setAddingDependency(false)}
                            on:keydown={(e) =>
                              (e.key === 'Escape' || e.key === 'Enter') && dependencyInput.blur()
                            }
                          />

                          <datalist id="tasks">
                            <For each={entities()}>
                              {(datalistEntity) => (
                                <Show
                                  when={
                                    // TODO: need to hide it if the entry's dependency chain includes `task`
                                    //       need to propagate dependencies up
                                    entity !== datalistEntity &&
                                    !entityDependencies().some(
                                      ([dependent, dependee]) =>
                                        dependent === entity && dependee === datalistEntity,
                                    )
                                  }
                                >
                                  <option>{datalistEntity.name[0]()}</option>
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
                          setEntities((v) => v.toSpliced(i(), 1));
                          setEntityDependencies((dependencies) =>
                            dependencies.filter(
                              ([dependent, dependee]) =>
                                entity !== dependent && entity !== dependee,
                            ),
                          );
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

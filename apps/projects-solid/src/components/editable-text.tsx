import { createSignal, Show, Signal } from 'solid-js';

export default (props: { value: Signal<string>; transform?(value: string): string }) => {
  const [editing, setEditing] = createSignal(false);
  const [value, setValue] = props.value;

  let input!: HTMLInputElement;

  return (
    <Show
      when={editing()}
      fallback={
        <button
          class="text-left w-full min-h-8 cursor-pointer"
          on:click={() => {
            setEditing(true);
            input.focus();
          }}
        >
          {value()}
        </button>
      }
    >
      <input
        ref={input}
        class="w-full"
        value={value()}
        on:blur={(e) => {
          const { value } = e.currentTarget;
          setValue(props.transform ? props.transform(value) : value);
          setEditing(false);
        }}
        on:keydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && e.currentTarget.blur()}
      />
    </Show>
  );
};

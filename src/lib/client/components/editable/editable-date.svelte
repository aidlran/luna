<script lang="ts">
  import type { EditableProps } from './editable-props';
  import EditableText from './editable-text.svelte';

  let {
    editing = $bindable(false),
    value = $bindable(''),
    onedit,
  }: Pick<EditableProps, 'editing' | 'value' | 'onedit'> = $props();
</script>

<EditableText
  bind:editing
  bind:value
  placeholder="YYYY-MM-DD HH:mm:ss"
  render={(v) => (v ? new Date(v).toLocaleString() : '')}
  transform={(v) => (v ? new Date(v).toISOString() : '')}
  validate={(v) => (v ? !isNaN(Date.parse(v)) : false)}
  {onedit}
/>

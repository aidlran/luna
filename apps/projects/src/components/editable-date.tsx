import type { JSX } from 'solid-js';
import EditableText, { type EditableTextProps } from './editable-text';

export default (
  props: Omit<EditableTextProps, 'on:change'> & {
    'on:change'?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
  },
) => {
  const getValue = props.value;

  props.value = () => {
    const value = getValue();
    return value ? new Date(value).toISOString() : '';
  };

  if (props['on:change']) {
    const original = props['on:change'];
    props['on:change'] = (e) => !isNaN(Date.parse(e.target.value)) && original(e);
  }

  return <EditableText {...props} />;
};

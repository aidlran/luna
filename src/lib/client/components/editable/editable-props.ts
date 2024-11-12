export interface EditableProps {
  editing?: boolean;
  placeholder?: string;
  value?: string;
  validate?: (value: string) => boolean;
  transform?: (value: string) => string;
  render?: (value: string) => string;
  onedit?: (value: string) => void;
}

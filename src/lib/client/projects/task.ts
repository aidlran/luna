import { object, string, type Input } from 'valibot';

export const TaskSchema = object({
  name: string(),
});

export type Task = Input<typeof TaskSchema>;

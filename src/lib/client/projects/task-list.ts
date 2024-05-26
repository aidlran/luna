import { array, type Input } from 'valibot';
import { TaskSchema } from './task';

export const TaskListSchema = array(TaskSchema);

export type TaskList = Input<typeof TaskListSchema>;

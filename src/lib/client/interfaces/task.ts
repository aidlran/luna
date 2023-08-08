import type { DataNodeChild } from './data-node-child';

export interface Task extends DataNodeChild<'task'> {
  name: string;
  description?: string;
}

import type { DataNode } from './data-node';

/** @deprecated moving to `Task` */
export interface Todo extends DataNode<'todo'> {
  name: string;
}

import type { DataNode } from './data-node';

export interface DataNodeChild<T extends string> extends DataNode<T> {
  parent: string;
}

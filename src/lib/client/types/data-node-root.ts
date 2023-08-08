import type { DataNode } from '../interfaces/data-node';

export type DataNodeRoot<T extends string> = Omit<DataNode<T>, 'parent'>;

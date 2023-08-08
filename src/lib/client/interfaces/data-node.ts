export interface DataNode<T extends string> {
  id: string;
  type: T;

  createdAt: number;
  updatedAt: number;

  /** Array of child Data object IDs */
  children?: string[];
  /** Parent data object ID */
  parent?: string;
}

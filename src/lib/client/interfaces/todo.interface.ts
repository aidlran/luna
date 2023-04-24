import type { IDataObject } from './data-object.interface';

export interface ITodo extends IDataObject {
  type: 'todo';
  name: string;
}

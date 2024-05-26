import { Identifier, getOne, putOne, type IdentifierSchema } from '@librebase/core';
import { FS, deleteFile, getFile, putFile } from '@librebase/fs';
import { safeParse } from 'valibot';
import { TaskListSchema, type TaskList } from './task-list';

const instanceID = 'localonly';

let localTaskListRef: Identifier;

export const LocalTaskListIdentifierSchema = {
  key: 10000,
  async parse(_, content) {
    const fileID = new Identifier(content);
    const file = await getFile<TaskList>(fileID.value);
    if (!file || !safeParse(TaskListSchema, file, { abortEarly: true }).success) {
      return;
    }
    localTaskListRef = fileID;
    return file;
  },
} satisfies IdentifierSchema;

const localTaskListID = new Identifier(LocalTaskListIdentifierSchema.key, []);

export async function setLocalTaskList(newTaskList: TaskList) {
  const hash = await putFile(newTaskList, 'application/json', { instanceID });
  if (localTaskListRef) {
    await deleteFile(localTaskListRef.value);
  }
  await putOne(localTaskListID, [FS.key, ...hash.toBytes()], instanceID);
  return getLocalTaskList();
}

export function getLocalTaskList() {
  return getOne<TaskList>(localTaskListID, instanceID);
}

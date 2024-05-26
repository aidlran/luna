import { Identifier, IdentifierRegistry, getOne, putOne } from '@librebase/core';
import { FS, deleteFile, getFile, putFile } from '@librebase/fs';
import { safeParse } from 'valibot';
import { browser } from '$app/environment';
import { localOnlyInstanceID } from '../instances';
import { TaskListSchema, type TaskList } from './task-list';

const instanceID = localOnlyInstanceID;
const key = 10000;
const localTaskListID = new Identifier(key, []);

let localTaskListRef: Identifier;

if (browser) {
  IdentifierRegistry.register(
    {
      key,
      async parse(_, content) {
        const fileID = new Identifier(content);
        const file = await getFile<TaskList>(fileID.value);
        if (!file || !safeParse(TaskListSchema, file, { abortEarly: true }).success) {
          return;
        }
        localTaskListRef = fileID;
        return file;
      },
    },
    {
      instanceID,
      force: true,
    },
  );
}

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

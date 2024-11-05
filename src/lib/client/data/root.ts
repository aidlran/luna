import { File, getMutable, putMutable } from '@astrobase/core';
import type { Entity } from './entity.svelte';

const key = 'tasks';

export async function getRoot() {
  const file = await getMutable<Entity>(key);
  return file?.getValue() as Promise<Entity>;
}

export async function setRoot(root: Entity) {
  const file = await new File().setMediaType('application/json').setValue(root);
  return putMutable(key, file, {});
}

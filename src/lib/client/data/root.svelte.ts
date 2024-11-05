import { ContentIdentifier, File, getMutable, putMutable } from '@astrobase/core';
import type { Entity } from './entity.svelte';

const key = 'tasks';

class Root implements Entity {
  name = $state<string>();
  children = $state<ContentIdentifier[]>();

  constructor() {
    setTimeout(() => this.pull());
  }

  async pull() {
    const file = await getMutable<Entity>(key);
    const value = (await file?.getValue()) as Entity;
    this.name = value?.name;
    this.children = value?.children;
  }

  async save() {
    const file = await new File()
      .setMediaType('application/json')
      .setValue({ name: this.name, children: this.children });
    await putMutable(key, file, {});
  }
}

export const root = new Root();

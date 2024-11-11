import { File, getMutable, putMutable } from '@astrobase/core';
import { Entity, type EntityContent, type ImmutableEntity } from './entity.svelte';

const key = 'tasks';

class Root extends Entity {
  constructor() {
    super();
    setTimeout(() => this.pull());
  }

  async pull() {
    const file = (await getMutable<ImmutableEntity>(key)) as File<EntityContent> | undefined;
    await this.parse(file);
  }

  async save() {
    await putMutable(key, await this.file, {});
  }
}

export const root = new Root();

import { ContentIdentifier, File, getContent, keyToCID, putContent } from '@astrobase/core';
import { Entity, type EntityContent, type ImmutableEntity } from './entity.svelte';

export const rootCID = new ContentIdentifier(keyToCID('tasks'));

class Root extends Entity {
  constructor() {
    super();
    setTimeout(() => this.pull());
  }

  async pull() {
    const file = (await getContent<ImmutableEntity>(rootCID)) as File<EntityContent> | undefined;
    await this.parse(file);
  }

  async save() {
    await putContent(rootCID, (await this.file).buffer, {});
  }
}

export const root = new Root();

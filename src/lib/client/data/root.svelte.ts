import { ContentIdentifier, File, getContent, keyToCID, putContent } from '@astrobase/core';
import { Entity } from './entity.svelte';

export const rootCID = new ContentIdentifier(keyToCID('luna'));

class Root extends Entity {
  constructor() {
    super();
    setTimeout(() => this.pull());
  }

  async pull() {
    // TODO: Astrobase should allow providing a validator as part of content parsing pipeline.
    //       We need to validate *for each data source*, otherwise the first to return anything
    //       will be used, even if it doesn't point to a valid immutable reference.
    const file = await getContent<File<Uint8Array>>(rootCID);
    const ref = (await file?.getValue()) as Uint8Array | undefined;
    if (ref) {
      await super.pull(ref);
    }
  }

  async save() {
    const cid = await super.save();
    const file = new File().setPayload(cid.bytes);
    await putContent(rootCID, file.buffer);
    return cid;
  }
}

export const root = new Root();

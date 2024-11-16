import { ContentIdentifier, type ContentIdentifierLike } from '@astrobase/core';
import { root } from './root.svelte';

export async function deleteEntity(targetCID: ContentIdentifierLike, targetIndex?: number) {
  targetCID = new ContentIdentifier(targetCID).toString();
  targetIndex ??= root.children.findIndex((cid) => cid.toString() === targetCID);

  if (targetIndex > -1) {
    root.children.splice(targetIndex, 1);

    await Promise.all(
      root.childrenEnt.map(async (ent, i) => {
        await ent.selfLoaded;
        const oldLen = ent.dependencies.length;
        ent.dependencies = ent.dependencies.filter((cid) => cid.toString() !== targetCID);
        if (ent.dependencies.length != oldLen) {
          root.children[i] = await ent.save();
        }
      }),
    );

    await root.save();

    // TODO: delete previous generations
  }
}

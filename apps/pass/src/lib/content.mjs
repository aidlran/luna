import { deleteContent } from '@astrobase/sdk/content';
// prettier-ignore
import { assertEntryExists, deleteEntry as baseDeleteEntry, get, getEntry, getIndex, put, saveIndex } from '../../../../lib/luna/content.mjs';
import pkg from '../../package.json' with { type: 'json' };

/**
 * @typedef IndexValue
 * @property {string} added
 * @property {import('@astrobase/sdk/cid').ContentIdentifier} cid
 */

/** @typedef {Record<string, IndexValue>} Index */

/**
 * @typedef Entry
 * @property {import('@astrobase/sdk/cid').ContentIdentifier} [prev]
 * @property {Record<string, string>} props
 */

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id
 * @returns {Promise<Entry['props'] & { added: string }>}
 */
export async function getEntryProps(instance, id) {
  const entry = await getEntry(instance, pkg.name, id);

  return entry
    ? {
        ...entry.props,
        added: (await getIndex(instance, pkg.name))[id]?.added,
      }
    : undefined;
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id
 * @returns {Promise<import('./content.mjs').Entry['props']>}
 */
export async function getAssertedEntryProps(instance, id) {
  await assertEntryExists(instance, pkg.name, id);
  const props = await getEntryProps(instance, id);
  if (!props) {
    console.error(`Entry '${id}' not found`);
    process.exit(1);
  }
  return props;
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id
 * @param {Entry['props']} props
 */
export async function saveEntry(instance, id, props) {
  const index = await getIndex(instance, pkg.name);
  const now = new Date().toISOString();
  props.updated ??= now;
  const added = props.added ?? index[id]?.added ?? now;
  delete props.added;
  index[id] = {
    added,
    cid: await put(instance, pkg.name, { prev: index[id]?.cid, props }),
  };
  await saveIndex(instance, pkg.name, index);
}

/**
 * Renames an entry in the index.
 *
 * Only the index is changed. Entry files remain unchanged.
 *
 * No entry existence assertions are made so be careful of potential overwrites.
 *
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} oldID
 * @param {string} newID
 */
export async function renameEntry(instance, oldID, newID) {
  const index = await getIndex(instance, pkg.name);
  index[newID] = index[oldID];
  delete index[oldID];
  await saveIndex(instance, pkg.name, index);
}

/** @type {import('../../../../lib/luna/content.mjs').DeleteEntryHook<IndexValue>} */
export async function deleteEntryHook({ cid }, instance) {
  /** @type {Promise<unknown>[]} */
  const promises = [];

  while (cid) {
    /** @type {Entry | void} */
    const entry = await get(instance, pkg.name, cid);

    promises.push(deleteContent(cid, instance));

    if (!entry) {
      break;
    }

    cid = entry.prev;
  }

  return Promise.all(promises);
}

/**
 * Deletes an entry in the index and cleans up entry history.
 *
 * @deprecated
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id
 */
export async function deleteEntry(instance, id) {
  await baseDeleteEntry(instance, pkg.name, id, deleteEntryHook);
}

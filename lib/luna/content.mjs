import { decodeWithCodec } from '@astrobase/sdk/codecs';
import { getContent } from '@astrobase/sdk/content';
import { FileBuilder } from '@astrobase/sdk/file';
import { getIdentity, getNextIdentity, getPrivateKey, putIdentity } from '@astrobase/sdk/identity';
import { putImmutable } from '@astrobase/sdk/immutable';
import { decrypt, encrypt } from './crypt.mjs';

/** @type {Uint8Array<ArrayBuffer>} */
let publicKey;

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id Identity ID
 * @returns {Promise<Uint8Array<ArrayBuffer>>}
 */
async function getPubKey(instance, id) {
  if (!publicKey) {
    /** @type {import('@astrobase/sdk/cid').ContentIdentifier} */
    let cid;

    try {
      ({ cid } = await getIdentity({ id, instance }));
    } catch (e) {
      if (e instanceof Error && e.message === 'Identity not found') {
        ({ cid } = await getNextIdentity(instance));
      } else {
        throw e;
      }
    }

    publicKey = new Uint8Array(cid.value);
  }

  return publicKey;
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id Identity ID
 * @returns {Promise<Uint8Array<ArrayBuffer>>}
 */
const getPrivKey = async (instance, id) =>
  getPrivateKey({ instance, publicKey: await getPubKey(instance, id) });

/**
 * @template T
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityId
 * @param {import('@astrobase/sdk/cid').ContentIdentifierLike} cid
 * @param {import('@astrobase/sdk/media-types').MediaTypeLike} mediaType
 * @returns {Promise<T | void>}
 */
export async function get(instance, identityId, cid, mediaType = 'application/json') {
  const content = await getContent(cid, instance);

  if (content) {
    // @ts-expect-error
    return decodeWithCodec(
      instance,
      decrypt(content.payload, await getPrivKey(instance, identityId)),
      mediaType,
    );
  }
}

/**
 * @template T
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id Identity ID
 * @returns {Promise<T | void>}
 */
export const getIndex = async (instance, id) =>
  get(instance, id, (await getIdentity({ id, instance })).identity.ref);

/**
 * @template T
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityID
 * @param {string} key
 * @returns {Promise<T | void>}
 */
export async function getEntry(instance, identityID, key) {
  const cid = (await getIndex(instance, identityID))[key]?.cid;
  if (cid) {
    return get(instance, identityID, cid);
  }
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityID
 * @param {string} id
 * @param {boolean} [bool] `true` = it must exist. `false` = it must not exist.
 */
export async function assertEntryExists(instance, identityID, id, bool = true) {
  if (!(await getIndex(instance, identityID))[id] == bool) {
    // eslint-disable-next-line no-console
    console.error(`Entry '${id}' ${bool ? 'does not exist' : 'already exists'}`);
    process.exit(1);
  }
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityId
 * @param {object} value
 * @param {import('@astrobase/sdk/media-types').MediaTypeLike} [mediaType]
 * @returns {Promise<import('@astrobase/sdk/cid').ContentIdentifier>}
 */
export const put = async (instance, identityId, value, mediaType) =>
  putImmutable(
    new FileBuilder().setPayload(
      await encrypt(value, await getPrivKey(instance, identityId), instance, mediaType),
    ),
    { instance },
  );

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} id Identity ID
 * @param {unknown} [newIndex]
 */
export const saveIndex = async (instance, id, newIndex) =>
  putIdentity({
    id,
    instance,
    ref: await put(instance, id, newIndex ?? (await getIndex(instance, id))),
  });

/**
 * @template T
 * @typedef {(value: T, instance: import('@astrobase/sdk/instance').Instance) => Promise<unknown>} DeleteEntryHook
 */

/**
 * Deletes an entry in the index and runs a hook with the value.
 *
 * @template T
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityId
 * @param {string} id
 * @param {DeleteEntryHook<T>} hook
 */
export async function deleteEntry(instance, identityId, id, hook) {
  /** @type {Record<string, T> | void} */
  const index = await getIndex(instance, identityId);

  if (!index) {
    return;
  }

  const value = index[id];

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete index[id];

  /** @type {Promise<unknown>[]} */
  const promises = [saveIndex(instance, identityId, index)];

  if (value) {
    promises.push(hook(value, instance));
  }

  await Promise.all(promises);
}

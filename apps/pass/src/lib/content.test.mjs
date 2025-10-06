import wordlist from '@astrobase/sdk/bip39/wordlist/english' with { type: 'json' };
import { Common } from '@astrobase/sdk/common';
import { inMemory } from '@astrobase/sdk/in-memory';
import { createInstance } from '@astrobase/sdk/instance';
import { createKeyring, loadKeyring } from '@astrobase/sdk/keyrings';
import assert from 'assert';
import { randomBytes } from 'crypto';
import { expect, test } from 'vitest';
import { getEntry, getIndex, saveIndex } from '../../../../lib/luna/content.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { deleteEntry, renameEntry, saveEntry } from './content.mjs';

const randText = (length = 8) => randomBytes(length).toString('base64');

const instance = createInstance(Common, { clients: [{ strategy: inMemory() }] });
const passphrase = randText();
const keyring = await createKeyring(instance, { passphrase, wordlist });
await loadKeyring(instance, { cid: keyring.cid, passphrase, wordlist });

test('saveEntry, getEntry, renameEntry & deleteEntry', async () => {
  await saveIndex(instance, pkg.name, {});

  const firstEntryID = randText();

  // Non exist get test
  await expect(getEntry(instance, pkg.name, firstEntryID)).resolves.toBe(undefined);

  // Save new test
  let props = {
    [randText()]: randText(),
  };
  await saveEntry(instance, firstEntryID, props);
  await expect(getEntry(instance, pkg.name, firstEntryID)).resolves.toStrictEqual({ props });

  // Save update test
  let prev = (await getIndex(instance, pkg.name))[firstEntryID].cid;
  props = {
    [randText()]: randText(),
    [randText()]: randText(),
  };
  await saveEntry(instance, firstEntryID, props);

  // Get after update
  let retrievedEntry = await getEntry(instance, pkg.name, firstEntryID);
  assert(retrievedEntry);
  expect(retrievedEntry.prev.toString()).toBe(prev.toString());
  expect(retrievedEntry.props).toStrictEqual(props);

  // Will be renamed
  const secondEntryID = firstEntryID + 'different';

  // Rename test
  await renameEntry(instance, firstEntryID, secondEntryID);
  await expect(getEntry(instance, pkg.name, firstEntryID)).resolves.toBe(undefined);
  retrievedEntry = await getEntry(instance, pkg.name, secondEntryID);
  assert(retrievedEntry);
  expect(retrievedEntry.prev.toString()).toBe(prev.toString());
  expect(retrievedEntry.props).toStrictEqual(props);

  // Delete test
  await deleteEntry(instance, secondEntryID);
  await expect(getEntry(instance, pkg.name, firstEntryID)).resolves.toBe(undefined);
  await expect(getEntry(instance, pkg.name, secondEntryID)).resolves.toBe(undefined);
});

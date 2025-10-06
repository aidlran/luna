import wordlist from '@astrobase/sdk/bip39/wordlist/english';
import { Common } from '@astrobase/sdk/common';
import { createInstance } from '@astrobase/sdk/instance';
import { createKeyring, getAvailableKeyringCIDs, loadKeyring } from '@astrobase/sdk/keyrings';
import sqlite from '@astrobase/sdk/sqlite';
import { saveIndex } from './content.mjs';
import { prompt } from './readline.mjs';

/**
 * @param {string} prefix
 * @returns {Promise<string>}
 */
async function getPassphrase(prefix) {
  const passphrase = await prompt(`${prefix} database passphrase`);
  if (!passphrase.length) {
    // eslint-disable-next-line no-console
    console.error('No passphrase entered');
    process.exit(1);
  }
  return passphrase;
}

/**
 * @param {import('@astrobase/sdk/instance').Instance} instance
 * @param {string} identityID
 * @returns {Promise<void>}
 */
export async function initKeyring(instance, identityID) {
  let [cid] = await getAvailableKeyringCIDs(instance);

  if (cid) {
    await loadKeyring(instance, { cid, passphrase: await getPassphrase('Enter'), wordlist });
  } else {
    const passphrase = await getPassphrase('Choose a');
    if (passphrase === (await getPassphrase('Confirm'))) {
      await loadKeyring(instance, {
        cid: (await createKeyring(instance, { passphrase, wordlist })).cid,
        passphrase,
        wordlist,
      });
      await saveIndex(instance, identityID, {});
    } else {
      // eslint-disable-next-line no-console
      console.error('Passphrases do not match');
      process.exit(1);
    }
  }
}

/**
 * @param {string} dbFilePath Database file path.
 * @param {string} identityID
 * @returns {Promise<import('@astrobase/sdk/instance').Instance>}
 */
export async function initInstance(dbFilePath, identityID) {
  /** @type {import('@astrobase/sdk/sqlite').SQLiteClientConfig} */
  const sqliteOptions = { filename: dbFilePath };
  const instance = createInstance(Common, { clients: [{ strategy: sqlite(sqliteOptions) }] });
  await initKeyring(instance, identityID);
  return instance;
}

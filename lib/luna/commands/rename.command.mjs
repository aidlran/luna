import { Command } from 'commander';
import { assertEntryExists, getIndex, saveIndex } from '../content.mjs';
import { dbOption } from '../db.option.mjs';
import { initInstance } from '../init.mjs';

export default (/** @type {string} */ pkgName) =>
  new Command('rename')
    .arguments('<unique-id> <new-unique-id>')
    .description('Assign a new ID to an entry')
    .addOption(dbOption(pkgName))
    .action(async (oldID, newID, { db }) => {
      const instance = await initInstance(db, pkgName);

      await assertEntryExists(instance, pkgName, oldID);
      await assertEntryExists(instance, pkgName, newID, false);

      const index = await getIndex(instance, pkgName);

      index[newID] = index[oldID];

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete index[oldID];

      await saveIndex(instance, pkgName, index);
    });

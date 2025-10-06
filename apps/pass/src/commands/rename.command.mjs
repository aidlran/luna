import { Command } from 'commander';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { assertEntryExists, renameEntry } from '../lib/content.mjs';
import { init } from '../lib/init.mjs';

export default new Command('rename')
  .arguments('<unique-id> <new-unique-id>')
  .description('Assign a new ID to an entry')
  .addOption(dbOption(pkg.name))
  .action(async (oldID, newID, { db }) => {
    const instance = await init(db);

    await assertEntryExists(instance, oldID);
    await assertEntryExists(instance, newID, false);

    await renameEntry(instance, oldID, newID);
  });

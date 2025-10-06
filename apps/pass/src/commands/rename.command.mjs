import { Command } from 'commander';
import { assertEntryExists } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { renameEntry } from '../lib/content.mjs';
import { init } from '../lib/init.mjs';

export default new Command('rename')
  .arguments('<unique-id> <new-unique-id>')
  .description('Assign a new ID to an entry')
  .addOption(dbOption(pkg.name))
  .action(async (oldID, newID, { db }) => {
    const instance = await init(db);

    await assertEntryExists(instance, pkg.name, oldID);
    await assertEntryExists(instance, pkg.name, newID, false);

    await renameEntry(instance, oldID, newID);
  });

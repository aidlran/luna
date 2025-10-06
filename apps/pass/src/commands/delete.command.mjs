import { Command } from 'commander';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { assertEntryExists, deleteEntry } from '../lib/content.mjs';
import { init } from '../lib/init.mjs';

export default new Command('delete')
  .argument('<unique-id>')
  .description('Delete an entry')
  .addOption(dbOption(pkg.name))
  .action(async (id, { db }) => {
    const instance = await init(db);
    await assertEntryExists(instance, id);
    await deleteEntry(instance, id);
  });

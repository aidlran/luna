import { Command } from 'commander';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { assertEntryExists, saveEntry } from '../lib/content.mjs';
import { init } from '../lib/init.mjs';
import { promptSecrets } from '../lib/prompt.mjs';
import { propertyOption } from '../options/property.option.mjs';
import { secretOption } from '../options/secret.options.mjs';

export default new Command('add')
  .argument('<unique-id>')
  .description('Add an entry')
  .addOption(dbOption(pkg.name))
  .addOption(propertyOption)
  .addOption(secretOption)
  .action(async (id, { db, property, secret }) => {
    promptSecrets((property ??= {}), secret);
    const instance = await init(db);
    await assertEntryExists(instance, id, false);
    await saveEntry(instance, id, property);
  });

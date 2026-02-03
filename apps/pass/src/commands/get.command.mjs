import { Command } from 'commander';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { getAssertedEntryProps } from '../lib/content.mjs';

export default new Command('get')
  .argument('<name>')
  .description('Retrieve an entry')
  .addOption(dbOption(pkg.name))
  .action(async (id, { db }) => {
    for (const [k, v] of Object.entries(
      await getAssertedEntryProps(await initInstance(db, pkg.name), id),
    ).sort(([a], [b]) => a.localeCompare(b))) {
      // eslint-disable-next-line no-console
      console.log(`${k.charAt(0).toUpperCase()}${k.slice(1)}:`, v);
    }
  });

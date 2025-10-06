import { Command } from 'commander';
import { getIndex } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import pkg from '../../package.json' with { type: 'json' };
import { init } from '../lib/init.mjs';

export default new Command('list')
  .argument('[search]')
  .description('List entries')
  .addOption(dbOption(pkg.name))
  .action(async (search, { db }) => {
    const index = await getIndex(await init(db), pkg.name);
    let keys = Object.keys(index);
    if (search) {
      keys = keys.filter((key) => key.toLowerCase().includes(search.trim().toLowerCase()));
    }
    for (const key of keys.sort((a, b) => a.localeCompare(b))) {
      console.log(key);
    }
  });

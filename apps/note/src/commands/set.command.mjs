import { Command } from 'commander';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };
import readStdin from '../lib/read-stdin.mjs';
import setNote from '../lib/set-note.mjs';
import timeoutOption from '../options/timeout.option.mjs';

export default new Command('set')
  .arguments('<name>')
  .description('Write to a new or overwrite an existing note from stdin')
  .addOption(dbOption(pkg.name))
  .addOption(timeoutOption)
  .action(async (name, { db, timeout }) =>
    setNote(await initInstance(db, pkg.name), name, await readStdin(timeout)),
  );

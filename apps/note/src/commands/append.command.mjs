import { Command } from 'commander';
import { get, getIndex } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };
import readStdin from '../lib/read-stdin.mjs';
import setNote from '../lib/set-note.mjs';
import timeoutOption from '../options/timeout.option.mjs';

export default new Command('append')
  .arguments('<name>')
  .description('Append to a new or existing note from stdin')
  .addOption(dbOption(pkg.name))
  .addOption(timeoutOption)
  .action(async (name, { db, timeout }) => {
    const chunks = await readStdin(timeout);

    const instance = await initInstance(db, pkg.name);

    /** @type {Record<string, import('@astrobase/sdk/cid').ContentIdentifier>} */
    const index = (await getIndex(instance, pkg.name)) || {};

    const oldCID = index[name];

    const originalNote =
      (oldCID && (await get(instance, pkg.name, oldCID, 'application/octet-stream'))) ||
      new Uint8Array();

    await setNote(instance, name, [originalNote, ...chunks]);
  });

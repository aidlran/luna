import { Command } from 'commander';
import { assertEntryExists, get } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };

export default new Command('cat')
  .alias('get')
  .argument('<name>')
  .description('Retrieve a note & print to stdout')
  .addOption(dbOption(pkg.name))
  .action(async function (name, { db }) {
    const instance = await initInstance(db, pkg.name);

    /** @type {import('@astrobase/sdk/cid').ContentIdentifier} */
    const cid = await assertEntryExists(instance, pkg.name, name);

    /** @type {Uint8Array<ArrayBuffer> | void} */
    const note = await get(instance, pkg.name, cid, 'application/octet-stream');

    if (!note) {
      this.error('Note content not found');
    }

    process.stdout.write(note);
  });

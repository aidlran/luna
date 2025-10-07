import { deleteContent } from '@astrobase/sdk/content';
import { Command } from 'commander';
import { get, getIndex, put, saveIndex } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };

export default new Command('append')
  .arguments('<name>')
  .description('Append to a new or existing note from stdin')
  .addOption(dbOption(pkg.name))
  .option(
    '--timeout <INTEGER>',
    'Timeout for awaiting stdin input',
    function (value) {
      const asInt = Number.parseInt(value);
      if (Number.isNaN(asInt)) {
        console.error('--timeout value must be an integer');
        process.exit(1);
      }
      return asInt;
    },
    3000,
  )
  .action(async function (name, { db, timeout }) {
    /** @type {Buffer[]} */
    const chunks = [];

    let timeoutInstance;

    const stdinRead = new Promise((resolve) => {
      process.stdin.on('end', resolve);
      timeoutInstance = setTimeout(
        () => this.error('Timed out awaiting input from stdin'),
        timeout,
      );
    });

    process.stdin.on('data', (data) => {
      clearTimeout(timeoutInstance);
      chunks.push(data);
    });

    await stdinRead;

    if (!chunks.some((buf) => buf.length)) {
      this.error('No input from stdin');
    }

    const instance = await initInstance(db, pkg.name);

    /** @type {Record<string, import('@astrobase/sdk/cid').ContentIdentifier>} */
    const index = (await getIndex(instance, pkg.name)) || {};

    const oldCID = index[name];

    const originalNote =
      (oldCID && (await get(instance, pkg.name, oldCID, 'application/octet-stream'))) ||
      new Uint8Array();

    /** @type {Buffer} */
    const newNote = Buffer.concat([originalNote, ...chunks]);

    originalNote.fill(0);
    for (const chunk of chunks) {
      chunk.fill(0);
    }

    index[name] = await put(instance, pkg.name, newNote, 'application/octet-stream');
    newNote.fill(0);
    await saveIndex(instance, pkg.name, index);
    // eslint-disable-next-line no-console
    console.log('Note saved');
    if (oldCID) {
      await deleteContent(oldCID, instance);
    }
  });

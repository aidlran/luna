import { getIdentity } from '@astrobase/sdk/identity';
import { Command } from 'commander';
import paths from 'env-paths';
import { join } from 'path';
import { assertEntryExists, get, getIndex, put, saveIndex } from '../../../../lib/luna/content.mjs';
import { dbOption } from '../../../../lib/luna/db.option.mjs';
import { initInstance } from '../../../../lib/luna/init.mjs';
import notePkg from '../../package.json' with { type: 'json' };
import assert from 'assert';

export default new Command('migrate')
  .argument('<name>', 'Target name to give note')
  .description('Migrate the note from luna-pass')
  .addOption(dbOption(notePkg.name))
  .action(async (name, { db }) => {
    // eslint-disable-next-line no-console
    console.log('Initialising Luna Note database...');

    const noteInstance = await initInstance(db, notePkg.name);

    await assertEntryExists(noteInstance, notePkg.name, name, false);

    // eslint-disable-next-line no-console
    console.log('Initialising Luna Pass database...');

    const passPkgName = 'luna-pass';

    const passInstance = await initInstance(
      join(paths(passPkgName, { suffix: '' }).data, passPkgName + '.db'),
    );

    /** @type {Buffer<ArrayBuffer> | void} */
    const passNote = await get(
      passInstance,
      passPkgName,
      (await getIdentity({ id: passPkgName + '-note', instance: passInstance })).identity.ref,
      'application/octet-stream',
    );

    assert(passNote);

    /** @type {Record<string, import('@astrobase/sdk/cid').ContentIdentifier>} */
    const noteIndex = (await getIndex(noteInstance, notePkg.name)) || {};

    noteIndex[name] = await put(noteInstance, notePkg.name, passNote, 'application/octet-stream');

    passNote.fill(0);

    await saveIndex(noteInstance, notePkg.name, noteIndex);

    // eslint-disable-next-line no-console
    console.log('Note saved');
  });

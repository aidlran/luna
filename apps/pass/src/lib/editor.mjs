import { spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import { readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function shred(/** @type {string} */ path) {
  const file = statSync(path);

  function fallback() {
    console.warn('Shred failed; using fallback');
    writeFileSync(path, Buffer.alloc(file.size, 0));
    unlinkSync(path);
  }

  try {
    const shred = spawnSync('shred', ['--remove', '--zero', '--iterations=3', path]);
    if (shred.status != 0) {
      fallback();
    }
  } catch {
    fallback();
  }
}

export function securelyEditViaEditor(/** @type {string | NodeJS.ArrayBufferView} */ data) {
  const tempFilePath = join(tmpdir(), randomUUID());

  const editor = process.env.EDITOR || 'vim';
  const args = [tempFilePath];

  if (editor === 'vim') {
    args.unshift('-c', 'set noswapfile nobackup nowritebackup');
  }

  writeFileSync(tempFilePath, data, { mode: 0o600 });

  const editResult = spawnSync(editor, args, { stdio: 'inherit' });

  const newData = readFileSync(tempFilePath);

  shred(tempFilePath);

  if (editResult.error) {
    console.error(editResult.error.message);
    process.exit(editResult.status);
  }


  return newData;
}

import { describe, expect, it } from 'vitest';
import { generateID } from '../../../../lib/test/generate-id.mjs';
import { spawnCommand } from '../../../../lib/test/spawn-command.mjs';

describe('Rename command', () => {
  it('Renames an entry', async () => {
    const oldID = generateID();

    const addResult = await spawnCommand(__dirname, 'add', {
      args: [oldID],
      cleanup: false,
    });

    expect(addResult.exitCode).toBe(0);
    expect(addResult.stderr).toBe('');
    expect(addResult.stdout).toBe('');

    const { dbFile } = addResult;

    const getResult = await spawnCommand(__dirname, 'get', {
      args: [oldID],
      cleanup: false,
      dbFile,
    });

    expect(getResult.exitCode).toBe(0);
    expect(getResult.stderr).toBe('');
    expect(getResult.stdout).not.toBe('');

    const newID = generateID();

    const renameResult = await spawnCommand(__dirname, 'rename', {
      args: [oldID, newID],
      cleanup: false,
      dbFile,
    });

    expect(renameResult.exitCode).toBe(0);
    expect(renameResult.stderr).toBe('');
    expect(renameResult.stdout).toBe('');

    const getOldResult = await spawnCommand(__dirname, 'get', {
      args: [oldID],
      cleanup: false,
      dbFile,
    });

    expect(getOldResult.exitCode).toBe(1);
    expect(getOldResult.stderr).toBe(`Entry '${oldID}' does not exist\n`);
    expect(getOldResult.stdout).toBe('');

    const getNewResult = await spawnCommand(__dirname, 'get', {
      args: [newID],
      dbFile,
    });

    expect(getNewResult.exitCode).toBe(0);
    expect(getNewResult.stderr).toBe('');
    expect(getNewResult.stdout).toBe(getResult.stdout);
  });

  it('Refuses if old ID does not exist', async () => {
    const oldID = generateID();

    const { exitCode, stderr, stdout } = await spawnCommand(__dirname, 'rename', {
      args: [oldID, generateID()],
    });

    expect(exitCode).toBe(1);
    expect(stderr).toBe(`Entry '${oldID}' does not exist\n`);
    expect(stdout).toBe('');
  });

  it('Refuses if new ID already exists', async () => {
    const oldID = generateID();
    const newID = generateID();

    let dbFile;

    for (const id of [oldID, newID]) {
      const result = await spawnCommand(__dirname, 'add', {
        args: [id],
        dbFile,
        cleanup: false,
      });

      dbFile ??= result.dbFile;

      expect(result.stderr).toBe('');
      expect(result.exitCode).toBe(0);
    }

    const { exitCode, stderr, stdout } = await spawnCommand(__dirname, 'rename', {
      args: [oldID, newID],
      dbFile,
    });

    expect(exitCode).toBe(1);
    expect(stderr).toBe(`Entry '${newID}' already exists\n`);
    expect(stdout).toBe('');
  });
});

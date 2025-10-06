import { describe, expect, it } from 'vitest';
import { generateID } from '../../../../lib/test/generate-id.mjs';
import { spawnCommand } from '../../../../lib/test/spawn-command.mjs';

describe('Delete command', () => {
  it('Deletes an entry', async () => {
    const id = generateID();
    const args = [id];

    const addResult = await spawnCommand(__dirname, 'add', {
      args,
      cleanup: false,
    });

    expect(addResult.exitCode).toBe(0);
    expect(addResult.stderr).toBe('');
    expect(addResult.stdout).toBe('');

    const { dbFile } = addResult;

    let getResult = await spawnCommand(__dirname, 'get', {
      args,
      cleanup: false,
      dbFile,
    });

    expect(getResult.exitCode).toBe(0);
    expect(getResult.stderr).toBe('');
    expect(getResult.stdout).not.toBe('');

    const deleteResult = await spawnCommand(__dirname, 'delete', {
      args,
      cleanup: false,
      dbFile,
    });

    expect(deleteResult.exitCode).toBe(0);
    expect(deleteResult.stderr).toBe('');
    expect(deleteResult.stdout).toBe('');

    getResult = await spawnCommand(__dirname, 'get', {
      args,
      dbFile,
    });

    expect(getResult.exitCode).toBe(1);
    expect(getResult.stderr).toBe(`Entry '${id}' does not exist\n`);
    expect(getResult.stdout).toBe('');
  });

  it('Refuses if ID does not exist', async () => {
    const id = generateID();

    const { exitCode, stderr, stdout } = await spawnCommand(__dirname, 'delete', {
      args: [id],
    });

    expect(exitCode).toBe(1);
    expect(stderr).toBe(`Entry '${id}' does not exist\n`);
    expect(stdout).toBe('');
  });
});

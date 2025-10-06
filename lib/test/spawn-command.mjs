import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import { join } from 'path';
import { stripVTControlCharacters } from 'util';
import { passphrase } from './passphrase.mjs';
import { rm } from 'fs/promises';

/**
 * @typedef SpawnCommandOptions
 * @property {string[]} [args]
 * @property {boolean} [cleanup]
 * @property {string} [code]
 * @property {string} [dbFile]
 */

/**
 * @typedef SpawnCommandResult
 * @property {string} dbFile
 * @property {number} exitCode
 * @property {string} stderr
 * @property {string} stdout
 */

/**
 * @param {string} dirname
 * @param {string} commandName
 * @param {SpawnCommandOptions} [options]
 * @returns {Promise<SpawnCommandResult>}
 */
export function spawnCommand(
  dirname,
  commandName,
  {
    args = [],
    cleanup = true,
    code,
    dbFile = join(dirname, `test.${randomBytes(8).toString('base64url')}.db`),
  } = {},
) {
  const srcFile = join(dirname, commandName + '.command.mjs');

  const commandProcess = spawn('node', [
    '-e',
    `let command = require('${srcFile}').default;\n` +
      (code ?? '') +
      `\ncommand.parse(${JSON.stringify(['--db', dbFile, ...args])}, { from: 'user' })`,
  ]);

  let stderr = '';

  commandProcess.stderr.on('data', (data) => {
    if (data instanceof Buffer) {
      stderr += data.toString();
    } else {
      throw TypeError('Unexpected non-Buffer type data from stderr: ' + data);
    }
  });

  let stdout = '';

  commandProcess.stdout.on('data', (data) => {
    if (data instanceof Buffer) {
      const str = data.toString();
      if (str.endsWith('database passphrase: ') || str.startsWith("Enter value for '")) {
        commandProcess.stdin.write(passphrase + '\n');
      } else {
        stdout += str;
      }
    } else {
      throw TypeError('Unexpected non-Buffer type data from stdout: ' + data);
    }
  });

  function clean() {
    if (cleanup) {
      for (const file of [dbFile, dbFile + '-shm', dbFile + 'wal']) {
        rm(file).catch(() => undefined);
      }
    }
  }

  /** @type {Promise<SpawnCommandResult>} */
  return new Promise((resolve, reject) => {
    commandProcess.on('close', (exitCode) => {
      resolve({ dbFile, exitCode, stderr, stdout: stripVTControlCharacters(stdout) });
      clean();
    });

    commandProcess.on('error', (err) => {
      reject('Unexpected error: ' + err);
      clean();
    });
  });
}

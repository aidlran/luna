import { clearLine, cursorTo } from 'readline';
import { createInterface } from 'readline/promises';
import { Writable } from 'stream';

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function prompt(prompt) {
  const readline = createInterface({
    input: process.stdin,
    output: new Writable({
      write: (_chunk, _encoding, callback) => callback(),
    }),
    terminal: true,
  });

  process.stdout.write(prompt + ': ');

  const answer = await readline.question('');

  cursorTo(process.stdout, 0);
  clearLine(process.stdout, 0);

  readline.close();

  return answer;
}

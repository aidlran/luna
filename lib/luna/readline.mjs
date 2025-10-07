import { clearLine, cursorTo } from 'readline';
import { createInterface } from 'readline/promises';
import { ReadStream } from 'tty';

/**
 * Prompts user for a secret value.
 *
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function prompt(prompt) {
  /** @type {import('tty').ReadStream} */
  let input;

  /** @type {boolean} */
  let unref;

  for (const stream of [process.stderr, process.stdout]) {
    if (stream.isTTY) {
      input = new ReadStream(stream.fd, { readable: true });
      unref = true;
      break;
    }
  }

  if (!input /* && process.stdin.isTTY */) {
    input = process.stdin;
    unref = false;
  }

  // if (!input) {
  //   // eslint-disable-next-line no-console
  //   console.error('No TTY for password prompt');
  //   process.exit(1);
  // }

  const readline = createInterface({ input, terminal: true });

  process.stderr.write(prompt + ': ');

  try {
    var answer = await readline.question('');
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      process.exit(0);
    }
    throw e;
  }

  cursorTo(process.stderr, 0);
  clearLine(process.stderr, 0);

  readline.close();

  if (unref) {
    input.unref();
  }

  return answer;
}

import { prompt } from '../../../../lib/luna/readline.mjs';

/**
 * @param {object} obj
 * @param {string[]} [secrets]
 * @returns {Promise<void>}
 */
export async function promptSecrets(obj, secrets) {
  if (secrets) {
    for (const key of secrets) {
      obj[key] = await prompt(`Enter value for '${key}'`);
    }
  }
}

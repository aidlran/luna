import { Option } from 'commander';
import { inspect } from 'util';

/**
 * @param {string} value
 * @returns {number}
 */
function parseIntArg(value) {
  const asInt = Number.parseInt(value);
  console.log(inspect(this, true, null, true));
  if (Number.isNaN(asInt)) {
    console.error(this.long + ' value must be an integer');
    process.exit(1);
  }
  return asInt;
}

export default new Option('--timeout <INTEGER>', 'Timeout for awaiting stdin input')
  .default(3000)
  .argParser(parseIntArg);

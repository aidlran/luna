import { initInstance } from '../../../../lib/luna/init.mjs';
import pkg from '../../package.json' with { type: 'json' };

/**
 * @param {string} dbFilePath
 * @returns {Promise<import('@astrobase/sdk/instance').Instance>}
 */
export const init = (dbFilePath) => initInstance(dbFilePath, pkg.name);

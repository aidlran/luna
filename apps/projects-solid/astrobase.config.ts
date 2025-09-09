import { Common } from '@astrobase/sdk/common';
import { createInstance } from '@astrobase/sdk/instance';

/**
 * The base Astrobase config. The application derives a reactive final config value with user
 * configuration on top.
 */
export default createInstance(Common);

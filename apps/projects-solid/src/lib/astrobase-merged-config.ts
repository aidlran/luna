import { createMemo } from 'solid-js';
import baseConfig from '../../astrobase.config';

/** The reactive merged Astrobase config. We'll add a source signal with the user's configuration. */
export default createMemo(() => baseConfig);

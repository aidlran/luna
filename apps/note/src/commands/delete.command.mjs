import { deleteContent } from '@astrobase/sdk/content';
import deleteCommand from '../../../../lib/luna/commands/delete.command.mjs';
import pkg from '../../package.json' with { type: 'json' };

export default deleteCommand(pkg.name, deleteContent);

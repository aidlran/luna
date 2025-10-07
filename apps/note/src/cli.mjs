#!/usr/bin/env node

import { Command } from 'commander';
import listCommand from '../../../lib/luna/commands/list.command.mjs';
import renameCommand from '../../../lib/luna/commands/rename.command.mjs';
import pkg from '../package.json' with { type: 'json' };
import appendCommand from './commands/append.command.mjs';
import catCommand from './commands/cat.command.mjs';
import deleteCommand from './commands/delete.command.mjs';
import editCommand from './commands/edit.command.mjs';
import migrateCommand from './commands/migrate.command.mjs';

new Command(pkg.name)
  .description(pkg.description)
  .version(pkg.version, '-v, --version')
  .addCommand(appendCommand)
  .addCommand(catCommand)
  .addCommand(deleteCommand)
  .addCommand(editCommand)
  .addCommand(listCommand(pkg.name))
  .addCommand(migrateCommand)
  .addCommand(renameCommand(pkg.name))
  .parse();

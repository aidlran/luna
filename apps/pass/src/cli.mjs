#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import addCommand from './commands/add.command.mjs';
import deleteCommand from './commands/delete.command.mjs';
import getCommand from './commands/get.command.mjs';
import listCommand from './commands/list.command.mjs';
import renameCommand from './commands/rename.command.mjs';
import updateCommand from './commands/update.command.mjs';

new Command(pkg.name)
  .description(pkg.description)
  .version(pkg.version, '-v, --version')
  .addCommand(addCommand)
  .addCommand(deleteCommand)
  .addCommand(getCommand)
  .addCommand(listCommand)
  .addCommand(renameCommand)
  .addCommand(updateCommand)
  .parse();

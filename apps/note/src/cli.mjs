#!/usr/bin/env node

import { Command } from 'commander';
import listCommand from '../../../lib/luna/list.command.mjs';
import pkg from '../package.json' with { type: 'json' };
import editCommand from './commands/edit.command.mjs';

new Command(pkg.name)
  .description(pkg.description)
  .version(pkg.version, '-v, --version')
  .addCommand(editCommand)
  .addCommand(listCommand(pkg.name))
  .parse();

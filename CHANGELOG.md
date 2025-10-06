# Changelog

## Unreleased

### Luna Note

- First version.
- Added `edit` & `list` commands.

### Luna Pass

- Removed automatic migration introduced in `v2.0.0-rc.7`.
- Removed `note` subcommand in favour of standalone Luna Note app.
- Refactored to modularise code.
- Replaced `readline-sync` dependency with own solution.
- Added E2E tests for commands.

## [Luna Pass 2.1.0](https://github.com/aidlran/cli-password-manager/releases/tag/v2.1.0) - 2025-07-17

- Added `note` subcommand.

## [Luna Pass 2.0.0-rc.8](https://github.com/aidlran/cli-password-manager/releases/tag/v2.0.0-rc.7) - 2025-06-25

- Added missing peer dependencies.

## [Luna Pass 2.0.0-rc.7](https://github.com/aidlran/cli-password-manager/releases/tag/v2.0.0-rc.7) - 2025-06-24

- Added `--db` option.
- Changed get command to list properties alphabetically.
- Renamed default database file path. File will be automatically renamed when a command is run.
- Migrated to use Astrobase keyring & identity. Database will be migrated when a command is run.

## [Luna Pass 2.0.0-rc.6](https://github.com/aidlran/cli-password-manager/releases/tag/v2.0.0-rc.6) - 2025-04-13

- Added optional case insensitive search to list command.
- Changed list command to print entries in alphabetical order.
- Fixed deprecation warning for assert import.

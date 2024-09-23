#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import { runOAuthFlow } from '../src/lib/eve-esi/esiOauthNative.mjs';

program.version('1.0.0').description('My Node CLI');

console.log(
  chalk.yellow(
    figlet.textSync('Eve Data Aggregator', { horizontalLayout: 'full' }),
  ),
);

program
  .command('repeat')
  .description('Repeats the OAuth flow at specified intervals')
  .requiredOption('-i, --interval <minutes>', 'Interval in minutes')
  .action(async (options) => {
    const intervalMs = options.interval * 60 * 1000;

    const runFlow = async () => {
      try {
        await runOAuthFlow();
        console.log(chalk.green('OAuth flow completed successfully.'));
      } catch (error) {
        console.error(chalk.red(`Error during OAuth flow: ${error.message}`));
      }
    };

    await runFlow();
    setInterval(runFlow, intervalMs);
  });

program.parse(process.argv);
#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { runOAuthFlow } from '../src/lib/eve-esi/esiOauthNative.mjs';
import { importWalletData } from '../src/lib/eve-esi/walletService.mjs';
import dotenv from 'dotenv';
import sequelize from '../src/utils/sequelizeClient.mjs';

dotenv.config();

program.version('1.0.0').description('My Node CLI');

console.log(
  chalk.yellow(
    figlet.textSync('Eve Data Aggregator', { horizontalLayout: 'full' }),
  ),
);

const runFlow = async () => {
  const { jwt, accessToken } = await runOAuthFlow();
  return { jwt, accessToken };
};

const runJobs = async ({ jwt, accessToken }) => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'importWalletData',
        message: 'Do you want to run importWalletData?',
        default: false,
      },
      // Add more prompts for other jobs here
    ]);

    if (answers.importWalletData) {
      try {
        await importWalletData(jwt, accessToken);
        console.log(chalk.green('importWalletData completed successfully.'));
      } catch (error) {
        console.error(
          chalk.red(`Error during importWalletData: ${error.message}`),
        );
      }
    }

    // Add more job executions here based on user answers
  } catch (error) {
    if (error instanceof inquirer.errors.ExitPromptError) {
      console.log(chalk.yellow('Prompt was forcefully closed by the user.'));
    } else {
      console.error(chalk.red(`Unexpected error: ${error.message}`));
    }
  }
};

const initialize = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      chalk.green('Database connection has been established successfully.'),
    );
  } catch (err) {
    console.error(chalk.red('Unable to connect to the database:', err));
    process.exit(1);
  }
};

const main = async () => {
  await initialize();

  program
    .command('repeat')
    .description('Repeats the OAuth flow at specified intervals')
    .option('-i, --interval <minutes>', 'Interval in minutes')
    .action(async (options) => {
      const intervalMs = options.interval ? options.interval * 60 * 1000 : null;
      const authData = await runFlow();
      await runJobs(authData);
      if (intervalMs) {
        setInterval(async () => {
          await runJobs(authData);
        }, intervalMs);
      }
    });

  program.action(async () => {
    const authData = await runFlow();
    await runJobs(authData);
  });

  program.parse(process.argv);
};

main();

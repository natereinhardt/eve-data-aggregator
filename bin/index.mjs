#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { runOAuthFlow } from '../src/lib/eve-esi/esiOauthNative.mjs';
import { importWalletData } from '../src/lib/eve-esi/walletService.mjs';
import dotenv from 'dotenv';
import sequelize from '../src/utils/sequelizeClient.mjs';
import { importCsvToDb } from '../src/utils/csvWalletHistory.mjs';

dotenv.config();

program.version('1.0.0').description('My Node CLI');

console.log(
  chalk.yellow(
    figlet.textSync('Eve Data Aggregator', { horizontalLayout: 'full' }),
  ),
);

const runJobs = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'importS0bHoldingsWalletData',
      message: 'Do you want to run importWalletData?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'importCsvToDb',
      message: 'Do you want to import CSV data to the database?',
      default: false,
    },
    // Add more prompts for other jobs here
  ]);

  if (answers.importS0bHoldingsWalletData) {
    try {
      const authData = await runOAuthFlow('importS0bHoldingsWalletData');
      const { jwt, accessToken } = authData;
      await importWalletData(jwt, accessToken);
      console.log(
        chalk.green('importS0bHoldingsWalletData completed successfully.'),
      );
    } catch (error) {
      console.error(
        chalk.red(`Error during importWalletData: ${error.message}`),
      );
    }
  }

  if (answers.importCsvToDb) {
    try {
      await importCsvToDb();
      console.log(chalk.green('importCsvToDb completed successfully.'));
    } catch (error) {
      console.error(chalk.red(`Error during importCsvToDb: ${error.message}`));
    }
  }

  // Add more job executions here based on user answers
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

program
  .command('repeat')
  .description('Repeats the OAuth flow at specified intervals')
  .option('-i, --interval <minutes>', 'Interval in minutes')
  .action(async (options) => {
    await initialize();
    const intervalMs = options.interval ? options.interval * 60 * 1000 : null;
    await runJobs();
    if (intervalMs) {
      setInterval(async () => {
        await runJobs(auhData);
      }, intervalMs);
    }
  });

program.action(async () => {
  await initialize();
  await runJobs();
});

program.parse(process.argv);

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

const runJobs = async ({ jwt, accessToken }, answers) => {
  try {
    if (!answers) {
      answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'importWalletData',
          message: 'Do you want to run importWalletData?',
          default: false,
        },
        // Add more prompts for other jobs here
      ]);
    }

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

  const authData = await runFlow();

  const repeatAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldRepeat',
      message: 'Do you want to repeat the job execution?',
      default: false,
    },
    {
      type: 'input',
      name: 'interval',
      message: 'Enter the interval in minutes:',
      when: (answers) => answers.shouldRepeat,
      validate: (input) => {
        const num = parseInt(input, 10);
        return !isNaN(num) && num > 0
          ? true
          : 'Please enter a valid number greater than 0';
      },
    },
  ]);

  const initialAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'importWalletData',
      message: 'Do you want to run importWalletData?',
      default: false,
    },
    // Add more prompts for other jobs here
  ]);

  await runJobs(authData, initialAnswers);

  if (repeatAnswers.shouldRepeat) {
    const intervalMs = repeatAnswers.interval * 60 * 1000;
    setInterval(async () => {
      await runJobs(authData, initialAnswers);
    }, intervalMs);
  }

  program.parse(process.argv);
};

main();

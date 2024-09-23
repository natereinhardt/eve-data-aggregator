#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import { runOAuthFlow } from "../src/lib/eve-esi/esiOauthNative.mjs";

program.version("1.0.0").description("My Node CLI");

console.log(
  chalk.yellow(figlet.textSync("Eve Data Aggregator", { horizontalLayout: "full" }))
);

program.action(() => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "runOAuth",
        message: "Do you want to run the OAuth flow?",
        default: false,
      },
      {
        type: "confirm",
        name: "repeat",
        message: "Do you want to repeat the OAuth flow?",
        default: false,
        when: (answers) => answers.runOAuth,
      },
      {
        type: "input",
        name: "interval",
        message: "How often do you want to run the OAuth flow (in minutes)?",
        validate: (value) => {
          const valid = !isNaN(parseFloat(value)) && isFinite(value) && value > 0;
          return valid || "Please enter a positive number";
        },
        filter: Number,
        when: (answers) => answers.repeat,
      },
    ])
    .then(async (answers) => {
      console.log(chalk.green(`Hey there, ${answers.name}!`));
      if (answers.runOAuth) {
        const runFlow = async () => {
          try {
            await runOAuthFlow();
            console.log(chalk.green("OAuth flow completed successfully."));
          } catch (error) {
            console.error(chalk.red(`Error during OAuth flow: ${error.message}`));
          }
        };

        await runFlow();

        if (answers.repeat) {
          const intervalMs = answers.interval * 60 * 1000;
          setInterval(runFlow, intervalMs);
        }
      }
    });
});

program.parse(process.argv);
import Token from '../../models/Tokens.mjs'; // Adjust the path as necessary
import chalk from 'chalk';

export async function upsertAuthData(authData) {
  try {
    await Token.upsert(authData);
    console.log(
      chalk.green('Auth data successfully upserted into the tokens database.'),
    );
  } catch (error) {
    console.error(
      chalk.red('Error upserting auth data into the tokens database:', error),
    );
  }
}

export async function findByJobName(job) {
  try {
    const token = await Token.findOne({ where: { job } });
    if (token) {
      console.log(chalk.green(`Token found for job: ${job}`));
    } else {
      console.log(chalk.yellow(`No token found for job: ${job}`));
    }
    return token;
  } catch (error) {
    console.error(chalk.red('Error finding token by job name:', error));
    throw error;
  }
}

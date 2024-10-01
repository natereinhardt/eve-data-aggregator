import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { sanitizeEntry } from './helpers.mjs';
import { upsertJournalEntries } from '../lib/service/transactionEntrieService.mjs';
import chalk from 'chalk';

export async function importCsvToDb() {
  const csvFilePath = path.resolve('S0B-All-cleaned.csv');
  const entries = [];

  return new Promise((resolve, reject) => {
    const parser = fs
      .createReadStream(csvFilePath)
      .pipe(parse({ columns: true }));

    parser.on('data', (row) => {
      // Apply the mapping logic
      row.amount = isNaN(parseFloat(row.amount))
        ? 0
        : parseFloat(row.amount).toFixed(2);
      row.balance = isNaN(parseFloat(row.balance))
        ? 0
        : parseFloat(row.balance).toFixed(2);
      row.transaction_type = row.amount < 0 ? 0 : 1;

      // Sanitize the entry
      const sanitizedEntry = sanitizeEntry(row);
      entries.push(sanitizedEntry);
    });

    parser.on('end', async () => {
      try {
        console.log(chalk.blue('CSV file successfully processed.'));
        await upsertJournalEntries(entries);
        console.log(
          chalk.green('Data successfully inserted into the database.'),
        );
        resolve();
      } catch (error) {
        console.error(
          chalk.red('Error inserting data into the database:', error),
        );
        reject(error);
      }
    });

    parser.on('error', (error) => {
      console.error(chalk.red('Error reading CSV file:', error));
      reject(error);
    });
  });
}

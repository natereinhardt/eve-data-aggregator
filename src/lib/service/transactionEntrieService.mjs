import JournalEntry from '../../models/JournalEntry.mjs';
import chalk from 'chalk';

export async function bulkUpsertJournalEntries(entries) {
  try {
    // Ensure 'id' is part of the unique constraint or primary key in your database schema
    const result = await JournalEntry.bulkCreate(entries, {
      updateOnDuplicate: [
        'id',
        'amount',
        'balance',
        'context_id',
        'context_id_type',
        'date',
        'description',
        'first_party_id',
        'reason',
        'ref_type',
        'second_party_id',
        'wallet_division',
        'transaction_type',
      ],
    });

    if (result.length > 0) {
      console.log(
        chalk.green(`Bulk upserted ${result.length} journal entries`),
      );

      // Filter and log entries with wallet_division equal to 4
      const filteredEntries = result.filter(
        (entry) => entry.wallet_division === 4,
      );
      if (filteredEntries.length > 0) {
        console.log(chalk.blue('Entries with wallet_division = 4:'));
        console.log(filteredEntries);
      }
    }
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

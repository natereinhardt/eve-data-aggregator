import JournalEntry from '../../models/JournalEntry.mjs';

export async function bulkUpsertJournalEntries(entries) {
  try {
    const result = await JournalEntry.bulkCreate(entries, {
      updateOnDuplicate: [
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
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

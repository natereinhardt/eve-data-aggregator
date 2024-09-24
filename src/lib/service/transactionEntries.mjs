import pool from './mysqlClient.mjs';

export async function upsertJournalEntry(entry) {
  const sql = `
    INSERT INTO journal_entries (
      amount, balance, context_id, context_id_type, date, description,
      first_party_id, id, reason, ref_type, second_party_id, wallet_division, transaction_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      amount = VALUES(amount),
      balance = VALUES(balance),
      context_id = VALUES(context_id),
      context_id_type = VALUES(context_id_type),
      date = VALUES(date),
      description = VALUES(description),
      first_party_id = VALUES(first_party_id),
      reason = VALUES(reason),
      ref_type = VALUES(ref_type),
      second_party_id = VALUES(second_party_id),
      wallet_division = VALUES(wallet_division),
      transaction_type = VALUES(transaction_type)
  `;
  const values = [
    entry.amount,
    entry.balance,
    entry.context_id,
    entry.context_id_type,
    entry.date,
    entry.description,
    entry.first_party_id,
    entry.id,
    entry.reason,
    entry.ref_type,
    entry.second_party_id,
    entry.wallet_division,
    entry.transaction_type,
  ];

  const [result] = await pool.execute(sql, values);
  return result;
}

// Example usage
const entry = {
  amount: 58320.0,
  balance: 9798963512.82,
  context_id: 40154468,
  context_id_type: 'planet_id',
  date: '2024-09-18T15:33:05Z',
  description:
    'Planetary Export Tax: SnookPP Zanjoahir exported from M-MD31 II',
  first_party_id: 2114715198,
  id: 23289030664,
  reason: 'Export Duty for M-MD31 II',
  ref_type: 'planetary_export_tax',
  second_party_id: 98399918,
  wallet_division: 1,
  transaction_type: 1,
};

async function main() {
  try {
    const upsertResult = await upsertJournalEntry(entry);
    console.log('Upsert Result:', upsertResult);
  } catch (error) {
    console.error('Database operation failed:', error);
  }
}

main();

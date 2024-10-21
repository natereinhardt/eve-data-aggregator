import chalk from 'chalk';

const models = {
  1: 'One_JournalEntry',
  2: 'Two_JournalEntry',
  3: 'Three_JournalEntry',
  4: 'Four_JournalEntry',
  5: 'Five_JournalEntry',
  6: 'Six_JournalEntry',
  7: 'Seven_JournalEntry',
};

async function getModel(wallet_division, sequelizeInstance) {
  const modelName = models[wallet_division];
  if (!modelName) {
    throw new Error(`No model found for wallet_division ${wallet_division}`);
  }
  const modelModule = await import(`../../models/${modelName}.mjs`);
  const defineModel = modelModule.default;
  return defineModel(sequelizeInstance);
}

export async function upsertJournalEntries(entries, sequelizeInstance) {
  const groupedEntries = entries.reduce((acc, entry) => {
    const { wallet_division } = entry;
    if (!acc[wallet_division]) {
      acc[wallet_division] = [];
    }
    acc[wallet_division].push(entry);
    return acc;
  }, {});

  for (const [wallet_division, entries] of Object.entries(groupedEntries)) {
    const model = await getModel(wallet_division, sequelizeInstance);
    if (model) {
      const result = await model.bulkCreate(entries, {
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
      console.log(
        chalk.green(
          `Bulk upserted ${result.length} entries into ${models[wallet_division]}`,
        ),
      );
    }
  }
}
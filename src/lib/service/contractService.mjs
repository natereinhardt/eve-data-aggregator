import chalk from 'chalk';

async function getContractModel(sequelizeInstance) {
  const modelModule = await import('../../models/Contract.mjs');
  const defineModel = modelModule.default;
  return defineModel(sequelizeInstance);
}

export async function upsertContracts(contracts, sequelizeInstance) {
  if (!Array.isArray(contracts) || contracts.length === 0) {
    console.log(chalk.yellow('No contracts to upsert.'));
    return;
  }
  try {
    const Contract = await getContractModel(sequelizeInstance);
    await Contract.bulkCreate(contracts, {
      updateOnDuplicate: [
        'acceptor_id',
        'assignee_id',
        'availability',
        'collateral',
        'date_accepted',
        'date_completed',
        'date_expired',
        'date_issued',
        'days_to_complete',
        'end_location_id',
        'for_corporation',
        'issuer_corporation_id',
        'issuer_id',
        'price',
        'reward',
        'start_location_id',
        'status',
        'title',
        'type',
        'volume',
        'character_name'
      ],
    });
    console.log(
      chalk.green(`${contracts.length} contracts upserted successfully.`)
    );
  } catch (error) {
    console.error(
      chalk.red('Error upserting contracts:', error)
    );
    throw error;
  }
}
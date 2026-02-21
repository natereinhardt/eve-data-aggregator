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
    
    // Debug: Log sample contract data
    if (contracts.length > 0) {
      const sample = contracts[0];
      console.log(
        chalk.magenta(
          `\nDebug - Sample contract data:` +
          `\n  contract_id: ${sample.contract_id}` +
          `\n  contract_type: ${sample.contract_type}` +
          `\n  total_value: ${sample.total_value}` +
          `\n  character_name: ${sample.character_name}`
        )
      );
    }
    
    // Use bulkCreate with updateOnDuplicate to insert new or update existing
    const result = await Contract.bulkCreate(contracts, {
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
        'character_name',
        'contract_type',
        'total_value'
      ],
    });
    
    console.log(
      chalk.green(
        `\n✓ ${contracts.length} contracts upserted successfully (inserted new or updated existing)`
      )
    );
    
    // Verify the sample contract was saved correctly
    if (contracts.length > 0) {
      const sampleId = contracts[0].contract_id;
      const saved = await Contract.findByPk(sampleId);
      if (saved) {
        console.log(
          chalk.cyan(
            `\nVerification - Contract ${sampleId} in database:` +
            `\n  total_value: ${saved.total_value}` +
            `\n  contract_type: ${saved.contract_type}`
          )
        );
      }
    }
  } catch (error) {
    console.error(
      chalk.red('Error upserting contracts:', error)
    );
    throw error;
  }
}
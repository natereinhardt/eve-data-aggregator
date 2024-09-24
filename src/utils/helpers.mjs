export function sanitizeEntry(entry) {
  const schema = {
    amount: 'decimal',
    balance: 'decimal',
    context_id: 'bigint',
    context_id_type: 'varchar',
    date: 'datetime',
    description: 'text',
    first_party_id: 'bigint',
    id: 'bigint',
    reason: 'text',
    ref_type: 'varchar',
    second_party_id: 'bigint',
    wallet_division: 'smallint',
    transaction_type: 'tinyint',
  };

  for (const key in schema) {
    switch (schema[key]) {
      case 'decimal':
        entry[key] =
          entry[key] == null ? 0.0 : parseFloat(entry[key]).toFixed(2);
        break;
      case 'bigint':
        entry[key] = entry[key] == null ? 0 : parseInt(entry[key], 10);
        break;
      case 'varchar':
        entry[key] = entry[key] == null ? '' : entry[key].toString();
        if (entry[key].length > 255) {
          entry[key] = entry[key].substring(0, 255); // Truncate to 255 characters
        }
        break;
      case 'datetime':
        entry[key] =
          entry[key] == null
            ? new Date().toISOString()
            : new Date(entry[key]).toISOString();
        break;
      case 'text':
        entry[key] = entry[key] == null ? '' : entry[key].toString();
        break;
      case 'smallint':
        entry[key] = entry[key] == null ? 0 : parseInt(entry[key], 10);
        break;
      case 'tinyint':
        entry[key] = entry[key] == null ? 0 : parseInt(entry[key], 10);
        break;
      default:
        entry[key] = entry[key] == null ? '' : entry[key];
    }
  }
  return entry;
}

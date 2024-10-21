// src/models/JournalEntry.mjs
import { DataTypes } from 'sequelize';

const defineJournalEntryModel = (sequelizeInstance) => {
  return sequelizeInstance.define(
    'JournalEntry',
    {
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      context_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      context_id_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_party_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ref_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      second_party_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wallet_division: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'journal_entries',
      timestamps: false,
    },
  );
};

export default defineJournalEntryModel;
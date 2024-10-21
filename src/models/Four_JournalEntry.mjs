// src/models/Four_JournalEntry.mjs
import { DataTypes } from 'sequelize';

const defineFourJournalEntryModel = (sequelizeInstance) => {
  return sequelizeInstance.define(
    'Four_JournalEntry',
    {
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      context_id: {
        type: DataTypes.BIGINT,
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      first_party_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true, // Composite primary key
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ref_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      second_party_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      wallet_division: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true, // Composite primary key
      },
      transaction_type: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      unique_id: {
        type: DataTypes.VIRTUAL, // Sequelize uses VIRTUAL instead of GENERATED for computed fields
        get() {
          return `${this.id}-${this.wallet_division}`;
        },
      },
    },
    {
      tableName: '4_journal_entries',
      timestamps: false,
      indexes: [
        { fields: ['transaction_type'] },
        { fields: ['date'] },
        { fields: ['context_id_type'] },
      ],
      primaryKey: {
        name: 'pk_journal_entries',
        fields: ['id', 'wallet_division'], // Composite primary key
      },
    },
  );
};

export default defineFourJournalEntryModel;

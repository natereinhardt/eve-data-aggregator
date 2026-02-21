import { DataTypes } from 'sequelize';

const defineContractsModel = (sequelizeInstance) => {
  return sequelizeInstance.define(
    'Contract',
    {
      acceptor_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      assignee_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      availability: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      collateral: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      contract_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      date_accepted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_completed: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_expired: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_issued: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      days_to_complete: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      end_location_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      for_corporation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      issuer_corporation_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      issuer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      reward: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      start_location_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contract_type: { // <-- Added field
        type: DataTypes.STRING,
        allowNull: true,
      },
      volume: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      character_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      total_value: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
      },
    },
    {
      tableName: 'contract',
      timestamps: false,
    }
  );
};

export default defineContractsModel;
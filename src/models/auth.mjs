// src/models/Auth.mjs
import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelizeClient.mjs';

const Auth = sequelize.define(
  'Auth',
  {
    scp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jti: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    kid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    azp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tenant: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tier: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    aud: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    iat: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    iss: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'auth',
    timestamps: false,
  },
);

export default Auth;

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const ven0mSequelize = new Sequelize(
  process.env.VEN0M_DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
);

export default ven0mSequelize;

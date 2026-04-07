import { Sequelize } from 'sequelize-typescript';
import { env } from '../config/env';
import path from 'path';

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  models: [path.join(__dirname, 'models', '*.ts'), path.join(__dirname, 'models', '*.js')],
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;

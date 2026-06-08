import { Sequelize } from 'sequelize-typescript';
import { env } from '../config/env';
import User from './models/User';
import Donation from './models/Donation';
import Cause from './models/Cause';
import CauseDonation from './models/CauseDonation';
import Achievement from './models/Achievement';
import UserAchievement from './models/UserAchievement';
import Notification from './models/Notification';

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  models: [User, Donation, Cause, CauseDonation, Achievement, UserAchievement, Notification],
  define: {
    underscored: true,
    timestamps: true,
  },
  ...(isProduction && {
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  }),
});

export default sequelize;

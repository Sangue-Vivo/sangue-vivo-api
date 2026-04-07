import {
  Table, Column, Model, DataType, HasMany, Default, AllowNull, PrimaryKey, Unique,
} from 'sequelize-typescript';
import UserAchievement from './UserAchievement';

@Table({ tableName: 'achievements', updatedAt: false })
export default class Achievement extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare code: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare icon: string;

  @Default(0)
  @Column(DataType.INTEGER)
  declare xpReward: number;

  @Column(DataType.INTEGER)
  declare requiredDonations: number | null;

  @Column(DataType.INTEGER)
  declare requiredStreak: number | null;

  @Column(DataType.INTEGER)
  declare requiredCauses: number | null;

  @HasMany(() => UserAchievement)
  declare users: UserAchievement[];
}

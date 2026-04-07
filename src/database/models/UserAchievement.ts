import {
  Table, Column, Model, DataType, BelongsTo, ForeignKey, Default, AllowNull, PrimaryKey,
} from 'sequelize-typescript';
import User from './User';
import Achievement from './Achievement';

@Table({ tableName: 'user_achievements', updatedAt: false })
export default class UserAchievement extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Achievement)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare achievementId: string;

  @BelongsTo(() => Achievement)
  declare achievement: Achievement;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare unlockedAt: Date;
}

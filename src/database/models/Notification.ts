import {
  Table, Column, Model, DataType, BelongsTo, ForeignKey, Default, AllowNull, PrimaryKey,
} from 'sequelize-typescript';
import User from './User';

@Table({ tableName: 'notifications', updatedAt: false })
export default class Notification extends Model {
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

  @AllowNull(false)
  @Column(DataType.ENUM('ELIGIBLE_TO_DONATE', 'DONATION_REMINDER', 'CAUSE_MATCH', 'RANK_UP', 'ACHIEVEMENT', 'GENERAL'))
  declare type: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare message: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isRead: boolean;

  @Column(DataType.STRING)
  declare actionUrl: string | null;
}

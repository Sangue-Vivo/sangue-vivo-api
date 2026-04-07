import {
  Table, Column, Model, DataType, BelongsTo, HasOne, ForeignKey, Default, AllowNull, PrimaryKey,
} from 'sequelize-typescript';
import User from './User';
import CauseDonation from './CauseDonation';

@Table({ tableName: 'donations' })
export default class Donation extends Model {
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
  @Column(DataType.DATE)
  declare scheduledDate: Date;

  @Column(DataType.DATE)
  declare completedDate: Date | null;

  @Default('SCHEDULED')
  @Column(DataType.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'))
  declare status: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare hospital: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare city: string;

  @Default(0)
  @Column(DataType.INTEGER)
  declare xpEarned: number;

  @HasOne(() => CauseDonation)
  declare causeDonation: CauseDonation | null;
}

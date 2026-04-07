import {
  Table, Column, Model, DataType, BelongsTo, ForeignKey, Default, AllowNull, PrimaryKey, Unique,
} from 'sequelize-typescript';
import Cause from './Cause';
import Donation from './Donation';

@Table({ tableName: 'cause_donations', updatedAt: false })
export default class CauseDonation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @ForeignKey(() => Cause)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare causeId: string;

  @BelongsTo(() => Cause)
  declare cause: Cause;

  @ForeignKey(() => Donation)
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare donationId: string;

  @BelongsTo(() => Donation)
  declare donation: Donation;
}

import {
  Table, Column, Model, DataType, BelongsTo, HasMany, ForeignKey, Default, AllowNull, PrimaryKey,
} from 'sequelize-typescript';
import User from './User';
import CauseDonation from './CauseDonation';

@Table({ tableName: 'causes' })
export default class Cause extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string;

  @Default('')
  @Column(DataType.STRING)
  declare patientName: string;

  @AllowNull(false)
  @Column(DataType.ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'))
  declare bloodType: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare hospital: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare city: string;

  @Default(1)
  @Column(DataType.INTEGER)
  declare urgencyLevel: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare goalDonations: number;

  @Default(0)
  @Column(DataType.INTEGER)
  declare currentDonations: number;

  @Default('ACTIVE')
  @Column(DataType.ENUM('ACTIVE', 'FULFILLED', 'EXPIRED'))
  declare status: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare createdById: string;

  @BelongsTo(() => User, 'createdById')
  declare createdBy: User;

  @HasMany(() => CauseDonation)
  declare donations: CauseDonation[];
}

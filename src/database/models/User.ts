import {
  Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull, PrimaryKey,
} from 'sequelize-typescript';
import Donation from './Donation';
import Cause from './Cause';
import UserAchievement from './UserAchievement';
import Notification from './Notification';

@Table({ tableName: 'users' })
export default class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare cpf: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare passwordHash: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @Default('')
  @Column(DataType.STRING)
  declare phone: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  declare birthDate: string;

  @AllowNull(false)
  @Column(DataType.ENUM('MALE', 'FEMALE', 'OTHER'))
  declare gender: string;

  @AllowNull(false)
  @Column(DataType.ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'))
  declare bloodType: string;

  @Default('')
  @Column(DataType.STRING)
  declare university: string;

  @Default('')
  @Column(DataType.STRING)
  declare course: string;

  @Default(1)
  @Column(DataType.INTEGER)
  declare semester: number;

  @Column(DataType.STRING)
  declare avatarUrl: string | null;

  @Default('user')
  @Column(DataType.ENUM('user', 'admin'))
  declare role: string;

  @Default('GOTA')
  @Column(DataType.ENUM('GOTA', 'DOADOR', 'AMIGO', 'GUARDIAO', 'SALVADOR', 'LENDA', 'HEROI_DE_SANGUE'))
  declare rank: string;

  @Default(0)
  @Column(DataType.INTEGER)
  declare totalDonations: number;

  @Default(0)
  @Column(DataType.INTEGER)
  declare xp: number;

  @Column(DataType.DATE)
  declare lastDonationDate: Date | null;

  @Column(DataType.DATE)
  declare nextEligibleDate: Date | null;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isEligible: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  declare consecutiveStreak: number;

  @Column(DataType.STRING)
  declare resetToken: string | null;

  @Column(DataType.DATE)
  declare resetTokenExpiry: Date | null;

  @HasMany(() => Donation)
  declare donations: Donation[];

  @HasMany(() => Cause, 'createdById')
  declare causesCreated: Cause[];

  @HasMany(() => UserAchievement)
  declare achievements: UserAchievement[];

  @HasMany(() => Notification)
  declare notifications: Notification[];

  toJSON() {
    const values = super.toJSON() as Record<string, unknown>;
    delete values.passwordHash;
    delete values.resetToken;
    delete values.resetTokenExpiry;
    return values;
  }
}

import { Op, fn, col, literal } from 'sequelize';
import User from '../../database/models/User';
import Donation from '../../database/models/Donation';
import Cause from '../../database/models/Cause';

export async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, totalDonations, activeCauses, donationsThisMonth, totalScheduled] =
    await Promise.all([
      User.count({ where: { role: 'user' } }),
      Donation.count({ where: { status: 'COMPLETED' } }),
      Cause.count({ where: { status: 'ACTIVE' } }),
      Donation.count({
        where: {
          status: 'COMPLETED',
          completedDate: { [Op.gte]: startOfMonth },
        },
      }),
      Donation.count({ where: { status: 'SCHEDULED' } }),
    ]);

  return {
    totalUsers,
    totalDonations,
    activeCauses,
    donationsThisMonth,
    totalScheduled,
  };
}

export async function getDonationsByMonth() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const results = (await Donation.findAll({
    where: {
      status: 'COMPLETED',
      completedDate: { [Op.gte]: twelveMonthsAgo },
    },
    attributes: [
      [fn('TO_CHAR', col('completed_date'), 'YYYY-MM'), 'month'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: [fn('TO_CHAR', col('completed_date'), 'YYYY-MM')],
    order: [[fn('TO_CHAR', col('completed_date'), 'YYYY-MM'), 'ASC']],
    raw: true,
  })) as unknown as { month: string; count: number }[];

  return results;
}

export async function getBloodDistribution() {
  const results = (await User.findAll({
    attributes: [
      'bloodType',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['bloodType'],
    raw: true,
  })) as unknown as { bloodType: string; count: number }[];

  return results;
}

export async function getUniversityStats() {
  const results = (await User.findAll({
    attributes: [
      'university',
      [fn('COUNT', col('id')), 'donors'],
      [fn('SUM', col('totalDonations')), 'totalDonations'],
    ],
    group: ['university'],
    raw: true,
  })) as unknown as { university: string; donors: number; totalDonations: number }[];

  return results;
}

export async function getRankDistribution() {
  const results = (await User.findAll({
    attributes: [
      'rank',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['rank'],
    raw: true,
  })) as unknown as { rank: string; count: number }[];

  return results;
}

export async function exportUsers() {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'cpf', 'bloodType', 'gender', 'birthDate', 'university', 'course', 'role', 'xp', 'rank', 'totalDonations', 'consecutiveStreak', 'isEligible', 'lastDonationDate', 'nextEligibleDate', 'createdAt', 'updatedAt'],
    raw: true,
  });
  return users;
}

export async function exportDonations() {
  const donations = await Donation.findAll({
    include: [
      { model: User, attributes: ['name'] },
      {
        model: (await import('../../database/models/CauseDonation')).default,
        include: [{ model: Cause, attributes: ['title'] }],
      },
    ],
  });

  return donations.map((d) => {
    const json = d.toJSON() as Record<string, any>;
    return {
      ...json,
      userName: json.user?.name ?? null,
      causeTitle: json.causeDonation?.cause?.title ?? null,
      user: undefined,
      causeDonation: undefined,
    };
  });
}

export async function exportCauses() {
  const causes = await Cause.findAll({ raw: true });
  return causes;
}

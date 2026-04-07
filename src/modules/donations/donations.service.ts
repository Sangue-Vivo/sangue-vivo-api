import Donation from '../../database/models/Donation';
import User from '../../database/models/User';
import Cause from '../../database/models/Cause';
import CauseDonation from '../../database/models/CauseDonation';
import { calculateXpForDonation, calculateRank, calculateNextEligibleDate } from '../../utils/gamification';

interface ScheduleData {
  scheduledDate: string;
  hospital: string;
  city: string;
  causeId?: string;
}

interface ListFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export async function schedule(userId: string, data: ScheduleData) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (!user.isEligible) {
    throw new Error('Usuário não está elegível para doar no momento');
  }

  const donation = await Donation.create({
    userId,
    scheduledDate: data.scheduledDate,
    hospital: data.hospital,
    city: data.city,
    status: 'SCHEDULED',
  });

  if (data.causeId) {
    const cause = await Cause.findByPk(data.causeId);
    if (!cause) {
      throw new Error('Causa não encontrada');
    }

    await CauseDonation.create({
      causeId: data.causeId,
      donationId: donation.id,
    });
  }

  return donation;
}

export async function list(userId: string, filters: ListFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  const where: any = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  const { rows: donations, count: total } = await Donation.findAndCountAll({
    where,
    include: [{ model: CauseDonation, as: 'causeDonation' }],
    order: [['scheduledDate', 'DESC']],
    limit,
    offset,
  });

  return {
    donations,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getById(id: string, userId: string) {
  const donation = await Donation.findByPk(id, {
    include: [
      { model: User, as: 'user' },
      { model: CauseDonation, as: 'causeDonation' },
    ],
  });

  if (!donation) {
    throw new Error('Doação não encontrada');
  }

  if (donation.userId !== userId) {
    throw new Error('Não autorizado a visualizar esta doação');
  }

  return donation;
}

export async function cancel(donationId: string, userId: string) {
  const donation = await Donation.findByPk(donationId);

  if (!donation) {
    throw new Error('Doação não encontrada');
  }

  if (donation.userId !== userId) {
    throw new Error('Não autorizado a cancelar esta doação');
  }

  if (donation.status !== 'SCHEDULED') {
    throw new Error('Apenas doações agendadas podem ser canceladas');
  }

  await donation.update({ status: 'CANCELLED' });
  return donation;
}

export async function complete(donationId: string) {
  const donation = await Donation.findByPk(donationId, {
    include: [{ model: CauseDonation, as: 'causeDonation' }],
  });

  if (!donation) {
    throw new Error('Doação não encontrada');
  }

  const hasCause = !!donation.causeDonation;
  let isUrgent = false;

  if (hasCause) {
    const cause = await Cause.findByPk(donation.causeDonation!.causeId);
    if (cause) {
      isUrgent = cause.urgencyLevel >= 4;
    }
  }

  const xpEarned = calculateXpForDonation(hasCause, isUrgent);
  const completedDate = new Date();

  await donation.update({
    status: 'COMPLETED',
    completedDate,
    xpEarned,
  });

  const user = await User.findByPk(donation.userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const newXp = user.xp + xpEarned;
  const newRank = calculateRank(newXp);
  const nextEligibleDate = calculateNextEligibleDate(completedDate);

  await user.update({
    totalDonations: user.totalDonations + 1,
    xp: newXp,
    rank: newRank,
    lastDonationDate: completedDate,
    nextEligibleDate,
    isEligible: false,
    consecutiveStreak: user.consecutiveStreak + 1,
  });

  if (hasCause) {
    const cause = await Cause.findByPk(donation.causeDonation!.causeId);
    if (cause) {
      const newCurrentDonations = cause.currentDonations + 1;
      const updates: any = { currentDonations: newCurrentDonations };

      if (newCurrentDonations >= cause.goalDonations) {
        updates.status = 'FULFILLED';
      }

      await cause.update(updates);
    }
  }

  return donation;
}

export async function noShow(donationId: string) {
  const donation = await Donation.findByPk(donationId);

  if (!donation) {
    throw new Error('Doação não encontrada');
  }

  await donation.update({ status: 'NO_SHOW' });

  const user = await User.findByPk(donation.userId);
  if (user) {
    await user.update({ consecutiveStreak: 0 });
  }

  return donation;
}

import { Op } from 'sequelize';
import Achievement from '../../database/models/Achievement';
import UserAchievement from '../../database/models/UserAchievement';
import User from '../../database/models/User';
import Donation from '../../database/models/Donation';
import CauseDonation from '../../database/models/CauseDonation';
import Notification from '../../database/models/Notification';
import { calculateRank } from '../../utils/gamification';

export async function listAll(userId: string) {
  const achievements = await Achievement.findAll();
  const userAchievements = await UserAchievement.findAll({
    where: { userId },
  });

  const unlockedMap = new Map(
    userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]),
  );

  return achievements.map((a) => ({
    ...a.toJSON(),
    unlockedAt: unlockedMap.get(a.id) ?? null,
  }));
}

export async function getUserAchievements(userId: string) {
  return UserAchievement.findAll({
    where: { userId },
    include: [{ model: Achievement }],
  });
}

export async function checkAndUnlock(userId: string) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const { totalDonations, consecutiveStreak } = user;

  // Count distinct causes the user donated to
  const causeDonations = await CauseDonation.findAll({
    include: [
      {
        model: Donation,
        where: { userId },
        attributes: [],
      },
    ],
    attributes: ['causeId'],
    group: ['causeId'],
  });
  const distinctCauses = causeDonations.length;

  const achievements = await Achievement.findAll();

  const alreadyUnlocked = await UserAchievement.findAll({
    where: { userId },
    attributes: ['achievementId'],
  });
  const unlockedIds = new Set(alreadyUnlocked.map((ua) => ua.achievementId));

  const newlyUnlocked: Achievement[] = [];

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const meetsDonations =
      achievement.requiredDonations == null ||
      totalDonations >= achievement.requiredDonations;
    const meetsStreak =
      achievement.requiredStreak == null ||
      consecutiveStreak >= achievement.requiredStreak;
    const meetsCauses =
      achievement.requiredCauses == null ||
      distinctCauses >= achievement.requiredCauses;

    if (meetsDonations && meetsStreak && meetsCauses) {
      await UserAchievement.create({
        userId,
        achievementId: achievement.id,
      });

      await user.update({
        xp: user.xp + achievement.xpReward,
        rank: calculateRank(user.xp + achievement.xpReward),
      });

      // Refresh user xp for next iteration
      user.xp = user.xp + achievement.xpReward;

      await Notification.create({
        userId,
        type: 'ACHIEVEMENT',
        title: 'Conquista desbloqueada!',
        message: `Voce desbloqueou a conquista "${achievement.name}"!`,
      });

      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

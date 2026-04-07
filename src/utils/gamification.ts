import { RANK_THRESHOLDS, RANK_ORDER, XP_VALUES, DONATION_COOLDOWN_DAYS } from '../config/constants';

export function calculateRank(xp: number): string {
  let rank = 'GOTA';
  for (const r of RANK_ORDER) {
    if (xp >= RANK_THRESHOLDS[r]) {
      rank = r;
    }
  }
  return rank;
}

export function calculateXpForDonation(hasCause: boolean, isUrgent: boolean): number {
  let xp = XP_VALUES.BASE_DONATION;
  if (hasCause) xp += XP_VALUES.CAUSE_BONUS;
  if (isUrgent) xp += XP_VALUES.URGENT_CAUSE_BONUS;
  return xp;
}

export function calculateNextEligibleDate(lastDonationDate: Date): Date {
  const next = new Date(lastDonationDate);
  next.setDate(next.getDate() + DONATION_COOLDOWN_DAYS);
  return next;
}

export function isEligibleToDonate(nextEligibleDate: Date | null): boolean {
  if (!nextEligibleDate) return true;
  return new Date() >= nextEligibleDate;
}

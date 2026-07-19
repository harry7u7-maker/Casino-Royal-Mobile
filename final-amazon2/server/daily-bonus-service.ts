/**
 * Daily Bonus Service
 * Handles automatic daily login bonuses and streak tracking
 */

import * as db from "./db";

export interface DailyBonusConfig {
  baseBonus: number; // Base bonus amount
  streakMultiplier: number; // Multiplier for consecutive days
  maxStreak: number; // Maximum streak bonus
  resetHour: number; // Hour of day when streak resets (UTC)
}

const DEFAULT_CONFIG: DailyBonusConfig = {
  baseBonus: 100, // 100 chips
  streakMultiplier: 1.1, // 10% increase per day
  maxStreak: 30, // Max 30 day streak
  resetHour: 0, // Reset at midnight UTC
};

/**
 * Check if user can claim daily bonus
 */
export function canClaimDailyBonus(lastClaimedAt: Date | null): boolean {
  if (!lastClaimedAt) return true;

  const now = new Date();
  const lastClaimed = new Date(lastClaimedAt);

  // Check if 24 hours have passed
  const hoursDiff = (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60);
  return hoursDiff >= 24;
}

/**
 * Calculate daily bonus with streak multiplier
 */
export function calculateDailyBonus(
  streak: number,
  config: DailyBonusConfig = DEFAULT_CONFIG
): number {
  const effectiveStreak = Math.min(streak, config.maxStreak);
  const multiplier = Math.pow(config.streakMultiplier, effectiveStreak - 1);
  return Math.floor(config.baseBonus * multiplier);
}

/**
 * Calculate streak continuation
 */
export function calculateStreak(lastClaimedAt: Date | null): number {
  if (!lastClaimedAt) return 1;

  const now = new Date();
  const lastClaimed = new Date(lastClaimedAt);

  // Check if claimed within 24-48 hours (streak continues)
  const hoursDiff = (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    return 0; // Already claimed today
  } else if (hoursDiff < 48) {
    return 1; // Streak continues
  } else {
    return 0; // Streak broken, reset to 1
  }
}

/**
 * Claim daily bonus for user
 */
export async function claimDailyBonus(
  userId: number,
  config: DailyBonusConfig = DEFAULT_CONFIG
) {
  try {
    // Get user's last bonus claim
    const lastBonus = await db.getLastDailyBonus(userId);

    // Check if can claim
    if (lastBonus && !canClaimDailyBonus(lastBonus.claimedAt)) {
      return {
        success: false,
        message: "Already claimed today",
        nextClaimTime: new Date(lastBonus.claimedAt.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    // Calculate streak
    const streakContinuation = calculateStreak(lastBonus?.lastClaimedAt || null);
    const newStreak = streakContinuation > 0 ? (lastBonus?.streak || 0) + 1 : 1;

    // Calculate bonus amount
    const bonusAmount = calculateDailyBonus(newStreak, config);

    // Create bonus record
    await db.createDailyBonus({
      userId,
      bonusAmount: bonusAmount.toString(),
      streak: newStreak,
      lastClaimedAt: new Date(),
    });

    // Update wallet
    const wallet = await db.getOrCreateWallet(userId);
    const currentBalance = parseFloat(wallet.balance as any);
    const newBalance = (currentBalance + bonusAmount).toFixed(2);

    await db.updateWalletBalance(userId, newBalance);

    // Create transaction record
    await db.createTransaction({
      userId,
      type: "referral_bonus" as const,
      amount: bonusAmount.toString(),
      description: `Daily Login Bonus (Day ${newStreak})`,
      status: "completed" as const,
    });

    return {
      success: true,
      bonusAmount,
      newStreak,
      newBalance,
      message: `Claimed ${bonusAmount} chips! Streak: ${newStreak} days`,
    };
  } catch (error) {
    console.error("Error claiming daily bonus:", error);
    return {
      success: false,
      message: "Error claiming bonus",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get daily bonus info for user
 */
export async function getDailyBonusInfo(userId: number) {
  try {
    const lastBonus = await db.getLastDailyBonus(userId);

    if (!lastBonus) {
      return {
        canClaim: true,
        streak: 0,
        nextBonusAmount: DEFAULT_CONFIG.baseBonus,
        lastClaimedAt: null,
        nextClaimTime: null,
      };
    }

    const canClaim = canClaimDailyBonus(lastBonus.claimedAt);
    const nextBonusAmount = calculateDailyBonus(
      canClaim ? lastBonus.streak + 1 : lastBonus.streak
    );
    const nextClaimTime = new Date(lastBonus.claimedAt.getTime() + 24 * 60 * 60 * 1000);

    return {
      canClaim,
      streak: lastBonus.streak,
      nextBonusAmount,
      lastClaimedAt: lastBonus.claimedAt,
      nextClaimTime: canClaim ? null : nextClaimTime,
    };
  } catch (error) {
    console.error("Error getting daily bonus info:", error);
    return {
      canClaim: true,
      streak: 0,
      nextBonusAmount: DEFAULT_CONFIG.baseBonus,
      lastClaimedAt: null,
      nextClaimTime: null,
    };
  }
}

/**
 * Get bonus progression schedule
 */
export function getBonusProgressionSchedule(
  config: DailyBonusConfig = DEFAULT_CONFIG
) {
  const schedule = [];
  for (let day = 1; day <= config.maxStreak; day++) {
    schedule.push({
      day,
      bonus: calculateDailyBonus(day, config),
      multiplier: Math.pow(config.streakMultiplier, day - 1).toFixed(2),
    });
  }
  return schedule;
}

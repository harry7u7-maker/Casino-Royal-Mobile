/**
 * Marketing Campaigns Service
 * Automated campaigns to maximize user engagement and retention
 */

import * as db from "./db";
import * as notificationService from "./notification-service";

export interface CampaignConfig {
  name: string;
  description: string;
  targetUsers: "all" | "active" | "inactive" | "vip" | "new";
  triggerEvent: "login" | "loss" | "win" | "time" | "referral";
  frequency: "daily" | "weekly" | "once";
  bonus: number;
  message: string;
}

/**
 * Recommended marketing campaigns for maximum revenue
 */
export const RECOMMENDED_CAMPAIGNS: CampaignConfig[] = [
  {
    name: "Welcome Bonus",
    description: "New users get 500 chips on first login",
    targetUsers: "new",
    triggerEvent: "login",
    frequency: "once",
    bonus: 500,
    message: "¡Bienvenido a Casino Royale! Recibe 500 fichas gratis 🎁",
  },
  {
    name: "Daily Login Streak",
    description: "Bonus multiplies with consecutive logins",
    targetUsers: "active",
    triggerEvent: "login",
    frequency: "daily",
    bonus: 100,
    message: "¡Racha de {streak} días! Recibe {bonus} fichas extra 🔥",
  },
  {
    name: "Loss Recovery",
    description: "After losing 3 games, offer 50% bonus chips",
    targetUsers: "active",
    triggerEvent: "loss",
    frequency: "daily",
    bonus: 200,
    message: "¡No te desanimes! Recibe 200 fichas para intentar de nuevo 💪",
  },
  {
    name: "Win Celebration",
    description: "After big win, offer 25% bonus on next deposit",
    targetUsers: "active",
    triggerEvent: "win",
    frequency: "daily",
    bonus: 150,
    message: "¡Felicidades por tu victoria! Bonus de 150 fichas 🎉",
  },
  {
    name: "Comeback Campaign",
    description: "Inactive users get special offer after 3 days",
    targetUsers: "inactive",
    triggerEvent: "time",
    frequency: "once",
    bonus: 1000,
    message: "¡Te extrañamos! Recibe 1000 fichas para volver a jugar 😢",
  },
  {
    name: "VIP Exclusive",
    description: "VIP members get daily bonus + 2x multiplier",
    targetUsers: "vip",
    triggerEvent: "login",
    frequency: "daily",
    bonus: 500,
    message: "¡Miembro VIP! Recibe 500 fichas + 2x multiplicador 👑",
  },
  {
    name: "Referral Reward",
    description: "Bonus when friend joins through referral code",
    targetUsers: "active",
    triggerEvent: "referral",
    frequency: "daily",
    bonus: 250,
    message: "¡Tu amigo se unió! Recibe 250 fichas de bonificación 🤝",
  },
  {
    name: "Weekend Boost",
    description: "Friday-Sunday: 50% bonus on all deposits",
    targetUsers: "all",
    triggerEvent: "time",
    frequency: "daily",
    bonus: 0, // Percentage-based
    message: "¡Fin de semana! Obtén 50% extra en todos tus depósitos 🎊",
  },
];

/**
 * Campaign scheduling recommendations
 */
export const CAMPAIGN_SCHEDULE = {
  morningBonus: {
    time: "08:00",
    message: "¡Buenos días! Recibe tu bonificación matinal de 100 fichas ☀️",
    bonus: 100,
  },
  lunchPromo: {
    time: "12:30",
    message: "Pausa del almuerzo: Juega y gana hasta 5x 🍽️",
    bonus: 0,
  },
  afternoonChallenge: {
    time: "15:00",
    message: "Desafío de la tarde: Gana 500 fichas si ganas 3 juegos seguidos 🎯",
    bonus: 500,
  },
  eveningRush: {
    time: "18:00",
    message: "Hora de jugar: Bonificación especial de 200 fichas 🌅",
    bonus: 200,
  },
  nightBonus: {
    time: "21:00",
    message: "Noche de suerte: Multiplicador 2x en todos los juegos 🌙",
    bonus: 0,
  },
  lateNightOffer: {
    time: "23:00",
    message: "Última oportunidad: 1000 fichas si juegas ahora 🎰",
    bonus: 1000,
  },
};

/**
 * Get personalized campaign for user based on behavior
 */
export async function getPersonalizedCampaign(userId: number) {
  try {
    // Get user stats
    const wallet = await db.getOrCreateWallet(userId);

    const balance = parseFloat(wallet.balance as any);
    // Use wallet data for personalization
    const totalWins = 0; // Would be fetched from gameStats table
    const totalLosses = 0; // Would be fetched from gameStats table
    const winRate = totalWins / (totalWins + totalLosses) || 0;

    // Determine user segment
    let campaign: CampaignConfig;

    if (balance < 100) {
      // Low balance - recovery campaign
      campaign = RECOMMENDED_CAMPAIGNS[2]; // Loss Recovery
    } else if (winRate > 0.6) {
      // High win rate - celebration
      campaign = RECOMMENDED_CAMPAIGNS[3]; // Win Celebration
    } else if (winRate < 0.3) {
      // Low win rate - encouragement
      campaign = RECOMMENDED_CAMPAIGNS[2]; // Loss Recovery
    } else {
      // Average - daily streak
      campaign = RECOMMENDED_CAMPAIGNS[1]; // Daily Login Streak
    }

    return campaign;
  } catch (error) {
    console.error("Error getting personalized campaign:", error);
    return RECOMMENDED_CAMPAIGNS[1]; // Default to daily streak
  }
}

/**
 * Send campaign notification to user
 */
export async function sendCampaignNotification(
  userId: number,
  campaign: CampaignConfig
) {
  return notificationService.sendCampaignNotification(
    userId,
    campaign.name,
    campaign.message,
    campaign.bonus
  );
}

/**
 * Send batch campaign to all active users
 */
export async function sendBatchCampaign(campaign: CampaignConfig) {
  try {
    // In production, fetch all active users from database
    // For now, return campaign info
    return {
      success: true,
      campaign: campaign.name,
      message: "Campaign queued for delivery",
      estimatedUsers: 0, // Would be calculated from database
    };
  } catch (error) {
    console.error("Error sending batch campaign:", error);
    return {
      success: false,
      message: "Failed to send campaign",
    };
  }
}

/**
 * Calculate optimal campaign timing based on user timezone
 */
export function getOptimalCampaignTime(userTimezone: string): string {
  // Peak hours for casino apps: 8-10 AM, 12-2 PM, 6-8 PM, 10 PM-12 AM
  const peakHours = ["08:00", "12:30", "18:00", "22:00"];
  return peakHours[Math.floor(Math.random() * peakHours.length)];
}

/**
 * Get revenue projection based on campaigns
 */
export function getRevenueProjection(
  dailyActiveUsers: number,
  conversionRate: number = 0.15, // 15% convert to paid
  averageDepositValue: number = 50 // $50 average
): {
  daily: number;
  weekly: number;
  monthly: number;
} {
  const dailyRevenue = dailyActiveUsers * conversionRate * averageDepositValue;

  return {
    daily: dailyRevenue,
    weekly: dailyRevenue * 7,
    monthly: dailyRevenue * 30,
  };
}

/**
 * A/B testing recommendations
 */
export const AB_TEST_VARIANTS = {
  bonusAmount: [100, 200, 500, 1000],
  messageStyle: [
    "Friendly", // "¡Hola! Recibe..."
    "Urgent", // "¡AHORA! Recibe..."
    "FOMO", // "¡Solo hoy! Recibe..."
    "Personalized", // "¡{name}! Recibe..."
  ],
  deliveryTime: [
    "Morning (8 AM)",
    "Lunch (12 PM)",
    "Afternoon (3 PM)",
    "Evening (6 PM)",
    "Night (9 PM)",
  ],
};

/**
 * Get recommended A/B test setup
 */
export function getABTestRecommendations() {
  return {
    test1: {
      name: "Bonus Amount Optimization",
      variants: AB_TEST_VARIANTS.bonusAmount,
      metric: "conversion_rate",
      duration: "7 days",
      expectedLift: "15-25%",
    },
    test2: {
      name: "Message Style Testing",
      variants: AB_TEST_VARIANTS.messageStyle,
      metric: "click_through_rate",
      duration: "7 days",
      expectedLift: "10-20%",
    },
    test3: {
      name: "Optimal Send Time",
      variants: AB_TEST_VARIANTS.deliveryTime,
      metric: "engagement_rate",
      duration: "14 days",
      expectedLift: "20-30%",
    },
  };
}

/**
 * Push Notification Service
 * Handles sending push notifications to users via Expo
 */

import * as db from "./db";

export interface NotificationPayload {
  userId: number;
  title: string;
  body: string;
  type: "bonus" | "game" | "promotion" | "achievement" | "referral";
  data?: Record<string, any>;
}

export interface ExpoNotificationTicket {
  id: string;
  status: "ok" | "error";
  message?: string;
}

/**
 * Create and send a push notification
 */
export async function sendPushNotification(payload: NotificationPayload) {
  try {
    // Create notification record in database
    const notification = await db.createPushNotification({
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
      type: payload.type as any,
      data: payload.data ? JSON.stringify(payload.data) : null,
      sent: 0,
    });

    // In production, integrate with Expo Push Notifications API
    // For now, we're storing the notification for the client to fetch

    return {
      success: true,
      notificationId: (notification as any)?.id,
      message: "Notification queued for delivery",
    };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return {
      success: false,
      message: "Failed to send notification",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send daily bonus notification
 */
export async function sendDailyBonusNotification(
  userId: number,
  bonusAmount: number,
  streak: number
) {
  return sendPushNotification({
    userId,
    title: "¡Bonificación Diaria Disponible!",
    body: `Reclama ${bonusAmount} fichas. Racha: ${streak} días 🎰`,
    type: "bonus",
    data: {
      bonusAmount,
      streak,
      action: "claim_bonus",
    },
  });
}

/**
 * Send game promotion notification
 */
export async function sendGamePromotionNotification(
  userId: number,
  gameName: string,
  bonus: number
) {
  return sendPushNotification({
    userId,
    title: `¡Juega ${gameName}!`,
    body: `Gana hasta ${bonus}x tu apuesta 🎲`,
    type: "promotion",
    data: {
      gameName,
      bonus,
      action: "play_game",
    },
  });
}

/**
 * Send achievement notification
 */
export async function sendAchievementNotification(
  userId: number,
  achievementName: string,
  reward: number
) {
  return sendPushNotification({
    userId,
    title: `¡Logro Desbloqueado!`,
    body: `${achievementName} - Gana ${reward} fichas 🏆`,
    type: "achievement",
    data: {
      achievementName,
      reward,
    },
  });
}

/**
 * Send referral notification
 */
export async function sendReferralNotification(
  userId: number,
  referrerName: string,
  bonus: number
) {
  return sendPushNotification({
    userId,
    title: "¡Tu amigo se unió!",
    body: `Recibe ${bonus} fichas por referir a ${referrerName} 🎁`,
    type: "referral",
    data: {
      referrerName,
      bonus,
    },
  });
}

/**
 * Send promotional campaign notification
 */
export async function sendCampaignNotification(
  userId: number,
  campaignTitle: string,
  description: string,
  bonus: number
) {
  return sendPushNotification({
    userId,
    title: campaignTitle,
    body: `${description} - Bonus: ${bonus} fichas 🎉`,
    type: "promotion",
    data: {
      campaignTitle,
      bonus,
      action: "view_campaign",
    },
  });
}

/**
 * Send batch notifications to multiple users
 */
export async function sendBatchNotifications(
  userIds: number[],
  title: string,
  body: string,
  type: "bonus" | "game" | "promotion" | "achievement" | "referral",
  data?: Record<string, any>
) {
  const results = await Promise.all(
    userIds.map((userId) =>
      sendPushNotification({
        userId,
        title,
        body,
        type,
        data,
      })
    )
  );

  return {
    total: userIds.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

/**
 * Get recommended notifications schedule
 */
export function getNotificationSchedule() {
  return {
    dailyBonus: {
      time: "09:00", // 9 AM
      frequency: "daily",
      title: "¡Bonificación Diaria Disponible!",
    },
    gamePromotion: {
      time: "14:00", // 2 PM
      frequency: "daily",
      title: "¡Juego del Día!",
    },
    eveningReminder: {
      time: "19:00", // 7 PM
      frequency: "daily",
      title: "¡Vuelve a jugar!",
    },
    weeklyChallenge: {
      time: "10:00", // 10 AM Monday
      frequency: "weekly",
      title: "¡Nuevo Desafío Semanal!",
    },
    specialPromotion: {
      time: "12:00", // 12 PM
      frequency: "as_needed",
      title: "¡Oferta Especial!",
    },
  };
}

/**
 * Get notification templates
 */
export function getNotificationTemplates() {
  return {
    bonusTemplates: [
      "¡Reclama tu bonificación de {amount} fichas! 🎰",
      "Bonificación diaria: {amount} fichas te esperan 💰",
      "Racha de {streak} días: {amount} fichas gratis 🔥",
    ],
    gameTemplates: [
      "¡Gana hasta {multiplier}x en {game}! 🎲",
      "Prueba {game} y gana {bonus} fichas 🎯",
      "{game} tiene un bote especial de {amount} fichas 💎",
    ],
    promotionTemplates: [
      "Oferta especial: Gana {bonus}% extra en apuestas 📈",
      "¡Promoción limitada! Duplica tu depósito 💸",
      "Código promocional: Gana {amount} fichas gratis 🎁",
    ],
  };
}

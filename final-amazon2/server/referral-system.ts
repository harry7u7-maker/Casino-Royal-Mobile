import { getDb } from "./db";

/**
 * Sistema de Referidos Viral
 * Genera ingresos por crecimiento orgánico
 */

export const REFERRAL_REWARDS = {
  // Bonificación por referir un amigo
  referrer_bonus: 100, // Fichas para quien refiere
  referee_bonus: 50,   // Fichas para quien es referido

  // Comisión por compras del referido
  referrer_commission: 0.10, // 10% de comisión en compras
};

export async function generateReferralCode(userId: string): Promise<string> {
  // Generar código único de referido
  const code = `CASINO_${userId.substring(0, 8).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  return code;
}

export async function applyReferralBonus(
  referrerId: string,
  refereeId: string,
  referralCode: string
) {
  try {
    // Dar bonificación al que refiere
    const referrerBonus = REFERRAL_REWARDS.referrer_bonus;

    // Dar bonificación al que es referido
    const refereeBonus = REFERRAL_REWARDS.referee_bonus;

    return {
      success: true,
      referrerBonus,
      refereeBonus,
      totalBonus: referrerBonus + refereeBonus,
    };
  } catch (error) {
    console.error("Error applying referral bonus:", error);
    return { success: false };
  }
}

export async function getReferralStats(userId: string) {
  try {
    // Obtener estadísticas de referidos del usuario
    return {
      userId,
      referralCode: await generateReferralCode(userId),
      totalReferrals: 0,
      totalEarnings: 0,
      message: "Comparte tu código de referido y gana fichas gratis",
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return null;
  }
}

/**
 * ESTRATEGIA DE REFERIDOS VIRAL
 *
 * 1. BONIFICACIÓN INICIAL
 *    - Quien refiere: 100 fichas
 *    - Quien es referido: 50 fichas
 *    - Total por referido: 150 fichas
 *
 * 2. COMISIÓN CONTINUA
 *    - 10% de comisión en todas las compras del referido
 *    - Ingresos pasivos indefinidos
 *
 * 3. INCENTIVOS VIRALES
 *    - Bonificación extra por 5 referidos
 *    - Bonificación extra por 10 referidos
 *    - Bonificación extra por 20 referidos
 *
 * PROYECCIONES:
 * - 1 usuario inicial
 * - Refiere a 5 amigos (cada uno refiere a 5)
 * - En 3 niveles: 1 + 5 + 25 + 125 = 156 usuarios
 * - Sin pagar nada en publicidad
 * - Crecimiento exponencial
 *
 * INGRESOS POR REFERIDOS:
 * - 100 usuarios referidos × 10% comisión = ingresos continuos
 * - Si cada usuario gasta $10/mes: $100 en comisiones
 * - Si cada usuario gasta $50/mes: $500 en comisiones
 */

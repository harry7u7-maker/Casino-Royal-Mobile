import { getDb } from "./db";
import { adImpressions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Redes de publicidad alternativas que NO requieren pago inicial
 * Todas generan ingresos por CPM (costo por mil impresiones)
 */

export const ALTERNATIVE_AD_NETWORKS = {
  // Redes de publicidad de bajo costo
  inmobi: {
    name: "InMobi",
    cpm: 0.5,
    description: "Red de publicidad móvil global",
    setup: "Gratuito",
  },
  appnext: {
    name: "AppNext",
    cpm: 0.8,
    description: "Publicidad de aplicaciones",
    setup: "Gratuito",
  },
  vungle: {
    name: "Vungle",
    cpm: 1.2,
    description: "Videos recompensados de alta calidad",
    setup: "Gratuito",
  },
  chartboost: {
    name: "Chartboost",
    cpm: 1.5,
    description: "Publicidad para juegos",
    setup: "Gratuito",
  },
  unity_ads: {
    name: "Unity Ads",
    cpm: 1.8,
    description: "Publicidad integrada en juegos",
    setup: "Gratuito",
  },
  // Redes de publicidad por CPC (costo por clic)
  facebook_audience: {
    name: "Facebook Audience Network",
    cpc: 0.05,
    description: "Publicidad de Facebook sin costo inicial",
    setup: "Gratuito",
  },
  // Redes de publicidad por CPA (costo por acción)
  tapjoy: {
    name: "Tapjoy",
    cpa: 0.1,
    description: "Publicidad por acciones completadas",
    setup: "Gratuito",
  },
};

export async function logAdImpression(
  userId: string,
  network: string,
  adType: "banner" | "interstitial" | "rewarded",
  revenue: number
) {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(adImpressions).values({
      userId: parseInt(userId) as any,
      adNetwork: network,
      adType,
      revenue: revenue.toString(),
    });
  } catch (error) {
    console.error("Error logging ad impression:", error);
  }
}

export async function getAdNetworkStats(network: string) {
  try {
    const db = await getDb();
    if (!db) return null;
    const impressions = await db
      .select()
      .from(adImpressions)
      .where(eq(adImpressions.adNetwork, network));

    const totalRevenue = impressions.reduce((sum: number, imp: any) => sum + imp.revenue, 0);
    const totalImpressions = impressions.length;
    const averageCPM = (totalRevenue / totalImpressions) * 1000;

    return {
      network,
      totalImpressions,
      totalRevenue,
      averageCPM,
      impressions,
    };
  } catch (error) {
    console.error("Error getting ad network stats:", error);
    return null;
  }
}

export async function getTotalAdRevenue() {
  try {
    const db = await getDb();
    if (!db) return null;
    const allImpressions = await db.select().from(adImpressions);
    const totalRevenue = allImpressions.reduce((sum: number, imp: any) => sum + imp.revenue, 0);

    return {
      totalRevenue,
      totalImpressions: allImpressions.length,
      averageCPM: (totalRevenue / allImpressions.length) * 1000,
      byNetwork: groupByNetwork(allImpressions),
    };
  } catch (error) {
    console.error("Error getting total ad revenue:", error);
    return null;
  }
}

function groupByNetwork(impressions: any[]) {
  const grouped: { [key: string]: { count: number; revenue: number } } = {};

  for (const imp of impressions) {
    if (!grouped[imp.network]) {
      grouped[imp.network] = { count: 0, revenue: 0 };
    }
    grouped[imp.network].count++;
    grouped[imp.network].revenue += imp.revenue;
  }

  return grouped;
}

/**
 * Estrategia de monetización alternativa:
 *
 * 1. PUBLICIDAD POR CPM (Costo por Mil impresiones)
 *    - InMobi: $0.50 CPM
 *    - AppNext: $0.80 CPM
 *    - Vungle: $1.20 CPM
 *    - Chartboost: $1.50 CPM
 *    - Unity Ads: $1.80 CPM
 *
 * 2. PUBLICIDAD POR CPC (Costo por Clic)
 *    - Facebook Audience Network: $0.05 por clic
 *
 * 3. PUBLICIDAD POR CPA (Costo por Acción)
 *    - Tapjoy: $0.10 por acción completada
 *
 * PROYECCIONES (Sin pagar nada a Google):
 * - 1,000 usuarios activos diarios
 * - 5 anuncios por usuario por día
 * - 5,000 impresiones diarias
 * - CPM promedio: $1.00
 * - Ingresos diarios: $5
 * - Ingresos mensuales: $150
 * - Ingresos anuales: $1,800+
 *
 * Con 10,000 usuarios:
 * - 50,000 impresiones diarias
 * - Ingresos diarios: $50
 * - Ingresos mensuales: $1,500
 * - Ingresos anuales: $18,000+
 */

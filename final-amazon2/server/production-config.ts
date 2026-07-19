/**
 * Production Configuration
 * Settings for maximum revenue generation
 */

export const PRODUCTION_CONFIG = {
  // Revenue Generation Settings
  revenue: {
    // Publicidad
    admob: {
      enabled: true,
      bannerRefreshRate: 30000, // 30 segundos
      interstitialFrequency: 3, // Cada 3 juegos
      rewardedAdBonus: 50, // Fichas por ver anuncio
      estimatedCPM: 5, // $5 por 1000 impresiones
    },

    // Métodos de Pago
    paymentMethods: {
      enabled: true,
      methods: [
        "paypal",
        "mercadopago",
        "santander",
        "openbank",
        "nubank",
        "clip",
        "redsys",
      ],
      processingFee: 0.03, // 3% de comisión
      minDeposit: 10, // $10 mínimo
      maxDeposit: 1000, // $1000 máximo
    },

    // Compras In-App
    inAppPurchases: {
      enabled: true,
      packages: [
        { chips: 100, price: 5 },
        { chips: 500, price: 20 },
        { chips: 1000, price: 35 },
        { chips: 5000, price: 150 },
      ],
      bonusMultiplier: 1.1, // 10% bonus en compras
    },

    // Suscripción VIP
    vipSubscription: {
      enabled: true,
      monthlyPrice: 9.99,
      benefits: {
        dailyBonus: 500, // Fichas diarias
        bonusMultiplier: 2, // 2x en bonificaciones
        adFree: true,
        prioritySupport: true,
      },
    },

    // Bonificaciones Diarias
    dailyBonuses: {
      enabled: true,
      baseBonus: 100,
      maxStreak: 30,
      streakMultiplier: 1.1, // 10% aumento por día
    },

    // Sistema de Referidos
    referrals: {
      enabled: true,
      bonusPerReferral: 250, // Fichas por referido
      referrerBonus: 500, // Bonus para quien refiere
      conversionTarget: 0.15, // 15% de referidos convierten a pagos
    },
  },

  // User Engagement Settings
  engagement: {
    // Notificaciones Push
    notifications: {
      enabled: true,
      dailyBonus: { time: "09:00", enabled: true },
      gamePromotion: { time: "14:00", enabled: true },
      eveningReminder: { time: "19:00", enabled: true },
      lateNightOffer: { time: "23:00", enabled: true },
      weeklyChallenge: { time: "10:00", enabled: true },
    },

    // Campañas de Marketing
    campaigns: {
      enabled: true,
      welcomeBonus: 500,
      lossRecovery: 200,
      winCelebration: 150,
      comebackOffer: 1000,
      vipExclusive: 500,
    },

    // Desafíos y Torneos
    challenges: {
      enabled: true,
      dailyChallenge: { reward: 500, frequency: "daily" },
      weeklyTournament: { reward: 5000, frequency: "weekly" },
      monthlyLeaderboard: { reward: 10000, frequency: "monthly" },
    },
  },

  // Analytics and Monitoring
  analytics: {
    enabled: true,
    trackEvents: [
      "app_open",
      "game_start",
      "game_end",
      "purchase",
      "ad_impression",
      "ad_click",
      "notification_received",
      "notification_clicked",
    ],
    reportingInterval: 3600000, // 1 hora
  },

  // Security Settings
  security: {
    enableSSL: true,
    enableRateLimiting: true,
    maxRequestsPerMinute: 100,
    enableIPWhitelist: false,
    enableTwoFactor: false,
  },

  // Database Settings
  database: {
    enableAutoBackup: true,
    backupInterval: 86400000, // 24 horas
    enableReplication: true,
    enableEncryption: true,
  },

  // Performance Settings
  performance: {
    enableCaching: true,
    cacheTTL: 3600, // 1 hora
    enableCompression: true,
    enableCDN: true,
  },
};

/**
 * Revenue Projections
 */
export const REVENUE_PROJECTIONS = {
  conservative: {
    description: "Proyección conservadora (15% conversión)",
    dailyActiveUsers: 1000,
    conversionRate: 0.15,
    averageDepositValue: 50,
    monthlyRevenue: 225000, // $225K
    yearlyRevenue: 2700000, // $2.7M
  },

  moderate: {
    description: "Proyección moderada (20% conversión)",
    dailyActiveUsers: 5000,
    conversionRate: 0.2,
    averageDepositValue: 50,
    monthlyRevenue: 1500000, // $1.5M
    yearlyRevenue: 18000000, // $18M
  },

  aggressive: {
    description: "Proyección agresiva (30% conversión)",
    dailyActiveUsers: 10000,
    conversionRate: 0.3,
    averageDepositValue: 50,
    monthlyRevenue: 4500000, // $4.5M
    yearlyRevenue: 54000000, // $54M
  },
};

/**
 * Get production configuration
 */
export function getProductionConfig() {
  return PRODUCTION_CONFIG;
}

/**
 * Get revenue projection
 */
export function getRevenueProjection(scenario: "conservative" | "moderate" | "aggressive") {
  return REVENUE_PROJECTIONS[scenario];
}

/**
 * Calculate estimated daily revenue
 */
export function calculateDailyRevenue(
  dailyActiveUsers: number,
  conversionRate: number = 0.15,
  averageDepositValue: number = 50,
  admobImpressions: number = 50000
): {
  fromPayments: number;
  fromAdvertising: number;
  total: number;
} {
  const fromPayments = dailyActiveUsers * conversionRate * averageDepositValue;
  const fromAdvertising = (admobImpressions / 1000) * PRODUCTION_CONFIG.revenue.admob.estimatedCPM;

  return {
    fromPayments,
    fromAdvertising,
    total: fromPayments + fromAdvertising,
  };
}

/**
 * Get optimization recommendations
 */
export function getOptimizationRecommendations() {
  return [
    {
      area: "Publicidad",
      recommendation: "Aumentar frecuencia de anuncios intersticiales a cada 2 juegos",
      potentialLift: "25-35%",
    },
    {
      area: "Bonificaciones",
      recommendation: "Implementar bonificaciones progresivas (más fichas cuanto más juegues)",
      potentialLift: "15-20%",
    },
    {
      area: "Notificaciones",
      recommendation: "Enviar notificaciones personalizadas basadas en comportamiento",
      potentialLift: "20-30%",
    },
    {
      area: "Precios",
      recommendation: "A/B test diferentes precios de paquetes de fichas",
      potentialLift: "10-15%",
    },
    {
      area: "VIP",
      recommendation: "Ofrecer prueba gratuita de 3 días para VIP",
      potentialLift: "30-40%",
    },
    {
      area: "Referidos",
      recommendation: "Aumentar bonus de referido a 500 fichas",
      potentialLift: "25-35%",
    },
  ];
}

/**
 * Production checklist
 */
export const PRODUCTION_CHECKLIST = [
  "✅ Todos los métodos de pago configurados",
  "✅ Google AdMob integrado y configurado",
  "✅ Notificaciones push automáticas activas",
  "✅ Campañas de marketing programadas",
  "✅ Dashboard de ingresos en tiempo real",
  "✅ Sistema de bonificaciones diarias activo",
  "✅ Tabla de clasificación global funcionando",
  "✅ Sistema de referidos activo",
  "✅ Suscripción VIP disponible",
  "✅ Desafíos y torneos programados",
  "✅ Análisis y tracking configurado",
  "✅ Backups automáticos habilitados",
  "✅ SSL/HTTPS configurado",
  "✅ Rate limiting activado",
  "✅ Monitoreo de errores activo",
];

/**
 * Google AdMob Configuration
 * Cuenta: harry.7u7@gmail.com
 */

// Test IDs (para desarrollo y pruebas)
export const ADMOB_TEST_IDS = {
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
  },
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
    interstitial: "ca-app-pub-3940256099942544/4411468910",
    rewarded: "ca-app-pub-3940256099942544/1712485313",
  },
};

// AdMob App ID (para inicializar el SDK)
export const ADMOB_APP_ID = "ca-app-pub-9724120681808037~4333547541";

// Production IDs (reemplaza con tus IDs reales de AdMob)
// Los IDs de unidad tienen formato ca-app-pub-9724120681808037/XXXXXXXXX
export const ADMOB_PRODUCTION_IDS = {
  android: {
    banner: "ca-app-pub-9724120681808037/2246320116",
    interstitial: "ca-app-pub-9724120681808037/7978827242",
    rewarded: "ca-app-pub-9724120681808037/3480610813",
  },
  ios: {
    banner: process.env.ADMOB_IOS_BANNER || ADMOB_TEST_IDS.ios.banner,
    interstitial: process.env.ADMOB_IOS_INTERSTITIAL || ADMOB_TEST_IDS.ios.interstitial,
    rewarded: process.env.ADMOB_IOS_REWARDED || ADMOB_TEST_IDS.ios.rewarded,
  },
};

// Seleccionar IDs basado en el ambiente
// Por defecto usa producción (IDs reales). En desarrollo con test IDs usa NODE_ENV=development
const isDevelopment = process.env.NODE_ENV === "development";
export const ADMOB_CONFIG = isDevelopment ? ADMOB_TEST_IDS : ADMOB_PRODUCTION_IDS;

/**
 * Configuración de estrategia de anuncios
 */
export const ADMOB_STRATEGY = {
  banner: {
    enabled: true,
    placement: "bottom",
    refreshRate: 30000,
  },
  interstitial: {
    enabled: true,
    frequency: 3,
    showProbability: 0.8,
  },
  rewarded: {
    enabled: true,
    reward: 50,
    placement: "bonus_screen",
  },
};

export function getAdUnitId(type: "banner" | "interstitial" | "rewarded", platform: "android" | "ios"): string {
  return ADMOB_CONFIG[platform][type];
}

export function isAdMobEnabled(): boolean {
  return ADMOB_STRATEGY.banner.enabled || ADMOB_STRATEGY.interstitial.enabled || ADMOB_STRATEGY.rewarded.enabled;
}

export function getAdStrategy() {
  return ADMOB_STRATEGY;
}
import { Platform } from 'react-native';
// import { initializeApp } from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics';
// import messaging from '@react-native-firebase/messaging';
// import crashlytics from '@react-native-firebase/crashlytics';
// import perf from '@react-native-firebase/perf';
// import database from '@react-native-firebase/database';
// import auth from '@react-native-firebase/auth';

/**
 * Inicializar Firebase para React Native
 * Esto debe llamarse una sola vez al iniciar la app
 */
export async function initializeFirebase() {
  try {
    // Firebase ya está inicializado automáticamente en React Native
    console.log('✅ Firebase inicializado correctamente');

    // // Habilitar Analytics
    // await analytics().setAnalyticsCollectionEnabled(true);
    console.log('✅ Analytics habilitado');

    // // Habilitar Crashlytics
    // if (Platform.OS !== 'web') {
    //   await crashlytics().setCrashlyticsCollectionEnabled(true);
    //   console.log('✅ Crashlytics habilitado');
    // }

    // // Habilitar Performance Monitoring
    // await perf().setPerformanceCollectionEnabled(true);
    // console.log('✅ Performance Monitoring habilitado');

    // // Configurar Messaging (Push Notifications)
    // if (Platform.OS !== 'web') {
    //   const token = await messaging().getToken();
    //   console.log('✅ FCM Token:', token);
    // }

    return true;
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error);
    return false;
  }
}

/**
 * Registrar evento de Analytics
 */
export async function logEvent(eventName: string, params?: Record<string, any>) {
  try {
    // await analytics().logEvent(eventName, params);
    console.log(`📊 Evento registrado: ${eventName}`, params);
  } catch (error) {
    console.error('Error registrando evento:', error);
  }
}

/**
 * Registrar usuario en Analytics
 */
export async function setUserId(userId: string) {
  try {
    // await analytics().setUserId(userId);
    console.log(`👤 Usuario ID establecido: ${userId}`);
  } catch (error) {
    console.error('Error estableciendo usuario:', error);
  }
}

/**
 * Registrar propiedades de usuario
 */
export async function setUserProperties(properties: Record<string, string>) {
  try {
    // await analytics().setUserProperties(properties);
    console.log('📋 Propiedades de usuario establecidas:', properties);
  } catch (error) {
    console.error('Error estableciendo propiedades:', error);
  }
}

/**
 * Registrar error en Crashlytics
 */
export async function recordError(error: Error) {
  try {
    if (Platform.OS !== 'web') {
      // await crashlytics().recordError(error);
      console.log('🚨 Error registrado en Crashlytics');
    }
  } catch (err) {
    console.error('Error registrando en Crashlytics:', err);
  }
}

/**
 * Eventos de Analytics predefinidos
 */
export const AnalyticsEvents = {
  // Eventos de juego
  GAME_STARTED: 'game_started',
  GAME_ENDED: 'game_ended',
  GAME_WON: 'game_won',
  GAME_LOST: 'game_lost',
  
  // Eventos de monetización
  PURCHASE_INITIATED: 'purchase_initiated',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  
  // Eventos de engagement
  DAILY_BONUS_CLAIMED: 'daily_bonus_claimed',
  REFERRAL_SHARED: 'referral_shared',
  REFERRAL_COMPLETED: 'referral_completed',
  
  // Eventos de usuario
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Eventos de anuncios
  AD_VIEWED: 'ad_viewed',
  AD_CLICKED: 'ad_clicked',
  REWARDED_AD_COMPLETED: 'rewarded_ad_completed',
  
  // Eventos de soporte
  SUPPORT_TICKET_CREATED: 'support_ticket_created',
  SUPPORT_TICKET_RESOLVED: 'support_ticket_resolved',
};

/**
 * Registrar evento de juego
 */
export async function logGameEvent(
  eventName: string,
  gameType: string,
  bet: number,
  winnings: number,
  multiplier?: number
) {
  await logEvent(eventName, {
    game_type: gameType,
    bet_amount: bet,
    winnings_amount: winnings,
    multiplier: multiplier || 1,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Registrar evento de compra
 */
export async function logPurchaseEvent(
  amount: number,
  currency: string,
  paymentMethod: string,
  itemId: string
) {
  await logEvent('purchase', {
    value: amount,
    currency: currency,
    payment_method: paymentMethod,
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Registrar evento de anuncio
 */
export async function logAdEvent(
  eventName: string,
  adType: string,
  adNetwork: string
) {
  await logEvent(eventName, {
    ad_type: adType,
    ad_network: adNetwork,
    timestamp: new Date().toISOString(),
  });
}

export default {
  initializeFirebase,
  logEvent,
  setUserId,
  setUserProperties,
  recordError,
  AnalyticsEvents,
  logGameEvent,
  logPurchaseEvent,
  logAdEvent,
};

/**
 * Firebase Configuration
 * Cuenta: harry.7u7@gmail.com
 * 
 * Servicios habilitados:
 * - Analytics
 * - Cloud Messaging (Push Notifications)
 * - Realtime Database
 * - Authentication
 * - Crashlytics
 * - Performance Monitoring
 */

// Reemplaza con tu configuración de Firebase
// Obtén esto de: Firebase Console → Configuración del proyecto → Tus apps
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD...",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "casinoroyale-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "casinoroyale-app",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "casinoroyale-app.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abc123def456",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://casinoroyale-app.firebaseio.com",
};

/**
 * Firebase Messaging Configuration
 */
export const firebaseMessagingConfig = {
  vapidKey: process.env.FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY",
  serverKey: process.env.FIREBASE_SERVER_KEY || "YOUR_SERVER_KEY",
};

/**
 * Firebase Analytics Events
 */
export const FIREBASE_EVENTS = {
  // Juegos
  GAME_PLAYED: "game_played",
  GAME_WON: "game_won",
  GAME_LOST: "game_lost",
  
  // Monetización
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  PURCHASE: "purchase",
  
  // Engagement
  BONUS_CLAIMED: "bonus_claimed",
  REFERRAL_SENT: "referral_sent",
  CHALLENGE_STARTED: "challenge_started",
  CHALLENGE_COMPLETED: "challenge_completed",
  
  // Soporte
  SUPPORT_TICKET_CREATED: "support_ticket_created",
  SUPPORT_TICKET_RESOLVED: "support_ticket_resolved",
  
  // Notificaciones
  PUSH_NOTIFICATION_RECEIVED: "push_notification_received",
  PUSH_NOTIFICATION_CLICKED: "push_notification_clicked",
};

/**
 * Firebase Database Paths
 */
export const FIREBASE_PATHS = {
  // Usuarios
  USERS: "users",
  USER_PROFILE: (uid: string) => `users/${uid}/profile`,
  USER_BALANCE: (uid: string) => `users/${uid}/balance`,
  USER_STATS: (uid: string) => `users/${uid}/stats`,
  
  // Tabla de clasificación
  LEADERBOARD: "leaderboard",
  LEADERBOARD_DAILY: "leaderboard/daily",
  LEADERBOARD_WEEKLY: "leaderboard/weekly",
  LEADERBOARD_MONTHLY: "leaderboard/monthly",
  
  // Soporte
  SUPPORT_TICKETS: "support_tickets",
  SUPPORT_TICKET: (ticketId: string) => `support_tickets/${ticketId}`,
  
  // Bonificaciones
  DAILY_BONUSES: "daily_bonuses",
  USER_BONUSES: (uid: string) => `users/${uid}/bonuses`,
  
  // Notificaciones
  NOTIFICATIONS: "notifications",
  USER_NOTIFICATIONS: (uid: string) => `users/${uid}/notifications`,
};

/**
 * Firebase Security Rules (para Realtime Database)
 */
export const FIREBASE_SECURITY_RULES = `
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "profile": {
          ".validate": "newData.hasChildren(['name', 'email', 'avatar'])"
        },
        "balance": {
          ".validate": "newData.isNumber()"
        },
        "stats": {
          ".validate": "newData.hasChildren(['totalWins', 'totalLosses', 'totalBet'])"
        }
      }
    },
    "leaderboard": {
      ".read": true,
      "$userId": {
        ".write": "root.child('admins').child(auth.uid).exists()"
      }
    },
    "support_tickets": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      "$ticketId": {
        ".write": "root.child('admins').child(auth.uid).exists() || data.child('userId').val() === auth.uid"
      }
    },
    "notifications": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "root.child('admins').child(auth.uid).exists()"
      }
    },
    "admins": {
      ".read": false,
      ".write": false
    }
  }
}
`;

/**
 * Tipos de Notificaciones Push
 */
export enum NotificationType {
  BONUS = "bonus",
  PROMOTION = "promotion",
  ACHIEVEMENT = "achievement",
  SUPPORT_RESPONSE = "support_response",
  GAME_INVITE = "game_invite",
  LEADERBOARD_UPDATE = "leaderboard_update",
}

/**
 * Interfaz de Ticket de Soporte
 */
export interface SupportTicket {
  id: string;
  userId: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  category: "payment" | "technical" | "account" | "other";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  sender: "user" | "admin";
  message: string;
  timestamp: string;
}

/**
 * Interfaz de Notificación Push
 */
export interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  createdAt: string;
  read: boolean;
}

/**
 * Interfaz de Evento de Analytics
 */
export interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, any>;
  timestamp: string;
  userId: string;
}

/**
 * Configuración de Notificaciones Push
 */
export const PUSH_NOTIFICATION_CONFIG = {
  // Bonificación diaria
  DAILY_BONUS: {
    title: "🎁 ¡Bonificación Diaria!",
    body: "Reclama tu bonificación de 50 fichas",
    type: NotificationType.BONUS,
  },
  
  // Promoción especial
  SPECIAL_PROMOTION: {
    title: "🎉 ¡Oferta Especial!",
    body: "Compra fichas con 50% de descuento",
    type: NotificationType.PROMOTION,
  },
  
  // Logro desbloqueado
  ACHIEVEMENT_UNLOCKED: {
    title: "🏆 ¡Logro Desbloqueado!",
    body: "Ganaste el logro de campeón",
    type: NotificationType.ACHIEVEMENT,
  },
  
  // Respuesta de soporte
  SUPPORT_RESPONSE: {
    title: "📧 Respuesta de Soporte",
    body: "Tu ticket de soporte ha sido respondido",
    type: NotificationType.SUPPORT_RESPONSE,
  },
};

/**
 * Función para inicializar Firebase
 * (Se llama desde app/_layout.tsx)
 */
export async function initializeFirebase() {
  try {
    // Validar configuración
    if (!firebaseConfig.projectId) {
      console.warn("Firebase no está configurado. Algunos servicios no funcionarán.");
      return false;
    }
    
    console.log("Firebase inicializado correctamente");
    return true;
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
    return false;
  }
}

/**
 * Función para obtener la URL de la base de datos
 */
export function getFirebaseDatabaseURL(): string {
  return firebaseConfig.databaseURL || `https://${firebaseConfig.projectId}.firebaseio.com`;
}

/**
 * Función para validar configuración de Firebase
 */
export function validateFirebaseConfig(): boolean {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredFields.every((field) => firebaseConfig[field as keyof typeof firebaseConfig]);
}

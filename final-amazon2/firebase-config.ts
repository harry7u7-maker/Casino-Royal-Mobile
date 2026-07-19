// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// import { getMessaging } from 'firebase/messaging';
// import { getDatabase } from 'firebase/database';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para Casino Royal Mobile
// Reemplaza estos valores con tu configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDemoKeyForCasinoRoyale",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "casinoroyale-demo.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "casinoroyale-demo",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "casinoroyale-demo.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abc123def456",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-ABC123DEF456",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://casinoroyale-demo.firebaseio.com"
};

// Inicializar Firebase
// const app = initializeApp(firebaseConfig);
const app = {} as any;

// Inicializar servicios de Firebase
// export const analytics = getAnalytics(app);
// export const messaging = getMessaging(app);
// export const database = getDatabase(app);
// export const auth = getAuth(app);
// export const firestore = getFirestore(app);

export default app as any;

/**
 * Para obtener tu configuración de Firebase:
 * 
 * 1. Ve a https://console.firebase.google.com
 * 2. Crea un nuevo proyecto o selecciona uno existente
 * 3. Haz clic en "Configuración del proyecto" (ícono de engranaje)
 * 4. Copia la configuración de tu app web
 * 5. Reemplaza los valores anteriores con los tuyos
 * 
 * O establece estas variables de entorno:
 * - FIREBASE_API_KEY
 * - FIREBASE_AUTH_DOMAIN
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_STORAGE_BUCKET
 * - FIREBASE_MESSAGING_SENDER_ID
 * - FIREBASE_APP_ID
 * - FIREBASE_MEASUREMENT_ID
 * - FIREBASE_DATABASE_URL
 */

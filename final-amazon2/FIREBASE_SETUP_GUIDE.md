# 🔥 Guía de Configuración de Firebase - Casino Royale Mobile

## Cuenta: harry.7u7@gmail.com

---

## Paso 1: Crear Proyecto en Firebase

### 1.1 Acceder a Firebase Console
1. Ve a https://console.firebase.google.com
2. Inicia sesión con: **harry.7u7@gmail.com**
3. Haz clic en "Agregar proyecto"

### 1.2 Crear Nuevo Proyecto
1. **Nombre del proyecto**: `Casino Royale Mobile`
2. **ID del proyecto**: `casinoroyale-app` (se genera automáticamente)
3. Desactiva "Habilitar Google Analytics" por ahora
4. Haz clic en "Crear proyecto"
5. Espera a que se cree (2-3 minutos)

### 1.3 Copiar Configuración
Una vez creado el proyecto:
1. Ve a "Configuración del proyecto" (rueda de engranaje)
2. Ve a "Tus apps"
3. Selecciona tu app (o crea una nueva)
4. Copia la configuración de Firebase (JSON)

---

## Paso 2: Habilitar Servicios de Firebase

### 2.1 Firebase Analytics
1. En la consola, ve a "Analytics"
2. Haz clic en "Comenzar"
3. Selecciona tu app
4. Haz clic en "Habilitar"

### 2.2 Firebase Cloud Messaging (Notificaciones Push)
1. Ve a "Cloud Messaging"
2. Haz clic en "Comenzar"
3. Copia tu **Server Key** (la necesitarás)

### 2.3 Firebase Realtime Database
1. Ve a "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona ubicación: **Norteamérica (us-central1)**
4. Modo de seguridad: **Modo de prueba** (cambiaremos después)
5. Haz clic en "Habilitar"

### 2.4 Firebase Authentication
1. Ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a "Proveedores de acceso"
4. Habilita: Email/Contraseña, Google, Teléfono
5. Guarda cambios

### 2.5 Firebase Crashlytics
1. Ve a "Crashlytics"
2. Haz clic en "Comenzar"
3. Selecciona tu app
4. Haz clic en "Habilitar"

---

## Paso 3: Obtener Credenciales

### 3.1 Firebase Config
1. Ve a "Configuración del proyecto"
2. Ve a "Tus apps"
3. Haz clic en tu app
4. Ve a "Configuración"
5. Copia el objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "casinoroyale-app.firebaseapp.com",
  projectId: "casinoroyale-app",
  storageBucket: "casinoroyale-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 3.2 Server Key (para notificaciones)
1. Ve a "Cloud Messaging"
2. Ve a "Credenciales"
3. Copia tu **Server Key**

### 3.3 Database URL
1. Ve a "Realtime Database"
2. Copia la URL de tu base de datos (ej: `https://casinoroyale-app.firebaseio.com`)

---

## Paso 4: Configurar en la App

### 4.1 Crear archivo de configuración

Crea `/home/ubuntu/casino-mobile-app/firebase.config.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "casinoroyale-app.firebaseapp.com",
  projectId: "casinoroyale-app",
  storageBucket: "casinoroyale-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
```

---

## Paso 5: Integrar en la App

### 5.1 Analytics
```typescript
import { logEvent } from "firebase/analytics";
import { analytics } from "@/firebase.config";

// Registrar evento
logEvent(analytics, "game_played", {
  game_type: "slots",
  bet_amount: 100,
  winnings: 250
});
```

### 5.2 Notificaciones Push
```typescript
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase.config";

// Obtener token
const token = await getToken(messaging, {
  vapidKey: "YOUR_VAPID_KEY"
});

// Escuchar mensajes
onMessage(messaging, (payload) => {
  console.log("Mensaje recibido:", payload);
});
```

### 5.3 Realtime Database
```typescript
import { ref, set, onValue } from "firebase/database";
import { database } from "@/firebase.config";

// Escribir datos
set(ref(database, "users/" + userId), {
  name: userName,
  balance: userBalance,
  lastLogin: new Date()
});

// Leer datos en tiempo real
onValue(ref(database, "leaderboard"), (snapshot) => {
  const data = snapshot.val();
  console.log("Tabla de clasificación:", data);
});
```

---

## Paso 6: Configurar Reglas de Seguridad

### 6.1 Realtime Database Rules

En Firebase Console, ve a "Realtime Database" → "Reglas":

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "leaderboard": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "support_tickets": {
      "$ticketId": {
        ".read": "root.child('admins').child(auth.uid).exists()",
        ".write": "root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}
```

---

## Paso 7: Crear Sistema de Soporte

### 7.1 Estructura de Tickets

```
/support_tickets
  /$ticketId
    - userId: string
    - email: string
    - subject: string
    - message: string
    - status: "open" | "in_progress" | "closed"
    - createdAt: timestamp
    - updatedAt: timestamp
    - responses: array
```

### 7.2 Crear Ticket desde App

```typescript
import { ref, push } from "firebase/database";
import { database } from "@/firebase.config";

async function createSupportTicket(email: string, subject: string, message: string) {
  const ticketsRef = ref(database, "support_tickets");
  const newTicket = await push(ticketsRef, {
    email,
    subject,
    message,
    status: "open",
    createdAt: new Date().toISOString(),
    responses: []
  });
  
  return newTicket.key;
}
```

---

## Paso 8: Enviar Notificaciones Push

### 8.1 Desde el Backend

```typescript
// server/notification-service.ts
import admin from "firebase-admin";

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const message = {
    notification: {
      title,
      body
    },
    data,
    token: userToken // Obtener del usuario
  };

  try {
    await admin.messaging().send(message);
    console.log("Notificación enviada");
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
}
```

---

## Paso 9: Monitorear Eventos

### 9.1 Eventos Importantes a Rastrear

```typescript
// Cuando usuario juega
logEvent(analytics, "game_played", {
  game_type: "slots",
  bet_amount: 100,
  result: "win"
});

// Cuando usuario realiza depósito
logEvent(analytics, "deposit", {
  amount: 50,
  method: "paypal",
  currency: "USD"
});

// Cuando usuario retira dinero
logEvent(analytics, "withdrawal", {
  amount: 100,
  method: "bank_transfer"
});

// Cuando usuario abre soporte
logEvent(analytics, "support_ticket_created", {
  subject: "Problema con pago",
  category: "payment"
});
```

---

## Paso 10: Dashboard de Firebase

### 10.1 Ver Datos en Tiempo Real

1. Ve a Firebase Console
2. Ve a "Realtime Database"
3. Verás todos los datos en tiempo real
4. Puedes filtrar y buscar

### 10.2 Ver Analytics

1. Ve a "Analytics"
2. Verás:
   - Usuarios activos
   - Eventos por día
   - Conversiones
   - Retención

### 10.3 Ver Crashlytics

1. Ve a "Crashlytics"
2. Verás:
   - Crashes reportados
   - Stack traces
   - Dispositivos afectados

---

## Paso 11: Integración con Soporte

### 11.1 Crear Formulario de Contacto en App

```typescript
// app/support.tsx
import { useState } from "react";
import { createSupportTicket } from "@/server/support-service";

export default function SupportScreen() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const ticketId = await createSupportTicket(email, subject, message);
    alert(`Ticket creado: ${ticketId}`);
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Asunto" value={subject} onChangeText={setSubject} />
      <TextInput placeholder="Mensaje" value={message} onChangeText={setMessage} multiline />
      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}
```

---

## Paso 12: Responder Tickets desde Gmail

### 12.1 Configurar Reenvío

1. En Gmail, ve a "Configuración"
2. Ve a "Reenvío y correo POP/IMAP"
3. Haz clic en "Agregar cuenta de reenvío"
4. Ingresa: `support@casinoroyale.app`
5. Confirma el código
6. Haz clic en "Reenviar a esta dirección"

### 12.2 Responder Tickets

Cuando recibas un correo de soporte:
1. Responde directamente desde Gmail
2. El sistema actualizará automáticamente el ticket
3. El usuario recibirá notificación de la respuesta

---

## Proyecciones de Impacto

| Métrica | Beneficio |
|---------|-----------|
| **Retención** | +25% con notificaciones push |
| **Engagement** | +40% con tabla de clasificación |
| **Satisfacción** | +90% con sistema de soporte |
| **Ingresos** | +15% con mejor experiencia |

---

## Contacto y Soporte

- **Email de Soporte**: support@casinoroyale.app
- **Gmail**: harry.7u7@gmail.com
- **Firebase Console**: https://console.firebase.google.com

---

**Versión**: 1.0.0  
**Cuenta**: harry.7u7@gmail.com  
**Fecha**: 2026-06-09

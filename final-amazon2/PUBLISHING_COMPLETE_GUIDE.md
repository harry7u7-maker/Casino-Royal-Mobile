# Guía Completa de Publicación - Casino Royale Mobile

## 📱 Publicación en Google Play Store (Android)

### Requisitos Previos
1. Crear cuenta de Google Play Developer ($25 USD)
2. Tener una tarjeta de crédito válida
3. Completar perfil de desarrollador

### Pasos de Publicación

#### 1. Preparar la App
```bash
cd /home/ubuntu/casino-mobile-app
eas build --platform android --type apk
```

#### 2. Crear Cuenta en Google Play Console
- Ir a https://play.google.com/console
- Crear nueva aplicación
- Llenar información básica

#### 3. Información de la App
- **Nombre**: Casino Royale
- **Descripción**: Juega tragamonedas, ruleta y blackjack. Gana dinero real con múltiples métodos de pago.
- **Categoría**: Juegos > Casino
- **Clasificación**: 18+ (Requiere verificación de edad)

#### 4. Contenido Clasificado
- ⚠️ **IMPORTANTE**: Marcar como "Contiene Juego de Azar"
- Aceptar términos de juego responsable
- Incluir advertencia de edad

#### 5. Cargar APK
- Ir a "Publicación" > "Versiones"
- Cargar APK generado por EAS
- Completar notas de versión

#### 6. Información de Precios
- Seleccionar "Gratis"
- Habilitar compras dentro de la app

#### 7. Clasificación de Contenido
- Completar cuestionario de clasificación
- Responder sobre contenido de juego de azar

#### 8. Revisar y Publicar
- Revisar toda la información
- Enviar para revisión
- **Tiempo de revisión**: 2-7 días

---

## 🍎 Publicación en App Store (iOS)

### Requisitos Previos
1. Cuenta de Apple Developer ($99 USD/año)
2. Mac con Xcode instalado
3. Certificados de desarrollo

### Pasos de Publicación

#### 1. Preparar la App
```bash
cd /home/ubuntu/casino-mobile-app
eas build --platform ios --type app-store
```

#### 2. Crear App en App Store Connect
- Ir a https://appstoreconnect.apple.com
- Crear nueva app
- Llenar información

#### 3. Información de la App
- **Nombre**: Casino Royale
- **Descripción**: Juega y gana dinero real
- **Categoría**: Games > Casino
- **Clasificación**: 17+ (Juego de azar)

#### 4. Información de Privacidad
- ⚠️ **CRÍTICO**: Completar cuestionario de privacidad
- Indicar recolección de datos de usuarios
- Describir uso de datos de pago

#### 5. Cargar Build
- Usar Transporter o App Store Connect
- Cargar IPA generado por EAS
- Completar información de compilación

#### 6. Información de Clasificación
- Marcar "Simulated Gambling"
- Seleccionar clasificación 17+
- Aceptar términos

#### 7. Revisar y Enviar
- Revisar información de privacidad
- Enviar para revisión
- **Tiempo de revisión**: 1-3 días

---

## 🪟 Publicación en Microsoft Store (Windows)

### Requisitos Previos
1. Cuenta de Microsoft Developer ($19 USD)
2. Certificado de desarrollador
3. Windows 10/11

### Pasos de Publicación

#### 1. Preparar la App
```bash
cd /home/ubuntu/casino-mobile-app
eas build --platform windows
```

#### 2. Crear App en Partner Center
- Ir a https://partner.microsoft.com/dashboard
- Crear nueva aplicación
- Seleccionar "Juego"

#### 3. Información de la App
- **Nombre**: Casino Royale
- **Descripción**: Juega casino en tu PC
- **Categoría**: Juegos > Casino

#### 4. Cargar Paquete
- Generar paquete MSIX
- Cargar en Partner Center
- Completar información técnica

#### 5. Clasificación de Contenido
- Completar IARC
- Seleccionar clasificación PEGI 18
- Indicar juego de azar

#### 6. Revisar y Publicar
- Revisar toda la información
- Enviar para revisión
- **Tiempo de revisión**: 1-2 días

---

## 🌐 Publicación en Web

### Desplegar en Vercel (Recomendado)

#### 1. Conectar Repositorio
```bash
# Subir a GitHub
git init
git add .
git commit -m "Casino Royale Mobile"
git push origin main
```

#### 2. Crear Cuenta en Vercel
- Ir a https://vercel.com
- Conectar GitHub
- Seleccionar repositorio

#### 3. Configurar Despliegue
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`

#### 4. Desplegar
- Vercel desplegará automáticamente
- URL: `casino-royale.vercel.app`

---

## 📊 Configuración de Análisis y Monetización

### Google AdMob (Publicidad)

#### 1. Crear Cuenta
- Ir a https://admob.google.com
- Crear cuenta con Google
- Verificar sitio web

#### 2. Crear Unidades de Anuncio
```
- Banner ads (320x50)
- Interstitial ads (full screen)
- Rewarded ads (giros gratis)
```

#### 3. Integrar en App
```typescript
// app.config.ts
{
  plugins: [
    [
      "google-mobile-ads",
      {
        androidClientId: "YOUR_ANDROID_CLIENT_ID",
        iosClientId: "YOUR_IOS_CLIENT_ID",
      },
    ],
  ]
}
```

### Firebase Analytics

#### 1. Crear Proyecto
- Ir a https://console.firebase.google.com
- Crear nuevo proyecto
- Nombrar "casino-royale"

#### 2. Agregar App
- Seleccionar iOS y Android
- Descargar archivos de configuración
- Agregar a proyecto

#### 3. Eventos Personalizados
```typescript
import { getAnalytics, logEvent } from "firebase/analytics";

// Rastrear juegos
logEvent(analytics, "game_played", {
  game_type: "slots",
  bet_amount: 50,
});

// Rastrear compras
logEvent(analytics, "purchase_completed", {
  amount: 9.99,
  currency: "USD",
});
```

---

## 💳 Configuración de Pagos

### PayPal
1. Ir a https://developer.paypal.com
2. Crear aplicación
3. Obtener Client ID y Secret
4. Agregar a variables de entorno

### Mercado Pago
1. Ir a https://www.mercadopago.com.mx
2. Crear cuenta de negocio
3. Ir a Credenciales
4. Copiar Access Token

### Santander
1. Contactar: +52 55 5269-4000
2. Solicitar API de pagos
3. Completar verificación
4. Recibir credenciales

---

## ⚖️ Cumplimiento Legal - México

### Requisitos Regulatorios

#### 1. Licencia de Juego
- ⚠️ **CRÍTICO**: Verificar si necesitas licencia en tu estado
- Algunos estados requieren licencia de la SEGOB
- Otros permiten juegos virtuales sin licencia

#### 2. Términos de Servicio
- Incluir advertencia de juego responsable
- Política de privacidad completa
- Términos de retirada de fondos

#### 3. Verificación de Edad
- Implementar verificación de 18+
- Solicitar documento de identidad
- Guardar registros de verificación

#### 4. Protección del Consumidor
- Cumplir con LFPD (Ley Federal de Protección de Datos)
- Encriptar datos sensibles
- Permitir acceso a datos personales

### Archivo Legal Requerido
```
AVISO LEGAL:
- Este juego es solo para entretenimiento
- No es un juego de azar real
- Los jugadores no pueden ganar dinero real
- O: Si es dinero real, incluir licencia
```

---

## 📢 Estrategia de Marketing

### Fase 1: Pre-Lanzamiento (2 semanas antes)
- Crear landing page
- Publicar en redes sociales
- Enviar press release

### Fase 2: Lanzamiento (Día 1)
- Publicar en todas las plataformas
- Anunciar en redes sociales
- Enviar email a contactos

### Fase 3: Post-Lanzamiento (Primeras 2 semanas)
- Responder reviews
- Corregir bugs reportados
- Publicar actualizaciones

### Anuncios Pagados
- Google Ads: $500-1000/mes
- Facebook Ads: $500-1000/mes
- TikTok Ads: $300-500/mes

---

## 🔐 Seguridad y Privacidad

### Checklist de Seguridad
- [ ] SSL/TLS en todos los endpoints
- [ ] Encriptación de datos de pago
- [ ] Validación de entrada en cliente y servidor
- [ ] Rate limiting en APIs
- [ ] Logs de auditoría
- [ ] Backup diario de base de datos

### Cumplimiento GDPR/LFPD
- [ ] Política de privacidad clara
- [ ] Consentimiento explícito
- [ ] Derecho a ser olvidado
- [ ] Acceso a datos personales
- [ ] Exportación de datos

---

## 📈 Monitoreo Post-Lanzamiento

### Métricas Clave
- Descargas diarias
- Usuarios activos
- Tasa de retención
- Ingresos por usuario
- Tasa de conversión de compras

### Herramientas
- Firebase Analytics
- Google Play Console
- App Store Connect
- Mixpanel
- Amplitude

---

## 🚀 Próximos Pasos

1. **Obtener Credenciales de Pago**
   - PayPal, Mercado Pago, Santander, Open Bank, Nubank, Clip

2. **Configurar Certificados**
   - Generar certificados para iOS
   - Crear keystore para Android

3. **Realizar Testing**
   - Pruebas en dispositivos reales
   - Pruebas de pagos en sandbox
   - Pruebas de seguridad

4. **Enviar para Revisión**
   - Google Play: 2-7 días
   - App Store: 1-3 días
   - Microsoft Store: 1-2 días

5. **Monitorear Lanzamiento**
   - Responder reviews
   - Corregir bugs
   - Publicar actualizaciones

---

## 📞 Soporte

Para preguntas sobre publicación:
- Google Play: https://support.google.com/googleplay
- App Store: https://developer.apple.com/support
- Microsoft Store: https://docs.microsoft.com/en-us/windows/uwp

Para preguntas sobre regulación en México:
- SEGOB: https://www.gob.mx/segob
- PROFECO: https://www.gob.mx/profeco

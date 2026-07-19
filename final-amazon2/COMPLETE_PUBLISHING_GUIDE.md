# 📱 Guía Completa de Publicación - Casino Royale Mobile

## Tabla de Contenidos
1. [Preparación Previa](#preparación-previa)
2. [Google Play Store (Android)](#google-play-store-android)
3. [Apple App Store (iOS)](#apple-app-store-ios)
4. [Microsoft Store (Windows)](#microsoft-store-windows)
5. [Checklist Final](#checklist-final)

---

## Preparación Previa

### Requisitos Generales
- ✅ Cuenta de desarrollador en cada plataforma
- ✅ Certificados y firmas digitales
- ✅ Descripciones y screenshots en español
- ✅ Política de privacidad y términos de servicio
- ✅ Información de contacto y soporte

### Información de la App
- **Nombre**: Casino Royale Mobile
- **Descripción**: Aplicación de casino con juegos emocionantes y múltiples métodos de pago
- **Categoría**: Juegos / Entretenimiento
- **Clasificación**: 18+ (Juego de azar)
- **Idiomas**: Español, Inglés

---

## Google Play Store (Android)

### Paso 1: Preparar la App

```bash
# 1. Compilar APK para producción
cd /home/ubuntu/casino-mobile-app
eas build --platform android --release

# 2. Generar AAB (Android App Bundle) - recomendado
eas build --platform android --release --output=app.aab
```

### Paso 2: Crear Cuenta de Desarrollador Google Play

1. Ve a https://play.google.com/console
2. Haz clic en "Crear Cuenta"
3. Completa el formulario con:
   - Nombre de desarrollador: "Casino Royale"
   - Email: tu_email@example.com
   - País: México
4. Paga la cuota de registro ($25 USD)

### Paso 3: Crear Aplicación en Google Play

1. En Google Play Console, haz clic en "Crear Aplicación"
2. Completa los detalles:
   - **Nombre de la app**: Casino Royale Mobile
   - **Idioma por defecto**: Español
   - **Categoría**: Juegos
   - **Tipo de aplicación**: Aplicación
3. Aceptar políticas de Google Play

### Paso 4: Completar Información de la App

#### Ficha de la Tienda
- **Descripción Breve** (80 caracteres):
  "Juega tragamonedas, ruleta y blackjack. ¡Gana fichas y dinero real!"

- **Descripción Completa** (4000 caracteres):
  ```
  ¡Bienvenido a Casino Royale Mobile!
  
  Disfruta de los mejores juegos de casino desde tu teléfono:
  
  🎰 TRAGAMONEDAS - Gira y gana hasta 5x tu apuesta
  🎲 RULETA - Apuesta en rojo, negro o números específicos
  🃏 BLACKJACK - Llega a 21 y vence al crupier
  
  ✨ Características:
  - Bonificaciones diarias automáticas
  - Tabla de clasificación global
  - Múltiples métodos de pago (PayPal, Mercado Pago, etc.)
  - Notificaciones push personalizadas
  - Desafíos y torneos con premios
  - Sistema de referidos viral
  - Suscripción VIP con beneficios exclusivos
  
  💰 Métodos de Pago:
  - PayPal
  - Mercado Pago
  - Santander Banca Móvil
  - Open Bank
  - Nubank
  - Clip
  - Redsys México
  
  ⚠️ Juega responsablemente. Si tienes problemas con el juego, 
  busca ayuda en gamblingtherapy.org
  ```

#### Capturas de Pantalla (Mínimo 2, máximo 8)
- Pantalla de inicio
- Juego de tragamonedas
- Tabla de clasificación
- Tienda de fichas
- Bonificaciones diarias

#### Icono de la App
- Tamaño: 512 x 512 px
- Formato: PNG
- Ubicación: `assets/images/icon.png`

#### Imagen de Portada
- Tamaño: 1024 x 500 px
- Ubicación: `assets/images/feature-graphic.png`

### Paso 5: Configurar Clasificación de Contenido

1. Ve a "Clasificación de contenido"
2. Completa el cuestionario:
   - Violencia: No
   - Lenguaje inapropiado: No
   - Contenido sexual: No
   - Juego de azar: **SÍ** (importante)
   - Compras dentro de la app: **SÍ**

### Paso 6: Configurar Política de Privacidad

1. Ve a "Política de privacidad"
2. Proporciona URL: `https://casinoroyale.app/privacy`
3. Asegúrate de que cumpla con GDPR y leyes mexicanas

### Paso 7: Subir APK/AAB

1. Ve a "Versiones" → "Producción"
2. Haz clic en "Crear versión"
3. Sube el archivo AAB
4. Completa las notas de la versión:
   ```
   Versión 1.0.0
   
   ✨ Características iniciales:
   - 3 juegos emocionantes (Tragamonedas, Ruleta, Blackjack)
   - Sistema de bonificaciones diarias
   - Múltiples métodos de pago
   - Tabla de clasificación global
   - Notificaciones push personalizadas
   - Sistema de referidos
   ```

### Paso 8: Revisar y Enviar

1. Ve a "Revisión de contenido"
2. Verifica todos los campos estén completos
3. Haz clic en "Enviar para revisión"
4. **Tiempo de revisión**: 24-48 horas

---

## Apple App Store (iOS)

### Paso 1: Preparar la App

```bash
# 1. Compilar IPA para producción
cd /home/ubuntu/casino-mobile-app
eas build --platform ios --release

# 2. Generar certificado de distribución
eas credentials
```

### Paso 2: Crear Cuenta de Desarrollador Apple

1. Ve a https://developer.apple.com/account
2. Haz clic en "Registrarse"
3. Completa con:
   - Apple ID: tu_email@example.com
   - Nombre de la organización: "Casino Royale"
   - País: México
4. Paga la cuota anual ($99 USD)

### Paso 3: Crear Identificador de App

1. En Developer Account, ve a "Certificates, Identifiers & Profiles"
2. Haz clic en "Identifiers" → "+"
3. Selecciona "App IDs"
4. Completa:
   - **Bundle ID**: `space.manus.casinoroyale`
   - **Description**: Casino Royale Mobile
   - **Capabilities**: Game Center, Push Notifications

### Paso 4: Crear Certificado de Distribución

1. Ve a "Certificates" → "+"
2. Selecciona "iOS Distribution"
3. Sigue las instrucciones para crear CSR
4. Descarga el certificado

### Paso 5: Crear Perfil de Aprovisionamiento

1. Ve a "Profiles" → "+"
2. Selecciona "App Store"
3. Selecciona el Bundle ID creado
4. Selecciona el certificado de distribución
5. Descarga el perfil

### Paso 6: Enviar a App Store Connect

1. Ve a https://appstoreconnect.apple.com
2. Haz clic en "Mis Apps" → "+"
3. Selecciona "Nueva App"
4. Completa:
   - **Nombre de la app**: Casino Royale Mobile
   - **Bundle ID**: `space.manus.casinoroyale`
   - **SKU**: casinoroyale-2026
   - **Plataforma**: iOS

### Paso 7: Completar Información de la App

#### Información General
- **Categoría Principal**: Juegos
- **Categoría Secundaria**: Entretenimiento
- **Clasificación de contenido**: 17+ (Juego de azar)

#### Descripción
```
¡Bienvenido a Casino Royale Mobile!

Disfruta de los mejores juegos de casino desde tu iPhone:

🎰 TRAGAMONEDAS - Gira y gana hasta 5x tu apuesta
🎲 RULETA - Apuesta en rojo, negro o números específicos
🃏 BLACKJACK - Llega a 21 y vence al crupier

✨ Características:
- Bonificaciones diarias automáticas
- Tabla de clasificación global
- Múltiples métodos de pago
- Notificaciones push personalizadas
- Desafíos y torneos con premios
- Sistema de referidos viral
- Suscripción VIP con beneficios exclusivos
```

#### Notas para Revisión
```
Hola,

Esta es una aplicación de casino con juegos de entretenimiento.

Métodos de pago integrados:
- PayPal
- Mercado Pago
- Santander
- Clip
- Nubank

La app incluye un sistema de bonificaciones diarias y notificaciones push.

Incluye advertencia sobre juego responsable.

Gracias,
Casino Royale Team
```

#### Capturas de Pantalla
- iPhone 6.5": 6 capturas (1284 x 2778 px)
- iPad 12.9": 6 capturas (2048 x 2732 px)

### Paso 8: Subir Build

1. Ve a "TestFlight"
2. Haz clic en "Crear versión"
3. Sube el IPA compilado
4. Espera a que se procese (5-10 minutos)
5. Prueba internamente
6. Ve a "App Store" → "Versión 1.0"
7. Haz clic en "Agregar compilación"
8. Selecciona el build de TestFlight

### Paso 9: Enviar para Revisión

1. Completa todos los campos requeridos
2. Haz clic en "Enviar para revisión"
3. **Tiempo de revisión**: 24-48 horas

---

## Microsoft Store (Windows)

### Paso 1: Preparar la App

```bash
# 1. Compilar para Windows
cd /home/ubuntu/casino-mobile-app
eas build --platform web --release

# 2. Empaquetar como aplicación Windows
# Usar herramientas de Microsoft para convertir web app a MSIX
```

### Paso 2: Crear Cuenta de Desarrollador Microsoft

1. Ve a https://partner.microsoft.com/en-us/dashboard
2. Haz clic en "Registrarse"
3. Completa:
   - Email: tu_email@example.com
   - País: México
   - Tipo de cuenta: Individual o Empresa
4. Paga la cuota de registro ($19 USD)

### Paso 3: Crear Aplicación en Partner Center

1. En Partner Center, haz clic en "Crear una nueva aplicación"
2. Selecciona "Juego"
3. Completa:
   - **Nombre de la aplicación**: Casino Royale Mobile
   - **Descripción**: Juegos de casino emocionantes
   - **Categoría**: Juegos

### Paso 4: Completar Información de la App

#### Descripción
```
¡Bienvenido a Casino Royale Mobile para Windows!

Disfruta de los mejores juegos de casino:

🎰 TRAGAMONEDAS - Gira y gana hasta 5x tu apuesta
🎲 RULETA - Apuesta en rojo, negro o números específicos
🃏 BLACKJACK - Llega a 21 y vence al crupier

Características:
- Bonificaciones diarias automáticas
- Tabla de clasificación global
- Múltiples métodos de pago
- Notificaciones push personalizadas
- Desafíos y torneos con premios
```

#### Clasificación de Contenido
- **Clasificación PEGI**: 18 (Juego de azar)
- **Contenido**: Juego de azar simulado

### Paso 5: Subir Paquete MSIX

1. Ve a "Paquetes"
2. Haz clic en "Cargar paquete"
3. Sube el archivo MSIX
4. Espera a que se procese

### Paso 6: Enviar para Revisión

1. Completa todos los campos requeridos
2. Haz clic en "Enviar para revisión"
3. **Tiempo de revisión**: 24-48 horas

---

## Checklist Final

### Antes de Publicar
- [ ] App compilada y probada en todas las plataformas
- [ ] Todos los métodos de pago funcionando
- [ ] Notificaciones push configuradas
- [ ] Política de privacidad completada
- [ ] Términos de servicio completados
- [ ] Información de contacto actualizada
- [ ] Screenshots en alta resolución
- [ ] Descripciones en español e inglés
- [ ] Iconos en todos los tamaños requeridos

### Después de Publicar
- [ ] Monitorear revisiones de usuarios
- [ ] Responder a comentarios y reseñas
- [ ] Monitorear errores y crashes
- [ ] Preparar actualizaciones basadas en feedback
- [ ] Implementar campañas de marketing
- [ ] Monitorear ingresos en tiempo real

---

## Soporte y Contacto

- **Email de Soporte**: support@casinoroyale.app
- **Sitio Web**: https://casinoroyale.app
- **Dashboard de Ingresos**: https://casinoroyale.app/dashboard

---

## Notas Importantes

⚠️ **Regulaciones de Juego**:
- Asegúrate de cumplir con las leyes de juego en México
- Incluye advertencias sobre juego responsable
- Proporciona recursos de ayuda para problemas de juego

⚠️ **Políticas de Tiendas**:
- Google Play: Prohibe ciertos tipos de juegos de azar
- Apple App Store: Requiere aprobación especial para juegos de azar
- Microsoft Store: Tiene restricciones similares

✅ **Mejores Prácticas**:
- Mantén la app actualizada regularmente
- Responde rápidamente a problemas de usuarios
- Implementa medidas de seguridad robustas
- Protege los datos de los usuarios

---

**Última actualización**: 2026-06-09
**Versión**: 1.0.0

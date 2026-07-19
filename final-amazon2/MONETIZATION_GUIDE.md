# Guía de Monetización - Casino Royale Mobile

## Resumen Ejecutivo

Casino Royale Mobile es una plataforma de casino completamente monetizada con múltiples fuentes de ingresos. Esta guía te ayudará a configurar y optimizar los sistemas de pago y monetización.

## Fuentes de Ingresos

### 1. Compra de Fichas (Principal)
- **Modelo**: Usuarios compran fichas con dinero real vía PayPal
- **Comisión**: PayPal toma 2.9% + $0.30 por transacción
- **Margen**: 70-80% de ganancia neta después de comisiones
- **Paquetes Recomendados**:
  - $4.99 → 500 fichas
  - $9.99 → 1,200 fichas (20% bonus)
  - $24.99 → 3,500 fichas (40% bonus)
  - $49.99 → 8,000 fichas (60% bonus)

### 2. Sistema de Referidos
- **Comisión**: 10% de cada depósito del usuario referido
- **Límite**: Sin límite de referidos
- **Pago**: Acreditado automáticamente en billetera

### 3. Publicidad Integrada (Futuro)
- **Red**: Google AdMob
- **CPM Estimado**: $3-8 USD
- **Implementación**: Banners entre juegos

### 4. Suscripción Premium (Futuro)
- **Precio**: $4.99/mes
- **Beneficios**: 
  - Bonificación diaria de fichas
  - Acceso a juegos exclusivos
  - Retiros sin comisión

## Configuración de PayPal

### Paso 1: Crear Cuenta de Negocio
1. Ir a https://www.paypal.com/mx/business
2. Registrarse como comerciante
3. Verificar identidad y cuenta bancaria

### Paso 2: Obtener Credenciales API
1. Ir a https://developer.paypal.com
2. Crear aplicación en Sandbox (testing)
3. Obtener Client ID y Secret
4. Guardar en variables de entorno:
   ```
   PAYPAL_CLIENT_ID=tu_client_id
   PAYPAL_CLIENT_SECRET=tu_client_secret
   PAYPAL_MODE=production (después de testing)
   ```

### Paso 3: Integración en Código
Las APIs de PayPal ya están configuradas en `server/routers.ts`:
- `paypal.createOrder`: Crear orden de compra
- `paypal.completeOrder`: Completar transacción

### Paso 4: Webhooks
Configurar webhooks en PayPal para:
- `PAYMENT.CAPTURE.COMPLETED`: Cuando se completa el pago
- `PAYMENT.CAPTURE.DENIED`: Cuando se rechaza el pago

## Configuración de Base de Datos

### Tablas Principales
- `wallets`: Saldo de usuarios
- `transactions`: Historial de transacciones
- `paypalTransactions`: Registro de pagos de PayPal
- `chipPackages`: Paquetes disponibles
- `referrals`: Códigos de referido

### Consultas Útiles
```sql
-- Ingresos totales del mes
SELECT SUM(amount) as total_revenue 
FROM paypalTransactions 
WHERE status = 'completed' 
AND MONTH(createdAt) = MONTH(NOW());

-- Usuarios activos
SELECT COUNT(DISTINCT userId) as active_users 
FROM transactions 
WHERE createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Top referrers
SELECT userId, referredCount, bonusEarned 
FROM referrals 
ORDER BY bonusEarned DESC 
LIMIT 10;
```

## Cumplimiento Legal - México

### Regulaciones Requeridas
1. **Licencia de Juego**: Requerida por SEGOB (Secretaría de Gobernación)
2. **Términos y Condiciones**: Incluir en app
3. **Política de Privacidad**: Cumplir con LFPDPPP
4. **Advertencia de Edad**: Verificación obligatoria de 18+
5. **Límites de Apuesta**: Implementar límites máximos

### Documentos Necesarios
- [ ] Términos y Condiciones (en app)
- [ ] Política de Privacidad (en app)
- [ ] Aviso de Juego Responsable
- [ ] Datos de contacto legal
- [ ] Política de Retención de Datos

### Implementación en App
Los siguientes archivos ya incluyen avisos legales:
- `app/auth/login.tsx`: Advertencia de edad
- `app/profile.tsx`: Información legal
- `app/(tabs)/index.tsx`: Aviso de juego responsable

## Seguridad y Fraude

### Medidas Implementadas
1. **Autenticación**: OAuth con Manus
2. **Encriptación**: HTTPS para todas las transacciones
3. **Validación**: Verificación de edad obligatoria
4. **Rate Limiting**: Máximo 10 transacciones por minuto
5. **Auditoría**: Log de todas las transacciones

### Prevención de Fraude
- Verificar identidad antes de retiros
- Límite de retiro diario: $500
- Período de espera de 24h para retiros
- Monitoreo de patrones sospechosos

## Estrategia de Precios

### Análisis de Competencia
- Zynga Poker: $0.99 - $99.99 por paquete
- PokerStars Play: $5 - $100 por paquete
- Caesars Casino: Similar a PokerStars

### Recomendación
Mantener precios competitivos pero con márgenes altos:
- Entrada baja: $4.99 (500 fichas)
- Punto medio: $9.99 (1,200 fichas)
- Premium: $49.99 (8,000 fichas)

## Proyecciones Financieras

### Escenarios Conservadores
- **Mes 1**: 100 usuarios, $500 ingresos
- **Mes 3**: 500 usuarios, $3,000 ingresos
- **Mes 6**: 2,000 usuarios, $15,000 ingresos
- **Año 1**: 10,000 usuarios, $100,000 ingresos

### Factores de Éxito
1. Marketing efectivo en redes sociales
2. Experiencia de usuario excelente
3. Actualizaciones regulares de juegos
4. Programa de referidos activo
5. Atención al cliente responsiva

## Próximos Pasos

1. **Configurar PayPal**: Completar verificación de cuenta
2. **Testing**: Realizar transacciones de prueba
3. **Legal**: Consultar con abogado especializado en juegos
4. **Marketing**: Crear estrategia de lanzamiento
5. **Publicación**: Enviar a App Store y Google Play

## Contacto y Soporte

Para preguntas sobre monetización:
- Email: support@casinoroyale.mx
- Teléfono: +52 (XX) XXXX-XXXX
- WhatsApp: Disponible 24/7

---

**Última actualización**: Junio 2026
**Versión**: 1.0

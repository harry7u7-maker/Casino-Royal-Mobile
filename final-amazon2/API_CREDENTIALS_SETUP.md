# Configuración de Credenciales de Pago - Casino Royale Mobile

## Estado Actual
La app está lista para recibir credenciales de pago. Cuando tengas las claves API, solo sigue estos pasos.

## Plataformas a Configurar

### 1. PayPal
**Credenciales necesarias:**
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

**Dónde obtenerlas:**
https://developer.paypal.com/dashboard/

### 2. Mercado Pago
**Credenciales necesarias:**
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_PUBLIC_KEY`

**Dónde obtenerlas:**
https://www.mercadopago.com.mx/

### 3. Santander Banca Móvil
**Credenciales necesarias:**
- `SANTANDER_API_KEY`
- `SANTANDER_API_SECRET`
- `SANTANDER_MERCHANT_ID`

**Dónde obtenerlas:**
Contactar a Santander: +52 55 5269-4000

### 4. Open Bank
**Credenciales necesarias:**
- `OPENBANK_API_KEY`
- `OPENBANK_CLIENT_ID`
- `OPENBANK_CLIENT_SECRET`

**Dónde obtenerlas:**
https://www.openbank.com.mx/

### 5. Nubank
**Credenciales necesarias:**
- `NUBANK_API_KEY`
- `NUBANK_CLIENT_ID`

**Dónde obtenerlas:**
Contactar a Nubank para acceso a API

### 6. Clip
**Credenciales necesarias:**
- `CLIP_API_KEY`
- `CLIP_MERCHANT_ID`

**Dónde obtenerlas:**
https://www.clip.mx/

## Cómo Enviar las Credenciales

Cuando tengas todas las claves, envíame un mensaje con el siguiente formato:

```
PayPal:
- CLIENT_ID: [tu_client_id]
- CLIENT_SECRET: [tu_client_secret]

Mercado Pago:
- ACCESS_TOKEN: [tu_access_token]
- PUBLIC_KEY: [tu_public_key]

Santander:
- API_KEY: [tu_api_key]
- API_SECRET: [tu_api_secret]
- MERCHANT_ID: [tu_merchant_id]

Open Bank:
- API_KEY: [tu_api_key]
- CLIENT_ID: [tu_client_id]
- CLIENT_SECRET: [tu_client_secret]

Nubank:
- API_KEY: [tu_api_key]
- CLIENT_ID: [tu_client_id]

Clip:
- API_KEY: [tu_api_key]
- MERCHANT_ID: [tu_merchant_id]
```

## Lo Que Haré Cuando Reciba las Credenciales

1. ✅ Configurar todas las variables de entorno
2. ✅ Integrar Nubank y Clip a la app
3. ✅ Probar cada método de pago
4. ✅ Crear webhooks para confirmaciones
5. ✅ Actualizar la base de datos
6. ✅ Dejar la app lista para publicar

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca compartas tus credenciales en chats públicos
- Usa este formulario seguro que proporciono
- Las credenciales se almacenarán de forma segura en tu app

## Preguntas Frecuentes

**¿Puedo usar credenciales de prueba primero?**
Sí, todas las plataformas tienen modo "Sandbox" para pruebas. Usa eso primero.

**¿Qué pasa si me equivoco en una credencial?**
Sin problema, simplemente me envías la correcta y la actualizo.

**¿Cuánto tiempo tarda la configuración?**
Una vez que tengas las credenciales, tardo aproximadamente 30 minutos en configurar todo.

---

**Última actualización**: Junio 2026
**Estado**: Esperando credenciales

# 📱 Guía de Configuración de Google AdMob - Casino Royale Mobile

## Cuenta: harry.7u7@gmail.com

---

## Paso 1: Acceder a Google AdMob

1. Ve a https://admob.google.com
2. Inicia sesión con: **harry.7u7@gmail.com**
3. Haz clic en "Comenzar" si es la primera vez

---

## Paso 2: Crear Aplicación en AdMob

### Para Android
1. En el panel de AdMob, haz clic en "Aplicaciones" → "Agregar aplicación"
2. Selecciona "Google Play"
3. Busca: **Casino Royale Mobile**
4. Selecciona la app cuando aparezca
5. Haz clic en "Agregar"

### Para iOS
1. Haz clic en "Aplicaciones" → "Agregar aplicación"
2. Selecciona "App Store"
3. Ingresa el Bundle ID: `space.manus.casinoroyale`
4. Nombre de la app: **Casino Royale Mobile**
5. Haz clic en "Crear"

---

## Paso 3: Crear Unidades Publicitarias

### Banner (Anuncios en la parte inferior)

1. En la app de Android, haz clic en "Unidades publicitarias" → "Agregar unidad"
2. Selecciona "Banner"
3. Nombre: `casino_banner_android`
4. Haz clic en "Crear unidad"
5. **Copia el ID de unidad**: `ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx`

**Repite para iOS:**
- Nombre: `casino_banner_ios`
- Guarda el ID de unidad

### Intersticial (Anuncios de pantalla completa)

1. Haz clic en "Unidades publicitarias" → "Agregar unidad"
2. Selecciona "Intersticial"
3. Nombre: `casino_interstitial_android`
4. Haz clic en "Crear unidad"
5. **Copia el ID de unidad**

**Repite para iOS:**
- Nombre: `casino_interstitial_ios`
- Guarda el ID de unidad

### Video Recompensado (Anuncios con recompensa)

1. Haz clic en "Unidades publicitarias" → "Agregar unidad"
2. Selecciona "Video recompensado"
3. Nombre: `casino_rewarded_android`
4. Haz clic en "Crear unidad"
5. **Copia el ID de unidad**

**Repite para iOS:**
- Nombre: `casino_rewarded_ios`
- Guarda el ID de unidad

---

## Paso 4: IDs de Unidades Publicitarias

Guarda estos IDs (reemplaza con los tuyos):

```
ANDROID:
- Banner: ca-app-pub-3940256099942544/6300978111
- Intersticial: ca-app-pub-3940256099942544/1033173712
- Video Recompensado: ca-app-pub-3940256099942544/5224354917

iOS:
- Banner: ca-app-pub-3940256099942544/2934735716
- Intersticial: ca-app-pub-3940256099942544/4411468910
- Video Recompensado: ca-app-pub-3940256099942544/1712485313
```

---

## Paso 5: Configurar en la App

### Crear archivo de configuración

Crea el archivo `/home/ubuntu/casino-mobile-app/admob.config.ts`:

```typescript
export const ADMOB_CONFIG = {
  android: {
    banner: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
    interstitial: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
    rewarded: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  },
  ios: {
    banner: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
    interstitial: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
    rewarded: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  },
};
```

---

## Paso 6: Integración en la App

### Importar en componentes

```typescript
import { ADMOB_CONFIG } from "@/admob.config";
import { BannerAd, BannerAdSize, InterstitialAd, RewardedAd } from "react-native-google-mobile-ads";

// Banner
<BannerAd
  unitId={ADMOB_CONFIG.android.banner}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
/>

// Intersticial
const interstitial = InterstitialAd.createForAdRequest(ADMOB_CONFIG.android.interstitial);

// Video Recompensado
const rewarded = RewardedAd.createForAdRequest(ADMOB_CONFIG.android.rewarded);
```

---

## Paso 7: Pruebas

### Usar IDs de Prueba

Para pruebas, usa estos IDs de prueba de Google:

```
Android:
- Banner: ca-app-pub-3940256099942544/6300978111
- Intersticial: ca-app-pub-3940256099942544/1033173712
- Video Recompensado: ca-app-pub-3940256099942544/5224354917

iOS:
- Banner: ca-app-pub-3940256099942544/2934735716
- Intersticial: ca-app-pub-3940256099942544/4411468910
- Video Recompensado: ca-app-pub-3940256099942544/1712485313
```

### Probar en Dispositivo

1. Instala la app en tu teléfono
2. Abre la app
3. Verifica que los anuncios aparezcan
4. Los anuncios de prueba mostrarán "Test Ad Label"

---

## Paso 8: Cambiar a Producción

Una vez que todo funcione:

1. Reemplaza los IDs de prueba con tus IDs reales de AdMob
2. Publica la app en Google Play y App Store
3. Los anuncios reales comenzarán a servirse después de 24-48 horas

---

## Paso 9: Monitorear Ingresos

### En el Dashboard de AdMob

1. Ve a "Reportes" en AdMob
2. Verás:
   - Impresiones (cuántas veces se mostró el anuncio)
   - Clics (cuántas veces se hizo clic)
   - CTR (Click-Through Rate)
   - Ingresos estimados

### Proyecciones de Ingresos

- **CPM Promedio**: $5-10 por 1000 impresiones
- **Con 10,000 usuarios**: ~$50-100 diarios
- **Con 100,000 usuarios**: ~$500-1000 diarios

---

## Paso 10: Optimización

### Mejores Prácticas

1. **No mostrar demasiados anuncios**: Máximo 1 cada 3-5 minutos
2. **Usar videos recompensados**: Generan 2-3x más ingresos
3. **Colocar banners estratégicamente**: Parte inferior de pantalla
4. **Mostrar intersticiales entre juegos**: No durante el juego

### Estrategia Recomendada

- **Banner**: Siempre visible en la parte inferior
- **Intersticial**: Después de cada 3 juegos
- **Video Recompensado**: Ofrecimiento voluntario (bonus de fichas)

---

## Paso 11: Pagos

### Configurar Método de Pago

1. En AdMob, ve a "Configuración" → "Cuenta"
2. Haz clic en "Información de pago"
3. Agrega tu información bancaria o PayPal
4. Los pagos se realizan mensualmente

### Umbral de Pago

- **Mínimo**: $100 USD
- **Frecuencia**: Mensual (entre el 21-26 de cada mes)

---

## Contacto y Soporte

- **Email de AdMob**: harry.7u7@gmail.com
- **Dashboard**: https://admob.google.com
- **Soporte de Google**: https://support.google.com/admob

---

## Notas Importantes

⚠️ **Política de Google**:
- No hagas clic en tus propios anuncios
- No incentives a usuarios a hacer clic en anuncios
- Mantén la app funcionando correctamente
- Cumple con las políticas de Google Play

✅ **Mejores Prácticas**:
- Monitorea tus ingresos diariamente
- Optimiza la colocación de anuncios
- A/B test diferentes estrategias
- Responde a los usuarios sobre los anuncios

---

**Versión**: 1.0.0  
**Cuenta**: harry.7u7@gmail.com  
**Fecha**: 2026-06-09

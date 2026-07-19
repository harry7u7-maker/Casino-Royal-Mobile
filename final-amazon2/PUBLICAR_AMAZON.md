# 🚀 Publicar en Amazon Appstore

## 1. Crea tu cuenta de developer
- Ve a https://developer.amazon.com/
- Regístrate gratis (sin costo anual)
- Usa tu correo: harry.7u7@gmail.com

## 2. Prepara los assets
Necesitarás:
- **Icono de la app** (512x512px)
- **Screenshots** (mínimo 3, de tu app funcionando)
- **Banner promocional** (1024x500px, opcional)
- **Descripción** de la app en español

## 3. Genera el APK con GitHub Actions
1. Sube el código a GitHub
2. Agrega el secreto `EXPO_TOKEN` (Settings > Secrets > Actions)
3. Ve a Actions > Build Casino Royal Mobile > Run workflow
4. Selecciona "amazon" como build type
5. Descarga el APK de los artifacts

## 4. Sube a Amazon
1. En developer.amazon.com > Add New App
2. Llena: nombre, descripción, categoría (Casino/Juegos)
3. Sube el APK
4. Sube screenshots e icono
5. Envía a revisión

## ⚠️ Importante sobre anuncios
Amazon Fire OS **no tiene Google Play Services**, así que AdMob no cargará anuncios en Fire Tablets. La app funcionará perfectamente, solo los anuncios no se mostrarán en esos dispositivos.

Si quieres monetizar en Fire OS, necesitarás implementar **Amazon Ads** más adelante.
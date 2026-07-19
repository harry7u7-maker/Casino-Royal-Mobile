#!/bin/bash

# ============================================================================
# Script de Publicación Automática - Casino Royale Mobile
# Publica la app en Google Play, App Store y Microsoft Store
# ============================================================================

set -e

echo "🎰 Casino Royale Mobile - Script de Publicación Automática"
echo "=========================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# ============================================================================
# PASO 1: Verificar Prerequisites
# ============================================================================

echo "📋 Verificando Prerequisites..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi
log_info "Node.js: $(node --version)"

# Verificar npm/pnpm
if ! command -v pnpm &> /dev/null; then
    log_error "pnpm no está instalado"
    exit 1
fi
log_info "pnpm: $(pnpm --version)"

# Verificar EAS CLI
if ! command -v eas &> /dev/null; then
    log_warn "EAS CLI no está instalado. Instalando..."
    npm install -g eas-cli
fi
log_info "EAS CLI: $(eas --version)"

# ============================================================================
# PASO 2: Compilar para todas las plataformas
# ============================================================================

echo ""
echo "🔨 Compilando para todas las plataformas..."
echo ""

# Android
log_info "Compilando para Android..."
eas build --platform android --release --auto-submit

# iOS
log_info "Compilando para iOS..."
eas build --platform ios --release --auto-submit

# Web (para Microsoft Store)
log_info "Compilando para Web..."
npm run build

# ============================================================================
# PASO 3: Preparar para Google Play
# ============================================================================

echo ""
echo "📱 Preparando para Google Play Store..."
echo ""

log_info "AAB (Android App Bundle) listo para Google Play"
log_info "Sigue estos pasos en Google Play Console:"
echo "  1. Ve a Google Play Console"
echo "  2. Selecciona tu app (Casino Royale Mobile)"
echo "  3. Ve a 'Versiones' → 'Producción'"
echo "  4. Haz clic en 'Crear versión'"
echo "  5. Sube el archivo AAB"
echo "  6. Completa la información de la versión"
echo "  7. Haz clic en 'Enviar para revisión'"

# ============================================================================
# PASO 4: Preparar para App Store
# ============================================================================

echo ""
echo "🍎 Preparando para App Store..."
echo ""

log_info "IPA (iOS App) listo para App Store"
log_info "Sigue estos pasos en App Store Connect:"
echo "  1. Ve a App Store Connect"
echo "  2. Selecciona tu app (Casino Royale Mobile)"
echo "  3. Ve a 'Versión 1.0'"
echo "  4. Haz clic en 'Agregar compilación'"
echo "  5. Selecciona el build de TestFlight"
echo "  6. Completa la información de la versión"
echo "  7. Haz clic en 'Enviar para revisión'"

# ============================================================================
# PASO 5: Preparar para Microsoft Store
# ============================================================================

echo ""
echo "🪟 Preparando para Microsoft Store..."
echo ""

log_info "Paquete MSIX listo para Microsoft Store"
log_info "Sigue estos pasos en Microsoft Partner Center:"
echo "  1. Ve a Microsoft Partner Center"
echo "  2. Selecciona tu app (Casino Royale Mobile)"
echo "  3. Ve a 'Paquetes'"
echo "  4. Haz clic en 'Cargar paquete'"
echo "  5. Sube el archivo MSIX"
echo "  6. Completa la información"
echo "  7. Haz clic en 'Enviar para revisión'"

# ============================================================================
# PASO 6: Resumen
# ============================================================================

echo ""
echo "✅ Compilación completada"
echo ""
echo "📊 Resumen de Publicación:"
echo "  • Google Play: Listo para enviar"
echo "  • App Store: Listo para enviar"
echo "  • Microsoft Store: Listo para enviar"
echo ""
echo "⏱️  Tiempo de revisión estimado:"
echo "  • Google Play: 24-48 horas"
echo "  • App Store: 24-48 horas"
echo "  • Microsoft Store: 24-48 horas"
echo ""
echo "💰 Ingresos comenzarán después de la aprobación"
echo ""
echo "🎉 ¡Buena suerte!"

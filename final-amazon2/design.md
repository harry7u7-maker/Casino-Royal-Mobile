# Casino Royale Mobile - Diseño de Interfaz

## Descripción General

Una aplicación móvil de casino con juegos de azar virtuales. Los usuarios comienzan con un saldo inicial y pueden jugar diversos juegos para ganar o perder dinero virtual.

## Pantallas Principales

### 1. **Pantalla de Inicio (Home)**
- **Contenido Principal:**
  - Saldo actual del usuario (grande y prominente)
  - Botón "Jugar Ahora" destacado
  - Acceso rápido a los juegos disponibles
  - Historial reciente de ganancias/pérdidas

- **Funcionalidad:**
  - Mostrar el saldo en tiempo real
  - Acceso a todos los juegos desde aquí
  - Botón para ir a configuración/perfil

### 2. **Pantalla de Tragamonedas (Slots)**
- **Contenido Principal:**
  - Tres rodillos giratorios animados
  - Botón "Girar" prominente
  - Monto de apuesta seleccionable
  - Resultado de la tirada (ganancia/pérdida)
  - Saldo actualizado

- **Funcionalidad:**
  - Seleccionar cantidad de apuesta
  - Girar los rodillos
  - Mostrar resultado inmediatamente
  - Actualizar saldo

### 3. **Pantalla de Ruleta**
- **Contenido Principal:**
  - Rueda de ruleta animada
  - Opciones de apuesta (rojo/negro/número)
  - Monto de apuesta
  - Botón "Girar"
  - Resultado

- **Funcionalidad:**
  - Seleccionar tipo de apuesta
  - Seleccionar monto
  - Girar la ruleta
  - Mostrar resultado

### 4. **Pantalla de Blackjack**
- **Contenido Principal:**
  - Cartas del dealer
  - Cartas del jugador
  - Botones: "Pedir", "Plantarse", "Doblar"
  - Monto de apuesta
  - Resultado de la mano

- **Funcionalidad:**
  - Juego interactivo de blackjack
  - Tomar decisiones durante el juego
  - Mostrar resultado

### 5. **Pantalla de Perfil/Configuración**
- **Contenido Principal:**
  - Información del usuario
  - Saldo total
  - Estadísticas de juego
  - Opción para reiniciar saldo
  - Configuración de tema

- **Funcionalidad:**
  - Ver estadísticas
  - Cambiar tema (claro/oscuro)
  - Reiniciar saldo

## Flujos de Usuario Principales

### Flujo 1: Jugar Tragamonedas
1. Usuario en Inicio → Toca "Tragamonedas"
2. Pantalla de Tragamonedas se abre
3. Usuario selecciona apuesta
4. Usuario toca "Girar"
5. Rodillos giran (animación)
6. Resultado se muestra
7. Saldo se actualiza
8. Opción para jugar de nuevo o volver

### Flujo 2: Jugar Ruleta
1. Usuario en Inicio → Toca "Ruleta"
2. Pantalla de Ruleta se abre
3. Usuario selecciona tipo de apuesta (rojo/negro/número)
4. Usuario selecciona monto
5. Usuario toca "Girar"
6. Rueda gira (animación)
7. Resultado se muestra
8. Saldo se actualiza

### Flujo 3: Jugar Blackjack
1. Usuario en Inicio → Toca "Blackjack"
2. Pantalla de Blackjack se abre
3. Usuario selecciona apuesta
4. Juego comienza
5. Usuario toma decisiones (Pedir/Plantarse/Doblar)
6. Resultado se muestra
7. Saldo se actualiza

## Paleta de Colores

| Elemento | Color | Código |
|----------|-------|--------|
| Fondo Principal | Negro Profundo | #0a0e27 |
| Superficie de Cartas | Azul Oscuro | #1a2744 |
| Texto Principal | Blanco | #ffffff |
| Texto Secundario | Gris Claro | #a0a0a0 |
| Acento Primario | Oro | #d4af37 |
| Acento Secundario | Verde Éxito | #22c55e |
| Error/Pérdida | Rojo | #ef4444 |
| Borde | Oro Oscuro | #8b7500 |

## Componentes Reutilizables

- **BalanceDisplay**: Muestra el saldo actual
- **BetSelector**: Selector de cantidad de apuesta
- **GameButton**: Botón para acciones principales
- **ResultCard**: Muestra resultado de apuesta
- **GameCard**: Acceso a cada juego desde inicio

## Consideraciones de Diseño

- **Orientación**: Portrait (9:16)
- **Uso con una mano**: Todos los botones principales en la mitad inferior
- **Animaciones**: Suaves y rápidas (no más de 300ms)
- **Feedback**: Haptic feedback en apuestas y resultados
- **Accesibilidad**: Texto legible, contraste suficiente
- **Tema**: Casino elegante y sofisticado, inspirado en Las Vegas

import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import Animated, { 
  useSharedValue, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "casino_balance";
const SYMBOLS = ["🍒", "🍋", "🍊", "🎰", "💎", "👑"];
const SYMBOL_MULTIPLIERS: Record<string, number> = {
  "🍒": 1.5,
  "🍋": 2,
  "🍊": 2.5,
  "🎰": 3,
  "💎": 4,
  "👑": 5,
};

export default function SlotsScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState<{ message: string; amount: number; isWin: boolean } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
  const [totalWinnings, setTotalWinnings] = useState(0);

  // Animaciones para los rodillos
  const reel1Rotation = useSharedValue(0);
  const reel2Rotation = useSharedValue(0);
  const reel3Rotation = useSharedValue(0);
  
  // Animaciones para efectos especiales
  const winScale = useSharedValue(1);
  const winOpacity = useSharedValue(0);
  const betBoomScale = useSharedValue(0);
  const betBoomOpacity = useSharedValue(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
      } else {
        setBalance(1000);
        await AsyncStorage.setItem(STORAGE_KEY, "1000");
      }
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.error("Error saving balance:", error);
    }
  };

  const animateReel = async (reelIndex: number, targetRotation: number, delay: number) => {
    return new Promise((resolve) => {
      const rotation = reelIndex === 0 ? reel1Rotation : reelIndex === 1 ? reel2Rotation : reel3Rotation;
      
      setTimeout(() => {
        rotation.value = withTiming(targetRotation, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        }, () => resolve(null));
      }, delay);
    });
  };

  const triggerBetBoom = async () => {
    // Efecto de explosión de apuesta
    betBoomScale.value = 0;
    betBoomOpacity.value = 1;
    
    betBoomScale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withTiming(0.8, { duration: 200, easing: Easing.in(Easing.cubic) })
    );
    
    betBoomOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 200 })
    );

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const triggerWinAnimation = async () => {
    winScale.value = 1;
    winOpacity.value = 1;
    
    winScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(0.9, { duration: 200 })
      ),
      3,
      false
    );

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const spin = async () => {
    if (balance < bet || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Deducir apuesta
    const newBalance = balance - bet;
    await saveBalance(newBalance);

    // Trigger Bet Boom
    await triggerBetBoom();

    // Generar resultados
    const newReels = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
    setReels(newReels);

    // Animar rodillos con delays
    await Promise.all([
      animateReel(0, 360 * 5 + newReels[0] * 60, 0),
      animateReel(1, 360 * 5 + newReels[1] * 60, 150),
      animateReel(2, 360 * 5 + newReels[2] * 60, 300),
    ]);

    // Calcular ganancia
    const symbol1 = SYMBOLS[newReels[0]];
    const symbol2 = SYMBOLS[newReels[1]];
    const symbol3 = SYMBOLS[newReels[2]];

    let winnings = 0;
    let message = "¡Intenta de nuevo!";
    let isWin = false;

    if (symbol1 === symbol2 && symbol2 === symbol3) {
      // Jackpot - tres símbolos iguales
      const multiplier = SYMBOL_MULTIPLIERS[symbol1] || 2;
      winnings = Math.floor(bet * multiplier * 10);
      message = `¡JACKPOT! 🎉 ¡${symbol1}${symbol1}${symbol1}!`;
      isWin = true;
      await triggerWinAnimation();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (symbol1 === symbol2 || symbol2 === symbol3) {
      // Dos símbolos iguales
      const multiplier = SYMBOL_MULTIPLIERS[symbol1 === symbol2 ? symbol1 : symbol3] || 1.5;
      winnings = Math.floor(bet * multiplier * 3);
      message = `¡Ganaste! 🎊 ${winnings}`;
      isWin = true;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (newReels[0] === 0 || newReels[1] === 0 || newReels[2] === 0) {
      // Bonus por símbolo especial
      winnings = Math.floor(bet * 1.5);
      message = `¡Bonus! +${winnings}`;
      isWin = true;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isWin) {
      const finalBalance = newBalance + winnings;
      await saveBalance(finalBalance);
      setTotalWinnings(totalWinnings + winnings);
    }

    setResult({ message, amount: winnings, isWin });
    setIsSpinning(false);
  };

  const reel1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${reel1Rotation.value}deg` }],
  }));

  const reel2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${reel2Rotation.value}deg` }],
  }));

  const reel3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${reel3Rotation.value}deg` }],
  }));

  const winAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: winScale.value }],
    opacity: winOpacity.value,
  }));

  const betBoomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: betBoomScale.value }],
    opacity: betBoomOpacity.value,
  }));

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-slate-800">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-yellow-400">🎰 TRAGAMONEDAS</Text>
          <View className="w-8" />
        </View>

        {/* Saldo */}
        <View className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 mb-4">
          <Text className="text-slate-900 text-sm font-semibold">Tu Saldo</Text>
          <Text className="text-slate-900 text-3xl font-bold">${balance.toFixed(2)}</Text>
        </View>

        {/* Rodillos */}
        <View className="bg-slate-800 rounded-2xl p-6 mb-6 border-2 border-yellow-400">
          <View className="flex-row justify-around items-center mb-4">
            {/* Reel 1 */}
            <Animated.View style={[reel1AnimatedStyle]} className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-yellow-400">
              <Text className="text-4xl">{SYMBOLS[reels[0]]}</Text>
            </Animated.View>

            {/* Reel 2 */}
            <Animated.View style={[reel2AnimatedStyle]} className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-yellow-400">
              <Text className="text-4xl">{SYMBOLS[reels[1]]}</Text>
            </Animated.View>

            {/* Reel 3 */}
            <Animated.View style={[reel3AnimatedStyle]} className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-yellow-400">
              <Text className="text-4xl">{SYMBOLS[reels[2]]}</Text>
            </Animated.View>
          </View>

          {/* Bet Boom Effect */}
          <Animated.View style={[betBoomAnimatedStyle]} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Text className="text-6xl font-bold text-yellow-300">💥 BET BOOM!</Text>
          </Animated.View>
        </View>

        {/* Resultado */}
        {result && (
          <Animated.View style={[winAnimatedStyle]} className={cn(
            "rounded-lg p-4 mb-4 text-center",
            result.isWin ? "bg-green-500" : "bg-red-500"
          )}>
            <Text className="text-white text-lg font-bold">{result.message}</Text>
            {result.isWin && (
              <Text className="text-white text-2xl font-bold mt-2">+${result.amount}</Text>
            )}
          </Animated.View>
        )}

        {/* Controles de Apuesta */}
        <View className="bg-slate-700 rounded-lg p-4 mb-4">
          <Text className="text-white text-sm font-semibold mb-3">Apuesta</Text>
          <View className="flex-row gap-2 mb-3">
            {[5, 10, 25, 50, 100].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => setBet(amount)}
                className={cn(
                  "flex-1 py-2 rounded-lg",
                  bet === amount ? "bg-yellow-400" : "bg-slate-600"
                )}
              >
                <Text className={cn(
                  "text-center font-bold",
                  bet === amount ? "text-slate-900" : "text-white"
                )}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setBet(Math.max(1, bet - 5))}
              className="flex-1 bg-slate-600 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-bold">−</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Apuesta: ${bet}</Text>
            <TouchableOpacity
              onPress={() => setBet(Math.min(balance, bet + 5))}
              className="flex-1 bg-slate-600 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón Girar */}
        <TouchableOpacity
          onPress={spin}
          disabled={isSpinning || balance < bet}
          className={cn(
            "py-4 rounded-lg mb-4 border-2",
            isSpinning || balance < bet
              ? "bg-slate-600 border-slate-500 opacity-50"
              : "bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300"
          )}
        >
          <Text className={cn(
            "text-center text-xl font-bold",
            isSpinning || balance < bet ? "text-slate-400" : "text-slate-900"
          )}>
            {isSpinning ? "GIRANDO..." : "GIRAR"}
          </Text>
        </TouchableOpacity>

        {/* Estadísticas */}
        <View className="bg-slate-700 rounded-lg p-4">
          <Text className="text-white text-sm font-semibold mb-2">Estadísticas</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-slate-400 text-xs">Ganancias Totales</Text>
              <Text className="text-green-400 text-lg font-bold">${totalWinnings}</Text>
            </View>
            <View>
              <Text className="text-slate-400 text-xs">Apuesta Mínima</Text>
              <Text className="text-yellow-400 text-lg font-bold">$1</Text>
            </View>
            <View>
              <Text className="text-slate-400 text-xs">Multiplicador Máx</Text>
              <Text className="text-purple-400 text-lg font-bold">50x</Text>
            </View>
          </View>
        </View>

        {/* Información */}
        <View className="bg-slate-700 rounded-lg p-4 mt-4">
          <Text className="text-yellow-400 text-xs font-semibold mb-2">💡 CÓMO JUGAR</Text>
          <Text className="text-slate-300 text-xs leading-5">
            • 3 símbolos iguales = JACKPOT (hasta 50x){"\n"}
            • 2 símbolos iguales = Gana 3x{"\n"}
            • Símbolo especial 👑 = Bonus{"\n"}
            • Juega responsablemente
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

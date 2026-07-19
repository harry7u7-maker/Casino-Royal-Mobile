import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

const STORAGE_KEY = "casino_balance";
const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36

export default function RouletteScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [betType, setBetType] = useState<"red" | "black" | "number">("red");
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [result, setResult] = useState<{ message: string; amount: number; isWin: boolean } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
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

  const spin = async () => {
    if (balance < bet || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Deduct bet
    const newBalance = balance - bet;
    setBalance(newBalance);

    // Simulate spinning
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate winning number
    const winning = Math.floor(Math.random() * 37);
    setWinningNumber(winning);

    let winAmount = 0;
    let message = "¡Perdiste!";

    if (betType === "red" && redNumbers.includes(winning)) {
      winAmount = bet * 2;
      message = "¡Ganaste! Rojo 🔴";
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (betType === "black" && blackNumbers.includes(winning)) {
      winAmount = bet * 2;
      message = "¡Ganaste! Negro ⚫";
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (betType === "number" && winning === selectedNumber) {
      winAmount = bet * 36;
      message = `¡JACKPOT! Número ${winning} 🎉`;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    const finalBalance = newBalance + winAmount;
    saveBalance(finalBalance);

    setResult({
      message,
      amount: winAmount,
      isWin: winAmount > 0,
    });

    setIsSpinning(false);
  };

  const handleBack = () => {
    router.back();
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-green-600";
    return redNumbers.includes(num) ? "bg-red-600" : "bg-black";
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-lg font-bold text-primary">Ruleta</Text>
            <Text className="text-lg font-bold text-foreground">${balance.toFixed(2)}</Text>
          </View>

          {/* Game Area */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            {/* Winning Number Display */}
            {winningNumber !== null && (
              <View className={`rounded-lg p-4 ${getNumberColor(winningNumber)}`}>
                <Text className="text-white text-center text-2xl font-bold">{winningNumber}</Text>
              </View>
            )}

            {/* Result */}
            {result && (
              <View
                className={`rounded-lg p-4 ${
                  result.isWin ? "bg-success/20 border border-success" : "bg-error/20 border border-error"
                }`}
              >
                <Text className={`text-lg font-bold ${result.isWin ? "text-success" : "text-error"}`}>
                  {result.message}
                </Text>
                {result.amount > 0 && (
                  <Text className="text-success font-bold mt-1">+${result.amount.toFixed(2)}</Text>
                )}
              </View>
            )}

            {/* Bet Type Selector */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Tipo de Apuesta</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setBetType("red");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-1 py-2 rounded-lg ${
                    betType === "red" ? "bg-red-600" : "bg-surface border border-red-600"
                  }`}
                >
                  <Text className={`text-center font-semibold ${betType === "red" ? "text-white" : "text-red-600"}`}>
                    Rojo 🔴
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setBetType("black");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-1 py-2 rounded-lg ${
                    betType === "black" ? "bg-black" : "bg-surface border border-black"
                  }`}
                >
                  <Text className={`text-center font-semibold ${betType === "black" ? "text-white" : "text-black"}`}>
                    Negro ⚫
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Number Selector (if number bet) */}
            {betType === "number" && (
              <View className="gap-2">
                <Text className="text-sm text-muted">Selecciona un número (0-36)</Text>
                <View className="flex-row flex-wrap gap-1">
                  {NUMBERS.map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => {
                        setSelectedNumber(num);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        selectedNumber === num
                          ? "bg-primary border-2 border-primary"
                          : `${getNumberColor(num)} opacity-60`
                      }`}
                    >
                      <Text className={`font-bold ${selectedNumber === num ? "text-background" : "text-white"}`}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Bet Selector */}
            <View className="gap-2">
              <Text className="text-sm text-muted">Apuesta: ${bet.toFixed(2)}</Text>
              <View className="flex-row gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => {
                      if (amount <= balance) {
                        setBet(amount);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    disabled={amount > balance}
                    className={`flex-1 py-2 rounded-lg ${
                      bet === amount
                        ? "bg-primary"
                        : amount > balance
                          ? "bg-muted/30"
                          : "bg-surface border border-primary"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        bet === amount ? "text-background" : "text-foreground"
                      }`}
                    >
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Spin Button */}
            <TouchableOpacity
              onPress={spin}
              disabled={isSpinning || balance < bet}
              className={`py-4 rounded-lg ${
                isSpinning || balance < bet ? "bg-muted/50" : "bg-primary"
              }`}
            >
              <Text className={`text-center text-lg font-bold ${isSpinning ? "text-muted" : "text-background"}`}>
                {isSpinning ? "Girando..." : "GIRAR"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted text-center">
              Rojo/Negro: 2x tu apuesta | Número exacto: 36x tu apuesta
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

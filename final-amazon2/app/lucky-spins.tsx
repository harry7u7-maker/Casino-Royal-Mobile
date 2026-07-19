import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

interface LuckySpinReward {
  id: number;
  amount: number;
  multiplier: number;
  probability: number;
}

const REWARDS: LuckySpinReward[] = [
  { id: 1, amount: 10, multiplier: 1, probability: 30 },
  { id: 2, amount: 25, multiplier: 2.5, probability: 25 },
  { id: 3, amount: 50, multiplier: 5, probability: 20 },
  { id: 4, amount: 100, multiplier: 10, probability: 15 },
  { id: 5, amount: 250, multiplier: 25, probability: 8 },
  { id: 6, amount: 500, multiplier: 50, probability: 2 },
];

export default function LuckySpinsScreen() {
  const router = useRouter();
  const [remainingSpins, setRemainingSpins] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<LuckySpinReward | null>(null);
  const spinRotation = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    router.back();
  };

  const getRandomReward = (): LuckySpinReward => {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const reward of REWARDS) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        return reward;
      }
    }

    return REWARDS[0];
  };

  const handleSpin = () => {
    if (remainingSpins <= 0) {
      Alert.alert("Sin giros", "Vuelve mañana para más giros gratis. O mira un anuncio para conseguir más.");
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate spinning
    Animated.sequence([
      Animated.timing(spinRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const reward = getRandomReward();
      setLastReward(reward);
      setRemainingSpins(remainingSpins - 1);
      setIsSpinning(false);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("¡Ganaste!", `¡Felicidades! Ganaste $${reward.amount}`);
    });
  };

  const handleWatchAdForSpins = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Ver Anuncio",
      "Mira un anuncio de 30 segundos para obtener 3 giros gratis",
      [
        { text: "Cancelar" },
        {
          text: "Ver Anuncio",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setRemainingSpins(remainingSpins + 3);
            Alert.alert("¡Éxito!", "Se agregaron 3 giros gratis a tu cuenta");
          },
        },
      ]
    );
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
            <Text className="text-lg font-bold text-primary">Giros de Suerte</Text>
            <View className="w-6" />
          </View>

          {/* Spins Remaining */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 items-center gap-2">
            <Text className="text-sm text-background/80">Giros Disponibles</Text>
            <Text className="text-5xl font-bold text-background">{remainingSpins}</Text>
            <Text className="text-xs text-background/60">Gratis cada 24 horas</Text>
          </View>

          {/* Spin Wheel */}
          <View className="bg-surface rounded-2xl p-8 border border-border items-center gap-4">
            <View className="w-48 h-48 bg-primary/20 rounded-full items-center justify-center border-4 border-primary">
              <View className="items-center">
                <Text className="text-5xl mb-2">🎡</Text>
                <Text className="text-sm font-bold text-primary">Gira la Rueda</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSpin}
              disabled={isSpinning || remainingSpins <= 0}
              className={`w-full py-4 rounded-xl font-bold ${
                isSpinning || remainingSpins <= 0
                  ? "bg-muted/30"
                  : "bg-primary"
              }`}
            >
              <Text
                className={`text-center font-bold text-lg ${
                  isSpinning || remainingSpins <= 0
                    ? "text-muted"
                    : "text-background"
                }`}
              >
                {isSpinning ? "Girando..." : remainingSpins <= 0 ? "Sin Giros" : "GIRAR AHORA"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Last Reward */}
          {lastReward && (
            <View className="bg-success/20 border-2 border-success rounded-2xl p-4 gap-2">
              <Text className="text-sm font-bold text-success">Último Giro</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl">🎉</Text>
                <Text className="text-2xl font-bold text-success">${lastReward.amount}</Text>
              </View>
            </View>
          )}

          {/* Watch Ad for More Spins */}
          <View className="bg-primary/10 border-2 border-primary rounded-2xl p-4 gap-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">📺</Text>
              <Text className="font-bold text-primary flex-1">Ver Anuncio = 3 Giros</Text>
            </View>
            <Text className="text-xs text-muted">
              Mira un anuncio rápido para obtener 3 giros adicionales sin costo.
            </Text>
            <TouchableOpacity
              onPress={handleWatchAdForSpins}
              className="bg-primary py-3 rounded-lg"
            >
              <Text className="text-center font-bold text-background">Ver Anuncio Ahora</Text>
            </TouchableOpacity>
          </View>

          {/* Rewards Table */}
          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">PREMIOS POSIBLES</Text>

            <View className="bg-surface rounded-2xl border border-border overflow-hidden">
              {REWARDS.map((reward, idx) => (
                <View
                  key={reward.id}
                  className={`p-3 flex-row items-center justify-between ${
                    idx !== REWARDS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg">
                      {reward.probability >= 25 ? "⭐" : reward.probability >= 10 ? "✨" : "💎"}
                    </Text>
                    <Text className="text-sm text-foreground">${reward.amount}</Text>
                  </View>
                  <Text className="text-xs text-muted">{reward.probability}% probabilidad</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
            <Text className="text-xs text-muted">
              💡 Los giros de suerte se reinician cada 24 horas. Mira anuncios para obtener más giros sin límite.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

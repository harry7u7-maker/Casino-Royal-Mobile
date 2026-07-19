import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Ganador del Día",
    description: "Gana $500 en un día",
    progress: 350,
    target: 500,
    reward: 100,
    completed: false,
  },
  {
    id: 2,
    title: "Maestro de Tragamonedas",
    description: "Juega 50 rondas de tragamonedas",
    progress: 42,
    target: 50,
    reward: 200,
    completed: false,
  },
  {
    id: 3,
    title: "Racha de Oro",
    description: "Gana 5 juegos consecutivos",
    progress: 3,
    target: 5,
    reward: 150,
    completed: false,
  },
  {
    id: 4,
    title: "Jugador Social",
    description: "Comparte la app con 3 amigos",
    progress: 1,
    target: 3,
    reward: 250,
    completed: false,
  },
];

export default function BonusesScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(7);
  const [dailyBonus, setDailyBonus] = useState(50);
  const [bonusCollected, setBonusCollected] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleClaimDaily = () => {
    if (bonusCollected) {
      Alert.alert("Ya reclamado", "Vuelve mañana para reclamar tu bonificación diaria");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBonusCollected(true);
    Alert.alert("¡Éxito!", `Bonificación de $${dailyBonus} agregada a tu billetera`);
  };

  const handleChallengePress = (challenge: Challenge) => {
    if (challenge.completed) {
      Alert.alert("Completado", "Ya completaste este desafío");
      return;
    }

    const progress = Math.round((challenge.progress / challenge.target) * 100);
    Alert.alert(
      challenge.title,
      `Progreso: ${progress}%\n\nRecompensa: $${challenge.reward}`,
      [{ text: "OK" }]
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
            <Text className="text-lg font-bold text-primary">Bonificaciones</Text>
            <View className="w-6" />
          </View>

          {/* Daily Bonus Card */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 gap-4">
            <View className="gap-2">
              <Text className="text-sm text-background/80">Bonificación Diaria</Text>
              <Text className="text-4xl font-bold text-background">${dailyBonus}</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🔥</Text>
              <Text className="text-background font-semibold">Racha: {streak} días</Text>
            </View>

            <TouchableOpacity
              onPress={handleClaimDaily}
              disabled={bonusCollected}
              className={`py-3 rounded-lg ${bonusCollected ? "bg-background/30" : "bg-background"}`}
            >
              <Text className={`text-center font-bold ${bonusCollected ? "text-background/60" : "text-primary"}`}>
                {bonusCollected ? "Ya Reclamado Hoy" : "Reclamar Ahora"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Streak Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            <Text className="font-bold text-foreground">¿Cómo funciona la racha?</Text>
            <Text className="text-sm text-muted leading-relaxed">
              Reclama tu bonificación diaria cada día para mantener tu racha. Cada día consecutivo aumenta tu bonificación un 10%.
            </Text>
            <View className="flex-row gap-2">
              <Text className="text-lg">💡</Text>
              <Text className="text-xs text-muted flex-1">
                Si pierdes la racha, vuelve a empezar. ¡Pero los bonos se reinician cada semana!
              </Text>
            </View>
          </View>

          {/* Challenges Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Desafíos Activos</Text>

            {MOCK_CHALLENGES.map((challenge) => {
              const progress = Math.round((challenge.progress / challenge.target) * 100);
              return (
                <TouchableOpacity
                  key={challenge.id}
                  onPress={() => handleChallengePress(challenge)}
                  className={`rounded-2xl p-4 border-2 ${
                    challenge.completed ? "bg-success/10 border-success" : "bg-surface border-border"
                  }`}
                >
                  <View className="gap-3">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-bold text-foreground">{challenge.title}</Text>
                        <Text className="text-xs text-muted mt-1">{challenge.description}</Text>
                      </View>
                      <View className="bg-primary/20 px-3 py-1 rounded-full">
                        <Text className="text-xs font-bold text-primary">${challenge.reward}</Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="gap-2">
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </View>
                      <Text className="text-xs text-muted">
                        {challenge.progress}/{challenge.target} ({progress}%)
                      </Text>
                    </View>

                    {challenge.completed && (
                      <View className="bg-success/20 px-3 py-2 rounded-lg">
                        <Text className="text-xs font-bold text-success text-center">✓ Completado</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* VIP Info */}
          <View className="bg-primary/10 border border-primary rounded-2xl p-4 gap-2">
            <Text className="font-bold text-primary">💎 Suscripción VIP</Text>
            <Text className="text-sm text-muted">
              Desbloquea bonificaciones exclusivas, desafíos especiales y multiplicadores de ganancias.
            </Text>
            <TouchableOpacity className="bg-primary py-2 rounded-lg mt-2">
              <Text className="text-center font-bold text-background text-sm">Ver Planes VIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

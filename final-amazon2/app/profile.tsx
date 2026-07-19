import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const STORAGE_KEY = "casino_balance";
const INITIAL_BALANCE = 1000;

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalWinnings: 0,
    totalLosses: 0,
  });

  useEffect(() => {
    loadBalance();
    loadStats();
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

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem("casino_stats");
      if (savedStats !== null) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const resetBalance = () => {
    Alert.alert("Confirmar", "¿Deseas reiniciar tu saldo a $1000?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Reiniciar",
        onPress: async () => {
          try {
            await AsyncStorage.setItem(STORAGE_KEY, INITIAL_BALANCE.toString());
            setBalance(INITIAL_BALANCE);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (error) {
            console.error("Error resetting balance:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-lg font-bold text-primary">Perfil</Text>
            <View className="w-6" />
          </View>

          {/* Balance Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-2">
            <Text className="text-sm text-muted">Tu Saldo Actual</Text>
            <Text className="text-4xl font-bold text-primary">${balance.toFixed(2)}</Text>
            <Text className="text-xs text-muted mt-2">
              {balance > INITIAL_BALANCE
                ? `+$${(balance - INITIAL_BALANCE).toFixed(2)} desde el inicio`
                : balance < INITIAL_BALANCE
                  ? `-$${(INITIAL_BALANCE - balance).toFixed(2)} desde el inicio`
                  : "Saldo inicial"}
            </Text>
          </View>

          {/* Statistics */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Estadísticas</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border flex-row justify-between">
              <View>
                <Text className="text-xs text-muted">Juegos Jugados</Text>
                <Text className="text-2xl font-bold text-foreground mt-1">{stats.gamesPlayed}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Ganancias Totales</Text>
                <Text className="text-2xl font-bold text-success mt-1">${stats.totalWinnings.toFixed(2)}</Text>
              </View>
              <View>
                <Text className="text-xs text-muted">Pérdidas Totales</Text>
                <Text className="text-2xl font-bold text-error mt-1">${stats.totalLosses.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Configuración</Text>

            {/* Theme Setting */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View>
                <Text className="text-foreground font-semibold">Tema</Text>
                <Text className="text-xs text-muted mt-1">
                  {colorScheme === "dark" ? "Oscuro 🌙" : "Claro ☀️"}
                </Text>
              </View>
              <Text className="text-lg">{colorScheme === "dark" ? "🌙" : "☀️"}</Text>
            </View>

            {/* Sound Setting */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View>
                <Text className="text-foreground font-semibold">Sonidos</Text>
                <Text className="text-xs text-muted mt-1">Activados 🔊</Text>
              </View>
              <Text className="text-lg">🔊</Text>
            </View>

            {/* Haptics Setting */}
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between">
              <View>
                <Text className="text-foreground font-semibold">Vibración</Text>
                <Text className="text-xs text-muted mt-1">Activada 📳</Text>
              </View>
              <Text className="text-lg">📳</Text>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={resetBalance}
              className="bg-warning/20 border border-warning rounded-2xl p-4"
            >
              <Text className="text-center font-bold text-warning">Reiniciar Saldo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBack}
              className="bg-primary rounded-2xl p-4"
            >
              <Text className="text-center font-bold text-background">Volver al Inicio</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted text-center leading-relaxed">
              Casino Royale v1.0.0{"\n"}
              Juega responsablemente. Recuerda que el juego es solo para entretenimiento.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

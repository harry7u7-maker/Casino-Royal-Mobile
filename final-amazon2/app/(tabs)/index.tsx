import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

const INITIAL_BALANCE = 1000;
const STORAGE_KEY = "casino_balance";

export default function HomeScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyBonusCollected, setDailyBonusCollected] = useState(false);
  const [streak, setStreak] = useState(7);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGamePress = (gameName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`../games/${gameName}`);
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../profile");
  };

  const handleClaimDailyBonus = () => {
    if (dailyBonusCollected) {
      Alert.alert("Ya reclamado", "Vuelve mañana para reclamar tu bonificación");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDailyBonusCollected(true);
    setBalance(balance + 50);
    Alert.alert("¡Éxito!", "Bonificación de $50 agregada a tu billetera");
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">Cargando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header with Balance */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">Tu Saldo</Text>
              <Text className="text-4xl font-bold text-primary">${balance.toFixed(2)}</Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/wallet");
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface rounded-full p-3 border border-border">
                  <Text className="text-xl">💰</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/shop");
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface rounded-full p-3 border border-border">
                  <Text className="text-xl">🛍️</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={handleProfilePress}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface rounded-full p-3 border border-border">
                  <Text className="text-xl">⚙️</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Daily Bonus Banner */}
          <TouchableOpacity
            onPress={handleClaimDailyBonus}
            disabled={dailyBonusCollected}
            className={`rounded-2xl p-4 border-2 ${
              dailyBonusCollected
                ? "bg-muted/20 border-muted"
                : "bg-gradient-to-r from-primary to-primary/80 border-primary"
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">🎁</Text>
                <View>
                  <Text className={`font-bold ${dailyBonusCollected ? "text-muted" : "text-background"}`}>
                    Bonificación Diaria
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Text className="text-lg">🔥</Text>
                    <Text className={`text-sm ${dailyBonusCollected ? "text-muted" : "text-background/80"}`}>
                      Racha: {streak} días
                    </Text>
                  </View>
                </View>
              </View>
              <View className="items-end">
                <Text className={`text-2xl font-bold ${dailyBonusCollected ? "text-muted" : "text-background"}`}>
                  +$50
                </Text>
                <Text className={`text-xs ${dailyBonusCollected ? "text-muted" : "text-background/60"}`}>
                  {dailyBonusCollected ? "Reclamado" : "Reclamar"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Quick Access Section */}
          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">ACCESO RÁPIDO</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.push("/bonuses")}
                className="flex-1 bg-surface rounded-xl p-3 border border-border items-center gap-1"
              >
                <Text className="text-2xl">🏆</Text>
                <Text className="text-xs font-bold text-foreground">Desafíos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/leaderboard")}
                className="flex-1 bg-surface rounded-xl p-3 border border-border items-center gap-1"
              >
                <Text className="text-2xl">📊</Text>
                <Text className="text-xs font-bold text-foreground">Top 10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/vip-store")}
                className="flex-1 bg-surface rounded-xl p-3 border border-border items-center gap-1"
              >
                <Text className="text-2xl">💎</Text>
                <Text className="text-xs font-bold text-foreground">VIP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/payment-methods")}
                className="flex-1 bg-surface rounded-xl p-3 border border-border items-center gap-1"
              >
                <Text className="text-2xl">💳</Text>
                <Text className="text-xs font-bold text-foreground">Depósito</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Games Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Juegos Disponibles</Text>

            {/* Slots Game */}
            <Pressable
              onPress={() => handleGamePress("slots")}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-surface rounded-2xl p-5 border border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-4xl">🎰</Text>
                    <View>
                      <Text className="text-lg font-bold text-primary">Tragamonedas</Text>
                      <Text className="text-xs text-muted">Gira y gana hasta 5x</Text>
                    </View>
                  </View>
                  <View className="bg-primary/20 px-2 py-1 rounded">
                    <Text className="text-xs font-bold text-primary">→</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Roulette Game */}
            <Pressable
              onPress={() => handleGamePress("roulette")}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-surface rounded-2xl p-5 border border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-4xl">🎡</Text>
                    <View>
                      <Text className="text-lg font-bold text-primary">Ruleta</Text>
                      <Text className="text-xs text-muted">Apuesta y gana 2x-36x</Text>
                    </View>
                  </View>
                  <View className="bg-primary/20 px-2 py-1 rounded">
                    <Text className="text-xs font-bold text-primary">→</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Blackjack Game */}
            <Pressable
              onPress={() => handleGamePress("blackjack")}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-surface rounded-2xl p-5 border border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-4xl">🃏</Text>
                    <View>
                      <Text className="text-lg font-bold text-primary">Blackjack</Text>
                      <Text className="text-xs text-muted">Llega a 21 y gana 1.5x</Text>
                    </View>
                  </View>
                  <View className="bg-primary/20 px-2 py-1 rounded">
                    <Text className="text-xs font-bold text-primary">→</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Promotional Banner */}
          <View className="bg-primary/10 border-2 border-primary rounded-2xl p-4 gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🚀</Text>
              <Text className="font-bold text-primary flex-1">¡Invita amigos y gana!</Text>
            </View>
            <Text className="text-xs text-muted">
              Comparte tu código de referido y recibe bonificaciones por cada amigo que se una.
            </Text>
            <TouchableOpacity className="bg-primary py-2 rounded-lg mt-2">
              <Text className="text-center font-bold text-background text-sm">Compartir Código</Text>
            </TouchableOpacity>
          </View>

          {/* Responsible Gaming Footer */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xs text-muted text-center leading-relaxed">
              ⚠️ Juega responsablemente. Si tienes problemas con el juego, busca ayuda en gamblingtherapy.org
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

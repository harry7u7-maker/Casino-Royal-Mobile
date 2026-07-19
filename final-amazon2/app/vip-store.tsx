import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

interface VIPTier {
  name: string;
  price: number;
  dailyBonus: number;
  betMultiplier: number;
  features: string[];
  color: string;
  icon: string;
}

const VIP_TIERS: VIPTier[] = [
  {
    name: "Silver",
    price: 4.99,
    dailyBonus: 50,
    betMultiplier: 1.1,
    features: [
      "Bonificación diaria de $50",
      "Multiplicador de apuestas 1.1x",
      "Acceso a desafíos VIP",
      "Soporte prioritario",
    ],
    color: "#C0C0C0",
    icon: "🟡",
  },
  {
    name: "Gold",
    price: 9.99,
    dailyBonus: 100,
    betMultiplier: 1.25,
    features: [
      "Bonificación diaria de $100",
      "Multiplicador de apuestas 1.25x",
      "Acceso a desafíos VIP",
      "Giros gratis diarios",
      "Soporte prioritario",
      "Retirada sin comisión",
    ],
    color: "#FFD700",
    icon: "🟢",
  },
  {
    name: "Platinum",
    price: 19.99,
    dailyBonus: 250,
    betMultiplier: 1.5,
    features: [
      "Bonificación diaria de $250",
      "Multiplicador de apuestas 1.5x",
      "Acceso a desafíos VIP exclusivos",
      "Giros gratis ilimitados",
      "Soporte 24/7 dedicado",
      "Retirada sin comisión",
      "Acceso a juegos exclusivos",
      "Cashback del 5%",
    ],
    color: "#E5E4E2",
    icon: "🔵",
  },
];

const COSMETICS = [
  {
    id: 1,
    name: "Tema Neon",
    type: "theme",
    price: 2.99,
    icon: "🌈",
    description: "Colores vibrantes y futuristas",
  },
  {
    id: 2,
    name: "Avatar Dorado",
    type: "avatar",
    price: 1.99,
    icon: "👑",
    description: "Avatar exclusivo dorado",
  },
  {
    id: 3,
    name: "Efecto Fuego",
    type: "effect",
    price: 0.99,
    icon: "🔥",
    description: "Efectos de fuego en las ganancias",
  },
  {
    id: 4,
    name: "Animación Rápida",
    type: "animation",
    price: 1.99,
    icon: "⚡",
    description: "Animaciones más rápidas",
  },
];

export default function VIPStoreScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"vip" | "cosmetics">("vip");
  const [currentVIP, setCurrentVIP] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleVIPPurchase = (tier: VIPTier) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `Suscribirse a ${tier.name}`,
      `$${tier.price}/mes\n\nBonificación diaria: $${tier.dailyBonus}\nMultiplicador: ${tier.betMultiplier}x`,
      [
        { text: "Cancelar" },
        {
          text: "Suscribirse",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCurrentVIP(tier.name);
            Alert.alert("¡Éxito!", `Suscripción a ${tier.name} activada`);
          },
        },
      ]
    );
  };

  const handleCosmeticPurchase = (cosmetic: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `Comprar ${cosmetic.name}`,
      `Precio: $${cosmetic.price}`,
      [
        { text: "Cancelar" },
        {
          text: "Comprar",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("¡Éxito!", `${cosmetic.name} agregado a tu inventario`);
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
            <Text className="text-lg font-bold text-primary">Tienda Premium</Text>
            <View className="w-6" />
          </View>

          {/* Tab Selector */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedTab("vip")}
              className={`flex-1 py-2 rounded-lg border ${
                selectedTab === "vip"
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-center font-bold text-sm ${
                  selectedTab === "vip" ? "text-background" : "text-foreground"
                }`}
              >
                💎 VIP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTab("cosmetics")}
              className={`flex-1 py-2 rounded-lg border ${
                selectedTab === "cosmetics"
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-center font-bold text-sm ${
                  selectedTab === "cosmetics" ? "text-background" : "text-foreground"
                }`}
              >
                🎨 Cosméticos
              </Text>
            </TouchableOpacity>
          </View>

          {/* VIP Tiers */}
          {selectedTab === "vip" && (
            <View className="gap-4">
              {VIP_TIERS.map((tier) => (
                <View
                  key={tier.name}
                  className={`rounded-2xl p-4 border-2 ${
                    currentVIP === tier.name
                      ? "bg-primary/20 border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <View className="gap-3">
                    {/* Header */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-2xl">{tier.icon}</Text>
                        <View>
                          <Text className="font-bold text-foreground">{tier.name}</Text>
                          <Text className="text-xs text-muted">${tier.price}/mes</Text>
                        </View>
                      </View>
                      {currentVIP === tier.name && (
                        <View className="bg-success px-3 py-1 rounded-full">
                          <Text className="text-xs font-bold text-background">Activo</Text>
                        </View>
                      )}
                    </View>

                    {/* Benefits */}
                    <View className="bg-background/30 rounded-lg p-3 gap-2">
                      {tier.features.map((feature, idx) => (
                        <View key={idx} className="flex-row gap-2">
                          <Text className="text-sm">✓</Text>
                          <Text className="text-sm text-muted flex-1">{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Button */}
                    {currentVIP !== tier.name && (
                      <TouchableOpacity
                        onPress={() => handleVIPPurchase(tier)}
                        className="bg-primary py-3 rounded-lg"
                      >
                        <Text className="text-center font-bold text-background">
                          Suscribirse Ahora
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Cosmetics */}
          {selectedTab === "cosmetics" && (
            <View className="gap-3">
              {COSMETICS.map((cosmetic) => (
                <TouchableOpacity
                  key={cosmetic.id}
                  onPress={() => handleCosmeticPurchase(cosmetic)}
                  className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-3xl">{cosmetic.icon}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-foreground">{cosmetic.name}</Text>
                      <Text className="text-xs text-muted">{cosmetic.description}</Text>
                    </View>
                  </View>
                  <View className="bg-primary/20 px-3 py-2 rounded-lg">
                    <Text className="font-bold text-primary text-sm">${cosmetic.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Info */}
          <View className="bg-primary/10 border border-primary rounded-2xl p-4 gap-2">
            <Text className="text-xs text-primary font-bold">💡 CONSEJO</Text>
            <Text className="text-xs text-muted">
              Los planes VIP se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu perfil.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

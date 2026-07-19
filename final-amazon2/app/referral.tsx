import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert, Share } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

interface ReferralStats {
  code: string;
  referrals: number;
  totalEarned: number;
  pendingBonus: number;
}

const SOCIAL_PLATFORMS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    bonus: 50,
    color: "#25D366",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    bonus: 75,
    color: "#1877F2",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    bonus: 75,
    color: "#E4405F",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    bonus: 100,
    color: "#000000",
  },
];

export default function ReferralScreen() {
  const router = useRouter();
  const [stats] = useState<ReferralStats>({
    code: "CASINO2024",
    referrals: 12,
    totalEarned: 900,
    pendingBonus: 150,
  });

  const handleBack = () => {
    router.back();
  };

  const handleShare = async (platform: typeof SOCIAL_PLATFORMS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const message = `🎰 ¡Únete a Casino Royale! Usa mi código ${stats.code} y obtén $50 de bonificación. ¡Gana dinero jugando! 💰 ${
      platform.id === "whatsapp" || platform.id === "facebook"
        ? "https://casino-royale.app/download"
        : ""
    }`;

    try {
      await Share.share({
        message,
        title: "Casino Royale",
        url: "https://casino-royale.app/download",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("¡Éxito!", `Compartido en ${platform.name}`);
    } catch (error) {
      console.error("Share error:", error);
    }
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
            <Text className="text-lg font-bold text-primary">Programa de Referidos</Text>
            <View className="w-6" />
          </View>

          {/* Referral Code Card */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 gap-4">
            <View className="gap-2">
              <Text className="text-sm text-background/80">Tu Código de Referido</Text>
              <Text className="text-3xl font-bold text-background">{stats.code}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Copiado", "Código copiado al portapapeles");
              }}
              className="bg-background/20 py-2 rounded-lg"
            >
              <Text className="text-center font-bold text-background">Copiar Código</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="grid grid-cols-2 gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Referidos</Text>
              <Text className="text-3xl font-bold text-primary">{stats.referrals}</Text>
              <Text className="text-xs text-muted mt-1">personas invitadas</Text>
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Ganancias</Text>
              <Text className="text-3xl font-bold text-success">${stats.totalEarned}</Text>
              <Text className="text-xs text-muted mt-1">total ganado</Text>
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border col-span-2">
              <Text className="text-xs text-muted mb-2">Bonificación Pendiente</Text>
              <Text className="text-2xl font-bold text-warning">${stats.pendingBonus}</Text>
              <Text className="text-xs text-muted mt-1">se agregará cuando se verifique</Text>
            </View>
          </View>

          {/* Share Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Comparte en Redes Sociales</Text>

            {SOCIAL_PLATFORMS.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                onPress={() => handleShare(platform)}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-3xl">{platform.icon}</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-foreground">{platform.name}</Text>
                    <Text className="text-xs text-muted">Comparte tu código</Text>
                  </View>
                </View>

                <View className="bg-primary/20 px-3 py-1 rounded-full">
                  <Text className="text-xs font-bold text-primary">+${platform.bonus}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* How It Works */}
          <View className="bg-primary/10 border border-primary rounded-2xl p-4 gap-3">
            <Text className="font-bold text-primary">¿Cómo funciona?</Text>

            <View className="gap-2">
              <View className="flex-row gap-2">
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-background">1</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Comparte tu código con amigos</Text>
              </View>

              <View className="flex-row gap-2">
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-background">2</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Ellos se registran con tu código</Text>
              </View>

              <View className="flex-row gap-2">
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-background">3</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Ambos reciben bonificación</Text>
              </View>

              <View className="flex-row gap-2">
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-background">4</Text>
                </View>
                <Text className="text-sm text-muted flex-1">Sin límite de referidos</Text>
              </View>
            </View>
          </View>

          {/* Bonus Tiers */}
          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">BONIFICACIÓN POR NIVEL</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">5-10 referidos</Text>
                <Text className="font-bold text-primary">+$100 bonus</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">11-25 referidos</Text>
                <Text className="font-bold text-primary">+$250 bonus</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">26+ referidos</Text>
                <Text className="font-bold text-primary">+$500 bonus</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

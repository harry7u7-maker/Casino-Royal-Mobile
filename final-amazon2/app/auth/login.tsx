import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    router.replace("/(tabs)");
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const redirectUrl = Linking.createURL("oauth/callback");
      const authUrl = `https://auth.manus.im/authorize?redirect_uri=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === "success") {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAge = () => {
    if (!dateOfBirth) {
      Alert.alert("Error", "Please enter your date of birth");
      return;
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (age < 18) {
      Alert.alert("Age Verification", "You must be 18 or older to use Casino Royale");
      return;
    }

    handleLogin();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-5xl">🎰</Text>
            <Text className="text-3xl font-bold text-primary">Casino Royale</Text>
            <Text className="text-sm text-muted text-center">
              La mejor experiencia de casino en tu bolsillo
            </Text>
          </View>

          {/* Info Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-bold text-foreground">Bienvenido</Text>
            <Text className="text-sm text-muted leading-relaxed">
              Casino Royale es una plataforma de juegos de casino con dinero virtual. Juega, gana y disfruta de la mejor experiencia de entretenimiento.
            </Text>
          </View>

          {/* Age Verification */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-lg font-bold text-foreground">Verificación de Edad</Text>
            <Text className="text-sm text-muted">
              Debes tener 18 años o más para usar esta aplicación.
            </Text>

            <View className="gap-2">
              <Text className="text-sm text-muted">Fecha de Nacimiento (YYYY-MM-DD)</Text>
              <TextInput
                placeholder="1990-01-15"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholderTextColor="#a0a0a0"
                className="bg-background rounded-lg px-4 py-3 text-foreground border border-border"
              />
            </View>

            <TouchableOpacity
              onPress={verifyAge}
              disabled={isLoading}
              className={`py-3 rounded-lg ${isLoading ? "bg-muted/50" : "bg-primary"}`}
            >
              <Text className={`text-center font-bold ${isLoading ? "text-muted" : "text-background"}`}>
                {isLoading ? "Verificando..." : "Continuar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Características</Text>

            <View className="flex-row gap-3">
              <Text className="text-2xl">🎮</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Múltiples Juegos</Text>
                <Text className="text-xs text-muted">Slots, Ruleta, Blackjack y más</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Text className="text-2xl">💰</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Gana Dinero Real</Text>
                <Text className="text-xs text-muted">Retira tus ganancias vía PayPal</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Text className="text-2xl">🎁</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Bonificaciones</Text>
                <Text className="text-xs text-muted">Referidos y promociones diarias</Text>
              </View>
            </View>
          </View>

          {/* Legal Notice */}
          <View className="bg-warning/10 border border-warning rounded-lg p-4">
            <Text className="text-xs text-warning text-center leading-relaxed">
              Juega responsablemente. Casino Royale cumple con todas las regulaciones mexicanas. Prohibido para menores de 18 años.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

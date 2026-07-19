import { ScrollView, Text, View, TouchableOpacity, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

interface PaymentMethod {
  id: number;
  provider: "paypal" | "santander" | "openbank" | "mercadopago" | "nubank" | "clip";
  accountNumber?: string;
  accountEmail?: string;
  isDefault: number;
}

const PAYMENT_PROVIDERS = [
  {
    id: "paypal",
    name: "PayPal",
    icon: "🅿️",
    description: "Tarjetas internacionales y billetera",
    color: "#003087",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    icon: "💰",
    description: "Billetera digital y tarjetas",
    color: "#3483FA",
  },
  {
    id: "nubank",
    name: "Nubank",
    icon: "💜",
    description: "Billetera digital Nubank",
    color: "#820AD1",
  },
  {
    id: "clip",
    name: "Clip",
    icon: "💳",
    description: "Pagos con tarjeta Clip",
    color: "#FF6B00",
  },
  {
    id: "santander",
    name: "Santander Banca Móvil",
    icon: "🏦",
    description: "Transferencia bancaria directa",
    color: "#E31B23",
  },
  {
    id: "openbank",
    name: "Open Bank",
    icon: "🏛️",
    description: "Transferencia bancaria",
    color: "#FF6B00",
  },
];

export default function PaymentMethodsExtendedScreen() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSelectMethod = async (provider: string) => {
    setSelectedProvider(provider);
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const providerName = PAYMENT_PROVIDERS.find(p => p.id === provider)?.name || provider;
      Alert.alert(
        `Configurar ${providerName}`,
        `Se abrirá la aplicación de ${providerName} para completar la configuración.`,
        [
          { text: "Cancelar", onPress: () => setIsProcessing(false) },
          {
            text: "Continuar",
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Éxito", "Método de pago agregado correctamente");
              setIsProcessing(false);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la solicitud");
      console.error("Setup error:", error);
    } finally {
      setIsProcessing(false);
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
            <Text className="text-lg font-bold text-primary">Todos los Métodos</Text>
            <View className="w-6" />
          </View>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm text-muted text-center">
              Selecciona tu método de pago preferido para agregar fondos a tu billetera.
            </Text>
          </View>

          {/* Payment Methods */}
          <View className="gap-3">
            {PAYMENT_PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                onPress={() => handleSelectMethod(provider.id)}
                disabled={isProcessing && selectedProvider === provider.id}
                className={`rounded-2xl p-4 border-2 ${
                  isProcessing && selectedProvider === provider.id
                    ? "bg-muted/20 border-muted"
                    : "bg-surface border-border"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-3xl">{provider.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">{provider.name}</Text>
                      <Text className="text-xs text-muted mt-1">{provider.description}</Text>
                    </View>
                  </View>

                  {isProcessing && selectedProvider === provider.id ? (
                    <ActivityIndicator size="small" color="#d4af37" />
                  ) : (
                    <Text className="text-xl">→</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Features */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            <Text className="font-bold text-foreground">¿Por qué múltiples métodos?</Text>

            <View className="flex-row gap-2">
              <Text className="text-lg">✓</Text>
              <Text className="text-sm text-muted flex-1">
                Elige el método más conveniente para ti
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Text className="text-lg">✓</Text>
              <Text className="text-sm text-muted flex-1">
                Transacciones rápidas y seguras
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Text className="text-lg">✓</Text>
              <Text className="text-sm text-muted flex-1">
                Comisiones competitivas
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Text className="text-lg">✓</Text>
              <Text className="text-sm text-muted flex-1">
                Soporte 24/7
              </Text>
            </View>
          </View>

          {/* Security Notice */}
          <View className="bg-success/10 border border-success rounded-lg p-4">
            <Text className="text-xs text-success text-center leading-relaxed">
              🔒 Todos tus datos están protegidos con encriptación de nivel bancario. Tus pagos son seguros y verificados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

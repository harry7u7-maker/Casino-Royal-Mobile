import { ScrollView, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { trackConversion } from "@/lib/google-ads-tracking";

interface ChipPackage {
  id: number;
  name: string;
  chips: number;
  priceInDollars: string;
  bonus: number;
  isActive: number;
}

export default function ShopScreen() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<ChipPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: packages, isLoading } = trpc.chipPackages.list.useQuery();
  const paypalMutation = trpc.paypal.createOrder.useMutation();

  const handleBuyChips = async (pkg: ChipPackage) => {
    setSelectedPackage(pkg);
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await paypalMutation.mutateAsync({
        packageId: pkg.id,
        amount: pkg.priceInDollars,
      });

      // In a real app, this would redirect to PayPal
      // For now, we'll show a success message
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Track conversion event for Google Ads
      trackConversion({
        transactionId: `order-${pkg.id}-${Date.now()}`,
        value: parseFloat(pkg.priceInDollars),
        currency: "USD",
      });
    } catch (error) {
      console.error("Purchase error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#d4af37" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-lg font-bold text-primary">Tienda de Fichas</Text>
            <View className="w-6" />
          </View>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm text-muted text-center">
              Compra fichas y juega con dinero real. Tus ganancias se acumulan en tu billetera.
            </Text>
          </View>

          {/* Chip Packages */}
          <View className="gap-3">
            {packages?.map((pkg) => (
              <View key={pkg.id} className="bg-surface rounded-2xl p-4 border border-border gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-primary">{pkg.name}</Text>
                    <Text className="text-2xl font-bold text-foreground mt-1">
                      {pkg.chips.toLocaleString()} 🪙
                    </Text>
                    {pkg.bonus > 0 && (
                      <Text className="text-sm text-success mt-1">
                        + {pkg.bonus} bonus fichas
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-primary">
                      ${parseFloat(pkg.priceInDollars).toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">USD</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleBuyChips(pkg)}
                  disabled={isProcessing && selectedPackage?.id === pkg.id}
                  className={`py-3 rounded-lg ${
                    isProcessing && selectedPackage?.id === pkg.id
                      ? "bg-muted/50"
                      : "bg-primary"
                  }`}
                >
                  <Text className={`text-center font-bold ${
                    isProcessing && selectedPackage?.id === pkg.id
                      ? "text-muted"
                      : "text-background"
                  }`}>
                    {isProcessing && selectedPackage?.id === pkg.id
                      ? "Procesando..."
                      : "Comprar con PayPal"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Payment Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            <Text className="font-bold text-foreground">Métodos de Pago Disponibles</Text>
            <Text className="text-sm text-muted">✓ PayPal</Text>
            <Text className="text-sm text-muted">✓ Santander Banca Móvil</Text>
            <Text className="text-sm text-muted">✓ Open Bank</Text>
            <Text className="text-sm text-muted">✓ Mercado Pago</Text>
            
            <TouchableOpacity
              onPress={() => router.push("/payment-methods")}
              className="bg-primary py-2 rounded-lg mt-2"
            >
              <Text className="text-center font-bold text-background text-sm">
                Ver Todos los Métodos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <View className="bg-success/10 border border-success rounded-lg p-4">
            <Text className="text-xs text-success text-center leading-relaxed">
              🔒 Tus pagos están protegidos por PayPal. Todos los datos se encriptan y se cumplen estándares internacionales de seguridad.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

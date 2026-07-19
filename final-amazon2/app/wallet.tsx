import { ScrollView, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function WalletScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">("balance");

  const { data: wallet, isLoading: walletLoading } = trpc.wallet.getBalance.useQuery();
  const { data: transactions, isLoading: transLoading } = trpc.transactions.list.useQuery();

  const handleBack = () => {
    router.back();
  };

  const handleAddFunds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/shop");
  };

  const handleWithdraw = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement withdrawal flow
  };

  if (walletLoading) {
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
            <Text className="text-lg font-bold text-primary">Mi Billetera</Text>
            <View className="w-6" />
          </View>

          {/* Balance Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-sm text-muted">Saldo Disponible</Text>
            <Text className="text-4xl font-bold text-primary">
              ${wallet ? parseFloat(wallet.balance as any).toFixed(2) : "0.00"}
            </Text>

            <View className="gap-2">
              <Text className="text-xs text-muted">Depósitos Totales</Text>
              <Text className="text-lg font-semibold text-foreground">
                ${wallet ? parseFloat(wallet.totalDeposited as any).toFixed(2) : "0.00"}
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-xs text-muted">Retiros Totales</Text>
              <Text className="text-lg font-semibold text-foreground">
                ${wallet ? parseFloat(wallet.totalWithdrawn as any).toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleAddFunds}
              className="flex-1 bg-primary py-3 rounded-lg"
            >
              <Text className="text-center font-bold text-background">Agregar Fondos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWithdraw}
              className="flex-1 bg-warning py-3 rounded-lg"
            >
              <Text className="text-center font-bold text-background">Retirar</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 border-b border-border">
            <TouchableOpacity
              onPress={() => {
                setActiveTab("balance");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 py-3 border-b-2 ${
                activeTab === "balance" ? "border-primary" : "border-transparent"
              }`}
            >
              <Text className={`text-center font-semibold ${
                activeTab === "balance" ? "text-primary" : "text-muted"
              }`}>
                Resumen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("transactions");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 py-3 border-b-2 ${
                activeTab === "transactions" ? "border-primary" : "border-transparent"
              }`}
            >
              <Text className={`text-center font-semibold ${
                activeTab === "transactions" ? "text-primary" : "text-muted"
              }`}>
                Historial
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === "balance" ? (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4 border border-border flex-row justify-between">
                <View>
                  <Text className="text-xs text-muted">Última Actualización</Text>
                  <Text className="text-sm font-semibold text-foreground mt-1">
                    {wallet?.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : "N/A"}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Estado</Text>
                  <Text className="text-sm font-semibold text-success mt-1">Activo ✓</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="gap-2">
              {transLoading ? (
                <ActivityIndicator size="small" color="#d4af37" />
              ) : transactions && transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <View key={idx} className="bg-surface rounded-lg p-3 border border-border flex-row justify-between">
                    <View>
                      <Text className="text-sm font-semibold text-foreground capitalize">
                        {tx.type?.replace(/_/g, " ")}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
                      </Text>
                    </View>
                    <Text className={`text-sm font-bold ${
                      tx.type?.includes("deposit") || tx.type?.includes("win")
                        ? "text-success"
                        : "text-error"
                    }`}>
                      {tx.type?.includes("deposit") || tx.type?.includes("win") ? "+" : "-"}
                      ${parseFloat(tx.amount as any).toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-center text-muted py-8">Sin transacciones aún</Text>
              )}
            </View>
          )}

          {/* Security Notice */}
          <View className="bg-success/10 border border-success rounded-lg p-4 mt-4">
            <Text className="text-xs text-success text-center leading-relaxed">
              🔒 Tu billetera está protegida. Todos los fondos se guardan de forma segura en nuestros servidores encriptados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

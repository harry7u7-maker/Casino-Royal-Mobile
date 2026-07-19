import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";

export default function DailyBonusScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const { data: bonusInfo } = trpc.dailyBonus.getInfo.useQuery();
  const { data: schedule } = trpc.dailyBonus.getSchedule.useQuery();
  const claimMutation = trpc.dailyBonus.claimBonus.useMutation();

  const handleClaimBonus = async () => {
    setLoading(true);
    try {
      const result = await claimMutation.mutateAsync();
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setClaimed(true);
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-4xl mb-2">🎁</Text>
          <Text className="text-3xl font-bold text-foreground mb-2">
            Bonificación Diaria
          </Text>
          <Text className="text-base text-muted text-center">
            Reclama tu bonificación diaria y aumenta tu racha
          </Text>
        </View>

        {/* Bonus Info Card */}
        {bonusInfo && (
          <View
            className="bg-surface rounded-2xl p-6 mb-6 border border-primary"
            style={{ borderColor: colors.primary }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-muted">Racha Actual:</Text>
              <Text className="text-3xl font-bold text-primary">
                {bonusInfo.streak} 🔥
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg text-muted">Próxima Bonificación:</Text>
              <Text className="text-2xl font-bold text-foreground">
                {bonusInfo.nextBonusAmount} fichas
              </Text>
            </View>

            {bonusInfo.canClaim ? (
              <TouchableOpacity
                onPress={handleClaimBonus}
                disabled={loading || claimed}
                className="bg-primary rounded-xl py-4 items-center"
                style={{
                  backgroundColor: colors.primary,
                  opacity: loading || claimed ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : claimed ? (
                  <Text className="text-lg font-bold text-background">
                    ¡Reclamado! ✓
                  </Text>
                ) : (
                  <Text className="text-lg font-bold text-background">
                    Reclamar Bonificación
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <View className="bg-muted/20 rounded-xl py-4 items-center">
                <Text className="text-base text-muted">
                  Próxima reclamación en:
                </Text>
                <Text className="text-lg font-bold text-foreground">
                  {bonusInfo.nextClaimTime
                    ? new Date(bonusInfo.nextClaimTime).toLocaleTimeString()
                    : "Pronto"}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Progression Schedule */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">
            Calendario de Bonificaciones
          </Text>

          <View className="bg-surface rounded-xl overflow-hidden">
            {schedule?.slice(0, 10).map((item: any, index: number) => (
              <View
                key={index}
                className="flex-row justify-between items-center p-4 border-b border-border"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-lg font-bold text-primary">
                    Día {item.day}
                  </Text>
                  {item.day <= (bonusInfo?.streak || 0) && (
                    <Text className="text-lg">✓</Text>
                  )}
                </View>
                <Text className="text-lg font-bold text-foreground">
                  {item.bonus} fichas
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View className="bg-warning/10 rounded-xl p-4 border border-warning">
          <Text className="text-base font-bold text-warning mb-2">
            💡 Consejo
          </Text>
          <Text className="text-sm text-foreground">
            Reclama tu bonificación diaria para mantener tu racha. Cuanto más
            larga sea tu racha, mayor será tu bonificación.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

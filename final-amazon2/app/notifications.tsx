import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";

export default function NotificationsScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"notifications" | "preferences">(
    "notifications"
  );

  const { data: notifications, refetch: refetchNotifications } =
    trpc.notifications.getNotifications.useQuery({ limit: 50 });
  const { data: preferences } = trpc.notifications.getPreferences.useQuery();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const updatePreferencesMutation =
    trpc.notifications.updatePreferences.useMutation();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync({ notificationId });
      await refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    try {
      await updatePreferencesMutation.mutateAsync({
        [key]: value,
      } as any);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bonus":
        return "🎁";
      case "game":
        return "🎮";
      case "promotion":
        return "🎉";
      case "achievement":
        return "🏆";
      case "referral":
        return "👥";
      default:
        return "📢";
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Tabs */}
      <View className="flex-row gap-2 p-4 border-b border-border">
        <TouchableOpacity
          onPress={() => setActiveTab("notifications")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "notifications"
              ? "bg-primary"
              : "bg-surface border border-border"
          }`}
          style={{
            backgroundColor:
              activeTab === "notifications" ? colors.primary : colors.surface,
          }}
        >
          <Text
            className={`font-bold ${
              activeTab === "notifications"
                ? "text-background"
                : "text-foreground"
            }`}
          >
            Notificaciones
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("preferences")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "preferences"
              ? "bg-primary"
              : "bg-surface border border-border"
          }`}
          style={{
            backgroundColor:
              activeTab === "preferences" ? colors.primary : colors.surface,
          }}
        >
          <Text
            className={`font-bold ${
              activeTab === "preferences"
                ? "text-background"
                : "text-foreground"
            }`}
          >
            Preferencias
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {activeTab === "notifications" ? (
          <View>
            {notifications && notifications.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleMarkAsRead(item.id)}
                    className={`bg-surface rounded-xl p-4 mb-3 border ${
                      item.read ? "border-border" : "border-primary"
                    }`}
                    style={{
                      borderColor: item.read ? colors.border : colors.primary,
                      opacity: item.read ? 0.6 : 1,
                    }}
                  >
                    <View className="flex-row gap-3">
                      <Text className="text-2xl">
                        {getNotificationIcon(item.type)}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-foreground">
                          {item.title}
                        </Text>
                        <Text className="text-sm text-muted mt-1">
                          {item.body}
                        </Text>
                        <Text className="text-xs text-muted mt-2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      {!item.read && (
                        <View
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View className="items-center justify-center py-12">
                <Text className="text-4xl mb-4">📭</Text>
                <Text className="text-lg text-muted">
                  No hay notificaciones
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">
              Configurar Notificaciones
            </Text>

            {preferences && (
              <View className="gap-4">
                <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      Bonificaciones
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Recibe alertas de bonificaciones diarias
                    </Text>
                  </View>
                  <Switch
                    value={preferences.bonusNotifications === 1}
                    onValueChange={(value) =>
                      handlePreferenceChange("bonusNotifications", value)
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      Juegos
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Notificaciones sobre nuevos juegos
                    </Text>
                  </View>
                  <Switch
                    value={preferences.gameNotifications === 1}
                    onValueChange={(value) =>
                      handlePreferenceChange("gameNotifications", value)
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      Promociones
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Ofertas especiales y promociones
                    </Text>
                  </View>
                  <Switch
                    value={preferences.promotionNotifications === 1}
                    onValueChange={(value) =>
                      handlePreferenceChange("promotionNotifications", value)
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      Logros
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Alertas cuando desbloquees logros
                    </Text>
                  </View>
                  <Switch
                    value={preferences.achievementNotifications === 1}
                    onValueChange={(value) =>
                      handlePreferenceChange("achievementNotifications", value)
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">
                      Referidos
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Notificaciones de amigos referidos
                    </Text>
                  </View>
                  <Switch
                    value={preferences.referralNotifications === 1}
                    onValueChange={(value) =>
                      handlePreferenceChange("referralNotifications", value)
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

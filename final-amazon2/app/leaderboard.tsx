import { ScrollView, Text, View, TouchableOpacity, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

interface LeaderboardEntry {
  rank: number;
  name: string;
  totalWinnings: number;
  gamesPlayed: number;
  winRate: number;
  isCurrentUser: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Carlos M.",
    totalWinnings: 12500,
    gamesPlayed: 342,
    winRate: 58.2,
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "María G.",
    totalWinnings: 11200,
    gamesPlayed: 298,
    winRate: 55.7,
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Juan P.",
    totalWinnings: 9800,
    gamesPlayed: 276,
    winRate: 52.1,
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Tú",
    totalWinnings: 8500,
    gamesPlayed: 215,
    winRate: 48.8,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: "Luis R.",
    totalWinnings: 7200,
    gamesPlayed: 198,
    winRate: 45.5,
    isCurrentUser: false,
  },
  {
    rank: 6,
    name: "Ana L.",
    totalWinnings: 6800,
    gamesPlayed: 187,
    winRate: 44.2,
    isCurrentUser: false,
  },
  {
    rank: 7,
    name: "Roberto S.",
    totalWinnings: 5900,
    gamesPlayed: 165,
    winRate: 42.1,
    isCurrentUser: false,
  },
  {
    rank: 8,
    name: "Sofia T.",
    totalWinnings: 5200,
    gamesPlayed: 142,
    winRate: 40.8,
    isCurrentUser: false,
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "alltime">("weekly");

  const handleBack = () => {
    router.back();
  };

  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => {
    const getMedalEmoji = (rank: number) => {
      if (rank === 1) return "🥇";
      if (rank === 2) return "🥈";
      if (rank === 3) return "🥉";
      return "•";
    };

    return (
      <View
        className={`flex-row items-center gap-4 p-4 rounded-2xl mb-2 border ${
          item.isCurrentUser
            ? "bg-primary/20 border-primary"
            : "bg-surface border-border"
        }`}
      >
        {/* Rank */}
        <View className="w-12 items-center">
          <Text className="text-2xl">{getMedalEmoji(item.rank)}</Text>
          <Text className="text-xs text-muted font-bold">#{item.rank}</Text>
        </View>

        {/* User Info */}
        <View className="flex-1 gap-1">
          <Text className={`font-bold ${item.isCurrentUser ? "text-primary" : "text-foreground"}`}>
            {item.name}
          </Text>
          <View className="flex-row gap-3">
            <Text className="text-xs text-muted">{item.gamesPlayed} juegos</Text>
            <Text className="text-xs text-muted">Win: {item.winRate}%</Text>
          </View>
        </View>

        {/* Winnings */}
        <View className="items-end gap-1">
          <Text className="font-bold text-primary">${item.totalWinnings.toLocaleString()}</Text>
          <Text className="text-xs text-muted">ganancias</Text>
        </View>
      </View>
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
            <Text className="text-lg font-bold text-primary">Tabla de Clasificación</Text>
            <View className="w-6" />
          </View>

          {/* Period Selector */}
          <View className="flex-row gap-2">
            {(["daily", "weekly", "monthly", "alltime"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                className={`flex-1 py-2 rounded-lg border ${
                  period === p
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-center text-xs font-bold ${
                    period === p ? "text-background" : "text-foreground"
                  }`}
                >
                  {p === "daily"
                    ? "Hoy"
                    : p === "weekly"
                    ? "Semana"
                    : p === "monthly"
                    ? "Mes"
                    : "Todo"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Top 3 Highlight */}
          <View className="gap-3">
            {MOCK_LEADERBOARD.slice(0, 3).map((entry) => (
              <View
                key={entry.rank}
                className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-4 border border-primary/30"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-3xl">
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                    </Text>
                    <View>
                      <Text className="font-bold text-foreground">{entry.name}</Text>
                      <Text className="text-xs text-muted">${entry.totalWinnings.toLocaleString()}</Text>
                    </View>
                  </View>
                  <Text className="text-2xl font-bold text-primary">#{entry.rank}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Full Leaderboard */}
          <View className="gap-2">
            <Text className="text-sm font-bold text-muted">RESTO DE JUGADORES</Text>
            <FlatList
              data={MOCK_LEADERBOARD.slice(3)}
              renderItem={renderLeaderboardEntry}
              keyExtractor={(item) => item.rank.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Your Rank Card */}
          <View className="bg-primary/10 border-2 border-primary rounded-2xl p-4 gap-2">
            <Text className="font-bold text-primary">Tu Posición</Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-foreground">#4</Text>
                <Text className="text-xs text-muted">Ganancias: $8,500</Text>
              </View>
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
                <Text className="text-background font-bold text-sm">Jugar Ahora</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
            <Text className="text-xs text-muted">
              💡 La tabla se actualiza cada hora. Juega más para subir de posición y ganar premios exclusivos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

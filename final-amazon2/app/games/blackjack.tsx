import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";

const STORAGE_KEY = "casino_balance";

interface Card {
  suit: string;
  rank: string;
  value: number;
}

export default function BlackjackScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<"betting" | "playing" | "finished">("betting");
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [result, setResult] = useState<{ message: string; amount: number; isWin: boolean } | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);

  useEffect(() => {
    loadBalance();
    initializeDeck();
  }, []);

  const loadBalance = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
      }
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.error("Error saving balance:", error);
    }
  };

  const initializeDeck = () => {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const newDeck: Card[] = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        let value = 0;
        if (rank === "A") value = 11;
        else if (["J", "Q", "K"].includes(rank)) value = 10;
        else value = parseInt(rank);

        newDeck.push({ suit, rank, value });
      }
    }

    // Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    setDeck(newDeck);
  };

  const drawCard = (currentDeck: Card[]) => {
    if (currentDeck.length === 0) {
      initializeDeck();
    }
    return currentDeck.pop();
  };

  const calculateHandValue = (cards: Card[]) => {
    let value = 0;
    let aces = 0;

    for (let card of cards) {
      if (card.rank === "A") {
        aces++;
        value += 11;
      } else if (["J", "Q", "K"].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const startGame = () => {
    if (balance < bet) return;

    const newDeck = [...deck];
    const player: Card[] = [];
    const dealer: Card[] = [];

    // Deal cards
    const card1 = newDeck.pop();
    if (card1) player.push(card1);

    const card2 = newDeck.pop();
    if (card2) dealer.push(card2);

    const card3 = newDeck.pop();
    if (card3) player.push(card3);

    const card4 = newDeck.pop();
    if (card4) dealer.push(card4);

    setDeck(newDeck);
    setPlayerCards(player);
    setDealerCards(dealer);
    setGameState("playing");
    setBalance(balance - bet);
    setResult(null);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    if (card) {
      const newPlayerCards = [...playerCards, card];
      setPlayerCards(newPlayerCards);
      setDeck(newDeck);

      if (calculateHandValue(newPlayerCards) > 21) {
        endGame(newPlayerCards, dealerCards);
      }
    }
  };

  const stand = () => {
    dealerTurn(playerCards, dealerCards);
  };

  const dealerTurn = (pCards: Card[], dCards: Card[]) => {
    const newDeck = [...deck];
    let dealerHand = [...dCards];

    while (calculateHandValue(dealerHand) < 17) {
      const card = newDeck.pop();
      if (card) dealerHand.push(card);
    }

    setDealerCards(dealerHand);
    setDeck(newDeck);

    setTimeout(() => {
      endGame(pCards, dealerHand);
    }, 500);
  };

  const endGame = (pCards: Card[], dCards: Card[]) => {
    const playerValue = calculateHandValue(pCards);
    const dealerValue = calculateHandValue(dCards);

    let winAmount = 0;
    let message = "";

    if (playerValue > 21) {
      message = "¡Pasaste de 21! 😢";
    } else if (dealerValue > 21) {
      winAmount = bet * 2;
      message = "¡El dealer se pasó! 🎉";
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (playerValue > dealerValue) {
      winAmount = bet * 2;
      message = "¡Ganaste! 🎊";
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (playerValue === dealerValue) {
      winAmount = bet;
      message = "¡Empate! 🤝";
    } else {
      message = "El dealer gana 😢";
    }

    const finalBalance = balance - bet + winAmount;
    saveBalance(finalBalance);

    setResult({
      message,
      amount: winAmount - bet,
      isWin: winAmount > bet,
    });

    setGameState("finished");
  };

  const handleBack = () => {
    router.back();
  };

  const CardDisplay = ({ card }: { card: Card }) => (
    <View className="bg-white rounded-lg p-2 border-2 border-foreground w-14 h-20 items-center justify-center">
      <Text className="text-foreground font-bold text-lg">{card.rank}</Text>
      <Text className="text-foreground text-sm">{card.suit}</Text>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-lg font-bold text-primary">Blackjack</Text>
            <Text className="text-lg font-bold text-foreground">${balance.toFixed(2)}</Text>
          </View>

          {/* Game Area */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            {gameState === "betting" ? (
              <>
                <Text className="text-center text-lg font-bold text-foreground">Selecciona tu apuesta</Text>

                <View className="gap-2">
                  <Text className="text-sm text-muted">Apuesta: ${bet.toFixed(2)}</Text>
                  <View className="flex-row gap-2">
                    {[10, 25, 50, 100].map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        onPress={() => {
                          if (amount <= balance) {
                            setBet(amount);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                        }}
                        disabled={amount > balance}
                        className={`flex-1 py-2 rounded-lg ${
                          bet === amount
                            ? "bg-primary"
                            : amount > balance
                              ? "bg-muted/30"
                              : "bg-surface border border-primary"
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            bet === amount ? "text-background" : "text-foreground"
                          }`}
                        >
                          ${amount}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={startGame}
                  disabled={balance < bet}
                  className={`py-4 rounded-lg ${balance < bet ? "bg-muted/50" : "bg-primary"}`}
                >
                  <Text className={`text-center text-lg font-bold ${balance < bet ? "text-muted" : "text-background"}`}>
                    JUGAR
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Dealer Cards */}
                <View className="gap-2">
                  <Text className="text-sm text-muted">Dealer</Text>
                  <View className="flex-row gap-2">
                    {dealerCards.map((card, idx) => (
                      <CardDisplay key={idx} card={card} />
                    ))}
                  </View>
                  {gameState === "finished" && (
                    <Text className="text-sm text-foreground">Valor: {calculateHandValue(dealerCards)}</Text>
                  )}
                </View>

                {/* Player Cards */}
                <View className="gap-2">
                  <Text className="text-sm text-muted">Tu Mano</Text>
                  <View className="flex-row gap-2">
                    {playerCards.map((card, idx) => (
                      <CardDisplay key={idx} card={card} />
                    ))}
                  </View>
                  <Text className="text-sm text-foreground">Valor: {calculateHandValue(playerCards)}</Text>
                </View>

                {/* Result */}
                {result && (
                  <View
                    className={`rounded-lg p-4 ${
                      result.isWin ? "bg-success/20 border border-success" : "bg-error/20 border border-error"
                    }`}
                  >
                    <Text className={`text-lg font-bold ${result.isWin ? "text-success" : "text-error"}`}>
                      {result.message}
                    </Text>
                    {result.amount !== 0 && (
                      <Text className={`font-bold mt-1 ${result.amount > 0 ? "text-success" : "text-error"}`}>
                        {result.amount > 0 ? "+" : ""}${result.amount.toFixed(2)}
                      </Text>
                    )}
                  </View>
                )}

                {/* Action Buttons */}
                {gameState === "playing" && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={hit} className="flex-1 bg-primary py-3 rounded-lg">
                      <Text className="text-center font-bold text-background">PEDIR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={stand} className="flex-1 bg-warning py-3 rounded-lg">
                      <Text className="text-center font-bold text-background">PLANTARSE</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {gameState === "finished" && (
                  <TouchableOpacity
                    onPress={() => {
                      setGameState("betting");
                      setPlayerCards([]);
                      setDealerCards([]);
                      setResult(null);
                    }}
                    className="bg-primary py-3 rounded-lg"
                  >
                    <Text className="text-center font-bold text-background">JUGAR DE NUEVO</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

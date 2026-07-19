import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export default function SupportScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<"payment" | "technical" | "account" | "other">("other");
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "payment", label: "💳 Pago" },
    { id: "technical", label: "🔧 Técnico" },
    { id: "account", label: "👤 Cuenta" },
    { id: "other", label: "❓ Otro" },
  ];

  const handleSubmit = async () => {
    if (!email || !subject || !message) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la llamada a la API
      console.log("Ticket de soporte:", { email, subject, message, category });
      Alert.alert("Éxito", "Tu ticket de soporte ha sido enviado. Nos pondremos en contacto pronto.");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "No pudimos enviar tu ticket. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">📧 Soporte</Text>
          <Text className="text-muted">¿Necesitas ayuda? Cuéntanos qué pasó</Text>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-foreground font-semibold mb-2">Email</Text>
          <TextInput
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="bg-surface text-foreground p-3 rounded-lg border border-border"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className="text-foreground font-semibold mb-2">Categoría</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full border",
                  category === cat.id
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                )}
              >
                <Text
                  className={cn(
                    "font-semibold",
                    category === cat.id ? "text-background" : "text-foreground"
                  )}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subject */}
        <View className="mb-4">
          <Text className="text-foreground font-semibold mb-2">Asunto</Text>
          <TextInput
            placeholder="Describe brevemente tu problema"
            value={subject}
            onChangeText={setSubject}
            className="bg-surface text-foreground p-3 rounded-lg border border-border"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Message */}
        <View className="mb-6">
          <Text className="text-foreground font-semibold mb-2">Mensaje</Text>
          <TextInput
            placeholder="Cuéntanos más detalles..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            className="bg-surface text-foreground p-3 rounded-lg border border-border"
            placeholderTextColor={colors.muted}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={cn(
            "bg-primary py-3 rounded-lg items-center mb-4",
            loading && "opacity-50"
          )}
        >
          <Text className="text-background font-bold text-lg">
            {loading ? "Enviando..." : "Enviar Ticket"}
          </Text>
        </TouchableOpacity>

        {/* FAQ Section */}
        <View className="mt-6 pt-6 border-t border-border">
          <Text className="text-2xl font-bold text-foreground mb-4">❓ Preguntas Frecuentes</Text>

          <View className="space-y-3">
            <View className="bg-surface p-4 rounded-lg">
              <Text className="text-foreground font-semibold mb-1">¿Cuánto tarda en responder?</Text>
              <Text className="text-muted text-sm">Respondemos en máximo 2 horas</Text>
            </View>

            <View className="bg-surface p-4 rounded-lg">
              <Text className="text-foreground font-semibold mb-1">¿Puedo cambiar mi contraseña?</Text>
              <Text className="text-muted text-sm">Sí, ve a Configuración → Seguridad</Text>
            </View>

            <View className="bg-surface p-4 rounded-lg">
              <Text className="text-foreground font-semibold mb-1">¿Cómo retiro dinero?</Text>
              <Text className="text-muted text-sm">Ve a Billetera → Retirar → Selecciona método</Text>
            </View>

            <View className="bg-surface p-4 rounded-lg">
              <Text className="text-foreground font-semibold mb-1">¿Es seguro mi dinero?</Text>
              <Text className="text-muted text-sm">Sí, usamos encriptación de nivel bancario</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View className="mt-6 p-4 bg-surface rounded-lg border border-border">
          <Text className="text-foreground font-semibold mb-2">📞 Contacto Directo</Text>
          <Text className="text-muted text-sm mb-1">Email: support@casinoroyale.app</Text>
          <Text className="text-muted text-sm">Disponible 24/7</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

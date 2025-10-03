import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../types/RootStackParamList";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PhoneVerificationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  // Dados do usuário vindos da tela de cadastro
  const userData = route.params?.userData || {};

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animações de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 300);
  }, []);

  // Formatação do telefone
  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");

    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  // Validação do telefone
  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, "");

    if (!phone.trim()) {
      setPhoneError("Telefone é obrigatório");
      return false;
    }

    if (numbers.length < 10) {
      setPhoneError("Telefone deve ter pelo menos 10 dígitos");
      return false;
    }

    if (numbers.length > 11) {
      setPhoneError("Telefone deve ter no máximo 11 dígitos");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);

    if (phoneError) {
      validatePhone(formatted);
    }
  };

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      return;
    }

    setIsLoading(true);

    // Simular envio do código
    setTimeout(() => {
      setIsLoading(false);

      // Navegar para a tela de validação do código
      (navigation as any).navigate("CodeVerificationScreen", {
        userData: { ...userData, phone },
        phoneNumber: phone,
      });
    }, 1500);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Background decorativo */}
            <View style={styles.backgroundDecoration}>
              <View style={[styles.circle, styles.circle1]} />
              <View style={[styles.circle, styles.circle2]} />
            </View>

            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Image
                source={require("../assets/logoTipos/logo.webp")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.welcomeText}>Verificação de Telefone</Text>
              <Text style={styles.subText}>
                Digite seu número de telefone para receber um código de
                verificação
              </Text>
            </Animated.View>

            {/* Ilustração */}
            <Animated.View
              style={[
                styles.illustrationContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                },
              ]}
            >
              <View style={styles.phoneIcon}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={48}
                  color="#1DB954"
                />
              </View>
            </Animated.View>

            {/* Formulário */}
            <Animated.View
              style={[
                styles.form,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: formAnim }],
                },
              ]}
            >
              {/* Informação sobre o processo */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Enviaremos um link de verificação via SMS para confirmar seu
                  número
                </Text>
              </View>

              {/* Campo de Telefone */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    phoneError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color="#1DB954"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    onBlur={() => validatePhone(phone)}
                    keyboardType="phone-pad"
                    maxLength={15}
                    placeholderTextColor="#888"
                  />
                </View>
                {phoneError ? (
                  <Text style={styles.errorText}>{phoneError}</Text>
                ) : null}
              </View>

              {/* Botão de Enviar Código */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isLoading ? styles.sendButtonDisabled : null,
                ]}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View
                      style={[styles.loadingDot, { opacity: fadeAnim }]}
                    />
                    <Text style={styles.sendText}>Enviando...</Text>
                  </View>
                ) : (
                  <Text style={styles.sendText}>Enviar Código</Text>
                )}
              </TouchableOpacity>

              {/* Informações adicionais */}
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalInfoText}>
                  Ao continuar, você concorda com nossos{" "}
                  <Text style={styles.linkText}>Termos de Uso</Text> e{" "}
                  <Text style={styles.linkText}>Política de Privacidade</Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default PhoneVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backgroundDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#1DB954",
    opacity: 0.05,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -60,
    right: -60,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -40,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    fontWeight: "300",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  phoneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1DB954",
  },
  form: {
    width: "100%",
  },
  infoContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoText: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    height: "100%",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  sendButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#1DB954",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#0a5a2a",
    shadowOpacity: 0.1,
  },
  sendText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  additionalInfo: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  additionalInfoText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: "#1DB954",
    fontWeight: "500",
  },
});

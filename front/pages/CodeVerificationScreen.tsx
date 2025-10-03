import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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

const CodeVerificationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  // Dados vindos da tela de telefone
  const userData = route.params?.userData || {};
  const phoneNumber = route.params?.phoneNumber || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Refs para os inputs
  const inputRefs = useRef<TextInput[]>([]);

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

    // Focar no primeiro input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 800);
  }, []);

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (codeError) {
      setCodeError("");
    }

    // Auto focus no próximo input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verificação quando todos os campos estão preenchidos
    if (newCode.every((digit) => digit !== "") && text) {
      console.log("Código completo digitado:", newCode.join(""));
      setTimeout(() => handleVerifyCode(newCode.join("")), 100);
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (text === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || code.join("");

    console.log("Verificando código:", finalCode);

    if (finalCode.length !== 6) {
      setCodeError("Código deve ter 6 dígitos");
      return;
    }

    setIsLoading(true);

    // Simular verificação do código
    setTimeout(() => {
      setIsLoading(false);

      console.log("Código a ser verificado:", finalCode);
      console.log("Comparando com 123456:", finalCode === "123456");

      // Simular código correto (123456)
      if (finalCode === "123456") {
        console.log("Código correto! Navegando para login...");

        // Navegar diretamente para login
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          console.log("Navegação executada com sucesso");
        } catch (error) {
          console.error("Erro na navegação:", error);
          // Fallback - tentar navegação simples
          navigation.navigate("Login" as any);
        }
      } else {
        setCodeError("Código inválido. Tente novamente.");
        // Limpar campos
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResendCode = () => {
    setCanResend(false);
    setCountdown(30);
    setCode(["", "", "", "", "", ""]);
    setCodeError("");

    Alert.alert(
      "Código Reenviado",
      `Um novo código foi enviado para ${phoneNumber}`,
      [{ text: "OK" }]
    );
  };

  const formatPhoneNumber = (phone: string) => {
    // Esconder parte do número para privacidade
    const numbers = phone.replace(/\D/g, "");
    if (numbers.length >= 10) {
      return `(${numbers.slice(0, 2)}) ****-${numbers.slice(-4)}`;
    }
    return phone;
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

              <Text style={styles.welcomeText}>Código de Verificação</Text>
              <Text style={styles.subText}>
                Digite o código de 6 dígitos enviado para{"\n"}
                <Text style={styles.phoneText}>
                  {formatPhoneNumber(phoneNumber)}
                </Text>
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
              <View style={styles.messageIcon}>
                <Ionicons name="chatbubble-outline" size={32} color="#1DB954" />
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
              {/* Campos do código */}
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : null,
                      codeError ? styles.codeInputError : null,
                    ]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        handleBackspace(digit, index);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                ))}
              </View>

              {codeError ? (
                <Text style={styles.errorText}>{codeError}</Text>
              ) : null}

              {/* Botão de Verificar */}
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isLoading ? styles.verifyButtonDisabled : null,
                ]}
                onPress={() => handleVerifyCode()}
                disabled={isLoading || code.some((digit) => digit === "")}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View
                      style={[styles.loadingDot, { opacity: fadeAnim }]}
                    />
                    <Text style={styles.verifyText}>Verificando...</Text>
                  </View>
                ) : (
                  <Text style={styles.verifyText}>Verificar Código</Text>
                )}
              </TouchableOpacity>

              {/* Reenviar código */}
              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendCode}>
                    <Text style={styles.resendText}>
                      Não recebeu o código?{" "}
                      <Text style={styles.resendLink}>Reenviar</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.countdownText}>
                    Reenviar código em {countdown}s
                  </Text>
                )}
              </View>

              {/* Dica sobre o código de teste */}
              <View style={styles.testCodeContainer}>
                <Text style={styles.testCodeText}>
                  💡 Para teste, use o código:{" "}
                  <Text style={styles.testCodeHighlight}>123456</Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default CodeVerificationScreen;

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
    width: 180,
    height: 180,
    top: -40,
    left: -60,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: 120,
    right: -30,
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
  phoneText: {
    color: "#1DB954",
    fontWeight: "500",
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  messageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1DB954",
  },
  form: {
    width: "100%",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  codeInputFilled: {
    borderColor: "#1DB954",
    backgroundColor: "#0d4a1f",
  },
  codeInputError: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: "#0a5a2a",
    shadowOpacity: 0.1,
  },
  verifyText: {
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
  resendContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  resendLink: {
    color: "#1DB954",
    fontWeight: "600",
  },
  countdownText: {
    color: "#888",
    fontSize: 14,
  },
  testCodeContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  testCodeText: {
    color: "#CCCCCC",
    fontSize: 12,
    textAlign: "center",
  },
  testCodeHighlight: {
    color: "#1DB954",
    fontWeight: "600",
  },
});

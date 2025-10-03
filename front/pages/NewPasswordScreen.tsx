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

const NewPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  // Dados vindos da tela anterior
  const recoveryMethod = route.params?.recoveryMethod || "email";
  const contactInfo = route.params?.contactInfo || "";
  const verificationCode = route.params?.verificationCode || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
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

  // Validação de senha
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Nova senha é obrigatória");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordError(
        "Senha deve conter ao menos uma letra maiúscula e minúscula"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Validação de confirmação de senha
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Confirmação de senha é obrigatória");
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("Senhas não coincidem");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleUpdatePassword = async () => {
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    // Simular atualização da senha
    setTimeout(() => {
      setIsLoading(false);

      Alert.alert(
        "Senha Alterada!",
        "Sua senha foi alterada com sucesso. Faça login com sua nova senha.",
        [
          {
            text: "OK",
            onPress: () => {
              // Resetar pilha de navegação e voltar para login
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]
      );
    }, 1500);
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, text: "", color: "#333" };
    if (pass.length < 6)
      return { strength: 1, text: "Fraca", color: "#FF6B6B" };
    if (pass.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])/.test(pass)) {
      return { strength: 2, text: "Média", color: "#FFA500" };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) {
      return { strength: 3, text: "Boa", color: "#1DB954" };
    }
    return { strength: 4, text: "Forte", color: "#0a5a2a" };
  };

  const passwordStrength = getPasswordStrength(password);

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

              <Text style={styles.welcomeText}>Nova Senha</Text>
              <Text style={styles.subText}>
                Crie uma nova senha segura para sua conta
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
              <View style={styles.shieldIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={32}
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
              {/* Campo de Nova Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nova senha</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    passwordError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#1DB954"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validatePassword(text);
                      if (confirmPassword)
                        validateConfirmPassword(confirmPassword);
                    }}
                    onBlur={() => validatePassword(password)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#888"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                {/* Indicador de força da senha */}
                {password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBars}>
                      {[1, 2, 3, 4].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.strengthBar,
                            {
                              backgroundColor:
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : "#333",
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text
                      style={[
                        styles.strengthText,
                        { color: passwordStrength.color },
                      ]}
                    >
                      {passwordStrength.text}
                    </Text>
                  </View>
                )}

                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Campo de Confirmar Nova Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirmar nova senha</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    confirmPasswordError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#1DB954"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) validateConfirmPassword(text);
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#888"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Dicas de segurança */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Para uma senha segura:</Text>
                <View style={styles.tipItem}>
                  <Ionicons
                    name={
                      password.length >= 6
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={password.length >= 6 ? "#1DB954" : "#888"}
                  />
                  <Text
                    style={[
                      styles.tipText,
                      { color: password.length >= 6 ? "#1DB954" : "#888" },
                    ]}
                  >
                    Pelo menos 6 caracteres
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons
                    name={
                      /(?=.*[a-z])(?=.*[A-Z])/.test(password)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      /(?=.*[a-z])(?=.*[A-Z])/.test(password)
                        ? "#1DB954"
                        : "#888"
                    }
                  />
                  <Text
                    style={[
                      styles.tipText,
                      {
                        color: /(?=.*[a-z])(?=.*[A-Z])/.test(password)
                          ? "#1DB954"
                          : "#888",
                      },
                    ]}
                  >
                    Letras maiúsculas e minúsculas
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons
                    name={
                      /\d/.test(password)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={/\d/.test(password) ? "#1DB954" : "#888"}
                  />
                  <Text
                    style={[
                      styles.tipText,
                      { color: /\d/.test(password) ? "#1DB954" : "#888" },
                    ]}
                  >
                    Pelo menos um número
                  </Text>
                </View>
              </View>

              {/* Botão de Alterar Senha */}
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  isLoading ? styles.updateButtonDisabled : null,
                ]}
                onPress={handleUpdatePassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View
                      style={[styles.loadingDot, { opacity: fadeAnim }]}
                    />
                    <Text style={styles.updateText}>Alterando...</Text>
                  </View>
                ) : (
                  <Text style={styles.updateText}>Alterar Senha</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default NewPasswordScreen;

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
    right: -100,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: 180,
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
  shieldIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1DB954",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#CCCCCC",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
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
  eyeButton: {
    padding: 4,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  strengthBars: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    marginRight: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  tipsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  tipsTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  updateButton: {
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
  updateButtonDisabled: {
    backgroundColor: "#0a5a2a",
    shadowOpacity: 0.1,
  },
  updateText: {
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
});

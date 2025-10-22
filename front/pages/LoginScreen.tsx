import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estados para os campos e validação
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
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
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
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

  // Validação de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email é obrigatório");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validação de senha
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Senha é obrigatória");
      return false;
    }
    if (password.length < 3) {
      setPasswordError("Senha deve ter pelo menos 3 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha: password }),
        }
      );
      const data = await res.json();
      setIsLoading(false);
      if (res.ok && data.token) {
        // Salvar token JWT
        await AsyncStorage.setItem("token", data.token);

        // Exemplo: decodificar token para acessar dados do usuário
        try {
          // Exemplo: acessar id e email
          // console.log('Usuário logado:', decoded.id, decoded.email);
        } catch (e) {
          // Se o token não puder ser decodificado
        }

        navigation.replace("MainTabs");
      } else {
        Alert.alert(
          "Erro de Login",
          data.message || "Email ou senha incorretos.",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert(
        "Erro de Login",
        "Não foi possível conectar ao servidor. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
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

            {/* Header com logo */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Animated.View
                style={{
                  transform: [{ scale: logoAnim }],
                }}
              >
                <Image
                  source={require("../assets/logoTipos/logo.webp")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animated.View>
              <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
              <Text style={styles.subText}>Faça login para continuar</Text>
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
              {/* Campo de Email */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    emailError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#1DB954"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    onBlur={() => validateEmail(email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Campo de Senha */}
              <View style={styles.inputContainer}>
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
                    placeholder="Senha"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validatePassword(text);
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
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Link Esqueceu a senha */}
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              {/* Botão de Login */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading ? styles.loginButtonDisabled : null,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View
                      style={[styles.loadingDot, { opacity: fadeAnim }]}
                    />
                    <Text style={styles.loginText}>Entrando...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginText}>Acessar</Text>
                )}
              </TouchableOpacity>

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.line} />
              </View>

              {/* Link para Criar Conta */}
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("Signup")}
              >
                <Text style={styles.signupText}>
                  Não tem uma conta?{" "}
                  <Text style={styles.signupLink}>Criar conta</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;

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
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  header: {
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.1,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    fontWeight: "300",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
    paddingVertical: 8,
  },
  forgotText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1DB954",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#0a5a2a",
    shadowOpacity: 0.1,
  },
  loginText: {
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#888",
    fontSize: 14,
    marginHorizontal: 16,
  },
  signupButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  signupText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  signupLink: {
    color: "#1DB954",
    fontWeight: "600",
  },
});

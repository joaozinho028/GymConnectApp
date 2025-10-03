import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SplashScreen({ navigation }: any) {
  // Múltiplas animações para diferentes elementos
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotsAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações mais sofisticada
    const startAnimations = () => {
      // Animação do background
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Animação do logo (escala e opacidade)
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Animação do texto (com delay)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);

      // Animação da barra de progresso (com delay)
      setTimeout(() => {
        Animated.timing(progressWidth, {
          toValue: 100,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start();
      }, 800);

      // Animação dos pontos (loading dots)
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotsAnimation, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(dotsAnimation, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1000);
    };

    startAnimations();

    // Timer para navegação
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: backgroundAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ["#000000", "#1a1a1a"],
            }),
          },
        ]}
      >
        {/* Efeito de fundo com circulos animados */}
        <View style={styles.backgroundCircles}>
          <Animated.View
            style={[
              styles.circle,
              styles.circle1,
              {
                opacity: backgroundAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circle2,
              {
                opacity: backgroundAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.08],
                }),
              },
            ]}
          />
        </View>

        {/* Container principal */}
        <View style={styles.content}>
          {/* Logo animado */}
          <Animated.View
            style={{
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            }}
          >
            <Image
              source={require("../assets/logoTipos/logo.webp")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Texto animado */}
          <Animated.View
            style={{
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            }}
          >
            <Text style={styles.title}>GymConnect</Text>
            <Text style={styles.subtitle}>Conecte-se, gerencie e cresça</Text>
          </Animated.View>

          {/* Barra de progresso moderna */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            {/* Dots animados */}
            <Animated.View
              style={[
                styles.dotsContainer,
                {
                  opacity: dotsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ]}
            >
              <View style={[styles.dot, { opacity: 1 }]} />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dotsAnimation.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange: [0.3, 1, 0.3, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dotsAnimation.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange: [0.3, 0.3, 1, 0.3],
                    }),
                  },
                ]}
              />
            </Animated.View>
          </View>
        </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={styles.footerText}>Carregando sua experiência...</Text>
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundCircles: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#1DB954",
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "300",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBackground: {
    width: SCREEN_WIDTH - 80,
    height: 4,
    backgroundColor: "#333333",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 2,
    shadowColor: "#1DB954",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DB954",
    marginHorizontal: 4,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "300",
  },
});

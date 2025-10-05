import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoryComponent from "../components/CategoryComponent";
import LocationScreen from "../components/LocationComponent";
import NotificationsScreen from "../components/NotificationsComponent";
import ProfileComponent from "../components/ProfileComponent";
import SplashScreen from "../components/SplashComponent";
import AccountScreen from "../pages/AccountScreen";
import CalendarScreen from "../pages/CalendarScreen";
import CodeVerificationScreen from "../pages/CodeVerificationScreen";
import FavoritesScreen from "../pages/FavoritesScreen";
import ForgotPasswordScreen from "../pages/ForgotPasswordScreen";
import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import NewPasswordScreen from "../pages/NewPasswordScreen";
import PasswordRecoveryCodeScreen from "../pages/PasswordRecoveryCodeScreen";
import PendenciasScreen from "../pages/pendenciasScreen";
import PhoneVerificationScreen from "../pages/PhoneVerificationScreen";
import ProfileScreen from "../pages/ProfileScreen";
import SignupScreen from "../pages/SignupScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const iconsMap = {
    Home: "home-outline",
    Agenda: "calendar-outline",
    Favorites: "star-outline",
    Perfil: "person-outline",
  } as never;

  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }: any) => {
          const iconName = iconsMap[route.name] || "ellipse";
          return (
            <Ionicons
              name={iconName}
              size={typeof size === "number" ? size : 24}
              color={color}
              style={{
                marginTop: 2,
                marginBottom: 2,
                ...(focused && {
                  shadowColor: "#1DB954",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }),
              }}
            />
          );
        },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopWidth: 1,
          borderTopColor: "#333",
          paddingTop: 12,
          paddingBottom: 20,
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 6,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          justifyContent: "center",
          alignItems: "center",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Agenda"
        component={CalendarScreen}
        options={{ title: "Calendário" }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favoritos" }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="PhoneVerificationScreen"
          component={PhoneVerificationScreen}
        />
        <Stack.Screen
          name="CodeVerificationScreen"
          component={CodeVerificationScreen}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="PasswordRecoveryCodeScreen"
          component={PasswordRecoveryCodeScreen}
        />
        <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />

        <Stack.Screen
          name="Category"
          component={CategoryComponent}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ProfileComponent"
          component={ProfileComponent}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="PendenciasScreen"
          component={PendenciasScreen}
          options={{
            headerShown: true,
            title: "Minhas Mensalidades",
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{
            headerShown: true,
            title: "Notificações",
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
          options={{
            headerShown: true,
            title: "Localização",
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{
            headerShown: true,
            title: "Dados da Conta",
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/RootStackParamList";

const { width: screenWidth } = Dimensions.get("window");
const isSmallScreen = screenWidth < 350;
const isMediumScreen = screenWidth >= 350 && screenWidth < 400;

const profileName = "João Vítor Marcelino";
const profilePhoto = "https://i.pravatar.cc/150?img=12";
const profileEmail = "joao@mail.com";
const memberSince = "Membro desde 2024";

// Estatísticas do usuário
const userStats = [
  {
    label: "Agendamentos",
    value: "47",
    icon: "calendar-outline",
    color: "#1DB954",
  },
  {
    label: "Treinos",
    value: "12",
    icon: "barbell-outline",
    color: "#3498db",
  },
  {
    label: "Faturas Atrasadas",
    value: "3",
    icon: "warning-outline",
    color: "#e74c3c",
  },
];

// Configurações organizadas por categoria
const accountSettings = [
  {
    id: "1",
    label: "Dados da Conta",
    icon: "person-outline",
    screen: "AccountScreen",
    description: "Informações pessoais e pagamento",
  },
  {
    id: "2",
    label: "Minhas Mensalidades",
    icon: "list-outline",
    screen: "PendenciasScreen",
    description: "Gerenciar pendências e pagamentos",
  },
];

const appSettings = [
  {
    id: "3",
    label: "Notificações",
    icon: "notifications-outline",
    screen: "NotificationsScreen",
    description: "Configurar alertas e lembretes",
  },
  {
    id: "4",
    label: "Localização",
    icon: "location-outline",
    screen: "LocationScreen",
    description: "Configurações de localização",
  },
];

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderSettingItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.settingCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={styles.settingCardContent}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={item.icon as any} size={24} color="#1DB954" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{item.label}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </View>
    </TouchableOpacity>
  );

  const renderStatItem = (stat: any, index: number) => (
    <View key={index} style={styles.statCard}>
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: stat.color + "20" },
        ]}
      >
        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header com perfil */}
          <ImageBackground
            source={require("../assets/banners/bannerProfile.jpg")}
            style={styles.header}
          >
            <View style={styles.overlay} />
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{profileName}</Text>
              <Text style={styles.profileEmail}>{profileEmail}</Text>
              <Text style={styles.memberSince}>{memberSince}</Text>
            </View>
          </ImageBackground>

          {/* Seção de Estatísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
            <View style={styles.statsContainer}>
              {userStats.map((stat, index) => renderStatItem(stat, index))}
            </View>
          </View>

          {/* Seção Conta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <FlatList
              data={accountSettings}
              keyExtractor={(item) => item.id}
              renderItem={renderSettingItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>

          {/* Seção Configurações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <FlatList
              data={appSettings}
              keyExtractor={(item) => item.id}
              renderItem={renderSettingItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>

          {/* Link para informações do app */}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://gymconect.com.br/info")}
            style={styles.infoLinkContainer}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#1DB954"
            />
            <Text style={styles.linkText}>Informações do aplicativo</Text>
          </TouchableOpacity>

          {/* Botão de sair */}
          <TouchableOpacity
            onPress={() => console.log("Usuário saiu")}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    height: isSmallScreen ? 220 : 250,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: isSmallScreen ? 80 : 96,
    height: isSmallScreen ? 80 : 96,
    borderRadius: isSmallScreen ? 40 : 48,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  profileName: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "#e0e0e0",
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: "#bbb",
    fontStyle: "italic",
  },
  statsSection: {
    backgroundColor: "#1a1a1a",
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#CCCCCC",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  settingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#CCCCCC",
  },
  infoLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  linkText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#e74c3c",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});

import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const favoriteStores = [
  {
    id: "1",
    name: "Nutrição com Carla",
    category: "Nutricionista",
    distance: "3,4 km",
    status: "Fechado",
    price: "Consulta R$150",
    logo: "https://cdn-icons-png.flaticon.com/512/2718/2718224.png", // ícone de nutrição
  },
  {
    id: "2",
    name: "Personal Lucas Oliveira",
    category: "Personal Trainer",
    distance: "1,2 km",
    status: "Aberto",
    price: "R$ 80 / aula",
    logo: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png", // ícone de treino
  },
  {
    id: "3",
    name: "Clube do Whey",
    category: "Suplementos",
    distance: "4,9 km",
    status: "Fechado",
    price: "Entrega grátis",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", // ícone de suplemento
  },
  {
    id: "4",
    name: "Yoga com Ana",
    category: "Yoga",
    distance: "2,7 km",
    status: "Aberto",
    price: "R$ 50 / aula",
    logo: "https://cdn-icons-png.flaticon.com/512/201/201634.png", // ícone de yoga
  },
];

export default function FavoritesScreen() {
  const renderStore = ({ item }: any) => (
    <View style={styles.storeItem}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeDetails}>
          {item.category} · {item.distance}
        </Text>
        <Text style={[styles.storeStatus, { color: "#CCCCCC" }]}>
          <Text style={{ fontWeight: "bold", color: "#FFFFFF" }}>
            {item.status}
          </Text>{" "}
          · <Text style={{ color: "#1DB954" }}>{item.price}</Text>
        </Text>
      </View>
      <Ionicons name="heart-outline" size={24} color="#1DB954" />
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            aqui você encontra academias, studios ou profissionais que você
            favoritou
          </Text>
        </View>

        <FlatList
          data={favoriteStores}
          keyExtractor={(item) => item.id}
          renderItem={renderStore}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: "center",
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
  },
  storeName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
  storeDetails: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 2,
  },
  storeStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
  },
});

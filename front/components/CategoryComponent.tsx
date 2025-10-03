import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const allItems = [
  {
    id: "1",
    categoryId: "1",
    photo:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
    title: "Academia PowerFit",
    description: "Treinos personalizados e equipamentos modernos.",
    rating: 4,
    profilePhoto:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
    bannerPhoto:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80",
    workingHours: "Seg a Sex - 06:00 às 22:00",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 9 9281-3141",
    email: "contato@powerfit.com",
    address: "Rua das Flores, 123 - São Paulo, SP",
    comments: [
      { id: "c1", name: "João", text: "Excelente atendimento!" },
      { id: "c2", name: "Maria", text: "Ambiente super limpo e organizado." },
    ],
    plans: [
      { id: "plan1", name: "Plano Básico", price: 99.9 },
      { id: "plan2", name: "Plano Premium", price: 199.9 },
      { id: "plan3", name: "Plano VIP", price: 299.9 },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1599058917212-d750089bc579?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    ],
  },

  {
    id: "1",
    categoryId: "2",
    photo:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
    title: "Matheus Benetti ",
    description: "Treinos personalizados focando em sua evolção",
    rating: 4,
    profilePhoto:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
    bannerPhoto:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80",
    workingHours: "Seg a Sex - 06:00 às 22:00",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 9 9281-3141",
    email: "contato@powerfit.com",
    address: "Rua das Flores, 123 - São Paulo, SP",
    comments: [
      { id: "c1", name: "João", text: "Excelente atendimento!" },
      { id: "c2", name: "Maria", text: "Ambiente super limpo e organizado." },
    ],
    plans: [
      { id: "plan1", name: "Plano Básico", price: 99.9 },
      { id: "plan2", name: "Plano Premium", price: 199.9 },
      { id: "plan3", name: "Plano VIP", price: 299.9 },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1599058917212-d750089bc579?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

export default function CategoryComponent({ route, navigation }: any) {
  const { categoryId, categoryName } = route.params;

  const filteredItems = allItems.filter(
    (item) => item.categoryId === categoryId
  );

  const renderStars = (rating: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: "#f2b01e", fontSize: 16 }}>
          {i <= rating ? "★" : "☆"}
        </Text>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.listContainer}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>
            Nenhum item encontrado nessa categoria.
          </Text>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("ProfileComponent", { ...item })
              }
            >
              <Image source={{ uri: item.photo }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.rating}>{renderStars(item.rating)}</View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#1DB954",
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    height: 100,
  },
  cardImage: {
    width: 120,
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cardTitle: { fontWeight: "700", fontSize: 16, marginBottom: 1 },
  cardDescription: { fontSize: 13, color: "#555" },
  rating: {
    flexDirection: "row",
    marginBottom: 4,
  },
  seeMore: {
    color: "#f23e3e",
    fontWeight: "600",
  },
  noItemsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});

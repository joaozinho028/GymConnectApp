import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const banners = [
  { id: "1", image: require("../assets/banners/banner1.png") },
  { id: "2", image: require("../assets/banners/banner2.png") },
];

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Academias perto de mim",
    "Personal para emagrecimento",
    "Treino funcional",
    "Musculação",
  ]);

  const [address, setAddress] = useState("Localizando...");

  const [items] = useState([
    {
      id: "1",
      photo:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      title: "Academia PowerFit",
      description: "Treinos personalizados e equipamentos modernos.",
      rating: 4,
      profilePhoto:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&q=80",
      bannerPhoto:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      workingHours:
        "Segunda a Sexta: 06h às 23h | Sábado: 07h às 20h | Domingo: 08h às 18h",
      phone: "(11) 98765-4321",
      whatsapp: "5511987654321",
      email: "contato@powerfit.com.br",
      address: "Rua das Flores, 123 - Centro, São Paulo - SP",
      comments: [
        "Ótima academia!",
        "Equipamentos modernos",
        "Professores qualificados",
      ],
      plans: [
        { id: 1, name: "Plano Básico", price: "89.90" },
        { id: 2, name: "Plano Premium", price: "149.90" },
        { id: 3, name: "Plano VIP", price: "199.90" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      id: "2",
      photo:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
      title: "Fitness Center",
      description: "Ambiente aconchegante e profissionais qualificados.",
      rating: 5,
      profilePhoto:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80",
      bannerPhoto:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      workingHours: "Segunda a Domingo: 06h às 22h",
      phone: "(11) 91234-5678",
      whatsapp: "5511912345678",
      email: "info@fitnesscenter.com.br",
      address: "Av. Paulista, 456 - Bela Vista, São Paulo - SP",
      comments: [
        "Ambiente excelente!",
        "Staff muito atencioso",
        "Localização perfeita",
      ],
      plans: [
        { id: 1, name: "Mensal", price: "99.90" },
        { id: 2, name: "Trimestral", price: "259.90" },
        { id: 3, name: "Anual", price: "899.90" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1571019614332-651312c4a2e0?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      id: "3",
      photo:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&q=80",
      title: "Strong Gym",
      description: "Academia completa com piscina e aulas de grupo.",
      rating: 4,
      profilePhoto:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=200&q=80",
      bannerPhoto:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
      workingHours:
        "Segunda a Sexta: 05h30 às 23h30 | Fins de semana: 07h às 21h",
      phone: "(11) 95555-1234",
      whatsapp: "5511955551234",
      email: "contato@stronggym.com.br",
      address: "Rua da Academia, 789 - Vila Madalena, São Paulo - SP",
      comments: [
        "Piscina incrível!",
        "Aulas de grupo muito boas",
        "Estrutura completa",
      ],
      plans: [
        { id: 1, name: "Basic", price: "129.90" },
        { id: 2, name: "Standard", price: "179.90" },
        { id: 3, name: "Premium", price: "299.90" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      id: "4",
      photo:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
      title: "Body Shape",
      description: "Foco em resultados com personal trainers especializados.",
      rating: 5,
      profilePhoto:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80",
      bannerPhoto:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      workingHours: "Segunda a Sexta: 06h às 22h | Sábado: 08h às 18h",
      phone: "(11) 94444-9876",
      whatsapp: "5511944449876",
      email: "bodyshape@contato.com.br",
      address: "Alameda dos Exercícios, 321 - Jardins, São Paulo - SP",
      comments: [
        "Personal trainers excelentes!",
        "Resultados garantidos",
        "Foco total na qualidade",
      ],
      plans: [
        { id: 1, name: "Personal 2x/semana", price: "249.90" },
        { id: 2, name: "Personal 3x/semana", price: "349.90" },
        { id: 3, name: "Personal VIP", price: "499.90" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&q=80",
      ],
    },
  ]);

  const [filteredItems, setFilteredItems] = useState(items);
  const [searchResults, setSearchResults] = useState(items);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "É necessário permitir o acesso à localização para o aplicativo funcionar corretamente.",
            [{ text: "Entendi" }]
          );
          setAddress("Permissão negada");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(location.coords);

        if (geocode.length > 0) {
          const place = geocode[0];
          const rua = place.street || "Rua desconhecida";
          const numero = place.name || "";
          const bairro = place.district || "";
          const cidade = place.city || "";

          const enderecoFormatado = `${rua}${numero ? ", " + numero : ""} ${
            bairro ? " - " + bairro : ""
          }${cidade ? " - " + cidade : ""}`;

          setAddress(enderecoFormatado);
        } else {
          setAddress("Endereço não encontrado");
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        setAddress("Erro ao localizar");
      }
    })();
  }, []);

  const renderStars = (rating: any) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={{ color: "#f2b01e", fontSize: 14 }}>
        {i < rating ? "★" : "☆"}
      </Text>
    ));
  };

  const onCancelSearch = () => {
    setSearchText("");
    setSearchActive(false);
    setSearchResults(items);
    setFilteredItems(items);
  };

  const onSubmitSearch = () => {
    const trimmed = searchText.trim();
    if (trimmed) {
      performSearch(trimmed);
      if (!recentSearches.includes(trimmed)) {
        setRecentSearches([trimmed, ...recentSearches.slice(0, 9)]); // Máximo 10 buscas
      }
    }
  };

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const results = items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.address.toLowerCase().includes(lowercaseQuery) ||
        item.plans.some((plan) =>
          plan.name.toLowerCase().includes(lowercaseQuery)
        )
    );
    setSearchResults(results);
    setFilteredItems(results);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.trim().length > 0) {
      performSearch(text.trim());
    } else {
      setSearchResults(items);
      setFilteredItems(items);
    }
  };

  const handleRecentSearchPress = (searchTerm: string) => {
    setSearchText(searchTerm);
    performSearch(searchTerm);
  };

  const handleGymPress = (gym: any) => {
    navigation.navigate("ProfileComponent", {
      title: gym.title,
      description: gym.description,
      profilePhoto: gym.profilePhoto,
      bannerPhoto: gym.bannerPhoto,
      workingHours: gym.workingHours,
      phone: gym.phone,
      whatsapp: gym.whatsapp,
      email: gym.email,
      address: gym.address,
      rating: gym.rating,
      comments: gym.comments,
      plans: gym.plans,
      gallery: gym.gallery,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ flex: 1 }}>
            <Text style={styles.addressText} numberOfLines={1}>
              Rua Paulo Schiochet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingLeft: 16 }}>
            <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar academias, treinos, locais..."
              placeholderTextColor="#888"
              value={searchText}
              onFocus={() => setSearchActive(true)}
              onChangeText={handleSearchTextChange}
              returnKeyType="search"
              onSubmitEditing={onSubmitSearch}
            />
          </View>
          {searchActive && (
            <TouchableOpacity
              onPress={onCancelSearch}
              style={styles.cancelButton}
            >
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {searchActive && (
          <View style={styles.searchContainer}>
            {searchText.trim().length === 0 ? (
              // Mostrar buscas recentes quando não há texto
              <View>
                <View style={styles.searchSection}>
                  <Text style={styles.sectionTitle}>Buscas Recentes</Text>
                  {recentSearches.length > 0 && (
                    <TouchableOpacity onPress={() => setRecentSearches([])}>
                      <Text style={styles.clearButton}>Limpar</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {recentSearches.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma busca recente.</Text>
                ) : (
                  <View style={styles.recentSearchGrid}>
                    {recentSearches.map((item, idx) => (
                      <TouchableOpacity
                        key={`${item}-${idx}`}
                        style={styles.recentSearchChip}
                        onPress={() => handleRecentSearchPress(item)}
                      >
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#CCCCCC"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.recentSearchText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              // Mostrar resultados da busca
              <View>
                <View style={styles.searchSection}>
                  <Text style={styles.sectionTitle}>
                    {searchResults.length > 0
                      ? `${searchResults.length} resultado${
                          searchResults.length > 1 ? "s" : ""
                        } encontrado${searchResults.length > 1 ? "s" : ""}`
                      : "Nenhum resultado encontrado"}
                  </Text>
                </View>
                {searchResults.length === 0 ? (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={48} color="#666" />
                    <Text style={styles.noResultsTitle}>
                      Nenhum resultado encontrado
                    </Text>
                    <Text style={styles.noResultsSubtitle}>
                      Tente buscar por:
                    </Text>
                    <Text style={styles.noResultsSuggestion}>
                      • Nome da academia
                    </Text>
                    <Text style={styles.noResultsSuggestion}>
                      • Tipo de treino
                    </Text>
                    <Text style={styles.noResultsSuggestion}>
                      • Localização
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.searchResultsScroll}
                  >
                    <View style={styles.searchResultsGrid}>
                      {searchResults.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.searchResultCard}
                          onPress={() => handleGymPress(item)}
                        >
                          <Image
                            source={{ uri: item.photo }}
                            style={styles.searchResultImage}
                          />
                          <View style={styles.searchResultContent}>
                            <Text
                              style={styles.searchResultTitle}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <Text
                              style={styles.searchResultDescription}
                              numberOfLines={2}
                            >
                              {item.description}
                            </Text>
                            <View style={styles.searchResultFooter}>
                              <View style={styles.gridRating}>
                                {renderStars(item.rating)}
                              </View>
                              <Text style={styles.searchResultPrice}>
                                A partir de R${" "}
                                {Math.min(
                                  ...item.plans.map((p: any) =>
                                    parseFloat(p.price)
                                  )
                                )}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        )}

        {!searchActive && (
          <>
            {/* Seção de Banners */}
            <View style={styles.bannerSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                style={styles.bannerScrollView}
              >
                {banners.map((banner) => (
                  <TouchableOpacity
                    key={banner.id}
                    style={styles.bannerContainer}
                  >
                    <Image source={banner.image} style={styles.bannerImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.gridContainer}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridCard}
                    onPress={() => handleGymPress(item)}
                  >
                    <Image
                      source={{ uri: item.photo }}
                      style={styles.gridCardImage}
                    />
                    <View style={styles.gridCardContent}>
                      <Text style={styles.gridCardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={styles.gridCardDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                      <View style={styles.gridRating}>
                        {renderStars(item.rating)}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  searchBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 12,
  },
  searchInputWrapper: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  cancelButton: { marginLeft: 10 },

  header: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: { fontWeight: "600", fontSize: 18, color: "#FFFFFF" },

  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    flex: 1,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  clearButton: {
    color: "#1DB954",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    color: "#CCCCCC",
    textAlign: "center",
    marginTop: 20,
  },
  recentSearchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentSearchChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 8,
  },
  recentSearchText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 12,
  },
  noResultsSuggestion: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  searchResultsScroll: {
    flex: 1,
  },
  searchResultsGrid: {
    gap: 12,
  },
  searchResultCard: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 8,
  },
  searchResultImage: {
    width: 80,
    height: 80,
  },
  searchResultContent: {
    flex: 1,
    padding: 12,
  },
  searchResultTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  searchResultDescription: {
    fontSize: 13,
    color: "#CCCCCC",
    lineHeight: 18,
    marginBottom: 8,
  },
  searchResultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchResultPrice: {
    fontSize: 12,
    color: "#1DB954",
    fontWeight: "600",
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  gridCardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridCardContent: {
    padding: 12,
  },
  gridCardTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    color: "#FFFFFF",
  },
  gridCardDescription: {
    fontSize: 12,
    color: "#CCCCCC",
    marginBottom: 8,
    lineHeight: 16,
  },
  gridRating: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Estilos para a seção de banners
  bannerSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  bannerScrollView: {
    height: 180,
  },
  bannerContainer: {
    width: screenWidth - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
});

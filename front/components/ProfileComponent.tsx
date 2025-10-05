import { Ionicons } from "@expo/vector-icons";
// import PixIcon from "app/assets/icons/PixIcon";
import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileComponent({ route, navigation }: any) {
  const {
    title,
    description,
    profilePhoto,
    bannerPhoto,
    workingHours,
    phone,
    whatsapp,
    email,
    address,
    rating,
    comments,
    plans = [], // Array de planos [{id, name, price}]
    gallery,
  } = route.params;

  // Estados dos modais e seleção
  const [modalPlanVisible, setModalPlanVisible] = useState(false);
  const [modalPaymentVisible, setModalPaymentVisible] = useState(false);
  const [modalCardFormVisible, setModalCardFormVisible] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  // Dados cartão (simplificado)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Render stars rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: "#f2b01e", fontSize: 18 }}>
          {i <= rating ? "★" : "☆"}
        </Text>
      );
    }
    return stars;
  };

  // Header modal reutilizável
  function ModalHeader({
    title,
    onClose,
  }: {
    title: string;
    onClose: () => void;
  }) {
    return (
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderTitle}>{title}</Text>
        {/* Espaço para equilibrar o layout */}
        {/* <TouchableOpacity onPress={onClose} style={styles.modalHeaderClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity> */}
        <View style={{ width: 24 }} />
      </View>
    );
  }

  // Handlers dos modais
  function handleOpenPlanModal() {
    setModalPlanVisible(true);
  }
  function handleClosePlanModal() {
    setModalPlanVisible(false);
  }
  function handleSelectPlan(plan: any) {
    setSelectedPlan(plan);
    setModalPlanVisible(false);
    setModalPaymentVisible(true);
  }
  function handleClosePaymentModal() {
    setModalPaymentVisible(false);
    setSelectedPaymentMethod("");
  }
  function handleSelectPaymentMethod(method: string) {
    setSelectedPaymentMethod(method);
    if (method === "pix") {
      // Caso queria deixar a parte de pix futuramente, poderia abrir outro modal aqui
      // Mas foi pedido para comentar essa parte
    } else {
      setModalPaymentVisible(false); // Fecha o modal de pagamento primeiro
      // Pequeno delay para transição suave
      setTimeout(() => {
        setModalCardFormVisible(true); // Então abre o formulário
      }, 300);
    }
  }
  function handleCloseCardFormModal() {
    setModalCardFormVisible(false);
    // limpar dados
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCVV("");
    // Volta para o modal de pagamento
    setTimeout(() => {
      setModalPaymentVisible(true);
    }, 300);
  }
  function handleConfirmPayment() {
    // Aqui você pode tratar o pagamento, por enquanto só fecha modal
    alert(
      `Pagamento confirmado para o plano ${selectedPlan?.name} via ${selectedPaymentMethod}`
    );
    setModalCardFormVisible(false);
    setModalPaymentVisible(false);
    setSelectedPaymentMethod("");
    setSelectedPlan(null);
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.bannerContainer}>
        <Image source={{ uri: bannerPhoto }} style={styles.bannerImage} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Text style={styles.sectionTitle}>Informações</Text>
        <Text style={styles.infoText}>{workingHours}</Text>
        <Text style={styles.infoText}>Endereço: {address}</Text>
        <Text style={styles.stars}>{renderStars()}</Text>

        <Text style={styles.sectionTitle}>Contatos</Text>

        <View style={styles.contactRow}>
          <Ionicons
            name="call-outline"
            size={18}
            color="#CCCCCC"
            style={styles.icon}
          />
          <Text style={styles.infoText}>{phone}</Text>
        </View>

        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL(`https://wa.me/${whatsapp}`)}
        >
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color="#25D366"
            style={styles.icon}
          />
          <Text style={[styles.infoText, { color: "#25D366" }]}>
            WhatsApp: {whatsapp}
          </Text>
        </TouchableOpacity>

        <View style={styles.contactRow}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#CCCCCC"
            style={styles.icon}
          />
          <Text style={styles.infoText}>{email}</Text>
        </View>
      </View>

      {/* Seção de Portfólio */}
      <View style={styles.portfolioSection}>
        <Text style={styles.sectionTitle}>Portfólio</Text>
        <View style={styles.galleryGrid}>
          {gallery && gallery.length > 0 ? (
            gallery.map((imageUrl: string, index: number) => (
              <TouchableOpacity key={index} style={styles.galleryItem}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noGalleryText}>Nenhuma imagem disponível</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.hireButton} onPress={handleOpenPlanModal}>
        <Text style={styles.hireButtonText}>Contratar</Text>
      </TouchableOpacity>

      {/* Modal Escolher Plano */}
      <Modal
        visible={modalPlanVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePlanModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <ModalHeader
              title="Escolha um plano"
              onClose={handleClosePlanModal}
            />

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 20,
                paddingBottom: 24,
              }}
            >
              {plans.length === 0 && (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  Nenhum plano disponível.
                </Text>
              )}

              {plans.map((plan: any) => (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => handleSelectPlan(plan)}
                >
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>R$ {plan.price} / mês</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.btn, styles.btnGhost, { margin: 16 }]}
              onPress={handleClosePlanModal}
            >
              <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Escolher Forma de Pagamento */}
      <Modal
        visible={modalPaymentVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePaymentModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <ModalHeader
              title="Forma de pagamento"
              onClose={handleClosePaymentModal}
            />

            <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
              {/* <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handleSelectPaymentMethod("pix")}
              disabled={true} // Pix desabilitado conforme seu pedido
            >
              <PixIcon width={24} height={24} />
              <Text style={[styles.paymentText, { color: "#999" }]}>
                Pix (Indisponível)
              </Text>
            </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handleSelectPaymentMethod("debito")}
              >
                <Ionicons name="card-outline" size={24} color="#FFFFFF" />
                <Text style={styles.paymentText}>Cartão de débito</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => handleSelectPaymentMethod("credito")}
              >
                <Ionicons name="card-outline" size={24} color="#FFFFFF" />
                <Text style={styles.paymentText}>Cartão de crédito</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.btn, styles.btnGhost, { margin: 16 }]}
              onPress={handleClosePaymentModal}
            >
              <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Formulário Cartão */}
      <Modal
        visible={modalCardFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseCardFormModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <ModalHeader
              title={`Dados do cartão (${selectedPaymentMethod})`}
              onClose={handleCloseCardFormModal}
            />

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 24,
              }}
            >
              <Text style={styles.label}>Número do cartão</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#666"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={19}
              />

              <Text style={styles.label}>Nome no cartão</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#666"
                value={cardName}
                onChangeText={setCardName}
              />

              <Text style={styles.label}>Validade (MM/AA)</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor="#666"
                value={cardExpiry}
                onChangeText={setCardExpiry}
                maxLength={5}
              />

              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="000"
                placeholderTextColor="#666"
                value={cardCVV}
                onChangeText={setCardCVV}
                maxLength={3}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, { marginTop: 24 }]}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.btnText}>Confirmar pagamento</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnGhost, { marginTop: 12 }]}
                onPress={handleCloseCardFormModal}
              >
                <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bannerContainer: {
    position: "relative",
    height: 150,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  profileImage: {
    position: "absolute",
    bottom: -40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 4,
    color: "#FFFFFF",
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 4,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  hireButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 24,
    marginHorizontal: 20,
    alignItems: "center",
  },
  hireButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
    paddingBottom: 34, // Safe area para iPhone
  },
  modalHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeaderClose: {
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeaderTitle: {
    flex: 1,
    textAlign: "left",
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  planCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planName: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  planPrice: {
    fontSize: 16,
    color: "#1DB954",
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#FFFFFF",
  },

  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#1a1a1a",
    color: "#FFFFFF",
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnPrimary: {
    backgroundColor: "#1DB954",
  },
  btnGhost: {
    backgroundColor: "#333",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Estilos para seção de portfólio
  portfolioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  galleryItem: {
    width: "31%",
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  noGalleryText: {
    textAlign: "center",
    color: "#CCCCCC",
    fontSize: 14,
    fontStyle: "italic",
    width: "100%",
    marginTop: 20,
  },
});

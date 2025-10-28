import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isSmallScreen = screenWidth < 350;
const isMediumScreen = screenWidth >= 350 && screenWidth < 400;

export default function AccountScreen() {
  const { usuario, atualizarUsuario } = useAuth();

  const [personalData, setPersonalData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    pais: "",
  });

  useEffect(() => {
    console.log("usuario do contexto:", usuario);
    if (usuario) {
      let endereco = {
        endereco: "",
        CEP: "",
        cidade: "",
        estado: "",
        pais: "",
      };
      if (usuario.endereco_usuario) {
        if (typeof usuario.endereco_usuario === "string") {
          try {
            endereco = JSON.parse(usuario.endereco_usuario);
          } catch {
            endereco.endereco = usuario.endereco_usuario;
          }
        } else {
          endereco = usuario.endereco_usuario as any;
        }
      }
      setPersonalData({
        nome: usuario.nome_usuario || "",
        email: usuario.email_usuario || "",
        telefone: usuario.telefone_usuario || "",
        cpf: usuario.cpf_usuario || "",
        endereco: endereco.endereco || "",
        cep: endereco.CEP || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
        pais: endereco.pais || "",
      });
    }
  }, [usuario]);

  // Modal estados
  const [modalPersonalVisible, setModalPersonalVisible] = useState(false);
  const [modalPaymentVisible, setModalPaymentVisible] = useState(false);

  // Dados temporários para edição (dados pessoais)
  const [tempPersonalData, setTempPersonalData] = useState({ ...personalData });

  // Dados pagamento
  const paymentMethods = ["PIX", "Cartão de Débito", "Cartão de Crédito"];
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  // Dados cartão
  const [cardData, setCardData] = useState({
    numero: "1234 5678 9876 5432",
    validade: "12/26",
    nomeTitular: "João V. Marcelino",
    cvv: "123",
  });

  // Dados temporários para edição do cartão
  const [tempCardData, setTempCardData] = useState({ ...cardData });

  // Funções para salvar e cancelar edição dados pessoais
  async function savePersonalData() {
    // Prepare address as JSON string
    const enderecoObj = {
      endereco: tempPersonalData.endereco,
      CEP: tempPersonalData.cep,
      cidade: tempPersonalData.cidade,
      estado: tempPersonalData.estado,
      pais: tempPersonalData.pais,
    };
    const dadosAtualizar = {
      nome_usuario: tempPersonalData.nome,
      email_usuario: tempPersonalData.email,
      telefone_usuario: tempPersonalData.telefone,
      cpf_usuario: tempPersonalData.cpf,
      endereco_usuario: JSON.stringify(enderecoObj),
    };
    const sucesso = await atualizarUsuario(dadosAtualizar);
    if (sucesso) {
      setPersonalData(tempPersonalData);
      setModalPersonalVisible(false);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  }

  function cancelPersonalEdit() {
    setTempPersonalData(personalData);
    setModalPersonalVisible(false);
  }

  // Funções para salvar e cancelar edição cartão
  function saveCardData() {
    setCardData(tempCardData);
    setModalPaymentVisible(false);
  }

  function cancelCardEdit() {
    setTempCardData(cardData);
    setModalPaymentVisible(false);
  }

  // Deletar cartão
  function deleteCard() {
    Alert.alert(
      "Excluir cartão",
      "Tem certeza que deseja excluir as informações do cartão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setCardData({
              numero: "",
              validade: "",
              nomeTitular: "",
              cvv: "",
            });
            setModalPaymentVisible(false);
            setPaymentMethod("PIX");
          },
        },
      ]
    );
  }

  // Organizar dados em grupos para melhor layout
  const contactInfo = [
    { label: "Nome", value: personalData.nome, icon: "person-outline" },
    { label: "Email", value: personalData.email, icon: "mail-outline" },
    { label: "Telefone", value: personalData.telefone, icon: "call-outline" },
    { label: "CPF", value: personalData.cpf, icon: "card-outline" },
  ];

  const addressInfo = [
    {
      label: "Endereço",
      value: personalData.endereco,
      icon: "location-outline",
    },
    { label: "CEP", value: personalData.cep, icon: "pin-outline" },
    { label: "Cidade", value: personalData.cidade, icon: "business-outline" },
    { label: "Estado", value: personalData.estado, icon: "map-outline" },
    { label: "País", value: personalData.pais, icon: "globe-outline" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minha Conta</Text>
          <Text style={styles.headerSubtitle}>
            Gerencie suas informações pessoais
          </Text>
        </View>

        {/* Card Informações de Contato */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1DB954"
              />
              <Text style={styles.cardTitle}>Informações de Contato</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalPersonalVisible(true)}
            >
              <Ionicons name="pencil-outline" size={20} color="#1DB954" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            {contactInfo.map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name={item.icon as any} size={16} color="#CCCCCC" />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card Endereço */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="location-outline" size={24} color="#1DB954" />
              <Text style={styles.cardTitle}>Endereço</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalPersonalVisible(true)}
            >
              <Ionicons name="pencil-outline" size={20} color="#1DB954" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            {addressInfo.map((item, index) => (
              <View key={index} style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name={item.icon as any} size={16} color="#CCCCCC" />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card Dados de Pagamento */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="wallet-outline" size={24} color="#1DB954" />
              <Text style={styles.cardTitle}>Dados de Pagamento</Text>
            </View>
            {(paymentMethod === "Cartão de Débito" ||
              paymentMethod === "Cartão de Crédito") && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setModalPaymentVisible(true)}
              >
                <Ionicons name="pencil-outline" size={20} color="#1DB954" />
              </TouchableOpacity>
            )}
          </View>

          {/* Seleção de método */}
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  paymentMethod === method && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <Ionicons
                  name={method === "PIX" ? "logo-whatsapp" : "card-outline"}
                  size={20}
                  color={paymentMethod === method ? "#fff" : "#1DB954"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === method && styles.paymentTextSelected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mostrar dados cartão se selecionado */}
          {(paymentMethod === "Cartão de Débito" ||
            paymentMethod === "Cartão de Crédito") && (
            <View style={styles.cardInfoContainer}>
              <View style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name="card-outline" size={16} color="#CCCCCC" />
                  <Text style={styles.infoLabel}>Número</Text>
                </View>
                <Text style={styles.infoValue}>
                  {cardData.numero || "Não cadastrado"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name="calendar-outline" size={16} color="#CCCCCC" />
                  <Text style={styles.infoLabel}>Validade</Text>
                </View>
                <Text style={styles.infoValue}>{cardData.validade || "-"}</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name="person-outline" size={16} color="#CCCCCC" />
                  <Text style={styles.infoLabel}>Nome no cartão</Text>
                </View>
                <Text style={styles.infoValue}>
                  {cardData.nomeTitular || "-"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Modal edição dados pessoais */}
        <Modal visible={modalPersonalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Editar Dados Pessoais</Text>

                {Object.entries(tempPersonalData).map(([key, value]) => (
                  <View key={key} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={(text) =>
                        setTempPersonalData((prev) => ({
                          ...prev,
                          [key]: text,
                        }))
                      }
                      placeholder={"Digite " + key}
                      placeholderTextColor="#666"
                    />
                  </View>
                ))}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={cancelPersonalEdit}
                  >
                    <Text style={styles.modalButtonSecondaryText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={savePersonalData}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Atualizar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal edição dados cartão */}
        <Modal visible={modalPaymentVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Editar Dados do Cartão</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Número do cartão</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={19}
                    placeholder="1234 5678 9876 5432"
                    placeholderTextColor="#666"
                    value={tempCardData.numero}
                    onChangeText={(text) =>
                      setTempCardData((prev) => ({ ...prev, numero: text }))
                    }
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Validade (MM/AA)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12/26"
                    placeholderTextColor="#666"
                    maxLength={5}
                    value={tempCardData.validade}
                    onChangeText={(text) =>
                      setTempCardData((prev) => ({ ...prev, validade: text }))
                    }
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nome no cartão</Text>
                  <TextInput
                    style={styles.input}
                    value={tempCardData.nomeTitular}
                    placeholderTextColor="#666"
                    onChangeText={(text) =>
                      setTempCardData((prev) => ({
                        ...prev,
                        nomeTitular: text,
                      }))
                    }
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholder="123"
                    placeholderTextColor="#666"
                    value={tempCardData.cvv}
                    onChangeText={(text) =>
                      setTempCardData((prev) => ({ ...prev, cvv: text }))
                    }
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonDanger,
                    { marginTop: 12 },
                  ]}
                  onPress={deleteCard}
                >
                  <Text style={styles.modalButtonDangerText}>
                    Deletar Cartão
                  </Text>
                </TouchableOpacity>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={cancelCardEdit}
                  >
                    <Text style={styles.modalButtonSecondaryText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={saveCardData}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Atualizar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollContent: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "#CCCCCC",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: isSmallScreen ? 12 : 14,
    color: "#CCCCCC",
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontWeight: "500",
    fontSize: isSmallScreen ? 14 : 16,
    color: "#FFFFFF",
    marginLeft: 22,
    lineHeight: 22,
  },
  paymentMethodsContainer: {
    gap: 8,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#1DB954",
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
  },
  paymentOptionSelected: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  paymentText: {
    fontSize: 15,
    color: "#1DB954",
    fontWeight: "600",
  },
  paymentTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  cardInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: isSmallScreen ? 18 : 22,
    fontWeight: "800",
    marginBottom: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCCCCC",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#2a2a2a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#1DB954",
  },
  modalButtonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalButtonSecondary: {
    backgroundColor: "#333",
  },
  modalButtonSecondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonDanger: {
    backgroundColor: "#e74c3c",
  },
  modalButtonDangerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

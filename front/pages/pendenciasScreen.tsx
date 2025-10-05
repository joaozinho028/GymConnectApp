import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isSmallScreen = screenWidth < 350;

// Lista de mensalidades pendentes organizadas por academia
const mensalidadesPendentes = [
  {
    nomeAcademia: "FitWay",
    data: [
      {
        id: "1",
        mes: "Setembro 2024",
        valor: "R$ 89,90",
        vencimento: "15/09/2024",
        diasAtraso: 18,
        unidade: "Jaraguá do Sul - Centro",
        status: "vencida",
      },
      {
        id: "2",
        mes: "Outubro 2024",
        valor: "R$ 89,90",
        vencimento: "15/10/2024",
        diasAtraso: -12,
        unidade: "Jaraguá do Sul - Centro",
        status: "proximoVencimento",
      },
    ],
  },
  {
    nomeAcademia: "Iron Gym",
    data: [
      {
        id: "3",
        mes: "Agosto 2024",
        valor: "R$ 120,00",
        vencimento: "10/08/2024",
        diasAtraso: 54,
        unidade: "Centro",
        status: "vencida",
      },
      {
        id: "4",
        mes: "Setembro 2024",
        valor: "R$ 120,00",
        vencimento: "10/09/2024",
        diasAtraso: 23,
        unidade: "Centro",
        status: "vencida",
      },
    ],
  },
];

export default function PendenciasScreen() {
  const [filtroAtivo, setFiltroAtivo] = useState<
    "todos" | "vencidas" | "aVencer"
  >("todos");

  const handlePagamento = (item: any) => {
    Alert.alert(
      "Confirmar Pagamento",
      `Deseja pagar a mensalidade de ${item.mes}?\nValor: ${item.valor}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Pagar",
          style: "default",
          onPress: () => {
            Alert.alert("Sucesso", "Redirecionando para o pagamento...");
            // Aqui seria implementada a lógica de pagamento
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencida":
        return "#e74c3c";
      case "proximoVencimento":
        return "#f39c12";
      default:
        return "#95a5a6";
    }
  };

  const getStatusText = (item: any) => {
    if (item.status === "vencida") {
      return `${item.diasAtraso} dias em atraso`;
    } else if (item.status === "proximoVencimento") {
      return `Vence em ${Math.abs(item.diasAtraso)} dias`;
    }
    return "Em dia";
  };

  const renderMensalidadeItem = ({ item }: any) => (
    <View
      style={[
        styles.mensalidadeCard,
        { borderLeftColor: getStatusColor(item.status) },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.status === "vencida" ? "warning" : "calendar-outline"}
            size={24}
            color={getStatusColor(item.status)}
          />
        </View>
        <View style={styles.mensalidadeInfo}>
          <Text style={styles.mesText}>{item.mes}</Text>
          <Text style={styles.unidadeText}>{item.unidade}</Text>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item)}
          </Text>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.valorText}>{item.valor}</Text>
          <Text style={styles.vencimentoText}>Venc: {item.vencimento}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.pagarButton,
            { backgroundColor: getStatusColor(item.status) },
          ]}
          onPress={() => handlePagamento(item)}
        >
          <Ionicons name="card-outline" size={16} color="#fff" />
          <Text style={styles.pagarButtonText}>
            {item.status === "vencida" ? "Pagar Agora" : "Pagar Antecipado"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.detalhesButton}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.detalhesButtonText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { nomeAcademia } }: any) => (
    <View style={styles.sectionHeader}>
      <Ionicons name="business-outline" size={20} color="#1DB954" />
      <Text style={styles.academyHeader}>{nomeAcademia}</Text>
    </View>
  );

  const filtrarMensalidades = () => {
    return mensalidadesPendentes
      .map((academia) => ({
        ...academia,
        data: academia.data.filter((mensalidade) => {
          if (filtroAtivo === "vencidas")
            return mensalidade.status === "vencida";
          if (filtroAtivo === "aVencer")
            return mensalidade.status === "proximoVencimento";
          return true; // 'todos'
        }),
      }))
      .filter((academia) => academia.data.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      {/* Header com filtros */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Minhas Pendências</Text>
        <Text style={styles.headerSubtitle}>Gerencie suas mensalidades</Text>

        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[
              styles.filtroButton,
              filtroAtivo === "todos" && styles.filtroButtonActive,
            ]}
            onPress={() => setFiltroAtivo("todos")}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={filtroAtivo === "todos" ? "#fff" : "#CCCCCC"}
            />
            <Text
              style={[
                styles.filtroText,
                filtroAtivo === "todos" && styles.filtroTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroButton,
              filtroAtivo === "vencidas" && styles.filtroButtonActive,
            ]}
            onPress={() => setFiltroAtivo("vencidas")}
          >
            <Ionicons
              name="warning"
              size={16}
              color={filtroAtivo === "vencidas" ? "#fff" : "#e74c3c"}
            />
            <Text
              style={[
                styles.filtroText,
                filtroAtivo === "vencidas" && styles.filtroTextActive,
              ]}
            >
              Atrasadas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroButton,
              filtroAtivo === "aVencer" && styles.filtroButtonActive,
            ]}
            onPress={() => setFiltroAtivo("aVencer")}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={filtroAtivo === "aVencer" ? "#fff" : "#f39c12"}
            />
            <Text
              style={[
                styles.filtroText,
                filtroAtivo === "aVencer" && styles.filtroTextActive,
              ]}
            >
              Futuras
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de mensalidades */}
      <SectionList
        sections={filtrarMensalidades()}
        keyExtractor={(item) => item.id}
        renderItem={renderMensalidadeItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
        SectionSeparatorComponent={() => (
          <View style={styles.sectionSeparator} />
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  headerContainer: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  filtroButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#333",
    gap: 6,
  },
  filtroButtonActive: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  filtroText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCCCCC",
  },
  filtroTextActive: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  academyHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  mensalidadeCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  mensalidadeInfo: {
    flex: 1,
  },
  mesText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  unidadeText: {
    fontSize: 13,
    color: "#CCCCCC",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  valorContainer: {
    alignItems: "flex-end",
  },
  valorText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  vencimentoText: {
    fontSize: 11,
    color: "#CCCCCC",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  pagarButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  pagarButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  detalhesButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#333",
    gap: 4,
  },
  detalhesButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionSeparator: {
    height: 16,
  },
  itemSeparator: {
    height: 8,
  },
});

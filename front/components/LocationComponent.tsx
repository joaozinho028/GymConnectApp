import Slider from "@react-native-community/slider";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LocationScreen() {
  const navigation = useNavigation();
  const [radius, setRadius] = useState(10); // Raio inicial de 10km
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <Text style={styles.description}>
        Ajuste a sua localização e o raio de alcance para encontrar academias
        próximas.
      </Text>

      {/* Seletor de Raio */}
      <View style={styles.section}>
        <Text style={styles.label}>Raio de busca: {radius} km</Text>
        <Slider
          style={{ width: "100%" }}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333"
          thumbTintColor="#1DB954"
        />
      </View>

      {/* Inputs para cidade e estado */}
      <View style={styles.section}>
        <Text style={styles.label}>Cidade</Text>
        <TextInput
          placeholder="Digite sua cidade"
          placeholderTextColor="#666"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Estado</Text>
        <TextInput
          placeholder="Digite seu estado"
          placeholderTextColor="#666"
          style={styles.input}
          value={state}
          onChangeText={setState}
        />
      </View>

      {/* Botão de salvar - futuro uso */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 24 : 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#1a1a1a",
  },
  saveButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { v4 as uuidv4 } from "uuid";

dayjs.locale("pt-br");

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt-br";

const STORAGE_KEY = "@events";

interface CalendarEvent {
  id: string;
  title: string;
  notes?: string;
  start: Date;
  end: Date;
}

type EventsByDate = Record<string, CalendarEvent[]>;

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const [title, setTitle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setEventsByDate(JSON.parse(raw));
      } catch (e) {
        console.warn("Erro ao carregar eventos", e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(eventsByDate)).catch((e) =>
      console.warn("Erro ao salvar eventos", e)
    );
  }, [eventsByDate]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    Object.keys(eventsByDate).forEach((d) => {
      if ((eventsByDate[d] || []).length > 0) {
        marks[d] = { marked: true, dots: [{ color: "#1DB954" }] };
      }
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#1DB954",
    };
    return marks;
  }, [eventsByDate, selectedDate]);

  const dayEvents = useMemo(() => {
    const list = eventsByDate[selectedDate] || [];
    return [...list].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [eventsByDate, selectedDate]);

  function openCreate() {
    setEditing(null);
    const base = new Date();
    const rounded = new Date(base);
    rounded.setMinutes(base.getMinutes() < 30 ? 30 : 0, 0, 0);
    setStart(rounded);

    const endDefault = new Date(rounded);
    endDefault.setHours(endDefault.getHours() + 1);
    setEnd(endDefault);

    setTitle("");
    setNotes("");
    setModalVisible(true);
  }

  function openEdit(ev: CalendarEvent) {
    setEditing(ev);
    setTitle(ev.title);
    setNotes(ev.notes || "");
    setStart(new Date(ev.start));
    setEnd(new Date(ev.end));
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function navigateToToday() {
    const today = dayjs().format("YYYY-MM-DD");
    setSelectedDate(today);
  }

  function navigateMonth(direction: "prev" | "next") {
    const current = dayjs(selectedDate);
    const newDate =
      direction === "next"
        ? current.add(1, "month").format("YYYY-MM-DD")
        : current.subtract(1, "month").format("YYYY-MM-DD");
    setSelectedDate(newDate);
  }

  function checkTimeConflict(
    newStart: Date,
    newEnd: Date,
    excludeId?: string
  ): CalendarEvent | null {
    const dateKey = dayjs(newStart).format("YYYY-MM-DD");
    const dayEvents = eventsByDate[dateKey] || [];

    for (const event of dayEvents) {
      if (excludeId && event.id === excludeId) continue;

      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      if (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      ) {
        return event;
      }
    }
    return null;
  }

  function upsertEvent() {
    if (!title.trim()) {
      Alert.alert(
        "Título obrigatório",
        "Informe um título para o agendamento."
      );
      return;
    }
    if (end <= start) {
      Alert.alert("Horário inválido", "O término deve ser depois do início.");
      return;
    }

    const conflict = checkTimeConflict(start, end, editing?.id);
    if (conflict) {
      Alert.alert(
        "Conflito de horário",
        `Já existe um agendamento "${conflict.title}" no horário ${dayjs(
          conflict.start
        ).format("HH:mm")} - ${dayjs(conflict.end).format("HH:mm")}`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salvar mesmo assim", onPress: () => saveEvent() },
        ]
      );
      return;
    }

    saveEvent();
  }

  function saveEvent() {
    const newEvent: CalendarEvent = editing
      ? { ...editing, title: title.trim(), notes: notes.trim(), start, end }
      : { id: uuidv4(), title: title.trim(), notes: notes.trim(), start, end };

    setEventsByDate((prev) => {
      const copy = { ...prev };
      const currentList = [...(copy[selectedDate] || [])];
      if (editing) {
        const idx = currentList.findIndex((e) => e.id === editing.id);
        if (idx >= 0) currentList[idx] = newEvent;
      } else {
        currentList.push(newEvent);
      }
      copy[selectedDate] = currentList;
      return copy;
    });

    closeModal();
  }

  function deleteEvent(ev: CalendarEvent) {
    Alert.alert("Excluir agendamento", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          setEventsByDate((prev) => {
            const copy = { ...prev };
            copy[selectedDate] = (copy[selectedDate] || []).filter(
              (e) => e.id !== ev.id
            );
            return copy;
          });
          closeModal();
        },
      },
    ]);
  }

  const renderItem: ListRenderItem<CalendarEvent> = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => openEdit(item)}>
      <View style={styles.eventHeader}>
        <View style={styles.eventTimeContainer}>
          <Ionicons name="calendar-outline" size={18} color="#1DB954" />
          <Text style={styles.eventTime}>
            {dayjs(item.start).format("HH:mm")} -{" "}
            {dayjs(item.end).format("HH:mm")}
          </Text>
        </View>
      </View>
      <Text style={styles.eventTitle}>{item.title}</Text>
      {item.notes ? <Text style={styles.eventNotes}>{item.notes}</Text> : null}
      <View style={styles.eventFooter}>
        <Text style={styles.durationText}>
          Duração:{" "}
          {Math.round(
            (new Date(item.end).getTime() - new Date(item.start).getTime()) /
              60000
          )}{" "}
          min
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView style={styles.container}>
        <Calendar
          firstDay={1}
          markedDates={markedDates}
          onDayPress={(d) => setSelectedDate(d.dateString)}
          theme={{
            calendarBackground: "#1a1a1a",
            textSectionTitleColor: "#FFFFFF",
            selectedDayBackgroundColor: "#1DB954",
            selectedDayTextColor: "#FFFFFF",
            todayTextColor: "#1DB954",
            dayTextColor: "#FFFFFF",
            textDisabledColor: "#666",
            arrowColor: "#1DB954",
            monthTextColor: "#FFFFFF",
            indicatorColor: "#1DB954",
            textDayFontWeight: "600",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        <View style={styles.quickNavigation}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigateMonth("prev")}
          >
            <Ionicons name="chevron-back" size={20} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.todayBtn} onPress={navigateToToday}>
            <Text style={styles.todayBtnText}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigateMonth("next")}
          >
            <Ionicons name="chevron-forward" size={20} color="#1DB954" />
          </TouchableOpacity>
        </View>

        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>
            {dayjs(selectedDate).format("DD [de] MMMM [de] YYYY")}
          </Text>
          <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={dayEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          style={{ backgroundColor: "#0a0a0a" }}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", color: "#CCCCCC", marginTop: 16 }}
            >
              Nenhum agendamento para este dia.
            </Text>
          }
          renderItem={renderItem}
        />

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editing ? "Editar agendamento" : "Novo agendamento"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Título</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex.: Treino de Peito e Tríceps"
                placeholderTextColor="#888"
                style={styles.input}
              />
              <Text style={styles.label}>Início</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={styles.inputLike}
              >
                <Ionicons name="time-outline" size={18} color="#FFFFFF" />
                <Text style={{ marginLeft: 8, color: "#FFFFFF" }}>
                  {dayjs(start).format("DD/MM/YYYY HH:mm")}
                </Text>
              </TouchableOpacity>{" "}
              <Text style={styles.label}>Término</Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={styles.inputLike}
              >
                <Ionicons name="time-outline" size={18} color="#FFFFFF" />
                <Text style={{ marginLeft: 8, color: "#FFFFFF" }}>
                  {dayjs(end).format("DD/MM/YYYY HH:mm")}
                </Text>
              </TouchableOpacity>{" "}
              <Text style={styles.label}>Observações</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Opcional"
                placeholderTextColor="#888"
                style={[styles.input, { height: 80 }]}
                multiline
              />
              <View style={styles.modalActions}>
                {editing ? (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#e53935" }]}
                    onPress={() => deleteEvent(editing)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                ) : null}

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={upsertEvent}
                >
                  <Text style={styles.btnText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showStartPicker && (
          <DateTimePicker
            value={start}
            mode="datetime"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStart(date);
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={end}
            mode="datetime"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEnd(date);
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  quickNavigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  navBtn: { padding: 8, borderRadius: 20, marginHorizontal: 20 },
  todayBtn: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#0a0a0a",
  },
  dayHeaderText: { fontSize: 16, fontWeight: "600", flex: 1, color: "#FFFFFF" },
  addBtn: {
    backgroundColor: "#1DB954",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  eventCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1DB954",
    borderWidth: 1,
    borderColor: "#333",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTimeContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  eventTime: {
    fontSize: 14,
    color: "#1DB954",
    marginLeft: 8,
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  eventNotes: {
    fontSize: 13,
    color: "#CCCCCC",
    marginBottom: 8,
    fontStyle: "italic",
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 8,
    marginTop: 8,
  },
  durationText: { fontSize: 11, color: "#888", textAlign: "right" },
  modalBackdrop: { flex: 1, backgroundColor: "transparent" },
  modalCard: { flex: 1, padding: 16, backgroundColor: "#1a1a1a" },
  modalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: "700", flex: 1, color: "#FFFFFF" },
  label: { fontWeight: "600", marginTop: 8, marginBottom: 6, color: "#FFFFFF" },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#2a2a2a",
    color: "#FFFFFF",
  },
  inputLike: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
  },
  modalActions: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnGhost: { backgroundColor: "#333", marginRight: 10 },
  btnPrimary: { backgroundColor: "#1DB954" },
  btnText: { color: "#fff", fontWeight: "700" },
});

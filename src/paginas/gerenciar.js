import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Gerenciar({ navigation, route }) {
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slide = useState(new Animated.Value(-200))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [modalConfirmarVisible, setModalConfirmarVisible] = useState(false);
  const [textoConfirmar, setTextoConfirmar] = useState("");
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  function abrirFecharMenu() {
    setMenuVisible(!menuVisible);
    Animated.timing(slide, {
      toValue: menuVisible ? -200 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  useEffect(() => {
    carregarUsuario();
    carregarReservas();
  }, []);

  const carregarUsuario = async () => {
    try {
      const res = await fetch("http://*******/aero_conexao/get_usuarios.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) setUsuario(json.usuarios);
    } catch (err) { console.log(err); }
  };

  const carregarReservas = async () => {
    try {
      const res = await fetch("http://*******/aero_conexao/get_reservas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) setReservas(json.reservas);
    } catch (err) { console.log(err); }
  };

  const cancelarReserva = (id_passagem) => {
    setReservaSelecionada(id_passagem);
    setTextoConfirmar("");
    setModalConfirmarVisible(true);
  };

  const confirmarCancelamento = () => {
    if (textoConfirmar !== "CONFIRMAR") {
      Alert.alert("Erro", "Você deve digitar CONFIRMAR exatamente.");
      return;
    }

    fetch("http://*******/aero_conexao/cancelar_reserva.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_passagem: reservaSelecionada }),
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert("Reserva", data.msg);
        if (data.success) carregarReservas();
        setModalConfirmarVisible(false);
      })
      .catch(err => console.log(err));
  };

  const dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const hoje = new Date();
  const dataHoje = `Hoje é ${dias[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

  return (
    <View style={styles.safeArea}>
      {menuVisible && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={abrirFecharMenu} />}

      {/* MENU LATERAL */}
      <Animated.View style={[styles.menu, { left: slide }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out-outline" size={20} color="#000" />
          <Text style={styles.menuItemText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Empresa')}>
          <Ionicons name="information-circle-outline" size={20} color="#000" />
          <Text style={styles.menuItemText}>Informações da empresa</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient colors={["#fffbe6", "#f6e9be"]} style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={26} color="#000" />
            </TouchableOpacity>

            <View></View>

            <View style={styles.rightIcons}>
              <TouchableOpacity onPress={() => navigation.navigate("Perfil", { id })}>
                <Image
                  source={{ uri: usuario?.foto ?? "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
                  style={styles.avatar}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={abrirFecharMenu}>
                <View style={menuVisible ? styles.menuIconAtivo : styles.menuIcon}>
                  <Ionicons name="menu-outline" size={26} color="#000" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.bemvindo}>Gerenciar Reservas</Text>
          <Text style={styles.data}>{dataHoje}</Text>
        </LinearGradient>

        {/* TEXTO INFORMATIVO */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Gerencie suas reservas ✈️</Text>
          <Text style={styles.infoText}>
            Aqui você pode visualizar, alterar ou cancelar suas reservas.{"\n\n"}
            Para cancelar, digite <Text style={styles.boldText}>CONFIRMAR</Text> exatamente como mostrado, garantindo que você está ciente de possíveis cobranças.{"\n\n"}
            Aproveite para verificar <Text style={styles.boldText}>datas, horários</Text> e detalhes do seu voo, mantendo suas viagens organizadas e sem imprevistos.
          </Text>
        </View>

        <View style={styles.content}>
          {reservas.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 30 }}>Nenhuma reserva encontrada.</Text>
          ) : (
            reservas.map(r => (
              <Animated.View key={r.id_passagem} style={[styles.card, { opacity: fadeAnim }]}>
                
                <View style={styles.cardHeader}>
                  <Ionicons name="ticket-outline" size={32} color="#d4af37" />
                  <Text style={styles.cardTitle}>{r.origem} → {r.destino}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>Data</Text>
                    <Text style={styles.cardValue}>{r.data_voo}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardLabel}>Hora</Text>
                    <Text style={styles.cardValue}>{r.hora_voo}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={[styles.cardButton, { backgroundColor: "#d9534f" }]} onPress={() => cancelarReserva(r.id_passagem)}>
                    <Text style={styles.cardButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.cardButton, { backgroundColor: "#5bc0de" }]} onPress={() => navigation.navigate("Aeroporto", { id })}>
                    <Text style={styles.cardButtonText}>Aeroporto</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL CONFIRMAR */}
      <Modal animationType="fade" transparent={true} visible={modalConfirmarVisible} onRequestClose={() => setModalConfirmarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Confirmar Cancelamento ⚠️</Text>
            <Text style={styles.modalText}>Para cancelar esta reserva, digite: 'CONFIRMAR' (possível cobrança)</Text>

            <TextInput
              value={textoConfirmar}
              onChangeText={setTextoConfirmar}
              placeholder="Digite CONFIRMAR"
              placeholderTextColor="#888"
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#ccc" }]} onPress={() => setModalConfirmarVisible(false)}>
                <Text style={styles.modalBtnText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#d9534f" }]} onPress={confirmarCancelamento}>
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#faf4e6" },
  overlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0)", zIndex: 50 },
  menu: { position: "absolute", top: 0, width: 200, height: "100%", backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 15, elevation: 8, zIndex: 99 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  menuItemText: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 35, height: 35, borderRadius: 20, marginRight: 10, backgroundColor: "#ddd" },
  menuIcon: { padding: 6, borderRadius: 500, marginLeft:10 },
  menuIconAtivo: { padding: 6, borderRadius: 500, backgroundColor: "rgba(0,0,0,0.15)", marginLeft:10 },
  bemvindo: { fontSize: 20, fontWeight: "700" },
  data: { color: "#666" },
  content: { padding: 20 },
  infoBox: { backgroundColor: "#fff", marginHorizontal: 20, marginTop: 15, padding: 15, borderRadius: 12, elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#333" },
  infoText: { fontSize: 14, lineHeight: 20, color: "#555" },
  boldText: { fontWeight: "700", color: "#d4af37" },

  // NOVOS ESTILOS DOS CARDS
  card: { backgroundColor: "#fff", borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginLeft: 10 },
  cardBody: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  cardInfo: { alignItems: "center", flex: 1 },
  cardLabel: { fontSize: 12, color: "#888", marginBottom: 2 },
  cardValue: { fontSize: 14, fontWeight: "600", color: "#333" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  cardButton: { flex: 1, paddingVertical: 10, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  cardButtonText: { color: "#fff", fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 12, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  modalText: { textAlign: "center", color: "#555", marginBottom: 15 },
  modalInput: { backgroundColor: "#f2f2f2", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: { flex: 1, padding: 10, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  modalBtnText: { fontWeight: "700", fontSize: 14 },
});

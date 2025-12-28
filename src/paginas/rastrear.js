import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Rastrear({ navigation, route }) {
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [bagagens, setBagagens] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slide = useState(new Animated.Value(-200))[0];

  function abrirFecharMenu() {
    setMenuVisible(!menuVisible);
    Animated.timing(slide, {
      toValue: menuVisible ? -200 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    carregarUsuario();
    carregarBagagens();
  }, []);

  async function carregarUsuario() {
    try {
      const response = await fetch("http://*******/aero_conexao/get_usuarios.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await response.json();
      if (json.success) setUsuario(json.usuarios);
    } catch (error) {
      console.log(error);
    }
  }

  async function carregarBagagens() {
    try {
      const response = await fetch("http://*******/aero_conexao/get_bagagens.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await response.json();
      if (json.success) setBagagens(json.bagagens);
    } catch (error) {
      console.log(error);
    }
  }

  const progressoStatus = (status) => {
    switch (status) {
      case "Despachada": return 0.2;
      case "Em trânsito": return 0.4;
      case "No porão da aeronave": return 0.6;
      case "Na esteira": return 0.8;
      case "Pronta para retirada": return 1.0;
      default: return 0;
    }
  };

  const dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const hoje = new Date();
  const dataHoje = `Hoje é ${dias[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

  const renderBagagem = (b) => (
    <View key={b.id_bagagem} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.codigo}>{b.origem} → {b.destino}</Text>
        <TouchableOpacity style={[styles.status, { backgroundColor: "#8b7fa3" }]} onPress={() => Alert.alert("Status da Bagagem", `Última atualização: ${b.ultima_atualizacao}`)}>
          <Text style={styles.statusText}>{b.status_bagagem}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.companhia}>Data do voo: {b.data_voo} | {b.hora_voo}</Text>
      <Text style={styles.infoText}>Código: {b.codigo_rastreio}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressoStatus(b.status_bagagem)*100}%` }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={abrirFecharMenu} activeOpacity={1} />}

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
        <LinearGradient colors={["#fffbe6", "#f6e9be"]} style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={26} color="#000" />
            </TouchableOpacity>

            <View style={styles.logoRow}></View>

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

          <Text style={styles.bemvindo}>Rastreamento de Bagagem</Text>
          <Text style={styles.data}>{dataHoje}</Text>
        </LinearGradient>

        {/* TEXTO INFORMATIVO SOBRE RASTREAMENTO */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Como acompanhar sua bagagem 🛄</Text>
          <Text style={styles.infoText}>
            Fique tranquilo: cada etapa da sua bagagem é exibida com clareza.{"\n\n"}
            A <Text style={styles.boldText}>barra de progresso</Text> mostra onde ela se encontra, e você pode conferir detalhes como <Text style={styles.boldText}>código de rastreio</Text>, <Text style={styles.boldText}>status atual</Text> e <Text style={styles.boldText}>última atualização</Text>.{"\n\n"}
            Lembre-se de chegar com antecedência ao aeroporto para retirar sua bagagem sem contratempos.
          </Text>
        </View>

        <View style={styles.content}>
          {bagagens.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 30 }}>Nenhuma bagagem encontrada.</Text>
          ) : (
            bagagens.map(renderBagagem)
          )}
        </View>
      </ScrollView>
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
  logoRow: { flexDirection: "row", alignItems: "center" },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  boldText: { fontWeight: "700", color: "#a39b7fff" },
  avatar: { width: 35, height: 35, borderRadius: 20 },
  menuIcon: { padding: 6, borderRadius: 50, marginLeft:10 },
  menuIconAtivo: { padding: 6, borderRadius: 500, backgroundColor: "rgba(0,0,0,0.15)", marginLeft:10  },
  bemvindo: { fontSize: 20, fontWeight: "700", color: "#000" },
  data: { color: "#666" },
  infoBox: { backgroundColor: "#fff", marginHorizontal: 20, marginTop: 15, padding: 15, borderRadius: 12, elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#333" },
  infoText: { fontSize: 14, lineHeight: 20, color: "#555" },
  content: { padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  codigo: { fontWeight: "700", fontSize: 16, color: "#222" },
  status: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  companhia: { fontSize: 14, color: "#666", marginTop: 8, marginBottom: 8 },
  infoText: { fontSize: 14, color: "#333333ff" },
  progressBar: { width: "100%", height: 8, backgroundColor: "#eee", borderRadius: 10, marginTop: 12, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#d8d4f2", borderRadius: 10 },
});

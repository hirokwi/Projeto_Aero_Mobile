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

export default function Check_in({ navigation, route }) {
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [voos, setVoos] = useState([]);
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
    carregarVoos();
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

  async function carregarVoos() {
    try {
      const response = await fetch("http://*******/aero_conexao/checkin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao: "listar", id_usuario: id })
      });
      const json = await response.json();
      if (json.success) setVoos(json.voos);
    } catch (error) {
      console.log(error);
    }
  }

  const getStatus = (voo) => {
    const agora = new Date();
    const dataVoo = new Date(voo.data + " " + voo.hora);
    const diffHoras = (dataVoo - agora) / (1000 * 60 * 60);

    if (voo.confirmado == 1)
      return { texto: "Check-in realizado", cor: "#6fcf97", explicacao: "Você já realizou o check-in para este voo." };
    if (diffHoras <= 72)
      return { texto: "Disponível", cor: "#f2c94c", explicacao: "O check-in está disponível, confirme agora." };
    return { texto: "Indisponível", cor: "#bdbdbd", explicacao: "O check-in ainda não está liberado." };
  };

  const dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const hoje = new Date();
  const dataHoje = `Hoje é ${dias[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

  const renderVoo = (v) => {
    const status = getStatus(v);
    return (
      <View key={v.id_passagem} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.codigo}>Voo {v.id_passagem}</Text>
          <TouchableOpacity style={[styles.status, { backgroundColor: status.cor }]} onPress={() => Alert.alert("Status do Voo", status.explicacao)}>
            <Text style={styles.statusText}>{status.texto}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.companhia}>{v.origem} → {v.destino}</Text>
        <Text style={styles.infoText}>Data: {v.data} | Hora: {v.hora}</Text>

        {status.texto === "Disponível" && (
          <TouchableOpacity style={styles.cardButton} onPress={() => fazerCheckIn(v.id_passagem)}>
            <Text style={styles.cardButtonText}>Fazer Check-in</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const fazerCheckIn = (id_passagem) => {
    fetch("http://*******/aero_conexao/checkin.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "fazer_checkin", id_passagem }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert("Check-in", data.msg);
        if (data.success) carregarVoos();
      })
      .catch((err) => console.log(err));
  };

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

          <Text style={styles.bemvindo}>Check-in Online</Text>
          <Text style={styles.data}>{dataHoje}</Text>
        </LinearGradient>

        {/* TEXTO INFORMATIVO SOBRE CHECK-IN */}
        <View style={styles.infoBox}>
  <Text style={styles.infoTitle}>Como funciona o Check-in Online 🛫</Text>
  <Text style={styles.infoText}>
    Você pode realizar o check-in para seus voos diretamente aqui.{"\n\n"}
    O check-in é liberado até <Text style={styles.boldText}>72 horas</Text> antes do voo. 
    Garanta que seus <Text style={styles.boldText}>dados estejam corretos</Text> e confirme seu assento.{"\n\n"}
    Lembre-se de chegar ao aeroporto com <Text style={styles.boldText}>antecedência</Text> e conferir todos os 
    <Text style={styles.boldText}> documentos necessários</Text> para embarque. 🛄✨{"\n\n"}
    Aproveite a praticidade e evite filas longas, tornando sua viagem mais tranquila e segura.
  </Text>
</View>
        

        <View style={styles.content}>
          {voos.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 30 }}>Nenhum voo disponível para check-in.</Text>
          ) : (
            voos.map(renderVoo)
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
  boldText: { fontWeight: "700", color: "#d4af37" },
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
  infoText: { fontSize: 14, color: "#333" },
  cardButton: { backgroundColor: "#d4af37", paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, marginTop: 10 },
  cardButtonText: { color: "#fff", fontWeight: "700" },
});

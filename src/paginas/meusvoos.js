import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MeusVoos({ navigation, route }) {
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [voos, setVoos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slide = useState(new Animated.Value(-200))[0];

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTexto, setPopupTexto] = useState("");

  function mostrarPopup(texto) {
    setPopupTexto(texto);
    setPopupVisible(true);
  }

  function fecharPopup() {
    setPopupVisible(false);
  }

  function abrirFecharMenu() {
    setMenuVisible(!menuVisible);

    Animated.timing(slide, {
      toValue: menuVisible ? -200 : 0,
      duration: 250,
      useNativeDriver: false
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

      if (json.success) {
        setUsuario(json.usuarios);
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  async function carregarVoos() {
    try {
      const response = await fetch("http://*******/aero_conexao/get_voos_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const json = await response.json();

      if (json.success) {
        setVoos(json.voos);
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  function getStatus(voo) {
    const agora = new Date();
    const dataVoo = new Date(voo.data_voo + " " + voo.hora_voo);

    const diffMs = dataVoo - agora;
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (voo.confirmado == 1) {
      return { texto: "Confirmado", cor: "#6fcf97", explicacao: "Você já realizou o check-in para este voo." };
    }

    if (diffHoras <= 72) {
      return { texto: "Pendente", cor: "#f2c94c", explicacao: "O check-in está disponível, mas você ainda não confirmou." };
    }

    return { texto: "Indisponível", cor: "#bdbdbd", explicacao: "O check-in ainda não está liberado para este voo." };
  }

  const dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

  const agora = new Date();
  const dataHoje = `Hoje é ${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;

  const renderVoo = (voo) => {
    const status = getStatus(voo);

    return (
      <View key={voo.id_voo} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.codigo}>VOO {voo.numero_voo}</Text>

          <TouchableOpacity
            onPress={() => mostrarPopup(status.explicacao)}
            style={[styles.status, { backgroundColor: status.cor }]}
          >
            <Text style={styles.statusText}>{status.texto}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.companhia}>{voo.id_voo}</Text>

        <View style={styles.infoRow}>
          <View style={styles.col}>
            <Ionicons name="airplane-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{voo.origem}</Text>
            <Text style={styles.time}>{voo.data_voo}</Text>
          </View>

          <Ionicons name="arrow-forward-outline" size={20} color="#999" />

          <View style={styles.col}>
            <Ionicons name="pin-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{voo.destino}</Text>
            <Text style={styles.time}>{voo.hora_voo}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>

      {menuVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={abrirFecharMenu}
        />
      )}

      {popupVisible && (
        <TouchableOpacity style={styles.popupContainer} activeOpacity={1} onPress={fecharPopup}>
          <View style={styles.popupBox}>
            <Text style={styles.popupText}>{popupTexto}</Text>
          </View>
        </TouchableOpacity>
      )}

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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>
          <View style={styles.topBar}>
            
            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>

            <View style={styles.rightIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('Perfil', { id })}>
                <Image
                  source={{ uri: usuario?.foto ? usuario.foto : 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
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

          <Text style={styles.bemvindo}>Bem vindo!</Text>
          <Text style={styles.data}>{dataHoje}</Text>

          <View style={styles.menuButtons}>
            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Meus voos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Servicos', { id })}>
              <Text style={styles.menuText}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Aeroporto', { id })}>
              <Text style={styles.menuText}>Aeroporto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Meus voos</Text>

          {/* DESIGN BONITO QUANDO NÃO TEM VOOS */}
          {voos.length === 0 ? (
            <View style={styles.semVoosBox}>
              <Ionicons name="airplane-outline" size={70} color="#d4af37" style={{ opacity: 0.8 }} />

              <Text style={styles.semTitulo}>Nenhum voo encontrado</Text>

              <Text style={styles.semTexto}>
                Você ainda não possui voos cadastrados na sua conta.
              </Text>

              <TouchableOpacity
                style={styles.btnAeroporto}
                onPress={() => navigation.navigate("Aeroporto", { id })}
              >
                <Text style={styles.btnAeroportoText}>Ver aeroportos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            voos.map(renderVoo)
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf4e6' },
  scrollContainer: { flex: 1 },

  popupContainer: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  popupBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "75%",
    elevation: 10,
  },

  popupText: { color: "#333", fontSize: 15, textAlign: "center" },

  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0)', zIndex: 50 },

  menuIcon: { padding: 6, borderRadius: 50, marginLeft: 10 },
  menuIconAtivo: { padding: 6, borderRadius: 500, backgroundColor: 'rgba(0,0,0,0.15)', marginLeft: 10 },

  menu: { position: 'absolute', top: 0, width: 200, height: '100%', backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 15, elevation: 8, zIndex: 99 },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  menuItemText: { marginLeft: 10, fontSize: 16, fontWeight: '600' },

  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 3 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '700', color: '#d4af37', marginLeft: 5 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },

  avatar: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd' },

  bemvindo: { fontSize: 20, fontWeight: '700', color: '#000' },
  data: { color: '#666', marginBottom: 15 },

  menuButtons: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f0f0f0', borderRadius: 30, paddingVertical: 6 },

  menuBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 20 },
  menuText: { color: '#666', fontWeight: '600' },
  active: { backgroundColor: '#dcdcdc' },
  activeText: { color: '#000' },

  content: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#444', marginVertical: 10 },

  /** DESENHO BONITO QUANDO NÃO TEM VOOS */
  semVoosBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    marginTop: 20,
    alignItems: "center",
    elevation: 2
  },

  semTitulo: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
    color: "#333"
  },

  semTexto: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 15,
    lineHeight: 20
  },

  btnAeroporto: {
    backgroundColor: "#d4af37",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10
  },

  btnAeroportoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },

  /** VOOS */
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  codigo: { fontWeight: '700', fontSize: 16, color: '#222' },
  status: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  companhia: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 10 },

  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  col: { alignItems: 'center' },

  infoText: { fontSize: 14, color: '#333', marginTop: 4 },
  time: { fontSize: 16, fontWeight: '700', color: '#000' },
});

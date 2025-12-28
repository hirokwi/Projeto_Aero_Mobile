import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Aeroporto({ navigation, route }) {
  const { id } = route.params ?? {};

  const [usuario, setUsuario] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const slide = useRef(new Animated.Value(-200)).current;

  const [cidade, setCidade] = useState('');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const API_URL = 'http://*******/aero_conexao/get_aeroporto.php';

  const cidadesDisponiveis = [
    { label: 'Escolha uma unidade', value: '' },
    { label: 'São Paulo', value: 'São Paulo' },
    { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
    { label: 'Belo Horizonte', value: 'Belo Horizonte' },
    { label: 'Brasília', value: 'Brasília' },
    { label: 'Salvador', value: 'Salvador' },
    { label: 'Fortaleza', value: 'Fortaleza' },
    { label: 'Curitiba', value: 'Curitiba' },
    { label: 'Manaus', value: 'Manaus' },
    { label: 'Recife', value: 'Recife' },
    { label: 'Porto Alegre', value: 'Porto Alegre' },
    { label: 'Belém', value: 'Belém' },
    { label: 'Goiânia', value: 'Goiânia' },
    { label: 'Guarulhos', value: 'Guarulhos' },
    { label: 'Campinas', value: 'Campinas' },
    { label: 'São Luís', value: 'São Luís' },
    { label: 'Maceió', value: 'Maceió' },
    { label: 'Natal', value: 'Natal' },
    { label: 'João Pessoa', value: 'João Pessoa' },
    { label: 'Campo Grande', value: 'Campo Grande' },
    { label: 'Teresina', value: 'Teresina' }
  ];

  // carregar usuário
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resp = await fetch('http://*****/aero_conexao/get_usuarios.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const json = await resp.json();
        if (json.success) setUsuario(json.usuarios);
      } catch (err) {
        console.log('Erro ao buscar usuário:', err);
      }
    }

    if (id) carregarUsuario();
  }, [id]);

  function abrirFecharMenu() {
    setMenuVisible(prev => !prev);
    Animated.timing(slide, {
      toValue: menuVisible ? -200 : 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  }

  async function buscarAeroporto(cidadeSelecionada) {
    setCidade(cidadeSelecionada);
    setDados(null);

    if (!cidadeSelecionada) return;

    setLoading(true);
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidade: cidadeSelecionada })
      });
      const json = await resp.json();
      if (json.success && json.aeroporto) {
        setDados(json.aeroporto);
      } else {
        setDados(null);
      }
    } catch (err) {
      console.log('Erro:', err);
      setDados(null);
    } finally {
      setLoading(false);
    }
  }

  // === DATA ===
  const dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const agora = new Date();
  const dataHoje = `Hoje é ${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;

  return (
    <View style={styles.safeArea}>
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={abrirFecharMenu} />
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

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* HEADER PREMIUM */}
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
            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('MeusVoos', { id })}>
              <Text style={styles.menuText}>Meus voos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Servicos', { id })}>
              <Text style={styles.menuText}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Aeroporto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* AREA PRINCIPAL */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Selecione a cidade</Text>

          {/* COMBOBOX */}
          <TouchableOpacity style={styles.pickerBox} onPress={() => setShowModal(true)}>
            <Text style={{ color: cidade ? "#000" : "#777", fontSize: 16 }}>
              {cidade || "Escolha uma unidade"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#000" style={{ position: "absolute", right: 10 }} />
          </TouchableOpacity>

          {/* MODAL */}
          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalFundo}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitulo}>Selecione a cidade</Text>

                <FlatList
                  data={cidadesDisponiveis}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setShowModal(false);
                        buscarAeroporto(item.value);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity style={styles.modalCancelar} onPress={() => setShowModal(false)}>
                  <Text style={styles.modalCancelarText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* === TEXTO FIXO DECORADO === */}
          <View style={styles.infoBox}>
            <Ionicons name="planet-outline" size={32} color="#d4af37" />
            <Text style={styles.infoTitle}>Bem-vindo às Unidades Aero ✈️</Text>
            <Text style={styles.infoText}>
              Nossos aeroportos oferecem conforto, segurança e uma experiência mais tranquila para seus voos.
              Confira serviços, avisos, estrutura e detalhes exclusivos de cada unidade espalhada pelo Brasil.
              Selecione uma cidade acima para visualizar as informações da unidade desejada.
            </Text>
          </View>

          {/* RESULTADOS */}
          {loading && <ActivityIndicator size="large" color="#d4af37" style={{ marginTop: 18 }} />}

          {!loading && !dados && cidade !== '' && (
            <View style={styles.emptyBox}>
              <Ionicons name="alert-circle-outline" size={36} color="#d4af37" />
              <Text style={styles.emptyText}>Nenhuma informação encontrada para "{cidade}"</Text>
            </View>
          )}

          {dados && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{dados.nome}</Text>
                <View style={styles.badge}>
                  <Ionicons name="location-outline" size={14} color="#fff" />
                  <Text style={styles.badgeText}>{dados.cidade}</Text>
                </View>
              </View>

              <View style={styles.chipsRow}>
                <View style={styles.chip}>
                  <Ionicons name="wifi" size={14} color="#2a7a2a" />
                  <Text style={styles.chipText}>{dados.wifi}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="bus" size={14} color="#2a7a2a" />
                  <Text style={styles.chipText}>{dados.transporte}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="cart" size={14} color="#2a7a2a" />
                  <Text style={styles.chipText}>{dados.duty_free}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="restaurant" size={14} color="#2a7a2a" />
                  <Text style={styles.chipText}>{dados.restaurantes}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <Text style={styles.detailText}>Última atualização: agora</Text>
              </View>

              <View style={styles.separator} />

              <Text style={styles.subTitle}>Avisos e recomendações</Text>

              <View style={styles.alertBox}>
                <Ionicons name="construct-outline" size={18} color="#a03b00" style={{ marginRight: 8 }} />
                <Text style={styles.alertText}>{dados.aviso_terminal}</Text>
              </View>

              <View style={styles.alertBox}>
                <Ionicons name="checkmark-done-outline" size={18} color="#0b5a8a" style={{ marginRight: 8 }} />
                <Text style={styles.alertText}>{dados.aviso_checkin}</Text>
              </View>

              <View style={styles.alertBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#7a3b3b" style={{ marginRight: 8 }} />
                <Text style={styles.alertText}>{dados.aviso_seguranca}</Text>
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf4e6' },
  scrollContainer: { flex: 1 },

  menuIcon: { padding: 6, borderRadius: 50, marginLeft: 10 },
  menuIconAtivo: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 500,
    marginLeft: 10
  },

  menu: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 15,
    elevation: 8,
    zIndex: 99
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
    zIndex: 50
  },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  menuItemText: { marginLeft: 10, fontSize: 16, fontWeight: '600' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '700', color: '#d4af37', marginLeft: 5 },

  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ddd'
  },

  bemvindo: { fontSize: 20, fontWeight: '700', color: '#000' },
  data: { color: '#666', marginBottom: 15 },

  menuButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 6
  },
  menuBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 20
  },
  menuText: { color: '#666', fontWeight: '600' },
  active: { backgroundColor: '#dcdcdc' },
  activeText: { color: '#000' },

  content: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#444', marginBottom: 15 },

  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 55,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#d4af37",
    elevation: 4,
    marginBottom: 20
  },

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "75%"
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#444"
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalItemText: {
    fontSize: 16,
    color: "#333"
  },
  modalCancelar: {
    marginTop: 15,
    backgroundColor: "#d4af37",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  modalCancelarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },

  /* TEXTO FIXO DECORADO */
  infoBox: {
    backgroundColor: '#fff8e8',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#d4af37',
    elevation: 3
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8a6d2b',
    marginTop: 5,
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#5a4a24',
    lineHeight: 20
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4af37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  badgeText: { color: '#fff', marginLeft: 6, fontWeight: '700', fontSize: 12 },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2fff2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8
  },
  chipText: { marginLeft: 6, color: '#2a7a2a', fontWeight: '600', fontSize: 12 },

  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { marginLeft: 8, color: '#666', fontSize: 13 },

  separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 },

  subTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },

  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff5f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e07a5f'
  },
  alertText: { color: '#7a2a2a', flex: 1, fontSize: 13 },

  emptyBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2
  },
  emptyText: { marginTop: 8, color: '#666' }
});

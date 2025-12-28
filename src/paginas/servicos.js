import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Servicos({ navigation, route }) {
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const slide = useState(new Animated.Value(-200))[0];

  function abrirFecharMenu() {
    setMenuVisible(!menuVisible);

    Animated.timing(slide, {
      toValue: menuVisible ? -200 : 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  }

  useEffect(() => {
    fetch("http://*******/aero_conexao/get_usuarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsuario(data.usuarios);
        }
      })
      .catch(err => console.log(err));
  }, []);

  // === DATA ===
  const dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

  const agora = new Date();
  const dataHoje = `Hoje é ${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;

  const servicos = [
    { id: 1, icon: 'airplane-outline', titulo: 'Check-in Online', descricao: 'Faça seu Check-in e escolha seu assento', botao: 'Fazer Check-in' },
    { id: 2, icon: 'bag-handle-outline', titulo: 'Rastrear Bagagem', descricao: 'Acompanhe sua bagagem em tempo real', botao: 'Rastrear' },
    { id: 3, icon: 'ticket-outline', titulo: 'Gerenciar Reservas', descricao: 'Visualize e modifique suas reservas', botao: 'Ver Reservas' },
    { id: 4, icon: 'person-circle-outline', titulo: 'Perfil de Passageiro', descricao: 'Gerencie seus dados e preferências', botao: 'Ver Perfil' },
  ];

  const renderServico = (item) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={item.icon} size={28} color="#d4af37" />
      </View>

      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardDesc}>{item.descricao}</Text>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => {
          if (item.titulo === "Check-in Online") navigation.navigate("Check_in", { id });
          if (item.titulo === "Rastrear Bagagem") navigation.navigate("Rastrear", { id });
          if (item.titulo === "Gerenciar Reservas") navigation.navigate("Gerenciar", { id });
          if (item.titulo === "Perfil de Passageiro") navigation.navigate("Perfil", { id });
        }}
      >
        <Text style={styles.cardButtonText}>{item.botao}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      
      {menuVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={abrirFecharMenu}
        />
      )}

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

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* HEADER (não mexi) */}
        
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
            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate("MeusVoos", { id })}>
              <Text style={styles.menuText}>Meus voos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate("Aeroporto", { id })}>
              <Text style={styles.menuText}>Aeroporto</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>

        {/* CONTEÚDO */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Serviços disponíveis</Text>
          {servicos.map(renderServico)}

          {/* ===== TEXTO FINAL DECORADO ===== */}
          <View style={styles.finalBox}>
            <Text style={styles.finalText}>
              ✨ Obrigado por escolher viajar com a <Text style={{ fontWeight: '700' }}>aero</Text>!  
              Estamos aqui para tornar sua experiência cada vez mais leve, rápida e segura.  
            </Text>

            <Text style={styles.finalText}>
              🧳 Precisa de ajuda? Conte conosco a qualquer momento!  
            </Text>

            <Text style={styles.finalFooter}>Boa viagem! ✈️🌍</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf4e6' },
  scrollContainer: { flex: 1 },

  menuIcon: { padding: 6, borderRadius: 50, marginLeft: 10 },
  menuIconAtivo: { padding: 6, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 500, marginLeft: 10 },

  menu: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 15,
    elevation: 8,
    zIndex: 99,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
    zIndex: 50,
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#444', marginBottom: 15 },

  /* ===== NOVO DESIGN DOS CARDS ===== */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  iconCircle: {
    backgroundColor: '#f8f1d2',
    padding: 14,
    borderRadius: 40,
    marginBottom: 10,
  },

  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 12 },

  cardButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8
  },
  cardButtonText: { color: '#fff', fontWeight: '700' },

  /* ===== TEXTO FINAL ===== */
  finalBox: {
    backgroundColor: '#fff9e6',
    padding: 20,
    borderRadius: 16,
    marginTop: 25,
    marginBottom: 40,
    elevation: 2
  },

  finalText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    lineHeight: 20
  },

  finalFooter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d4af37',
    marginTop: 10,
    textAlign: 'center'
  }
});

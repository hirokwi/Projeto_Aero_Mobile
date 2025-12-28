import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';

export default function Perfil({ navigation, route }) {

  const [usuarios, setUsuarios] = useState(null);
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [temNotificacao, setTemNotificacao] = useState(false);

  const { id } = route.params;

  const apiPerfil = 'http://*******/aero_conexao/perfil.php';
  const apiFoto = 'http://*******/aero_conexao/alterar_foto.php';
  const apiInbox = 'http://*******/aero_conexao/inbox_listar.php';

  useEffect(() => {
    buscarUsuarios();
    verificarNotificacoes();
  }, []);

  function verificarNotificacoes() {
    fetch(apiInbox, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const existe = data.mensagens.some(m => m.lida == 0);
          setTemNotificacao(existe);
        }
      });
  }

  async function buscarUsuarios() {
    try {
      const response = await axios.post(apiPerfil, { id });

      if (response.data.success) {
        setUsuarios(response.data.usuarios);
      } else {
        Alert.alert("Erro", response.data.message);
      }

    } catch (err) {
      Alert.alert("Erro", "Falha ao carregar dados do servidor.");
    }
  }

  async function mudarFoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    setLoadingFoto(true);

    const file = result.assets[0];

    let form = new FormData();
    form.append("id", id);
    form.append("foto", {
      uri: file.uri,
      type: "image/jpeg",
      name: "perfil.jpg"
    });

    try {
      let response = await fetch(apiFoto, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: form
      });

      let json = await response.json();

      if (json.success) {
        setUsuarios((prev) => ({ ...prev, foto: json.foto }));
      } else {
        Alert.alert("Erro", "Não foi possível enviar a foto.");
      }

    } catch (err) {
      Alert.alert("Erro", "Falha ao enviar imagem.");
    }

    setLoadingFoto(false);
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>
          <View style={styles.topBar}>

            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>

            <View style={styles.rightIcons}>

              <TouchableOpacity onPress={() => navigation.navigate("Inbox", { id })}>
                <View style={{ position: "relative", marginRight: 12 }}>
                  <Ionicons name="notifications-outline" size={23} color="#000" />

                  {temNotificacao && (
                    <View style={styles.notifDot} />
                  )}
                </View>
              </TouchableOpacity>

              <Image
                source={{
                  uri: usuarios?.foto
                    ? usuarios.foto
                    : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }}
                style={styles.avatarTop}
              />
            </View>
          </View>

          <Text style={styles.bemvindo}>Seu Perfil</Text>
          <Text style={styles.subInfo}>Gerencie seus dados pessoais, foto e informações da sua conta ✨</Text>
        </LinearGradient>

        {/* CONTEÚDO */}
        <View style={styles.content}>

          {/* FOTO + NOME */}
          <View style={styles.profileContainer}>

            <View style={styles.profileImageWrapper}>
              <Image
                source={{
                  uri: usuarios?.foto
                    ? usuarios.foto
                    : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }}
                style={styles.profileImage}
              />

              <TouchableOpacity style={styles.cameraBtn} onPress={mudarFoto}>
                {loadingFoto
                  ? <ActivityIndicator color="#fff" size={18} />
                  : <Ionicons name="camera" size={18} color="#fff" />}
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{usuarios?.nome}</Text>
            <Text style={styles.profileEmail}>{usuarios?.email}</Text>
          </View>

          {/* CARD DE INFOS MODERNIZADO */}
          <View style={styles.dataCard}>
            <Text style={styles.cardTitle}>Informações pessoais 📄</Text>

            <Text style={styles.cardDesc}>Aqui ficam seus dados oficiais registrados na companhia aérea.</Text>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>CPF</Text>
              <Text style={styles.value}>{usuarios?.cpf}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>RG</Text>
              <Text style={styles.value}>{usuarios?.rg}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Telefone</Text>
              <Text style={styles.value}>{usuarios?.telefone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.voltarText}>Voltar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  safeArea: { flex: 1, backgroundColor: '#faf4e6' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '700', color: '#d4af37', marginLeft: 6 },

  rightIcons: { flexDirection: 'row', alignItems: 'center' },

  avatarTop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d4af37"
  },

  notifDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },

  bemvindo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  subInfo: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
    marginBottom: 5
  },

  content: { padding: 20, alignItems: 'center' },

  /* FOTO */
  profileContainer: { alignItems: 'center', marginBottom: 20 },

  profileImageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 5,
    backgroundColor: '#d4af37',
    position: 'relative',
    elevation: 5
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#fff'
  },

  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#d4af37',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6
  },

  profileName: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 10,
    color: '#333'
  },

  profileEmail: { color: '#666', marginBottom: 15 },

  /* CARD NOVO */
  dataCard: {
    width: '93%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 18,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },

  cardDesc: {
    fontSize: 13,
    color: '#777',
    marginBottom: 15
  },

  infoBlock: {
    backgroundColor: '#f5f1df',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12
  },

  label: {
    color: '#a48c2c',
    fontWeight: '700',
    fontSize: 13,
  },

  value: {
    color: '#333',
    fontSize: 15,
    marginTop: 3
  },

  voltarBtn: {
    marginTop: 30,
    backgroundColor: '#d4af37',
    paddingVertical: 13,
    borderRadius: 12,
    width: '70%',
    alignItems: 'center',
    elevation: 3,
  },

  voltarText: { color: '#fff', fontWeight: '700', fontSize: 16 },

});

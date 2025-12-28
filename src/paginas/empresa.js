import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Empresa({ navigation }) {

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>

          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle-outline" size={32} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.bemvindo}>Informações da Empresa</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* SOBRE NÓS */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#d4af37" />
              <Text style={styles.cardTitle}>Sobre Nós</Text>
            </View>
            <Text style={styles.texto}>
              A Aero é uma empresa dedicada a transformar cada voo em uma experiência única. 
              Conforto, segurança e eficiência são nossos pilares, e trabalhamos todos os dias para superar suas expectativas.
            </Text>
          </View>

          {/* MISSÃO */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="rocket-outline" size={28} color="#5bc0de" />
              <Text style={styles.cardTitle}>Missão</Text>
            </View>
            <Text style={styles.texto}>
              Conectar pessoas com rapidez, segurança e inovação, oferecendo o melhor serviço aéreo do Brasil. 
              Nosso foco é você chegar mais longe, sempre com qualidade.
            </Text>
          </View>

          {/* VISÃO */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="eye-outline" size={28} color="#f0ad4e" />
              <Text style={styles.cardTitle}>Visão</Text>
            </View>
            <Text style={styles.texto}>
              Ser referência nacional em atendimento e tecnologia aplicada à aviação, mantendo o compromisso com excelência e inovação constante.
            </Text>
          </View>

          {/* VALORES */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart-outline" size={28} color="#d9534f" />
              <Text style={styles.cardTitle}>Valores</Text>
            </View>
            <View style={styles.valorList}>
              <Text style={styles.valorItem}>• Segurança em primeiro lugar</Text>
              <Text style={styles.valorItem}>• Transparência em todos os processos</Text>
              <Text style={styles.valorItem}>• Qualidade e conforto para passageiros</Text>
              <Text style={styles.valorItem}>• Eficiência e inovação constante</Text>
              <Text style={styles.valorItem}>• Respeito e empatia com cada cliente</Text>
            </View>
          </View>

          {/* FRASE DE IMPACTO */}
          <View style={[styles.card, styles.impactCard]}>
            <Text style={styles.impactText}>
              "Viajar é mais que se deslocar, é criar memórias inesquecíveis. Com a Aero, cada voo é uma experiência premium."
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf4e6' },
  scrollContainer: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3
  },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '700', color: '#d4af37', marginLeft: 5 },

  bemvindo: { fontSize: 20, fontWeight: '700', color: '#000', marginTop: 20 },

  content: { paddingHorizontal: 20, marginTop: 25 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginLeft: 8, color: '#333' },

  texto: { fontSize: 15, color: '#555', lineHeight: 22, marginTop: 5 },

  valorList: { marginTop: 8 },
  valorItem: { fontSize: 14, color: '#555', lineHeight: 20 },

  impactCard: { backgroundColor: '#fffbe6', borderWidth: 1, borderColor: '#d4af37', alignItems: 'center' },
  impactText: { fontSize: 16, fontWeight: '700', fontStyle: 'italic', textAlign: 'center', color: '#444' }
});

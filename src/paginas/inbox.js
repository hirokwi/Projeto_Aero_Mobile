import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Inbox({ navigation, route }) {
  const { id } = route.params;

  const [msgs, setMsgs] = useState([]);

  const urlListar = "http://*******/aero_conexao/inbox_listar.php";
  const urlLida = "http://*******/aero_conexao/inbox_lida.php";
  const urlDeletar = "http://*******/aero_conexao/inbox_deletar.php";

  useEffect(() => {
    carregar();
  }, []);

  const carregar = () => {
    fetch(urlListar, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMsgs(data.mensagens);
      });
  };

  const marcarLida = (id_inbox) => {
    fetch(urlLida, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_inbox }),
    })
      .then((r) => r.json())
      .then(() => carregar());
  };

  const deletar = (id_inbox) => {
    fetch(urlDeletar, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_inbox }),
    })
      .then((r) => r.json())
      .then(() => carregar());
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#faf4e6" }}>
      {/* HEADER IGUAL AO PERFIL (mesma vibe) */}
      <LinearGradient colors={["#fffbe6", "#f6e9be"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Inbox</Text>

          <Ionicons name="mail-outline" size={24} color="#000" />
        </View>

        <Text style={styles.headerSub}>
          Suas mensagens, avisos e alertas importantes
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {msgs.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="mail-open-outline" size={55} color="#d4af37" />
            <Text style={styles.emptyText}>Nenhuma mensagem por aqui...</Text>
            <Text style={styles.emptySub}>
              Quando algo importante chegar, você verá tudo aqui.
            </Text>
          </View>
        )}

        {msgs.map((m) => (
          <View
            key={m.id_inbox}
            style={[
              styles.card,
              m.lida == 0 ? styles.cardNaoLida : styles.cardLida,
            ]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => marcarLida(m.id_inbox)}
            >
              {/* LABEL */}
              <Text
                style={[
                  styles.label,
                  m.lida == 1 ? { color: "#777" } : { color: "#d4af37" },
                ]}
              >
                {m.lida == 1 ? "Mensagem lida" : "Nova mensagem"}
              </Text>

              {/* ÍCONE */}
              <Ionicons
                name={
                  m.lida == 1 ? "mail-open-outline" : "mail-unread-outline"
                }
                size={26}
                color={m.lida == 1 ? "#777" : "#d4af37"}
                style={{ marginTop: 4 }}
              />

              {/* TÍTULO */}
              <Text
                style={[
                  styles.titulo,
                  m.lida == 1 && { color: "#777" },
                ]}
              >
                {m.titulo}
              </Text>

              {/* MENSAGEM */}
              <Text
                style={[
                  styles.msg,
                  m.lida == 1 && { color: "#888" },
                ]}
              >
                {m.mensagem}
              </Text>

              {/* DATA */}
              <Text style={styles.data}>{m.data}</Text>
            </TouchableOpacity>

            {/* BOTÃO DELETAR */}
            <TouchableOpacity onPress={() => deletar(m.id_inbox)}>
              <Ionicons name="trash-outline" size={25} color="#b91c1c" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
  },

  headerSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },

  content: {
    padding: 20,
  },

  emptyBox: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: "#444",
  },

  emptySub: {
    marginTop: 4,
    color: "#777",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardNaoLida: {
    borderLeftWidth: 4,
    borderLeftColor: "#d4af37",
  },

  cardLida: {
    borderLeftWidth: 4,
    borderLeftColor: "#ccc",
    opacity: 0.9,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },

  titulo: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
  },

  msg: {
    fontSize: 14,
    marginTop: 6,
  },

  data: {
    fontSize: 11,
    color: "#777",
    marginTop: 10,
  },
});

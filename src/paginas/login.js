import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const apiUrl = "http://*******/aero_conexao/login.php";

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(
        apiUrl,
        { email, senha },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.success) {
        Alert.alert("Sucesso", "Login realizado com sucesso!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("MeusVoos", { id: data.usuarios.id })
          }
        ]);
      } else {
        Alert.alert("Erro", data.message || "Email ou senha incorretos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fdf7eb" }}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✈️</Text>
          </View>

          <Text style={styles.logo}>aero</Text>
          <Text style={styles.subtitle}>Your gateway to the sky</Text>

          <Text style={styles.heading}>Entrar</Text>
          <Text style={styles.description}>
            Faça login na sua conta para acessar os serviços
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* CAMPO SENHA COM OLHINHO */}
          <View style={styles.senhaContainer}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#555"
              style={[styles.input, { paddingRight: 45 }]}
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              maxLength={40}
            />

            <TouchableOpacity
              style={styles.iconeSenha}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons
                name={mostrarSenha ? "eye" : "eye-off"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.bottomTextContainer}>
            <Text>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Create")}>
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            © 2025 Aero. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fdf7eb"
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center"
  },
  iconContainer: {
    backgroundColor: "#d4af37",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  icon: { fontSize: 28 },
  logo: { fontSize: 28, fontWeight: "bold", color: "#d4af37" },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 25,
    textAlign: "center"
  },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  description: {
    fontSize: 12,
    color: "#777",
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },
  senhaContainer: {
    width: "100%",
    position: "relative"
  },
  iconeSenha: {
    position: "absolute",
    right: 12,
    top: 15
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  bottomTextContainer: {
    flexDirection: "row",
    marginBottom: 15
  },
  link: { color: "#d4af37", fontWeight: "bold" },
  footer: {
    fontSize: 10,
    color: "#aaa",
    textAlign: "center",
    marginTop: 10
  }
});

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

export default function Create({ navigation }) {
  const [step, setStep] = useState(1);

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confSenhaVisivel, setConfSenhaVisivel] = useState(false);

  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const apiUrl = "http://*******/aero_conexao/add.php";

  // ------------------- MÁSCARAS -----------------------

  const maskTelefone = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 11);
    if (v.length >= 11)
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  };

  const maskCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const maskRG = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 9)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1})$/, "$1-$2");
  };

  // ------------------- VALIDAÇÕES -----------------------

  const validarCampos = () => {
    if (nome.trim().length < 3) return "O nome precisa ter pelo menos 3 caracteres.";

    if (!email.includes("@") || !email.includes(".")) return "Digite um email válido.";

    if (telefone.replace(/\D/g, "").length < 10) return "Digite um telefone válido.";

    if (cpf.replace(/\D/g, "").length !== 11) return "Digite um CPF válido.";

    if (rg.replace(/\D/g, "").length < 7) return "Digite um RG válido.";

    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";

    if (senha !== confSenha) return "As senhas não coincidem.";

    return null;
  };

  // ------------------- CADASTRO -----------------------

  const handleCadastro = async () => {
    const erro = validarCampos();
    if (erro) {
      Alert.alert("Erro", erro);
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        nome,
        cpf,
        rg,
        email,
        telefone,
        senha
      });

      const data = response.data;

      if (data.error) {
        Alert.alert("Erro", data.error);
        return;
      }

      if (data.success === true) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      } else {
        Alert.alert("Erro", "Erro desconhecido ao cadastrar.");
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
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👤</Text>
          </View>

          <Text style={styles.logo}>aero</Text>
          <Text style={styles.subtitle}>Crie seu perfil e embarque!</Text>

          <Text style={styles.heading}>Cadastro</Text>
          <Text style={styles.description}>Preencha os dados abaixo</Text>

          {/* ====================== ETAPA 1 ============================= */}
          {step === 1 && (
            <>
              <TextInput
                placeholder="Nome completo"
                placeholderTextColor="#555"
                style={styles.input}
                maxLength={50}
                value={nome}
                onChangeText={setNome}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#555"
                style={styles.input}
                value={email}
                maxLength={50}
                keyboardType="email-address"
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Telefone"
                placeholderTextColor="#555"
                style={styles.input}
                value={telefone}
                maxLength={15}
                keyboardType="phone-pad"
                onChangeText={(text) => setTelefone(maskTelefone(text))}
              />

              <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ====================== ETAPA 2 ============================= */}
          {step === 2 && (
            <>
              <TextInput
                placeholder="CPF"
                placeholderTextColor="#555"
                style={styles.input}
                value={cpf}
                keyboardType="numeric"
                maxLength={14}
                onChangeText={(text) => setCpf(maskCPF(text))}
              />

              <TextInput
                placeholder="RG"
                placeholderTextColor="#555"
                style={styles.input}
                value={rg}
                keyboardType="numeric"
                maxLength={12}
                onChangeText={(text) => setRg(maskRG(text))}
              />

              {/* SENHA */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#555"
                  style={[styles.input, { paddingRight: 45 }]}
                  secureTextEntry={!senhaVisivel}
                  value={senha}
                  maxLength={40}
                  onChangeText={setSenha}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                >
                  <Ionicons
                    name={senhaVisivel ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRMAR SENHA */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#555"
                  style={[styles.input, { paddingRight: 45 }]}
                  secureTextEntry={!confSenhaVisivel}
                  value={confSenha}
                  maxLength={40}
                  onChangeText={setConfSenha}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setConfSenhaVisivel(!confSenhaVisivel)}
                >
                  <Ionicons
                    name={confSenhaVisivel ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Criar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.bottomTextContainer}>
            <Text>Já tem uma conta? </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>© 2025 Aero. Todos os direitos reservados.</Text>
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
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15
  },

  passwordContainer: {
    width: "100%",
    position: "relative"
  },

  eyeButton: {
    position: "absolute",
    right: 10,
    top: 13
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
  backButton: { marginTop: 5 },
  backText: { color: "#d4af37", fontWeight: "bold" },
  bottomTextContainer: {
    flexDirection: "row",
    marginTop: 10,
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

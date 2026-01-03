import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { login as apiLogin } from "../src/services/api";
import { setToken } from "../src/services/session";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!user || !pass) {
      Alert.alert("Error", "Ingrese usuario y contraseña");
      return;
    }

    try {
      const res = await apiLogin(user, pass);

      if (res?.token) {
        setToken(res.token);
        console.log("JWT guardado:", res.token); // 👈 debug
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login incorrecto", "Credenciales inválidas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al backend");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#888"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  button: {
    marginTop: 10,
  },
});

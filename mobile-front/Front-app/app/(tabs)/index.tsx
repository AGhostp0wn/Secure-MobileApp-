import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "../../src/services/api";
import { clearToken, getToken } from "../../src/services/session";

export default function Crud() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  // 🔴 ÚNICO CAMBIO: getToken() con await
  useEffect(() => {
    async function checkAuthAndLoad() {
      const token = await getToken(); // ✅ CAMBIO REAL

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const data = await getItems();

        // TOKEN EXPIRADO
        if (data?.error === "TOKEN_EXPIRED") {
          clearToken();
          router.replace("/login");
          return;
        }

        if (Array.isArray(data)) {
          setItems(data);
          setError(null);
        } else {
          setItems([]);
        }
      } catch {
        setError("Error de conexión con el servidor");
        setItems([]);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuthAndLoad();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("El nombre del item es obligatorio");
      return;
    }

    try {
      const res = await createItem(name, description);

      if (res?.error === "TOKEN_EXPIRED") {
        clearToken();
        router.replace("/login");
        return;
      }

      setName("");
      setDescription("");
      setError(null);

      const data = await getItems();
      if (Array.isArray(data)) setItems(data);
    } catch {
      setError("Error al crear el item");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteItem(id);

      if (res?.error === "TOKEN_EXPIRED") {
        clearToken();
        router.replace("/login");
        return;
      }

      const data = await getItems();
      if (Array.isArray(data)) setItems(data);
    } catch {
      setError("Error al eliminar el item");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const res = await updateItem(editingId, name, description);

      if (res?.error === "TOKEN_EXPIRED") {
        clearToken();
        router.replace("/login");
        return;
      }

      setEditingId(null);
      setName("");
      setDescription("");

      const data = await getItems();
      if (Array.isArray(data)) setItems(data);
    } catch {
      setError("Error al actualizar el item");
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 Mis Items</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>
          {editingId ? "Editar Item" : "Nuevo Item"}
        </Text>

        <TextInput
          placeholder="Nombre del item"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <Button
          title={editingId ? "Guardar cambios" : "Agregar item"}
          onPress={editingId ? handleUpdate : handleCreate}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.itemDesc}>{item.description}</Text>
            )}

            <View style={styles.actions}>
              <Button
                title="Editar"
                onPress={() => {
                  setEditingId(item.id);
                  setName(item.name);
                  setDescription(item.description || "");
                }}
              />

              <Button
                title="Eliminar"
                color="#c62828"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.logout}>
        <Button
          title="Cerrar sesión"
          color="#c62828"
          onPress={() => {
            clearToken();
            router.replace("/login");
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    color: "#000",
  },
  list: {
    marginTop: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    elevation: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  itemDesc: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  logout: {
    marginTop: 20,
    marginBottom: 40,
  },
});

import { getToken } from "./session";

const API_URL = "http://192.168.1.47:5000";

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

export async function getItems() {
  const token = getToken();

  // 🔐 Si no hay token, no llamar al backend
  if (!token) {
    return { error: "NO_TOKEN" };
  }

  const res = await fetch(`${API_URL}/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔴 Manejo explícito de 401
  if (res.status === 401) {
    return { error: "UNAUTHORIZED" };
  }

  return res.json();
}

export async function createItem(name: string, description: string) {
  const token = getToken();

  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  return res.json();
}

export async function deleteItem(id: number) {
  const token = getToken();

  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function updateItem(
  id: number,
  name: string,
  description: string
) {
  const token = getToken();

  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });

  return res.json();
}


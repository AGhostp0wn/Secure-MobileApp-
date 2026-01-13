import { getToken, setToken, getRefreshToken, clearToken } from "./session";


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
  let token = getToken();

  if (!token) {
    token = await refreshAccessToken();
    if (!token) return { error: "NO_TOKEN" };
  }

  let res = await fetch(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      clearToken();
      return { error: "TOKEN_EXPIRED" };
    }

    // 🔁 retry
    res = await fetch(`${API_URL}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return res.json();
}


export async function createItem(name: string, description: string) {
  let token = getToken();

  if (!token) {
    token = await refreshAccessToken();
    if (!token) return { error: "NO_TOKEN" };
  }

  let res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      clearToken();
      return { error: "TOKEN_EXPIRED" };
    }

    // 🔁 retry
    res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
  }

  return res.json();
}


export async function deleteItem(id: number) {
  let token = getToken();

  if (!token) {
    token = await refreshAccessToken();
    if (!token) return { error: "NO_TOKEN" };
  }

  let res = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      clearToken();
      return { error: "TOKEN_EXPIRED" };
    }

    // 🔁 retry
    res = await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return res.json();
}


export async function updateItem(
  id: number,
  name: string,
  description: string
) {
  let token = getToken();

  if (!token) {
    token = await refreshAccessToken();
    if (!token) return { error: "NO_TOKEN" };
  }

  let res = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      clearToken();
      return { error: "TOKEN_EXPIRED" };
    }

    // 🔁 retry
    res = await fetch(`${API_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
  }

  return res.json();
}



async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  setToken(data.access_token);
  return data.access_token;
}

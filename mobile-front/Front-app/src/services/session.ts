import * as SecureStore from "expo-secure-store";

let token = "";

export function setToken(t: string) {
  token = t;
}

export function getToken() {
  return token;
}

export function clearToken() {
  token = "";
  SecureStore.deleteItemAsync("refresh_token");
}

// 👇 NUEVO
export async function setRefreshToken(rt: string) {
  await SecureStore.setItemAsync("refresh_token", rt);
}

// 👇 NUEVO
export async function getRefreshToken() {
  return await SecureStore.getItemAsync("refresh_token");
}

// Guarda el token: SecureStore (cifrado del sistema) en el celular, localStorage en web
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const storage = {
  async get(key) {
    try {
      if (Platform.OS === 'web') return window.localStorage.getItem(key);
      return await SecureStore.getItemAsync(key);
    } catch { return null; }
  },
  async set(key, value) {
    try {
      if (Platform.OS === 'web') return window.localStorage.setItem(key, value);
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  async remove(key) {
    try {
      if (Platform.OS === 'web') return window.localStorage.removeItem(key);
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};

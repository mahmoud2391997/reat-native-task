import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

export const storage = Platform.OS === 'web' ? null : new MMKV({ id: 'myapp-storage' });

export const mmkvGetString = (key: string) => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return storage?.getString(key) ?? null;
  } catch {
    return null;
  }
};

export const mmkvSetString = (key: string, value: string) => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
      return;
    }
    storage?.set(key, value);
  } catch {}
};

export const mmkvDelete = (key: string) => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
      return;
    }
    storage?.delete(key);
  } catch {}
};

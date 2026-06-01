import * as SecureStore from 'expo-secure-store';

/**
 * Last-tradition persistence. Returning users boot straight into the
 * tradition they last used; first-launch users (no value) see the picker.
 */

const KEY = 'modality_last_tradition_v1';

export type TraditionId = 'turkish-makam' | 'modal-jazz';

export async function getLastTradition(): Promise<TraditionId | null> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    if (v === 'turkish-makam' || v === 'modal-jazz') return v;
    return null;
  } catch {
    return null;
  }
}

export async function setLastTradition(id: TraditionId): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, id);
  } catch {
    // non-fatal — picker will just show again next launch
  }
}

// ── Full factory reset ────────────────────────────────────────────────
// Clears all persisted state — progress, last-tradition, and the Makam
// intro flag — returning the app to its true first-launch state.
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@modality/progress';
const MAKAM_INTRO_KEY = 'makam_onboarding_v3';

export async function resetEverything(): Promise<void> {
  try { await AsyncStorage.removeItem(PROGRESS_KEY); } catch {}
  try { await SecureStore.deleteItemAsync(KEY); } catch {}
  try { await SecureStore.deleteItemAsync(MAKAM_INTRO_KEY); } catch {}
}

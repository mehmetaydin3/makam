import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, COLORS_LIGHT, ColorScheme } from '../data/constants';
import { JAZZ_COLORS, JAZZ_COLORS_LIGHT, JazzColorScheme } from '../data/traditions/modal-jazz/theme';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorSchemeKind = 'light' | 'dark';

const STORAGE_KEY = '@modality/theme_mode_v1';

type ThemeContextType = {
  /** The user's chosen preference: light, dark, or system. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** The concrete scheme actually in effect (system resolved to light/dark). */
  scheme: ColorSchemeKind;
  /** Makam palette for the active scheme. */
  colors: ColorScheme;
  /** Modal Jazz palette for the active scheme. */
  jazzColors: JazzColorScheme;
};

function resolveScheme(mode: ThemeMode, system: ColorSchemeName): ColorSchemeKind {
  if (mode === 'system') return system === 'light' ? 'light' : 'dark';
  return mode;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  setMode: () => {},
  scheme: 'dark',
  colors: COLORS,
  jazzColors: JAZZ_COLORS,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'dark');

  // Hydrate the saved preference once on mount.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (cancelled) return;
        if (v === 'light' || v === 'dark' || v === 'system') setModeState(v);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Track OS appearance changes (only matters while mode === 'system').
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystemScheme(colorScheme ?? 'dark'));
    return () => sub.remove();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme = resolveScheme(mode, systemScheme);
  const colors = scheme === 'light' ? COLORS_LIGHT : COLORS;
  const jazzColors = scheme === 'light' ? JAZZ_COLORS_LIGHT : JAZZ_COLORS;

  return (
    <ThemeContext.Provider value={{ mode, setMode, scheme, colors, jazzColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

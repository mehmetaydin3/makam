import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root layout. First-launch onboarding + the tradition picker now live in
 * app/index.tsx (the welcome flow), so no onboarding overlay is needed here.
 *
 * Providers: ThemeProvider (dark/light/system palette) wraps LanguageProvider
 * (i18n). Order is independent — they don't depend on each other — but Theme
 * is outermost so any future i18n-of-theme-labels has palette available.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

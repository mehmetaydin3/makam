import { LanguageProvider } from '../context/LanguageContext';
import { Stack } from 'expo-router';

/**
 * Root layout. First-launch onboarding + the tradition picker now live in
 * app/index.tsx (the welcome flow), so no onboarding overlay is needed here.
 */
export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}

import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import Onboarding, { hasSeenOnboarding } from '../components/Onboarding';

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    hasSeenOnboarding().then(seen => setShowOnboarding(!seen));
  }, []);

  if (showOnboarding === null) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
}

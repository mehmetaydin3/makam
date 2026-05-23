import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../data/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1A1A1C', borderTopWidth: 0, elevation: 0 },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Makam', tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="usul"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: 'Learn', tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen name="library" options={{ href: null }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { JAZZ_COLORS } from '../../../data/traditions/modal-jazz/theme';

export default function ModalJazzTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: JAZZ_COLORS.surface, borderTopWidth: 0, elevation: 0 },
        tabBarActiveTintColor: JAZZ_COLORS.accent,
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Modes', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: 'Learn', tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="practice"
        options={{ title: 'Practice', tabBarIcon: ({ color, size }) => <Ionicons name="musical-note-outline" size={size} color={color} /> }}
      />
    </Tabs>
  );
}

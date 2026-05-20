import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function TabIcon({ focused, name, label }: { focused: boolean; name: any; label: string }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={focused ? name : `${name}-outline`} size={22} color={focused ? '#C8975A' : '#504E4A'} />
      <Text numberOfLines={1} style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="bulb" label="DISCOVER" /> }} />
      <Tabs.Screen name="library" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="book" label="MAKAMS" /> }} />
      <Tabs.Screen name="learn" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="school" label="LEARN" /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#1A1A1C', borderTopColor: '#2A2A2E', borderTopWidth: 1, height: 80, paddingBottom: 16, paddingTop: 12 },
  tabItem: { alignItems: 'center', gap: 4, width: 70 },
  label: { fontSize: 10, color: '#504E4A', letterSpacing: 1, textAlign: 'center' },
  labelFocused: { color: '#C8975A' },
});

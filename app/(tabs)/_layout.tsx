import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ focused, icon, label }: { focused: boolean; icon: string; label: string }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="◎" label="EXPLORE" /> }} />
      <Tabs.Screen name="library" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="≡" label="LIBRARY" /> }} />
      <Tabs.Screen name="learn" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="○" label="LEARN" /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#1A1A1C', borderTopColor: '#2A2A2E', borderTopWidth: 1, height: 80, paddingBottom: 16, paddingTop: 12 },
  tabItem: { alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, color: '#504E4A' },
  iconFocused: { color: '#C8975A' },
  label: { fontSize: 10, color: '#504E4A', letterSpacing: 0.5 },
  labelFocused: { color: '#C8975A' },
});

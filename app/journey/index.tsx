import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../data/constants';

/**
 * Journey — the meta-layer above traditions. Placeholder for 3c.1;
 * full meta-progress (traditions explored, Crossroads) lands in 3c.2.
 * Settings reachable here so no path is lost when the gear is removed.
 */
export default function JourneyScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.eyebrow}>YOUR JOURNEY</Text>
        <Text style={styles.heading}>Journey</Text>
        <Text style={styles.subheading}>A profile of you as a student of modal music. Coming together in the next steps.</Text>

        <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/turkish-makam/settings' as any)}>
          <Text style={styles.settingsText}>Settings</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  body: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: SPACING.xl },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: 16, marginTop: SPACING.lg },
  settingsText: { fontSize: 15, color: COLORS.textPrimary },
  chevron: { fontSize: 18, color: COLORS.textTertiary },
});

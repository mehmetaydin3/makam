import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../data/constants';

type Props = {
  traditionName: string;
  accent: string;
  onPressTradition?: () => void; // opens tradition switcher (wired in 3c.4)
};

/**
 * Chrome — the app-wide top bar present on every tradition screen.
 * Left: tradition chip (tap to switch traditions — wired in 3c.4).
 * Right: journey avatar (tap to open the meta-layer Journey screen).
 * Replaces the old per-screen settings gear.
 */
export function Chrome({ traditionName, accent, onPressTradition }: Props) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={onPressTradition}>
        <View style={[styles.diamond, { backgroundColor: accent }]} />
        <Text style={styles.chipText}>{traditionName}</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.avatar}
        activeOpacity={0.7}
        onPress={() => router.push('/journey' as any)}
      >
        <Ionicons name="person-circle-outline" size={28} color={accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  diamond: { width: 8, height: 8, borderRadius: 2, transform: [{ rotate: '45deg' }] },
  chipText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  avatar: { padding: 2 },
});

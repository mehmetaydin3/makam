import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../data/constants';

type Props = {
  color: string;
  name: string;
  pronunciation: string;
  description: string;
  mood: string[];
  moodMap: Record<string, string>;
  onPress: () => void;
};

export function LibraryCard({ color, name, pronunciation, description, mood, moodMap, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.colorStrip, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.name}>{name}</Text>
            </View>
            <Text style={styles.pronunciation}>/{pronunciation}/</Text>
          </View>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{description}</Text>
        <View style={styles.footer}>
          <View style={styles.moodRow}>
            {mood.slice(0, 2).map((m) => (
              <View key={m} style={styles.moodTag}>
                <Text style={styles.moodText}>{moodMap[m] || m}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorStrip: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm },
  name: { fontSize: 22, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: -0.5 },
  pronunciation: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
  desc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodRow: { flexDirection: 'row', gap: 6 },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodText: { fontSize: 11, color: COLORS.textSecondary },
});

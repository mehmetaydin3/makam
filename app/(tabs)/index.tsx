import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MAKAMS } from '../../data/makams';
import { COLORS, SPACING } from '../../data/constants';

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.subheading}>A makam is a melodic framework — a scale, mood, and movement combined. Select one to explore.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {MAKAMS.map((makam) => (
          <TouchableOpacity
            key={makam.id}
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => router.push(`/makam/${makam.id}`)}
          >
            <View style={[styles.colorStrip, { backgroundColor: makam.color }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.makamName}>{makam.name}</Text>
                <Text style={styles.makamPronunciation}>/{makam.pronunciation}/</Text>
              </View>
              <Text style={styles.makamDesc} numberOfLines={2}>{makam.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.moodRow}>
                  {makam.mood.slice(0, 2).map((m) => (
                    <View key={m} style={styles.moodTag}>
                      <Text style={styles.moodText}>{m}</Text>
                    </View>
                  ))}
                </View>
                <Text style={[styles.seyirBadge, { color: makam.color }]}>
                  {makam.seyir} ›
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 8 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorStrip: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm },
  makamName: { fontSize: 22, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: -0.5 },
  makamPronunciation: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
  makamDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  seyirBadge: { fontSize: 12, textTransform: 'capitalize', fontWeight: '500' },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { USULS } from '../../data/usuls';
import { COLORS, SPACING } from '../../data/constants';

function BeatPattern({ pattern, color }: { pattern: string[]; color: string }) {
  return (
    <View style={styles.patternRow}>
      {pattern.map((beat, i) => (
        <View key={i} style={[
          styles.beat,
          beat === 'strong' && { backgroundColor: color, width: 18, height: 18 },
          beat === 'medium' && { backgroundColor: color + '88', width: 14, height: 14 },
          beat === 'weak' && { backgroundColor: COLORS.border, width: 10, height: 10 },
        ]} />
      ))}
    </View>
  );
}

export default function UsulDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const usul = USULS.find(u => u.id === id);

  if (!usul) return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Usul</Text>
      </TouchableOpacity>
      <Text style={{ color: COLORS.textSecondary, padding: SPACING.lg }}>Usul not found.</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Usul</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{usul.timeSignature} · {usul.tempo}</Text>
        <Text style={[styles.title, { color: usul.color }]}>{usul.name}</Text>
        <Text style={styles.pronunciation}>/{usul.pronunciation}/</Text>
        <View style={[styles.divider, { backgroundColor: usul.color }]} />

        <View style={styles.patternCard}>
          <Text style={styles.patternLabel}>BEAT PATTERN</Text>
          <BeatPattern pattern={usul.pattern} color={usul.color} />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: usul.color, width: 12, height: 12 }]} />
              <Text style={styles.legendText}>Strong</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: usul.color + '88', width: 10, height: 10 }]} />
              <Text style={styles.legendText}>Medium</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.border, width: 8, height: 8 }]} />
              <Text style={styles.legendText}>Weak</Text>
            </View>
          </View>
        </View>

        <Text style={styles.feelText}>{usul.feel}</Text>
        <Text style={styles.descText}>{usul.description}</Text>

        <Text style={styles.sectionLabel}>COMMON MAKAMS</Text>
        <View style={styles.tagRow}>
          {usul.commonMakams.map((m) => {
            const n: Record<string, string> = {'rast':'Rast','ussak':'Uşşak','hicaz':'Hicaz','huseyni':'Hüseyní','saba':'Saba','segah':'Segah','kurd':'Kurd','neva':'Neva','buselik':'Buselik','cargah':'Çargah','nihavend':'Nihavend','kurdilihicazkar':'Kürdilihicazkar'};
            return (
              <TouchableOpacity key={m} style={[styles.tag, { borderColor: usul.color + '55' }]} onPress={() => router.push('/makam/' + m)}>
                <Text style={[styles.tagText, { color: usul.color }]}>{n[m] || m}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>NOTABLE PIECES</Text>
        {usul.notablePieces.map((p, i) => (
          <View key={i} style={styles.pieceRow}>
            <Text style={styles.pieceTitle}>{p.title}</Text>
            <Text style={styles.pieceMeta}>{p.composer} · {p.makam}</Text>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontSize: 38, fontWeight: '200', letterSpacing: -1, lineHeight: 44 },
  pronunciation: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic', marginTop: 4 },
  divider: { width: 40, height: 2, borderRadius: 999, marginVertical: SPACING.lg },
  patternCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md, marginBottom: SPACING.lg },
  patternLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2 },
  patternRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  beat: { borderRadius: 999 },
  legend: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { borderRadius: 999 },
  legendText: { fontSize: 12, color: COLORS.textSecondary },
  feelText: { fontSize: 16, color: COLORS.accent, lineHeight: 24, fontStyle: 'italic', marginBottom: SPACING.md },
  descText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26, marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.accent, letterSpacing: 2, marginBottom: SPACING.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.xl },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  tagText: { fontSize: 13, fontWeight: '500' },
  pieceRow: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pieceTitle: { fontSize: 15, color: COLORS.textPrimary },
  pieceMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});

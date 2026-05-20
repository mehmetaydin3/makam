import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { USULS } from '../../data/usuls';
import { COLORS, SPACING } from '../../data/constants';

function BeatPattern({ pattern, color }: { pattern: string[]; color: string }) {
  return (
    <View style={styles.patternRow}>
      {pattern.map((beat, i) => (
        <View
          key={i}
          style={[
            styles.beat,
            beat === 'strong' && { backgroundColor: color, width: 18, height: 18 },
            beat === 'medium' && { backgroundColor: color + '88', width: 14, height: 14 },
            beat === 'weak' && { backgroundColor: COLORS.border, width: 10, height: 10 },
            beat === 'rest' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border, width: 10, height: 10 },
          ]}
        />
      ))}
    </View>
  );
}

function UsulDetail({ usul, onClose }: { usul: any; onClose: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.readerHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>← Usul</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.readerScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.detailEyebrow}>{usul.timeSignature} · {usul.tempo}</Text>
        <Text style={[styles.detailTitle, { color: usul.color }]}>{usul.name}</Text>
        <Text style={styles.detailPronunciation}>/{usul.pronunciation}/</Text>
        <View style={[styles.divider, { backgroundColor: usul.color }]} />

        <View style={styles.patternCard}>
          <Text style={styles.patternLabel}>BEAT PATTERN</Text>
          <BeatPattern pattern={usul.pattern} color={usul.color} />
          <View style={styles.patternLegend}>
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
          {usul.commonMakams.map((m: string) => (
            <View key={m} style={[styles.tag, { borderColor: usul.color + '55' }]}>
              <Text style={[styles.tagText, { color: usul.color }]}>{m}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>NOTABLE PIECES</Text>
        {usul.notablePieces.map((p: any, i: number) => (
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

export default function UsulScreen() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <UsulDetail usul={selected} onClose={() => setSelected(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={styles.heading}>Usul</Text>
        <Text style={styles.subheading}>The rhythmic cycles that carry the makam. Pattern, feel, and pulse.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {USULS.map((usul) => (
          <TouchableOpacity key={usul.id} style={styles.card} activeOpacity={0.75} onPress={() => setSelected(usul)}>
            <View style={[styles.colorStrip, { backgroundColor: usul.color }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.usulName}>{usul.name}</Text>
                <Text style={styles.usulPron}>/{usul.pronunciation}/</Text>
                <View style={styles.timeSig}>
                  <Text style={[styles.timeSigText, { color: usul.color }]}>{usul.timeSignature}</Text>
                </View>
              </View>
              <BeatPattern pattern={usul.pattern} color={usul.color} />
              <Text style={styles.feelSnippet} numberOfLines={2}>{usul.feel}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  list: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', flexDirection: 'row' },
  colorStrip: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  usulName: { fontSize: 20, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: -0.5 },
  usulPron: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic', flex: 1 },
  timeSig: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  timeSigText: { fontSize: 12, fontWeight: '600' },
  patternRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  beat: { borderRadius: 999 },
  feelSnippet: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  readerHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  readerScroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  detailEyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  detailTitle: { fontSize: 38, fontWeight: '200', letterSpacing: -1, lineHeight: 44 },
  detailPronunciation: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic', marginTop: 4 },
  divider: { width: 40, height: 2, borderRadius: 999, marginVertical: SPACING.lg },
  patternCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md, marginBottom: SPACING.lg },
  patternLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2 },
  patternLegend: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { borderRadius: 999 },
  legendText: { fontSize: 12, color: COLORS.textSecondary },
  feelText: { fontSize: 16, color: COLORS.accent, lineHeight: 24, fontStyle: 'italic', marginBottom: SPACING.md },
  descText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26, marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, marginBottom: SPACING.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.xl },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  tagText: { fontSize: 13, fontWeight: '500' },
  pieceRow: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pieceTitle: { fontSize: 15, color: COLORS.textPrimary },
  pieceMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});

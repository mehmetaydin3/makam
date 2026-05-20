import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMakamById } from '../../data/makams';
import { COLORS, SPACING, RADIUS, SEYIR_LABELS } from '../../data/constants';

export default function MakamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const makam = getMakamById(id);

  if (!makam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Makam not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Library</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
          <Text style={styles.makamName}>{makam.name}</Text>
          <Text style={styles.pronunciation}>/{makam.pronunciation}/</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{makam.family} family</Text>
            </View>
            <View style={[styles.tag, styles.tagAccent]}>
              <Text style={[styles.tagText, styles.tagTextAccent]}>{SEYIR_LABELS[makam.seyir]}</Text>
            </View>
          </View>
        </View>
        <View style={styles.audioCard}>
          <View style={styles.audioInner}>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
            <View style={styles.audioMeta}>
              <Text style={styles.audioTitle}>Play Scale</Text>
              <Text style={styles.audioSub}>Hear the {makam.name} makam</Text>
            </View>
          </View>
          <View style={styles.waveformPlaceholder}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View key={i} style={[styles.waveBar, { height: 4 + Math.abs(Math.sin(i * 0.8)) * 20, backgroundColor: i < 12 ? makam.color : COLORS.border }]} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{makam.description}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Root</Text>
            <Text style={styles.infoValue}>{makam.durak}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Dominant</Text>
            <Text style={styles.infoValue}>{makam.guclu}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{makam.timeOfDay}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodRow}>
            {makam.mood.map((m) => (
              <View key={m} style={styles.moodTag}>
                <Text style={styles.moodText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scale</Text>
          <Text style={styles.scaleNote}>● Characteristic degree — defines the makam's color</Text>
          <View style={styles.scaleGrid}>
            {makam.scale.map((degree) => (
              <View key={degree.degree} style={[styles.scaleItem, degree.isCharacteristic && { borderColor: makam.color, backgroundColor: makam.color + '15' }]}>
                <Text style={styles.scaleDegree}>{degree.degree}</Text>
                <Text style={styles.scaleName}>{degree.name}</Text>
                <Text style={styles.scaleWestern}>{degree.westernNearest}</Text>
                <Text style={styles.scaleCents}>{degree.cents}¢</Text>
                {degree.isCharacteristic && <View style={[styles.characteristicDot, { backgroundColor: makam.color }]} />}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Characteristic Movement</Text>
          <View style={styles.phraseCard}>
            <Text style={styles.phraseText}>"{makam.characteristicPhrase}"</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Seyir</Text>
          <View style={styles.seyirCard}>
            <Text style={styles.seyirType}>{SEYIR_LABELS[makam.seyir]}</Text>
            <View style={styles.seyirVisual}>
              {makam.seyir === 'ascending' && <Text style={styles.seyirArrow}>↗ rises from root upward</Text>}
              {makam.seyir === 'descending' && <Text style={styles.seyirArrow}>↘ descends from high to root</Text>}
              {makam.seyir === 'undulating' && <Text style={styles.seyirArrow}>↗↘ moves in both directions</Text>}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Related Makams</Text>
          <View style={styles.relatedRow}>
            {makam.relatedMakams.map((name) => (
              <View key={name} style={styles.relatedTag}>
                <Text style={styles.relatedText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.section, { marginBottom: SPACING.xxxl }]}>
          <Text style={styles.sectionLabel}>Notable Pieces</Text>
          {makam.notablePieces.map((piece, i) => (
            <View key={i} style={styles.pieceRow}>
              <Text style={styles.pieceTitle}>{piece.title}</Text>
              <Text style={styles.pieceComposer}>{piece.composer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  errorText: { color: COLORS.textSecondary, padding: SPACING.lg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  scroll: { paddingHorizontal: SPACING.lg },
  hero: { marginBottom: SPACING.lg, paddingTop: SPACING.sm },
  colorBar: { width: 32, height: 3, borderRadius: 999, marginBottom: SPACING.md },
  makamName: { fontSize: 52, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -2, marginBottom: SPACING.xs },
  pronunciation: { fontSize: 15, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: SPACING.md },
  tagRow: { flexDirection: 'row', gap: SPACING.sm },
  tag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 999, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tagAccent: { backgroundColor: COLORS.accentMuted, borderColor: COLORS.accent + '44' },
  tagText: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'capitalize' },
  tagTextAccent: { color: COLORS.accent },
  audioCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  audioInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  playButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: COLORS.background, fontSize: 16, marginLeft: 2 },
  audioMeta: { flex: 1 },
  audioTitle: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  audioSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  waveformPlaceholder: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 28 },
  waveBar: { width: 3, borderRadius: 2 },
  section: { marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  infoCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  infoLabel: { fontSize: 10, color: COLORS.textTertiary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.xs },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'center' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  moodTag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  moodText: { fontSize: 13, color: COLORS.textSecondary },
  scaleNote: { fontSize: 11, color: COLORS.textTertiary, marginBottom: SPACING.md },
  scaleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  scaleItem: { width: '22%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', position: 'relative' },
  scaleDegree: { fontSize: 10, color: COLORS.textTertiary, marginBottom: 2 },
  scaleName: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'center', marginBottom: 2 },
  scaleWestern: { fontSize: 11, color: COLORS.textSecondary },
  scaleCents: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2 },
  characteristicDot: { position: 'absolute', top: 6, right: 6, width: 5, height: 5, borderRadius: 999 },
  phraseCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  phraseText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  seyirCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  seyirType: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary, textTransform: 'capitalize' },
  seyirVisual: { flex: 1 },
  seyirArrow: { fontSize: 13, color: COLORS.textSecondary },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  relatedTag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  relatedText: { fontSize: 13, color: COLORS.textSecondary },
  pieceRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pieceTitle: { fontSize: 15, color: COLORS.textPrimary, marginBottom: 2 },
  pieceComposer: { fontSize: 13, color: COLORS.textSecondary },
});

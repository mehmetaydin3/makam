import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMakamById } from '../../data/makams';
import { COLORS, SPACING, RADIUS, SEYIR_LABELS } from '../../data/constants';
import { useState, useRef, useEffect } from 'react';
import { audioEngine, PlaybackState } from '../../audio/audioEngine';

export default function MakamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const makam = getMakamById(id);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => { return () => { audioEngine.stop(); }; }, []);

  useEffect(() => {
    if (playbackState === 'playing') {
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [playbackState]);

  if (!makam) return <SafeAreaView style={styles.container}><Text style={styles.errorText}>Makam not found.</Text></SafeAreaView>;

  const handlePlay = async () => {
    if (playbackState === 'playing') {
      await audioEngine.stop(); setPlaybackState('idle'); setActiveIndex(-1); return;
    }
    const cents = makam.scaleDegreeCents;
    await audioEngine.playScale(makam.durak, cents, (state, index) => {
      setPlaybackState(state);
      if (index !== undefined) setActiveIndex(index);
      if (state === 'stopped') setActiveIndex(-1);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { audioEngine.stop(); router.back(); }} style={styles.backButton}>
          <Text style={styles.backText}>← Makams</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
          <Text style={styles.makamName}>{makam.name}</Text>
          <Text style={styles.pronunciation}>/{makam.pronunciation}/</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{makam.family} family</Text></View>
            <View style={[styles.tag, styles.tagAccent]}><Text style={[styles.tagText, styles.tagTextAccent]}>{SEYIR_LABELS[makam.seyir]}</Text></View>
          </View>
        </View>
        <View style={styles.audioCard}>
          <View style={styles.audioInner}>
            <TouchableOpacity onPress={handlePlay} activeOpacity={0.8}>
              <Animated.View style={[styles.playButton, { backgroundColor: makam.color, transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.playIcon}>{playbackState === 'playing' ? '■' : '▶'}</Text>
              </Animated.View>
            </TouchableOpacity>
            <View style={styles.audioMeta}>
              <Text style={styles.audioTitle}>{playbackState === 'playing' ? 'Playing...' : 'Play Scale'}</Text>
              <Text style={styles.audioSub}>{playbackState === 'playing' ? `${'Note'} · ${makam.scaleDegreeCents?.[activeIndex] ?? 0}¢` : `Hear the ${makam.name} makam`}</Text>
            </View>
          </View>
          <View style={styles.degreeRow}>
            {makam.scaleDegreeCents && makam.scaleDegreeCents.map((cents, i) => (
              <View key={i} style={[styles.degreePip, { backgroundColor: i === activeIndex ? makam.color : COLORS.border, height: i === activeIndex ? 24 : 10 }]} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{makam.description}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Root</Text><Text style={styles.infoValue}>{makam.durak}</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Dominant</Text><Text style={styles.infoValue}>{makam.guclu}</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{makam.timeOfDay}</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodRow}>
            {makam.mood.map((m) => <View key={m} style={styles.moodTag}><Text style={styles.moodText}>{m}</Text></View>)}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scale</Text>
          <Text style={styles.scaleNote}>● Characteristic degree — defines the makam's color</Text>
          <View style={styles.scaleGrid}>
            {makam.scaleDegreeCents && makam.scaleDegreeCents.map((cents, i) => (
              <View key={degree.degree} style={[styles.scaleItem, degree.isCharacteristic && { borderColor: makam.color, backgroundColor: makam.color + '15' }, i === activeIndex && { borderColor: makam.color, backgroundColor: makam.color + '30' }]}>
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
          <View style={styles.phraseCard}><Text style={styles.phraseText}>"{makam.characteristicPhrase}"</Text></View>
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
            {makam.relatedMakams.map((name) => <View key={name} style={styles.relatedTag}><Text style={styles.relatedText}>{name}</Text></View>)}
          </View>
        </View>
        <View style={[styles.section, { marginBottom: SPACING.xxxl }]}>
          <Text style={styles.sectionLabel}>Common Usul Pairings</Text>
          <View style={styles.usulRow}>
            {makam.commonUsuls && makam.commonUsuls.map((usul) => {
              const idMap = {'Düyek':'duyek','Sofyan':'sofyan','Aksak':'aksak','Semai':'semai','Curcuna':'curcuna','Muhammes':'muhammes','Devr-i Hindi':'devr-i-hindi','Yürük Semai':'yuruk-semai'};
              const usulId = idMap[usul] || usul.toLowerCase().replace(/ /g, '-');
              return (
                <TouchableOpacity key={usul} style={styles.usulTag} onPress={() => router.push('/usul/' + usulId)}>
                  <Text style={styles.usulTagText}>{usul}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Notable Pieces</Text>
          {makam.notablePieces.map((piece, i) => (
            <View key={i} style={styles.pieceRow}>
              <View style={styles.pieceTitleRow}>
                <Text style={styles.pieceTitle}>{piece.title}</Text>
                {piece.usul && <View style={styles.pieceUsulBadge}><Text style={styles.pieceUsulText}>{piece.usul}</Text></View>}
              </View>
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
  audioCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  audioInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  playButton: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: COLORS.background, fontSize: 16, marginLeft: 2 },
  audioMeta: { flex: 1 },
  audioTitle: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  audioSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  degreeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 28 },
  degreePip: { flex: 1, borderRadius: 2, minHeight: 10 },
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
  pieceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  pieceUsulBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  pieceUsulText: { fontSize: 10, color: COLORS.textTertiary, letterSpacing: 0.5 },
  usulRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  usulTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: COLORS.accent + '55', backgroundColor: COLORS.surface },
  usulTagText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  pieceTitle: { fontSize: 15, color: COLORS.textPrimary, marginBottom: 2 },
  pieceComposer: { fontSize: 13, color: COLORS.textSecondary },
});

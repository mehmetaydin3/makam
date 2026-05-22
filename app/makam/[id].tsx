import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getMakamById } from '../../data/makams';
import { COLORS, SPACING } from '../../data/constants';
import { audioEngine, PlaybackState } from '../../audio/audioEngine';

const SEYIR_LABELS = { ascending: 'Ascending ↗', descending: 'Descending ↘', undulating: 'Undulating ↗↘' };

export default function MakamDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const makam = getMakamById(id);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeDegree, setActiveDegree] = useState<number | null>(null);

  useEffect(() => {
    return () => { audioEngine.stop(); };
  }, []);

  const handlePlayStop = async () => {
    if (audioEngine.playing) {
      await audioEngine.stop();
      setPlaybackState('idle');
      setActiveDegree(null);
    } else {
      const cents = makam?.scale.map(d => d.cents) ?? [];
      await audioEngine.playScale(
        makam?.durak ?? '',
        cents,
        (state, degreeIndex) => {
          setPlaybackState(state === 'stopped' ? 'idle' : state);
          setActiveDegree(degreeIndex ?? null);
          if (state === 'stopped') setActiveDegree(null);
        }
      );
    }
  };

  if (!makam) return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.header}>
        <Text style={styles.backText}>← Makams</Text>
      </TouchableOpacity>
      <Text style={styles.errorText}>Makam not found.</Text>
    </SafeAreaView>
  );

  const isPlaying = playbackState === 'playing';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
          <TouchableOpacity
            style={[styles.playButton, { borderColor: makam.color }, isPlaying && { backgroundColor: makam.color }]}
            onPress={handlePlayStop}
          >
            <Text style={[styles.playButtonText, isPlaying && { color: '#fff' }]}>
              {isPlaying ? '■  Stop' : '▶  Play Scale'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{makam.description}</Text>
        </View>
        {makam.westernAnalogy ? (
          <View style={styles.analogyCard}>
            <Text style={styles.analogyLabel}>FOR WESTERN MUSICIANS</Text>
            <Text style={styles.analogyText}>{makam.westernAnalogy}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Root</Text><Text style={styles.infoValue}>{makam.durak}</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Dominant</Text><Text style={styles.infoValue}>{makam.guclu}</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{makam.timeOfDay}</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodRow}>
            {(makam.mood || []).map((m) => <View key={m} style={styles.moodTag}><Text style={styles.moodText}>{m}</Text></View>)}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scale Degrees</Text>
          <View style={styles.degreeGrid}>
            {(makam.scale || []).map((d, i) => {
              const nearest = Math.round(d.cents / 100) * 100;
              const dev = d.cents - nearest;
              const abs = Math.abs(dev);
              const dir = dev < 0 ? '♭' : '♯';
              let interp = '';
              if (abs >= 36 && abs <= 64) interp = '¼ tone ' + dir;
              else if (abs >= 16 && abs <= 35) interp = 'slightly ' + dir;
              else if (abs >= 65 && abs <= 85) interp = '¾ tone ' + dir;
              const centsLabel = abs > 15 ? (dev > 0 ? '+' : '') + dev + '¢' : '';
              const isActive = activeDegree === i;
              return (
                <View key={i} style={[
                  styles.degreeItem,
                  d.isCharacteristic && { borderColor: makam.color, borderWidth: 2 },
                  isActive && { backgroundColor: makam.color + '33', borderColor: makam.color, borderWidth: 2 }
                ]}>
                  <Text style={[styles.degreeNote, (d.isCharacteristic || isActive) && { color: makam.color }]}>{d.westernNearest}</Text>
                  {interp ? <Text style={[styles.degreeInterp, d.isCharacteristic && { color: makam.color + 'cc' }]}>{interp}</Text> : null}
                  {centsLabel && !interp ? <Text style={styles.degreeDev}>{centsLabel}</Text> : null}
                  {centsLabel && interp ? <Text style={styles.degreeCentsSmall}>{centsLabel}</Text> : null}
                </View>
              );
            })}
          </View>
          {makam.characterNote ? <Text style={styles.characterNote}>{makam.characterNote}</Text> : null}
          <Text style={styles.scaleHint}>Highlighted notes are where this makam lives — they can't be swapped for standard tuning.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Characteristic Movement</Text>
          <View style={styles.phraseCard}><Text style={styles.phraseText}>"{makam.characteristicPhrase}"</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Seyir</Text>
          <View style={styles.seyirCard}>
            <Text style={styles.seyirType}>{SEYIR_LABELS[makam.seyir]}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Related Makams</Text>
          <View style={styles.relatedRow}>
            {(makam.relatedMakams || []).map((name) => (
              <TouchableOpacity key={name} style={styles.relatedTag} onPress={() => router.push('/makam/' + name.toLowerCase())}>
                <Text style={styles.relatedText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Common Usul Pairings</Text>
          <View style={styles.usulRow}>
            {(makam.commonUsuls || []).map((usul) => {
              const idMap = {'Düyek':'duyek','Sofyan':'sofyan','Aksak':'aksak','Semai':'semai','Curcuna':'curcuna','Muhammes':'muhammes','Devr-i Hindi':'devr-i-hindi','Yürük Semai':'yuruk-semai'};
              const usulId = idMap[usul] || usul.toLowerCase().replace(/ /g, '-');
              return (
                <TouchableOpacity key={usul} style={styles.usulTag} onPress={() => router.push('/usul/' + usulId)}>
                  <Text style={styles.usulTagText}>{usul}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{ marginBottom: 80 }}>
          <Text style={styles.sectionLabel}>Notable Pieces</Text>
          {(makam.notablePieces || []).map((piece, i) => (
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
  makamName: { fontSize: 52, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -2, marginBottom: 4 },
  pronunciation: { fontSize: 15, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: SPACING.md },
  tagRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tagAccent: { borderColor: COLORS.accent + '55' },
  tagText: { fontSize: 12, color: COLORS.textSecondary },
  tagTextAccent: { color: COLORS.accent },
  playButton: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, marginTop: SPACING.sm },
  playButtonText: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  section: { marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  analogyCard: { backgroundColor: COLORS.accentMuted, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.accent + '33', borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  analogyLabel: { fontSize: 10, color: COLORS.accent, letterSpacing: 2, marginBottom: 6 },
  analogyText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  infoCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  infoLabel: { fontSize: 10, color: COLORS.textTertiary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'center' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  moodTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  moodText: { fontSize: 13, color: COLORS.textSecondary },
  degreeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  degreeItem: { width: '22%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  degreeNote: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'center' },
  degreeInterp: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, textAlign: 'center' },
  degreeDev: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2, textAlign: 'center' },
  degreeCentsSmall: { fontSize: 9, color: COLORS.textTertiary, marginTop: 1, textAlign: 'center' },
  scaleHint: { fontSize: 12, color: COLORS.textTertiary, marginTop: SPACING.md, lineHeight: 18, fontStyle: 'italic' },
  characterNote: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic', marginTop: SPACING.sm, marginBottom: SPACING.sm },
  phraseCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  phraseText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  seyirCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  seyirType: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  relatedTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  relatedText: { fontSize: 13, color: COLORS.textSecondary },
  usulRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  usulTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: COLORS.accent + '55', backgroundColor: COLORS.surface },
  usulTagText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  pieceRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pieceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  pieceUsulBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  pieceUsulText: { fontSize: 10, color: COLORS.textTertiary },
  pieceTitle: { fontSize: 15, color: COLORS.textPrimary, marginBottom: 2 },
  pieceComposer: { fontSize: 13, color: COLORS.textSecondary },
});

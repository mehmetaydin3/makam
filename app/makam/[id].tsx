import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUsulById } from '../../data/usuls';
import { useState, useEffect, useRef } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getMakamById, AudioExample } from '../../data/makams';
import { COLORS, SPACING } from '../../data/constants';
import { audioEngine, PlaybackState } from '../../audio/audioEngine';
import Sound from 'react-native-sound';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PLAYER_HEIGHT = (SCREEN_WIDTH - SPACING.lg * 2) * 9 / 16;

const SEYIR_LABELS = {
  ascending: 'Ascending ↗',
  descending: 'Descending ↘',
  undulating: 'Undulating ↗↘',
};

function AudioCard({
  example,
  label,
  color,
  showTaksimExplainer = false,
}: {
  example: AudioExample;
  label: string;
  color: string;
  showTaksimExplainer?: boolean;
}) {
  return (
    <View style={[styles.audioCard, { borderLeftColor: color }]}>
      <Text style={[styles.audioCardLabel, { color }]}>{label}</Text>

      {showTaksimExplainer && (
        <View style={styles.explainerBox}>
          <Text style={styles.explainerText}>
            A taksim is a free-form improvisation — no fixed rhythm, no composed melody. The musician explores the makam through spontaneous expression. It is the purest way to hear what a makam sounds like.
          </Text>
        </View>
      )}

      <Text style={styles.audioTitle}>{example.title}</Text>
      <Text style={styles.audioMeta}>
        {example.composer}
        {example.performer !== example.composer ? ' · ' + example.performer : ''}
        {example.year ? ' · ' + example.year : ''}
      </Text>
      <Text style={styles.audioDescription}>{example.description}</Text>

      <View style={styles.playerWrapper}>
        <YoutubePlayer
          height={PLAYER_HEIGHT}
          videoId={example.youtubeId}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          }}
          initialPlayerParams={{
            rel: false,
            modestbranding: true,
          }}
        />
      </View>
    </View>
  );
}

export default function MakamDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const makam = getMakamById(id as string);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeDegree, setActiveDegree] = useState<number | null>(null);
  const [selectedUsul, setSelectedUsul] = useState<string | null>(null);
  const selectedUsulData = selectedUsul ? getUsulById(selectedUsul) : null;
  const [usulPlaying, setUsulPlaying] = useState(false);
  const usulSoundRef = useRef<Sound | null>(null);

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
        makam?.id ?? '',
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

  const closeUsulModal = () => {
    if (usulSoundRef.current) { usulSoundRef.current.stop(); usulSoundRef.current.release(); usulSoundRef.current = null; }
    setUsulPlaying(false);
    setSelectedUsul(null);
  };

  const playUsul = () => {
    if (usulPlaying) {
      if (usulSoundRef.current) { usulSoundRef.current.stop(); usulSoundRef.current.release(); usulSoundRef.current = null; }
      setUsulPlaying(false);
      return;
    }
    const filename = `usul_${selectedUsul}.wav`;
    const s = new Sound(filename, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) { console.error('Usul audio error:', error); return; }
      usulSoundRef.current = s;
      setUsulPlaying(true);
      s.play(() => { s.release(); usulSoundRef.current = null; setUsulPlaying(false); });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Makams</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
          <Text style={styles.makamName}>{makam.name}</Text>
          <Text style={styles.pronunciation}>/{makam.pronunciation}/</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{makam.family} family</Text>
            </View>
            <View style={[styles.tag, styles.tagAccent]}>
              <Text style={[styles.tagText, styles.tagTextAccent]}>
                {SEYIR_LABELS[makam.seyir]}
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{makam.description}</Text>
        </View>

        {/* WESTERN ANALOGY */}
        {makam.westernAnalogy ? (
          <View style={styles.analogyCard}>
            <Text style={styles.analogyLabel}>FOR WESTERN MUSICIANS</Text>
            <Text style={styles.analogyText}>{makam.westernAnalogy}</Text>
          </View>
        ) : null}

        {/* INFO ROW */}
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

        {/* MOOD */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodRow}>
            {(makam.mood || []).map((m) => (
              <View key={m} style={styles.moodTag}>
                <Text style={styles.moodText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* LISTENING SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Listen</Text>
          <AudioCard
            example={makam.listening.sarki}
            label="ICONIC RECORDING"
            color={makam.color}
          />
          <AudioCard
            example={makam.listening.taksim}
            label="TAKSIM — PURE IMPROVISATION"
            color={makam.color}
            showTaksimExplainer
          />
        </View>

        {/* SCALE DEGREES */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Scale Degrees</Text>
          <TouchableOpacity
            style={[styles.playButton, { borderColor: makam.color }, isPlaying && { backgroundColor: makam.color }]}
            onPress={handlePlayStop}
          >
            <Text style={[styles.playButtonText, isPlaying && { color: '#fff' }]}>
              {isPlaying ? '■  Stop' : '▶  Play Scale on Ney'}
            </Text>
          </TouchableOpacity>
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
                  isActive && { backgroundColor: makam.color + '33', borderColor: makam.color, borderWidth: 2 },
                ]}>
                  <Text style={[styles.degreeNote, (d.isCharacteristic || isActive) && { color: makam.color }]}>
                    {d.westernNearest}
                  </Text>
                  {interp ? <Text style={[styles.degreeInterp, d.isCharacteristic && { color: makam.color + 'cc' }]}>{interp}</Text> : null}
                  {centsLabel && !interp ? <Text style={styles.degreeDev}>{centsLabel}</Text> : null}
                  {centsLabel && interp ? <Text style={styles.degreeCentsSmall}>{centsLabel}</Text> : null}
                </View>
              );
            })}
          </View>
          {makam.characterNote ? <Text style={styles.characterNote}>{makam.characterNote}</Text> : null}
          <Text style={styles.scaleHint}>Highlighted notes are where this makam lives — they cannot be swapped for standard tuning.</Text>
        </View>

        {/* CHARACTERISTIC MOVEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Characteristic Movement</Text>
          <View style={styles.phraseCard}>
            <Text style={styles.phraseText}>"{makam.characteristicPhrase}"</Text>
          </View>
        </View>

        {/* USUL PAIRINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Rhythmic Cycles (Usul)</Text>
          <View style={{ backgroundColor: COLORS.accent + '11', borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.accent + '33' }}>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 }}>
              A makam without its usul is just a scale. The rhythmic cycle gives it life — pulse, momentum, and form. Tap any usul below to hear how it sounds and feel how it moves.
            </Text>
          </View>
          <View style={{ gap: SPACING.sm }}>
            {(makam.commonUsuls || []).map((usul) => {
              const idMap: Record<string, string> = {
                'Duyek': 'duyek', 'Düyek': 'duyek',
                'Sofyan': 'sofyan',
                'Aksak': 'aksak',
                'Semai': 'semai', 'Semâi': 'semai',
                'Curcuna': 'curcuna', 'Curcûna': 'curcuna',
                'Muhammes': 'muhammes',
                'Devr-i Hindi': 'devr-i-hindi',
                'Yuruk Semai': 'yuruk-semai', 'Yürük Semai': 'yuruk-semai',
              };
              const usulId = idMap[usul] || usul.toLowerCase().replace(/ /g, '-');
              const usulData = getUsulById(usulId);
              return (
                <TouchableOpacity
                  key={usul}
                  onPress={() => setSelectedUsul(usulId)}
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent + '22', borderWidth: 1, borderColor: COLORS.accent + '55', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: COLORS.accent, fontSize: 16 }}>▶</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: '500', marginBottom: 2 }}>{usul}</Text>
                    {usulData && <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>{usulData.timeSignature} • {usulData.totalBeats} beats • {usulData.tempo}</Text>}
                  </View>
                  <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SEYIR */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Seyir</Text>
          <View style={styles.seyirCard}>
            <Text style={styles.seyirType}>{SEYIR_LABELS[makam.seyir]}</Text>
          </View>
        </View>

        {/* RELATED MAKAMS */}
        <View style={{ marginBottom: 80 }}>
          <Text style={styles.sectionLabel}>Related Makams</Text>
          <View style={styles.relatedRow}>
            {(makam.relatedMakams || []).map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.relatedTag}
                onPress={() => {
                const nameToId: Record<string, string> = {
                  'Rast': 'rast', 'Uşşak': 'ussak', 'Ussak': 'ussak',
                  'Hicaz': 'hicaz', 'Hüseyni': 'huseyni', 'Huseyni': 'huseyni',
                  'Saba': 'saba', 'Segah': 'segah', 'Kurd': 'kurd',
                  'Neva': 'neva', 'Buselik': 'buselik', 'Çargah': 'cargah',
                  'Nihavend': 'nihavend',
                };
                const targetId = nameToId[name] || name.toLowerCase();
                router.push(('/makam/' + targetId) as any);
              }}
              >
                <Text style={styles.relatedText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>



      </ScrollView>

        {/* USUL MODAL */}
        <Modal
          visible={!!selectedUsul}
          transparent
          animationType="slide"
          onRequestClose={closeUsulModal}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeUsulModal} />
            <View style={{ backgroundColor: '#1A1A1C', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 48 }}>
              {selectedUsulData && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: COLORS.accent, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>Usul</Text>
                    <TouchableOpacity onPress={closeUsulModal}>
                      <Text style={{ color: COLORS.textTertiary, fontSize: 20 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: COLORS.textPrimary, fontSize: 28, fontWeight: '300', marginBottom: 2 }}>{selectedUsulData.name}</Text>
                  <Text style={{ color: COLORS.textTertiary, fontSize: 13, marginBottom: 20 }}>/{selectedUsulData.pronunciation}/ • {selectedUsulData.timeSignature} • {selectedUsulData.tempo}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
                    {selectedUsulData.pattern.map((beat, i) => (
                      <View key={i} style={{
                        flex: 1, height: 32, borderRadius: 4,
                        backgroundColor: beat === 'strong' ? COLORS.accent : beat === 'medium' ? COLORS.accent + '55' : beat === 'weak' ? '#2A2A2C' : 'transparent',
                        borderWidth: beat === 'rest' ? 1 : 0, borderColor: COLORS.border,
                      }} />
                    ))}
                  </View>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 15, lineHeight: 24, marginBottom: 20 }}>{selectedUsulData.description}</Text>
                  <TouchableOpacity
                    onPress={playUsul}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.accent + '22', borderWidth: 1, borderColor: COLORS.accent + '55', borderRadius: 12, padding: 14 }}
                  >
                    <Text style={{ fontSize: 18 }}>{usulPlaying ? '⏹' : '▶'}</Text>
                    <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: '600' }}>{usulPlaying ? 'Stop' : 'Hear this usul'}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

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
  tagRow: { flexDirection: 'row', gap: SPACING.sm },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tagAccent: { borderColor: COLORS.accent + '55' },
  tagText: { fontSize: 12, color: COLORS.textSecondary },
  tagTextAccent: { color: COLORS.accent },
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
  audioCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, marginBottom: SPACING.lg },
  audioCardLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.sm, fontWeight: '600' },
  explainerBox: { backgroundColor: COLORS.background, borderRadius: 8, padding: SPACING.sm, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  explainerText: { fontSize: 12, color: COLORS.textTertiary, lineHeight: 18, fontStyle: 'italic' },
  audioTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  audioMeta: { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  audioDescription: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md },
  playerWrapper: { borderRadius: 8, overflow: 'hidden' },
  playButton: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, marginBottom: SPACING.md },
  playButtonText: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
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
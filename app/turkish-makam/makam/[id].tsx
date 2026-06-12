import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUsulById } from '../../../data/usuls';
import { useState, useEffect, useRef, useMemo } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getMakamById, getMakamByName, AudioExample } from '../../../data/makams';
import { useLanguage } from '../../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import ShareableCard from '../../../components/ShareableCard';
import { SPACING, RADIUS, ColorScheme } from '../../../data/constants';
import { useTheme } from '../../../context/ThemeContext';
import { useProgress } from '../../../hooks/useProgress';
import { MasteryBar } from '../../../components/mastery/MasteryBar';
import { audioEngine, PlaybackState, PLAYABLE_MAKAM_IDS } from '../../../audio/audioEngine';
import { MakamScaleDiagram } from '../../../components/scale/MakamScaleDiagram';
import { Accordion } from '../../../components/common/Accordion';
import { CharacterBand } from '../../../components/common/CharacterBand';
import { ArtistLink } from '../../../components/common/ArtistLink';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PLAYER_HEIGHT = (SCREEN_WIDTH - SPACING.lg * 2) * 9 / 16;

const SEYIR_LABELS_EN = {
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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
        <ArtistLink name={example.composer} accent={color} />
        {example.performer !== example.composer ? (
          <Text>
            {' · '}
            <ArtistLink name={example.performer} accent={color} />
          </Text>
        ) : null}
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
  const { t, language, noteNames } = useLanguage();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const COLORS = colors;
  const [showShare, setShowShare] = useState(false);
  const SEYIR_LABELS = language === 'tr' ? {
    ascending: 'Çıkıcı ↗',
    descending: 'İnici ↘',
    undulating: 'İnici-Çıkıcı ↗↘',
  } : SEYIR_LABELS_EN;
  const makam = getMakamById(id as string);
  const accent = makam?.color ?? COLORS.accent;
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeDegree, setActiveDegree] = useState<number | null>(null);
  const [selectedUsul, setSelectedUsul] = useState<string | null>(null);
  const selectedUsulData = selectedUsul ? getUsulById(selectedUsul) : null;
  const [usulPlaying, setUsulPlaying] = useState(false);
  // usul playback now goes through the expo-audio engine

  useEffect(() => {
    return () => { audioEngine.stop(); };
  }, []);

  const { markModeExplored, modeMasteryPoints } = useProgress();
  useEffect(() => {
    if (makam) markModeExplored('turkish-makam', makam.id);
  }, [makam?.id]);

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
        <Text style={[styles.backText, { color: accent }]}>← Makams</Text>
      </TouchableOpacity>
      <Text style={styles.errorText}>Makam not found.</Text>
    </SafeAreaView>
  );

  const isPlaying = playbackState === 'playing';

  const closeUsulModal = () => {
    audioEngine.stop();
    setUsulPlaying(false);
    setSelectedUsul(null);
  };

  const playUsul = async () => {
    if (usulPlaying) {
      await audioEngine.stop();
      setUsulPlaying(false);
      return;
    }
    const filename = `usul_${selectedUsul}.wav`;
    setUsulPlaying(true);
    await audioEngine.playUsul(filename, () => setUsulPlaying(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>← Makams</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowShare(true)} style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color={accent} />
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
              <Text style={styles.tagText}>{makam.family} {language === 'tr' ? ' ailesi' : ' family'}</Text>
            </View>
            <View style={[styles.tag, styles.tagAccent, { borderColor: accent + '55' }]}>
              <Text style={[styles.tagText, styles.tagTextAccent, { color: accent }]}>
                {SEYIR_LABELS[makam.seyir]}
              </Text>
            </View>
          </View>

          <MasteryBar
            points={modeMasteryPoints('turkish-makam', makam.id)}
            accent={accent}
            textPrimary={COLORS.textPrimary}
            textSecondary={COLORS.textSecondary}
            textTertiary={COLORS.textTertiary}
            surface={COLORS.surface}
            border={COLORS.border}
          />
        </View>

        {/* HERO SCALE — hear it first */}
        <MakamScaleDiagram
          makamId={makam.id}
          scale={makam.scale || []}
          accentColor={makam.color}
          noteNames={noteNames === 'solfege' ? 'solfege' : 'western'}
        />
        {makam.characterNote ? <Text style={styles.characterNote}>{makam.characterNote}</Text> : null}

        {/* DRONE / PLAY ALONG — hold the durak and sing/play the makam over it.
            Only for makams the ney engine can voice at a correct root. */}
        {PLAYABLE_MAKAM_IDS.includes(makam.id) && (
          <TouchableOpacity
            style={[styles.droneEntry, { borderColor: accent + '55' }]}
            onPress={() => { audioEngine.stop(); router.push(('/turkish-makam/makam/drone?id=' + makam.id) as any); }}
            activeOpacity={0.85}
          >
            <View style={[styles.droneEntryIcon, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
              <Ionicons name="radio-outline" size={18} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.droneEntryTitle}>{language === 'tr' ? 'Dem (Drone) ile çal' : 'Drone · Play along'}</Text>
              <Text style={styles.droneEntrySub}>{language === 'tr' ? 'Durağı tut, üzerine söyle ya da çal' : 'Hold the durak and sing or play over it'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}

        {/* CHARACTER BAND — color + time + mood, compact */}
        <CharacterBand
          swatch={makam.color}
          accent={accent}
          colors={COLORS}
          moods={makam.mood || []}
          timeOfDay={makam.timeOfDay}
        />

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

        {/* ABOUT (collapsed) */}
        <Accordion title={language === 'tr' ? 'Hakkında' : 'About'} accent={accent} colors={COLORS}>
          <Text style={styles.description}>{makam.description}</Text>
          {makam.westernAnalogy ? (
            <View style={[styles.analogyCard, { backgroundColor: accent + '11', borderColor: accent + '33', borderLeftColor: accent, marginTop: SPACING.md, marginBottom: 0 }]}>
              <Text style={[styles.analogyLabel, { color: accent }]}>{language === 'tr' ? 'BATI MÜZİSYENLERİ İÇİN' : 'FOR WESTERN MUSICIANS'}</Text>
              <Text style={styles.analogyText}>{makam.westernAnalogy}</Text>
            </View>
          ) : null}
        </Accordion>

        {/* LISTENING SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: accent }]}>{language === 'tr' ? 'Dinle' : 'Listen'}</Text>
          {makam.listening.sarki.youtubeId && (
            <AudioCard
              example={makam.listening.sarki}
              label="ICONIC RECORDING"
              color={makam.color}
            />
          )}
          {makam.listening.taksim.youtubeId && (
            <AudioCard
              example={makam.listening.taksim}
              label="TAKSIM — PURE IMPROVISATION"
              color={makam.color}
              showTaksimExplainer
            />
          )}
        </View>

        {/* CHARACTERISTIC MOVEMENT (collapsed) */}
        <Accordion title="Characteristic Movement" accent={accent} colors={COLORS}>
          <View style={[styles.phraseCard, { borderLeftColor: accent }]}>
            <Text style={styles.phraseText}>"{makam.characteristicPhrase}"</Text>
          </View>
        </Accordion>

        {/* USUL PAIRINGS (collapsed) */}
        <Accordion title="Rhythmic Cycles (Usul)" accent={accent} colors={COLORS}>
          <View style={{ backgroundColor: accent + '11', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: accent + '33' }}>
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
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: accent + '22', borderWidth: 1, borderColor: accent + '55', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="play" size={15} color={accent} />
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
        </Accordion>

        {/* SEYIR (collapsed) */}
        <Accordion title="Seyir" accent={accent} colors={COLORS}>
          <View style={[styles.seyirCard, { borderWidth: 0, padding: 0 }]}>
            <Text style={styles.seyirType}>{SEYIR_LABELS[makam.seyir]}</Text>
          </View>
        </Accordion>

        {/* RELATED MAKAMS */}
        <View style={{ marginBottom: 80 }}>
          <Text style={[styles.sectionLabel, { color: accent }]}>{language === 'tr' ? 'İlgili Makamlar' : 'Related Makams'}</Text>
          <View style={styles.relatedRow}>
            {(makam.relatedMakams || []).map((name) => {
              const target = getMakamByName(name);
              // Only link makams that actually exist in the guide; others are
              // shown as plain tags so a tap never lands on a "not found" screen.
              if (!target) {
                return (
                  <View key={name} style={[styles.relatedTag, styles.relatedTagInactive]}>
                    <Text style={[styles.relatedText, styles.relatedTextInactive]}>{name}</Text>
                  </View>
                );
              }
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.relatedTag, { borderColor: accent + '55' }]}
                  onPress={() => router.push(('/turkish-makam/makam/' + target.id) as any)}
                >
                  <Text style={[styles.relatedText, { color: accent }]}>{name}</Text>
                </TouchableOpacity>
              );
            })}
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
                    <Text style={{ color: accent, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>Usul</Text>
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
                        backgroundColor: beat === 'strong' ? accent : beat === 'medium' ? accent + '55' : beat === 'weak' ? '#2A2A2C' : 'transparent',
                        borderWidth: beat === 'rest' ? 1 : 0, borderColor: COLORS.border,
                      }} />
                    ))}
                  </View>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 15, lineHeight: 24, marginBottom: 20 }}>{selectedUsulData.description}</Text>
                  <TouchableOpacity
                    onPress={playUsul}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: accent + '22', borderWidth: 1, borderColor: accent + '55', borderRadius: RADIUS.md, padding: 14 }}
                  >
                    <Ionicons name={usulPlaying ? "stop" : "play"} size={15} color={accent} />
                    <Text style={{ color: accent, fontSize: 14, fontWeight: '600' }}>{usulPlaying ? 'Stop' : 'Hear this usul'}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      <ShareableCard makam={makam} visible={showShare} onClose={() => setShowShare(false)} />
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  errorText: { color: COLORS.textSecondary, padding: SPACING.lg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shareButton: { padding: 4 },
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
  analogyCard: { backgroundColor: COLORS.accentMuted, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.accent + '33', borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  analogyLabel: { fontSize: 10, color: COLORS.accent, letterSpacing: 2, marginBottom: 6 },
  analogyText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  infoCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  infoLabel: { fontSize: 10, color: COLORS.textTertiary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'center' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  moodTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  moodText: { fontSize: 13, color: COLORS.textSecondary },
  audioCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, marginBottom: SPACING.lg },
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
  degreeItem: { width: '22%', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  degreeNote: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'center' },
  degreeInterp: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, textAlign: 'center' },
  degreeDev: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2, textAlign: 'center' },
  degreeCentsSmall: { fontSize: 9, color: COLORS.textTertiary, marginTop: 1, textAlign: 'center' },
  scaleHint: { fontSize: 12, color: COLORS.textTertiary, marginTop: SPACING.md, lineHeight: 18, fontStyle: 'italic' },
  characterNote: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic', marginTop: SPACING.xs, marginBottom: SPACING.md, paddingHorizontal: SPACING.xs },
  droneEntry: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, marginBottom: SPACING.lg },
  droneEntryIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  droneEntryTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  droneEntrySub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  phraseCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  phraseText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  seyirCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  seyirType: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  relatedTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  relatedTagInactive: { borderStyle: 'dashed', opacity: 0.55 },
  relatedText: { fontSize: 13, color: COLORS.textSecondary },
  relatedTextInactive: { color: COLORS.textTertiary },
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
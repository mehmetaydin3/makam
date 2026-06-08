import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getModeById, getRelatedModes } from '../../../data/traditions/modal-jazz/modes';
import { useProgress } from '../../../hooks/useProgress';
import { MasteryBar } from '../../../components/mastery/MasteryBar';
import { JAZZ_COLORS, JazzColorScheme, SPACING, RADIUS } from '../../../data/traditions/modal-jazz/theme';
import { useTheme } from '../../../context/ThemeContext';
import YouTubeEmbed from '../../../components/lessons/YouTubeEmbed';
import { YOUTUBE_IDS } from '../../../data/traditions/modal-jazz/youtubeIds';
import ScaleDiagram from '../../../components/lessons/ScaleDiagram';
import { Accordion } from '../../../components/common/Accordion';
import { CharacterBand } from '../../../components/common/CharacterBand';

const brightnessColor = (c: JazzColorScheme): Record<string, string> => ({
  bright: c.bright,
  neutral: c.neutral,
  dark: c.dark,
});


export default function ModalJazzModeDetail() {
  const { id } = useLocalSearchParams();
  const modeId = id as string;
  const router = useRouter();
  const { markModeExplored, modeMasteryPoints } = useProgress();
  const { jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(jazzColors), [jazzColors]);
  const JAZZ_COLORS = jazzColors;
  const mode = getModeById(modeId);

  useEffect(() => {
    if (modeId) markModeExplored('modal-jazz', modeId);
  }, [modeId]);

  if (!mode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: JAZZ_COLORS.textSecondary }}>Mode not found.</Text>
      </View>
    );
  }

  const accentColor = brightnessColor(jazzColors)[mode.brightness];
  const related = getRelatedModes(mode.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={JAZZ_COLORS.textPrimary} />
          <Text style={styles.backLabel}>Modes</Text>
        </TouchableOpacity>
        <View style={[styles.brightnessBadge, { backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.brightnessText, { color: accentColor }]}>{mode.brightness}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.name}>{mode.name}</Text>
          <View style={styles.heroMeta}>
            <Text style={[styles.oneWord, { color: accentColor }]}>{mode.oneWord}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>
              {mode.degree === 1 ? 'major scale' :
               mode.degree === 2 ? 'minor · 2nd degree' :
               mode.degree === 3 ? 'minor · 3rd degree' :
               mode.degree === 4 ? 'major · 4th degree' :
               mode.degree === 5 ? 'dominant · 5th degree' :
               mode.degree === 6 ? 'minor · 6th degree' :
               'diminished · 7th degree'}
            </Text>
          </View>

          <MasteryBar
            points={modeMasteryPoints('modal-jazz', mode.id)}
            accent={accentColor}
            textPrimary={JAZZ_COLORS.textPrimary}
            textSecondary={JAZZ_COLORS.textSecondary}
            textTertiary={JAZZ_COLORS.textTertiary}
            surface={JAZZ_COLORS.surface}
            border={JAZZ_COLORS.border}
          />
        </View>

        {/* ── HERO SCALE — hear it first ── */}
        <ScaleDiagram defaultRootSemitone={mode.degree === 1 ? 0 : mode.degree === 2 ? 2 : mode.degree === 3 ? 4 : mode.degree === 4 ? 5 : mode.degree === 5 ? 7 : mode.degree === 6 ? 9 : 11}
          intervals={mode.intervals}
          colorNoteInterval={mode.colorNoteInterval}
          avoidNoteInterval={mode.avoidNoteInterval}
          brightness={mode.brightness}
        />

        {/* ── CHARACTER BAND — brightness swatch + one-word ── */}
        <CharacterBand
          swatch={accentColor}
          accent={accentColor}
          colors={JAZZ_COLORS}
          swatchLabel={mode.brightness}
          moods={[mode.oneWord]}
        />

        {/* Color note callout — the defining sound */}
        <View style={[styles.colorNoteCard, { borderLeftColor: accentColor }]}>
          <Text style={styles.colorNoteHeading}>The color note</Text>
          <Text style={[styles.colorNoteValue, { color: accentColor }]}>{mode.colorNote}</Text>
          <Text style={styles.colorNoteExplain}>
            This is the note that defines the sound of {mode.name}. Remove it and the mode loses its identity.
          </Text>
        </View>

        {mode.avoidNote && (
          <View style={[styles.avoidNoteCard, { marginTop: SPACING.sm }]}>
            <Text style={styles.avoidLabel}>Avoid note</Text>
            <Text style={styles.avoidValue}>{mode.avoidNote}</Text>
            <Text style={styles.avoidExplain}>Use this note carefully — it can clash against the tonic.</Text>
          </View>
        )}

        {/* ── About (collapsed) ── */}
        <View style={{ height: SPACING.md }} />
        <Accordion title="About this mode" accent={accentColor} colors={JAZZ_COLORS}>
          <Text style={styles.character}>{mode.character}</Text>
        </Accordion>

        {/* ── When to use it (collapsed) ── */}
        <Accordion title="When to use it" accent={accentColor} colors={JAZZ_COLORS}>
          {mode.chordContexts.map((ctx, i) => (
            <View key={i} style={[styles.chordCard, i === 0 && { marginTop: 0 }]}>
              <View style={styles.chordCardTop}>
                <Text style={styles.chordSymbol}>{ctx.chordSymbol}</Text>
                <Text style={styles.chordType}>{ctx.chordType}</Text>
              </View>
              <Text style={styles.chordDescription}>{ctx.description}</Text>
              <View style={styles.progressionsRow}>
                {ctx.commonProgressions.map((p, j) => (
                  <View key={j} style={styles.progressionPill}>
                    <Text style={[styles.progressionText, { color: accentColor }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Accordion>

        {/* ── Hear it (kept visible — audio) ── */}
        <Section label="Hear it in action">
          {mode.classicTunes.map((tune, i) => {
            const videoId = tune.youtubeId || YOUTUBE_IDS[tune.title];
            return (
              <View key={i} style={styles.tuneCard}>
                <View style={styles.tuneTop}>
                  <Text style={styles.tuneTitle}>{tune.title}</Text>
                  <Text style={styles.tuneYear}>{tune.year}</Text>
                </View>
                <Text style={[styles.tuneArtist, { color: accentColor }]}>{tune.artist}</Text>
                <Text style={styles.tuneWhy}>{tune.whyThisTune}</Text>
                {videoId && (
                  <View style={styles.playerWrapper}>
                    <YouTubeEmbed videoId={videoId} />
                  </View>
                )}
              </View>
            );
          })}
        </Section>

        {/* ── Notable players (collapsed) ── */}
        <Accordion title="Notable players" accent={accentColor} colors={JAZZ_COLORS}>
          <View style={styles.playersRow}>
            {mode.notablePlayers.map((p, i) => (
              <View key={i} style={styles.playerPill}>
                <Text style={styles.playerText}>{p}</Text>
              </View>
            ))}
          </View>
        </Accordion>

        {/* ── Theory (collapsed) ── */}
        <Accordion title="Theory" accent={accentColor} colors={JAZZ_COLORS}>
          <View style={styles.theoryGrid}>
            <TheoryRow accent={accentColor} label="Degree" value={`${mode.degree}${ordinal(mode.degree)} degree of the major scale`} />
            <TheoryRow accent={accentColor} label="Formula" value={mode.formula} />
            <TheoryRow accent={accentColor} label="Relative key" value={mode.relativeKey} />
            <TheoryRow accent={accentColor} label="Intervals" value={mode.intervals.join('  ')} mono />
          </View>
        </Accordion>

        {/* ── Often confused with (collapsed) ── */}
        {related.length > 0 && (
            <Accordion title="Often confused with" accent={accentColor} colors={JAZZ_COLORS}>
              {related.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.relatedCard}
                  onPress={() => router.replace(('/modal-jazz/mode/' + r.id) as any)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.relatedName}>{r.name}</Text>
                    <Text style={styles.relatedOneWord}>{r.oneWord}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color={JAZZ_COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </Accordion>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const { jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(jazzColors), [jazzColors]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function TheoryRow({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: string }) {
  const { jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(jazzColors), [jazzColors]);
  return (
    <View style={styles.theoryRow}>
      <Text style={styles.theoryLabel}>{label}</Text>
      <Text style={[styles.theoryValue, mono && styles.theoryMono, mono && accent ? { color: accent } : null]}>{value}</Text>
    </View>
  );
}

function ordinal(n: number): string {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const makeStyles = (JAZZ_COLORS: JazzColorScheme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: JAZZ_COLORS.background },
  errorContainer: { flex: 1, backgroundColor: JAZZ_COLORS.background, justifyContent: 'center', alignItems: 'center' },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 15, color: JAZZ_COLORS.textPrimary },
  brightnessBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  brightnessText: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.lg },
  hero: { paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  name: { fontSize: 42, fontWeight: '200', color: JAZZ_COLORS.textPrimary, letterSpacing: 0.5, marginBottom: 8 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  oneWord: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: JAZZ_COLORS.textTertiary },
  metaText: { fontSize: 12, color: JAZZ_COLORS.textTertiary },
  character: { fontSize: 16, color: JAZZ_COLORS.textSecondary, lineHeight: 26 },
  divider: { height: 1, backgroundColor: JAZZ_COLORS.border, marginVertical: SPACING.lg },
  section: { marginBottom: SPACING.sm },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: JAZZ_COLORS.textTertiary, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.md },
  colorNoteCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderLeftWidth: 3, padding: SPACING.md, marginBottom: SPACING.sm },
  colorNoteHeading: { fontSize: 11, color: JAZZ_COLORS.textTertiary, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  colorNoteValue: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
  colorNoteExplain: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 20 },
  avoidNoteCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderLeftWidth: 3, borderLeftColor: JAZZ_COLORS.warning, padding: SPACING.md },
  avoidLabel: { fontSize: 11, color: JAZZ_COLORS.warning, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  avoidValue: { fontSize: 16, fontWeight: '600', color: JAZZ_COLORS.warning, marginBottom: 4 },
  avoidExplain: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 20 },
  chordCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.border, padding: SPACING.md, marginBottom: SPACING.sm },
  chordCardTop: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: SPACING.sm },
  chordSymbol: { fontSize: 22, fontWeight: '500', color: JAZZ_COLORS.textPrimary },
  chordType: { fontSize: 13, color: JAZZ_COLORS.textTertiary },
  chordDescription: { fontSize: 14, color: JAZZ_COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.sm },
  progressionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  progressionPill: { backgroundColor: JAZZ_COLORS.surfaceRaised, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  progressionText: { fontSize: 11, color: JAZZ_COLORS.accent, fontFamily: 'Courier' },
  tuneCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.border, padding: SPACING.md, marginBottom: SPACING.sm },
  tuneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  tuneTitle: { fontSize: 16, fontWeight: '500', color: JAZZ_COLORS.textPrimary, flex: 1 },
  tuneYear: { fontSize: 12, color: JAZZ_COLORS.textTertiary, marginLeft: SPACING.sm },
  tuneArtist: { fontSize: 13, color: JAZZ_COLORS.accent, marginBottom: SPACING.sm },
  tuneWhy: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md },
  playerWrapper: { borderRadius: RADIUS.md, overflow: 'hidden' },
  playersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  playerPill: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.full, borderWidth: 1, borderColor: JAZZ_COLORS.border, paddingHorizontal: 12, paddingVertical: 6 },
  playerText: { fontSize: 13, color: JAZZ_COLORS.textSecondary },
  theoryGrid: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.border, overflow: 'hidden' },
  theoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: JAZZ_COLORS.border },
  theoryLabel: { fontSize: 13, color: JAZZ_COLORS.textTertiary },
  theoryValue: { fontSize: 13, color: JAZZ_COLORS.textPrimary, textAlign: 'right', flex: 1, marginLeft: SPACING.md },
  theoryMono: { fontFamily: 'Courier', color: JAZZ_COLORS.accent, letterSpacing: 2 },
  relatedCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.border, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  relatedName: { fontSize: 16, fontWeight: '500', color: JAZZ_COLORS.textPrimary },
  relatedOneWord: { fontSize: 12, color: JAZZ_COLORS.textTertiary, marginTop: 2 },
});

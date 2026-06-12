import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { SPACING, RADIUS, ColorScheme } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { MAKAMS } from '../../data/makams';
import { LESSONS } from '../../data/education';
import { MODES as JAZZ_MODES } from '../../data/traditions/modal-jazz/modes';
import { COMING_SOON_TRADITIONS, LIVE_TRADITIONS } from '../../data/traditions/registry';
import { Constellation, StarDatum } from '../../components/constellation/Constellation';
import { StreakBadge, XpBadge } from '../../components/rewards';

/**
 * Journey — the meta-layer above traditions.
 *
 * The "soul of progress" screen (IA spec §3): spatial & narrative, NOT a
 * scoreboard. No streaks, no XP, no "X of Y" counts. Progress is a map of
 * where you've been.
 *
 * 3c.2: renders the full shape with an honest empty state. Both traditions
 * ship this release, so both are live/enterable — Modal Jazz is 'available'
 * when progress tracking lands (3c.5) it's fed by progress.ts selectors with
 * no layout changes.
 */

type TraditionState = 'completed' | 'exploring' | 'started' | 'available';

type TraditionSummary = { coverage: number; familiar: number; total: number };
type TraditionView = {
  summary: TraditionSummary;
  stars: StarDatum[];
  id: string;
  name: string;
  tagline: string;
  accent: string;
  state: TraditionState;
  narrative: string; // what we SAY about progress — never a number
};

function stateLabel(state: TraditionState): string {
  switch (state) {
    case 'completed': return 'Explored fully';
    case 'exploring': return 'Exploring';
    case 'started': return 'Started';
    case 'available': return 'Not yet begun';
  }
}

const CARD_PREVIEW_W = 300;

export default function JourneyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const COLORS = colors;
  const {
    traditionState, progress, traditionCoverage, traditionMastery, countModesAtLevel,
    modeMasteryLevel, isModeCovered,
    totalXp, currentStreak, streakActiveToday,
  } = useProgress();

  const makamState = traditionState('turkish-makam', MAKAMS.length, LESSONS.length);
  const jazzState = traditionState('modal-jazz', JAZZ_MODES.length, 0);

  const makamIds = MAKAMS.map((m) => m.id);
  const jazzIds = JAZZ_MODES.map((m) => m.id);

  // Live mastery summaries (Layer 3a) — coverage = how much sky is lit,
  // familiar = modes at Familiar (L3) or above.
  const makamSummary = {
    coverage: traditionCoverage('turkish-makam', makamIds),
    familiar: countModesAtLevel('turkish-makam', makamIds, 3),
    total: makamIds.length,
  };
  const jazzSummary = {
    coverage: traditionCoverage('modal-jazz', jazzIds),
    familiar: countModesAtLevel('modal-jazz', jazzIds, 3),
    total: jazzIds.length,
  };

  const makamStars: StarDatum[] = MAKAMS.map((m) => ({
    id: m.id, name: m.name, group: m.family,
    level: modeMasteryLevel('turkish-makam', m.id),
    covered: isModeCovered('turkish-makam', m.id),
  }));
  const jazzStars: StarDatum[] = JAZZ_MODES.map((m) => ({
    id: m.id, name: m.name, group: m.brightness,
    level: modeMasteryLevel('modal-jazz', m.id),
    covered: isModeCovered('modal-jazz', m.id),
  }));

  // Crossroads opens once the user has begun at least two live traditions —
  // generic over the registry, so it keeps working as more traditions go live.
  const startedLiveCount = LIVE_TRADITIONS.filter((t) => !!progress.traditions[t.id]).length;
  const crossroadsUnlocked = startedLiveCount >= 2;

  const makamNarrative =
    makamState === 'completed' ? 'You\u2019ve explored this world fully.'
    : makamState === 'exploring' ? 'You\u2019re finding your way through.'
    : makamState === 'started' ? 'You\u2019ve begun here.'
    : 'Waiting to be explored.';

  const traditions: TraditionView[] = [
    {
      id: 'turkish-makam',
      name: 'Turkish Makam',
      tagline: 'The microtonal poetry of Anatolia.',
      accent: COLORS.accent,
      state: makamState,
      narrative: makamNarrative,
      summary: makamSummary,
      stars: makamStars,
    },
    {
      id: 'modal-jazz',
      name: 'Modal Jazz',
      tagline: 'The American conversation with the modes.',
      accent: '#7B8FFF',
      state: jazzState,
      narrative: jazzState === 'available' ? 'Waiting to be explored.' : 'You\u2019ve begun here.',
      summary: jazzSummary,
      stars: jazzStars,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/journey/settings' as any)} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR JOURNEY</Text>
        <Text style={styles.heading}>A student of{'\n'}modal music</Text>
        <Text style={styles.subheading}>
          Every tradition you explore becomes part of your map. The more worlds you cross into, the more connections reveal themselves.
        </Text>

        {/* Streak + XP at a glance */}
        <View style={styles.badgeRow}>
          <StreakBadge streak={currentStreak} activeToday={streakActiveToday} colors={COLORS} />
          <XpBadge xp={totalXp} colors={COLORS} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>TRADITIONS</Text>
        <View style={styles.traditionList}>
          {traditions.map((tr) => (
            <View key={tr.id} style={styles.traditionCard}>
              <View style={styles.cardTop}>
                <View style={[styles.traditionDiamond, { backgroundColor: tr.accent }]} />
                <View style={styles.traditionBody}>
                  <Text style={styles.traditionName}>{tr.name}</Text>
                  <Text style={styles.traditionTagline}>{tr.tagline}</Text>
                </View>
              </View>

              {/* Mini constellation preview */}
              <View style={styles.previewWrap}>
                <Constellation
                  stars={tr.stars}
                  accent={tr.accent}
                  width={CARD_PREVIEW_W}
                  height={96}
                  compact
                />
              </View>

              {/* Coverage bar + familiar count */}
              <View style={styles.summaryRow}>
                <View style={styles.coverageTrack}>
                  <View style={[styles.coverageFill, { width: `${Math.round(tr.summary.coverage * 100)}%`, backgroundColor: tr.accent }]} />
                </View>
                <Text style={styles.summaryText}>{Math.round(tr.summary.coverage * 100)}% explored</Text>
              </View>
              <Text style={[styles.masteryText, { color: tr.accent }]}>
                {tr.summary.familiar > 0
                  ? `${tr.summary.familiar} of ${tr.summary.total} ${tr.id === 'turkish-makam' ? 'makams' : 'modes'} familiar`
                  : tr.narrative}
              </Text>

              {/* Actions */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.skyBtn, { borderColor: tr.accent }]}
                  onPress={() => router.push((`/journey/sky?tradition=${tr.id}`) as any)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles-outline" size={14} color={tr.accent} />
                  <Text style={[styles.skyBtnText, { color: tr.accent }]}>View your sky</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.enterBtn}
                  onPress={() => router.push((tr.id === 'turkish-makam' ? '/turkish-makam' : '/modal-jazz') as any)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.enterBtnText}>Enter</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>

        {COMING_SOON_TRADITIONS.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>MORE TRADITIONS</Text>
            <View style={styles.comingSoonWrap}>
              {COMING_SOON_TRADITIONS.map((t) => (
                <View key={t.id} style={styles.comingCard}>
                  <View style={[styles.comingDiamond, { backgroundColor: t.accent }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.comingNameRow}>
                      <Text style={styles.comingName}>{t.name}</Text>
                      <Text style={styles.comingBadge}>SOON</Text>
                    </View>
                    <Text style={styles.comingBlurb}>{t.blurb}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>CROSSROADS</Text>
        {crossroadsUnlocked ? (
          <TouchableOpacity
            style={styles.crossroadsCard}
            activeOpacity={0.8}
            onPress={() => router.push('/journey/crossroads' as any)}
          >
            <View style={styles.crossroadsRow}>
              <Ionicons name="git-compare-outline" size={20} color={COLORS.accent} style={{ marginBottom: SPACING.sm }} />
              <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
            </View>
            <Text style={styles.crossroadsText}>
              A Crossroads has opened. Comparative pieces await — how a feeling travels between the two worlds.
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.crossroadsCard}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textTertiary} style={{ marginBottom: SPACING.sm }} />
            <Text style={styles.crossroadsText}>
              Explore more than one tradition, and connections between them will open here — how Hicaz and a Phrygian-dominant scale share one ancient interval, how a feeling travels between worlds.
            </Text>
          </View>
        )}

        {/* REFERENCE — app-wide lookup tools, reachable outside the Learn tabs */}
        <Text style={styles.sectionLabel}>REFERENCE</Text>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          <TouchableOpacity
            style={[styles.crossroadsCard, { flex: 1, marginBottom: 0 }]}
            activeOpacity={0.8}
            onPress={() => router.push('/glossary' as any)}
          >
            <Ionicons name="book-outline" size={20} color={COLORS.accent} style={{ marginBottom: SPACING.sm }} />
            <Text style={styles.crossroadsText}>Glossary — the vocabulary of both traditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.crossroadsCard, { flex: 1, marginBottom: 0 }]}
            activeOpacity={0.8}
            onPress={() => router.push('/artist' as any)}
          >
            <Ionicons name="people-outline" size={20} color={COLORS.accent} style={{ marginBottom: SPACING.sm }} />
            <Text style={styles.crossroadsText}>Musicians — the people behind the recordings</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.xs },
  backButton: { marginLeft: -4 },
  settingsButton: { padding: 2 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  heading: { fontSize: 36, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, lineHeight: 42, marginBottom: SPACING.md },
  subheading: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  divider: { width: 40, height: 2, backgroundColor: COLORS.accent, borderRadius: 999, marginVertical: SPACING.xl },
  badgeRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  dailyChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm, paddingVertical: 10, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1 },
  dailyChipText: { fontSize: 13, fontWeight: '600' },
  sectionLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md, marginTop: SPACING.sm },
  traditionList: { gap: SPACING.sm, marginBottom: SPACING.xl },
  traditionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm },
  coverageTrack: { flex: 1, height: 5, borderRadius: 999, backgroundColor: COLORS.border, overflow: 'hidden' },
  coverageFill: { height: 5, borderRadius: 999 },
  summaryText: { fontSize: 11, color: COLORS.textTertiary },
  masteryText: { fontSize: 12, marginTop: 6, fontWeight: '500' },
  traditionCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-start' },
  previewWrap: { alignItems: 'center', marginVertical: SPACING.xs, overflow: 'hidden', borderRadius: RADIUS.md, backgroundColor: '#0C0C0F' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
  skyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  skyBtnText: { fontSize: 13, fontWeight: '600' },
  enterBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 10, paddingVertical: 8 },
  enterBtnText: { fontSize: 13, color: COLORS.textSecondary },
  traditionDiamond: { width: 10, height: 10, borderRadius: 2, transform: [{ rotate: '45deg' }], marginTop: 5 },
  traditionBody: { flex: 1, gap: 3 },
  traditionName: { fontSize: 18, fontWeight: '400', color: COLORS.textPrimary },
  traditionTagline: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18 },
  traditionNarrative: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  statePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  statePillText: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
  crossroadsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  comingSoonWrap: { gap: SPACING.sm, marginBottom: SPACING.sm },
  comingCard: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, opacity: 0.75 },
  comingDiamond: { width: 10, height: 10, borderRadius: 3, transform: [{ rotate: '45deg' }], marginTop: 4, opacity: 0.6 },
  comingNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  comingName: { fontSize: 16, fontWeight: '500', color: COLORS.textSecondary },
  comingBadge: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: COLORS.textTertiary, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  comingBlurb: { fontSize: 12, color: COLORS.textTertiary, lineHeight: 18, marginTop: 3 },
  crossroadsCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg },
  crossroadsText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});

import { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { MAKAMS } from '../../data/makams';
import { MODES as JAZZ_MODES } from '../../data/traditions/modal-jazz/modes';
import { MASTERY_LABELS } from '../../data/progress';
import { Constellation, StarDatum } from '../../components/constellation/Constellation';
import { StreakBadge, XpBadge, RewardBurst } from '../../components/rewards';

const JAZZ_ACCENT = '#7B8FFF';

/**
 * The constellation screen - a tradition's living star map. Reached from the
 * Journey card ("View your sky"). Renders every mode as a star brightened by
 * mastery, clustered by family/brightness, with a tap-to-inspect panel.
 *
 * Layered with the gamification surface: a streak + XP header, a daily-challenge
 * entry, and a reward burst the first time the lit-star count rises while the
 * screen is mounted (i.e. a star just came alive).
 */
export default function SkyScreen() {
  const router = useRouter();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const { tradition } = useLocalSearchParams();
  const traditionId = (tradition as string) === 'modal-jazz' ? 'modal-jazz' : 'turkish-makam';
  const isMakam = traditionId === 'turkish-makam';
  const accent = isMakam ? COLORS.accent : JAZZ_ACCENT;

  const {
    modeMasteryLevel, isModeCovered, countModesAtLevel,
    totalXp, currentStreak, streakActiveToday, isDailyChallengeDone,
  } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reward, setReward] = useState<{ title: string; subtitle: string } | null>(null);

  // Build stars from the tradition's modes + live mastery.
  const stars: StarDatum[] = isMakam
    ? MAKAMS.map((m) => ({
        id: m.id, name: m.name, group: m.family,
        level: modeMasteryLevel(traditionId, m.id),
        covered: isModeCovered(traditionId, m.id),
      }))
    : JAZZ_MODES.map((m) => ({
        id: m.id, name: m.name, group: m.brightness,
        level: modeMasteryLevel(traditionId, m.id),
        covered: isModeCovered(traditionId, m.id),
      }));

  const allIds = stars.map((s) => s.id);
  const litCount = stars.filter((s) => s.level > 0).length;
  const masteredCount = countModesAtLevel(traditionId, allIds, 5);
  const familiarCount = countModesAtLevel(traditionId, allIds, 3);

  // Reward moment: detect when a NEW star lights up while mounted.
  const prevLit = useRef<number | null>(null);
  useEffect(() => {
    if (prevLit.current !== null && litCount > prevLit.current) {
      setReward({
        title: 'A new star ignites',
        subtitle: `${litCount} of ${stars.length} stars now lit in your sky.`,
      });
    }
    prevLit.current = litCount;
  }, [litCount]);

  const screen = Dimensions.get('window');
  const canvasW = screen.width;
  const canvasH = screen.height * 0.46;

  const selected = selectedId ? stars.find((s) => s.id === selectedId) : null;
  const traditionName = isMakam ? 'Turkish Makam' : 'Modal Jazz';
  const unit = isMakam ? 'makams' : 'modes';
  const dailyDone = isDailyChallengeDone(traditionId);

  const openStar = (id: string) => {
    const path = isMakam ? `/turkish-makam/makam/${id}` : `/modal-jazz/mode/${id}`;
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={accent} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{traditionName}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        {/* Streak + XP badges */}
        <View style={styles.badgeRow}>
          <StreakBadge streak={currentStreak} activeToday={streakActiveToday} colors={COLORS} />
          <XpBadge xp={totalXp} colors={COLORS} />
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR SKY</Text>
          <Text style={styles.headline}>
            {litCount === 0 ? 'A dark sky, waiting.' : `${litCount} of ${stars.length} stars lit`}
          </Text>
          <Text style={styles.sub}>
            {familiarCount > 0
              ? `${familiarCount} ${unit} familiar${masteredCount > 0 ? ` - ${masteredCount} mastered` : ''}`
              : 'Explore and take quizzes to light your sky.'}
          </Text>
        </View>

        <Constellation
          stars={stars}
          accent={accent}
          width={canvasW}
          height={canvasH}
          onSelectStar={setSelectedId}
          selectedId={selectedId}
        />

        {selected ? (
          <View style={styles.inspect}>
            <View style={styles.inspectRow}>
              <View style={[styles.inspectDot, { backgroundColor: selected.level === 0 ? COLORS.textTertiary : accent }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inspectName}>{selected.name}</Text>
                <Text style={styles.inspectMeta}>
                  {MASTERY_LABELS[selected.level as 0 | 1 | 2 | 3 | 4 | 5]}
                  {selected.covered ? ' - explored' : selected.level > 0 ? ' - known, not yet explored' : ''}
                </Text>
              </View>
              <TouchableOpacity style={[styles.openBtn, { borderColor: accent }]} onPress={() => openStar(selected.id)}>
                <Text style={[styles.openBtnText, { color: accent }]}>Open</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.inspect}>
            <Text style={styles.hint}>Tap a star to see the {isMakam ? 'makam' : 'mode'}.</Text>
          </View>
        )}

        {/* Daily challenge entry */}
        <TouchableOpacity
          style={[styles.dailyCard, { borderColor: dailyDone ? COLORS.success : accent }]}
          activeOpacity={0.85}
          onPress={() => router.push(`/journey/daily?tradition=${traditionId}` as any)}
        >
          <View style={[styles.dailyIcon, { backgroundColor: (dailyDone ? COLORS.success : accent) + '22' }]}>
            <Ionicons
              name={dailyDone ? 'checkmark-done' : 'sparkles'}
              size={20}
              color={dailyDone ? COLORS.success : accent}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dailyTitle}>Daily challenge</Text>
            <Text style={styles.dailyMeta}>
              {dailyDone ? 'Done today - streak safe. Back tomorrow.' : 'A fresh set, today only. Keep your streak alive.'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </ScrollView>

      <RewardBurst
        visible={!!reward}
        kind="star"
        title={reward?.title ?? ''}
        subtitle={reward?.subtitle}
        accent={accent}
        textPrimary={COLORS.textPrimary}
        textSecondary={COLORS.textSecondary}
        onDone={() => setReward(null)}
      />
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  badgeRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xs },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  headline: { fontSize: 30, fontWeight: '200', letterSpacing: -0.5, color: COLORS.textPrimary, marginTop: 6 },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  inspect: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, minHeight: 72, justifyContent: 'center' },
  inspectRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  inspectDot: { width: 14, height: 14, borderRadius: 7 },
  inspectName: { fontSize: 17, color: COLORS.textPrimary, fontWeight: '500' },
  inspectMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  openBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  openBtnText: { fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 13, color: COLORS.textTertiary, textAlign: 'center' },
  dailyCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginHorizontal: SPACING.xl, marginTop: SPACING.sm, padding: SPACING.md, borderRadius: 16, borderWidth: 1, backgroundColor: COLORS.surface },
  dailyIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dailyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  dailyMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },
});

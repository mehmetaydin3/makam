import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../data/constants';
import { useProgress } from '../../hooks/useProgress';
import { MAKAMS } from '../../data/makams';
import { LESSONS } from '../../data/education';
import { MODES as JAZZ_MODES } from '../../data/traditions/modal-jazz/modes';

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

type TraditionView = {
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

export default function JourneyScreen() {
  const router = useRouter();
  const { traditionState, progress } = useProgress();

  const makamState = traditionState('turkish-makam', MAKAMS.length, LESSONS.length);
  const jazzState = traditionState('modal-jazz', JAZZ_MODES.length, 0);

  const makamStarted = !!progress.traditions['turkish-makam'];
  const jazzStarted = !!progress.traditions['modal-jazz'];
  const crossroadsUnlocked = makamStarted && jazzStarted;

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
    },
    {
      id: 'modal-jazz',
      name: 'Modal Jazz',
      tagline: 'The American conversation with the modes.',
      accent: '#7B8FFF',
      state: jazzState,
      narrative: jazzState === 'available' ? 'Waiting to be explored.' : 'You\u2019ve begun here.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/journey/settings' as any)} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR JOURNEY</Text>
        <Text style={styles.heading}>A student of{'\n'}modal music</Text>
        <Text style={styles.subheading}>
          Every tradition you explore becomes part of your map. The more worlds you cross into, the more connections reveal themselves.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>TRADITIONS</Text>
        <View style={styles.traditionList}>
          {traditions.map((tr) => (
            <TouchableOpacity
              key={tr.id}
              style={styles.traditionCard}
              activeOpacity={0.8}
              onPress={() => router.push((tr.id === 'turkish-makam' ? '/turkish-makam' : '/modal-jazz') as any)}
            >
              <View style={[styles.traditionDiamond, { backgroundColor: tr.accent }]} />
              <View style={styles.traditionBody}>
                <Text style={styles.traditionName}>{tr.name}</Text>
                <Text style={styles.traditionTagline}>{tr.tagline}</Text>
                <Text style={[styles.traditionNarrative, { color: tr.accent }]}>{tr.narrative}</Text>
              </View>
              <View style={styles.statePill}>
                <Text style={styles.statePillText}>{stateLabel(tr.state)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>CROSSROADS</Text>
        <View style={styles.crossroadsCard}>
          <Ionicons
            name={crossroadsUnlocked ? 'git-compare-outline' : 'lock-closed-outline'}
            size={20}
            color={COLORS.textTertiary}
            style={{ marginBottom: SPACING.sm }}
          />
          <Text style={styles.crossroadsText}>
            {crossroadsUnlocked
              ? 'A Crossroads has opened. Comparative essays await.'
              : 'Explore more than one tradition, and connections between them will open here \u2014 how a phrygian flatness echoes H\u00fcseyni, how ideas travel between worlds.'}
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { marginLeft: -4 },
  settingsButton: { padding: 4 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  heading: { fontSize: 36, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, lineHeight: 42, marginBottom: SPACING.md },
  subheading: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  divider: { width: 40, height: 2, backgroundColor: COLORS.accent, borderRadius: 999, marginVertical: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md, marginTop: SPACING.sm },
  traditionList: { gap: SPACING.sm, marginBottom: SPACING.xl },
  traditionCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.md, alignItems: 'flex-start' },
  traditionDiamond: { width: 10, height: 10, borderRadius: 2, transform: [{ rotate: '45deg' }], marginTop: 5 },
  traditionBody: { flex: 1, gap: 3 },
  traditionName: { fontSize: 18, fontWeight: '400', color: COLORS.textPrimary },
  traditionTagline: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18 },
  traditionNarrative: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  statePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  statePillText: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
  crossroadsCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', padding: SPACING.lg },
  crossroadsText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});

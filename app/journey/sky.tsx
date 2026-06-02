import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../data/constants';
import { useProgress } from '../../hooks/useProgress';
import { MAKAMS } from '../../data/makams';
import { MODES as JAZZ_MODES } from '../../data/traditions/modal-jazz/modes';
import { MASTERY_LABELS } from '../../data/progress';
import { Constellation, StarDatum } from '../../components/constellation/Constellation';

const JAZZ_ACCENT = '#7B8FFF';

/**
 * The constellation screen — a tradition's living star map. Reached from the
 * Journey card ("View your sky"). Renders every mode as a star brightened by
 * mastery, clustered by family/brightness, with a tap-to-inspect panel.
 */
export default function SkyScreen() {
  const router = useRouter();
  const { tradition } = useLocalSearchParams();
  const traditionId = (tradition as string) === 'modal-jazz' ? 'modal-jazz' : 'turkish-makam';
  const isMakam = traditionId === 'turkish-makam';
  const accent = isMakam ? COLORS.accent : JAZZ_ACCENT;

  const { modeMasteryLevel, isModeCovered, countModesAtLevel } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Build stars from the tradition's modes + live mastery.
  const stars: StarDatum[] = isMakam
    ? MAKAMS.map((m) => ({
        id: m.id,
        name: m.name,
        group: m.family,
        level: modeMasteryLevel(traditionId, m.id),
        covered: isModeCovered(traditionId, m.id),
      }))
    : JAZZ_MODES.map((m) => ({
        id: m.id,
        name: m.name,
        group: m.brightness,
        level: modeMasteryLevel(traditionId, m.id),
        covered: isModeCovered(traditionId, m.id),
      }));

  const allIds = stars.map((s) => s.id);
  const litCount = stars.filter((s) => s.level > 0).length;
  const masteredCount = countModesAtLevel(traditionId, allIds, 5);
  const familiarCount = countModesAtLevel(traditionId, allIds, 3);

  const screen = Dimensions.get('window');
  const canvasW = screen.width;
  const canvasH = screen.height * 0.58;

  const selected = selectedId ? stars.find((s) => s.id === selectedId) : null;
  const traditionName = isMakam ? 'Turkish Makam' : 'Modal Jazz';
  const unit = isMakam ? 'makams' : 'modes';

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

      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR SKY</Text>
        <Text style={styles.headline}>
          {litCount === 0
            ? 'A dark sky, waiting.'
            : `${litCount} of ${stars.length} stars lit`}
        </Text>
        <Text style={styles.sub}>
          {familiarCount > 0
            ? `${familiarCount} ${unit} familiar${masteredCount > 0 ? ` · ${masteredCount} mastered` : ''}`
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
            <View style={[styles.inspectDot, { backgroundColor: selected.level === 0 ? '#8A8A99' : accent }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inspectName}>{selected.name}</Text>
              <Text style={styles.inspectMeta}>
                {MASTERY_LABELS[selected.level as 0 | 1 | 2 | 3 | 4 | 5]}
                {selected.covered ? ' · explored' : selected.level > 0 ? ' · known, not yet explored' : ''}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080A' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  headline: { fontSize: 30, fontWeight: '200', letterSpacing: -0.5, color: COLORS.textPrimary, marginTop: 6 },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  inspect: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg, minHeight: 80, justifyContent: 'center' },
  inspectRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  inspectDot: { width: 14, height: 14, borderRadius: 7 },
  inspectName: { fontSize: 17, color: COLORS.textPrimary, fontWeight: '500' },
  inspectMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  openBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  openBtnText: { fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 13, color: COLORS.textTertiary, textAlign: 'center' },
});

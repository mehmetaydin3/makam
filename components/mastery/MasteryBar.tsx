import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  MASTERY_LABELS,
  MASTERY_THRESHOLDS,
  levelForPoints,
  pointsToNextLevel,
  MasteryLevel,
} from '../../data/progress';

/**
 * MasteryBar — a per-mode understanding indicator for detail screens.
 *
 * Shows the current mastery level for one mode/makam and a fill toward the
 * next level. Intrinsic, encouraging: it only ever grows. At max level it
 * shows a "Mastered" state with a star. The fill animates on mount.
 */

type Props = {
  points: number;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  surface: string;
  border: string;
};

export function MasteryBar({ points, accent, textPrimary, textSecondary, textTertiary, surface, border }: Props) {
  const level = levelForPoints(points);
  const toNext = pointsToNextLevel(points);
  const maxed = toNext === null;
  const fraction = maxed ? 1 : toNext.current / toNext.next;

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: fraction, duration: 650, delay: 200, useNativeDriver: false }).start();
  }, [fraction]);

  const widthInterp = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.row}>
        <View style={styles.labelRow}>
          {maxed && <Ionicons name="star" size={14} color={accent} style={{ marginRight: 5 }} />}
          <Text style={[styles.levelLabel, { color: maxed ? accent : textPrimary }]}>
            {MASTERY_LABELS[level as MasteryLevel]}
          </Text>
        </View>
        <Text style={[styles.hint, { color: textTertiary }]}>
          {maxed ? 'Fully mastered' : `${toNext.current}/${toNext.next} to ${MASTERY_LABELS[(level + 1) as MasteryLevel]}`}
        </Text>
      </View>

      {/* Segmented track — 5 segments, filled by level, current segment animates */}
      <View style={styles.track}>
        {[1, 2, 3, 4, 5].map((seg) => {
          const filled = level >= seg;
          const isCurrent = seg === level + 1 && !maxed;
          return (
            <View key={seg} style={[styles.segWrap, { backgroundColor: border }]}>
              {filled && <View style={[styles.segFill, { backgroundColor: accent }]} />}
              {isCurrent && (
                <Animated.View style={[styles.segFill, { backgroundColor: accent, width: widthInterp }]} />
              )}
            </View>
          );
        })}
      </View>

      <Text style={[styles.caption, { color: textSecondary }]}>
        {level === 0
          ? 'Explore and practice this to build mastery.'
          : maxed
          ? 'You know this one inside out.'
          : 'Practice and revisit to deepen your understanding.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  levelLabel: { fontSize: 15, fontWeight: '600' },
  hint: { fontSize: 11 },
  track: { flexDirection: 'row', gap: 4 },
  segWrap: { flex: 1, height: 6, borderRadius: 999, overflow: 'hidden' },
  segFill: { height: 6, width: '100%', borderRadius: 999 },
  caption: { fontSize: 12, lineHeight: 17 },
});

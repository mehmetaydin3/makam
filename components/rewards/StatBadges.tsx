import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from './ProgressRing';
import { xpToNextLevel } from '../../data/progress';

/**
 * StreakBadge / XpBadge — compact, theme-aware progress chips used across the
 * Journey and Sky surfaces. They turn the raw streak/XP numbers into something
 * visual: a flame whose strength reads at a glance, and a level ring that fills
 * toward the next player level.
 */

type Palette = {
  accent: string; surface: string; border: string;
  textPrimary: string; textSecondary: string; textTertiary: string;
};

export function StreakBadge({
  streak, activeToday, colors,
}: { streak: number; activeToday: boolean; colors: Palette }) {
  const flameColor = streak === 0 ? colors.textTertiary : '#E8893A';
  return (
    <View style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Ionicons name="flame" size={18} color={flameColor} />
      <View>
        <Text style={[styles.bigNum, { color: colors.textPrimary }]}>{streak}</Text>
        <Text style={[styles.label, { color: colors.textTertiary }]}>
          {streak === 1 ? 'day streak' : 'day streak'}
        </Text>
      </View>
      {activeToday && <View style={[styles.dot, { backgroundColor: '#E8893A' }]} />}
    </View>
  );
}

export function XpBadge({ xp, colors }: { xp: number; colors: Palette }) {
  const { current, next, level } = xpToNextLevel(xp);
  const frac = next > 0 ? current / next : 1;
  return (
    <View style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <ProgressRing size={34} stroke={3} progress={frac} color={colors.accent} trackColor={colors.border}>
        <Text style={[styles.ringNum, { color: colors.accent }]}>{level}</Text>
      </ProgressRing>
      <View>
        <Text style={[styles.bigNum, { color: colors.textPrimary }]}>{xp.toLocaleString()}</Text>
        <Text style={[styles.label, { color: colors.textTertiary }]}>XP · Lv {level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1,
  },
  bigNum: { fontSize: 18, fontWeight: '600', lineHeight: 20 },
  label: { fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 1 },
  ringNum: { fontSize: 13, fontWeight: '700' },
  dot: { width: 7, height: 7, borderRadius: 4, marginLeft: 2 },
});

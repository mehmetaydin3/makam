import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS } from '../../data/constants';

/**
 * CharacterBand — a compact "visual character" strip shown directly under the
 * hero scale. It replaces the old prose mood/time sections with a couple of
 * lines: a color swatch, an optional time-of-day pill, and a row of mood chips.
 * Palette-agnostic (same token shape as Accordion).
 */

export type BandColors = {
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
};

type Props = {
  /** Character color swatch (makam.color / brightness color). */
  swatch: string;
  accent: string;
  colors: BandColors;
  /** Mood / descriptor chips. */
  moods?: string[];
  /** Optional time-of-day, shown with a clock icon. */
  timeOfDay?: string;
  /** Optional label for the swatch (e.g. brightness word). */
  swatchLabel?: string;
};

export function CharacterBand({ swatch, accent, colors, moods = [], timeOfDay, swatchLabel }: Props) {
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {swatchLabel ? <Text style={[styles.swatchLabel, { color: swatch }]}>{swatchLabel}</Text> : null}
        {timeOfDay ? (
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.timeText}>{timeOfDay}</Text>
          </View>
        ) : null}
      </View>
      {moods.length > 0 ? (
        <View style={styles.chipsRow}>
          {moods.map((m) => (
            <View key={m} style={styles.chip}>
              <Text style={styles.chipText}>{m}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (c: BandColors) =>
  StyleSheet.create({
    wrap: { marginBottom: SPACING.md },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
    swatch: { width: 28, height: 28, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: c.border },
    swatchLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    timePill: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
      paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full,
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
    },
    timeText: { fontSize: 12, color: c.textSecondary },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
    chip: {
      paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full,
      backgroundColor: c.surfaceRaised, borderWidth: 1, borderColor: c.border,
    },
    chipText: { fontSize: 12, color: c.textSecondary },
  });

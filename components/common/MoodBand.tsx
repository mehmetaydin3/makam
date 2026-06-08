import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * MoodBand — a compact, scannable VISUAL character treatment for listing cards.
 *
 * Instead of a comma sentence of moods, it shows:
 *   • a few small colored mood chips (tinted by the card's character color), and
 *   • a tiny time-of-day sun/moon glyph (makams) or brightness glyph (jazz modes).
 *
 * Purely presentational — pass in the resolved character `color` and the data.
 */

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Mood → hue family ─────────────────────────────────────────────────────────
// Each mood keyword maps to a small emotional color so a glance reads the feeling.
const MOOD_HUE: Record<string, string> = {
  // warm / bright
  joyful: '#D8A24A', bright: '#D8A24A', clear: '#D4B94E', hopeful: '#D8A24A',
  uplifting: '#D8A24A', uncomplicated: '#D4B94E', serene: '#7FB39B',
  calm: '#7FB39B', balanced: '#7FB39B', warm: '#C8975A', dignified: '#C8975A',
  noble: '#C8975A', elegant: '#C8975A', resolved: '#7FB39B', confident: '#C8975A',
  // tender / longing
  tender: '#C98BA0', longing: '#C98BA0', intimate: '#C98BA0', nostalgic: '#C98BA0',
  yearning: '#C98BA0', wandering: '#9B8FC0', free: '#9B8FC0', introspective: '#6E6E9E',
  // sad / grief
  melancholic: '#5FA39A', grief: '#5E8AB4', weeping: '#5E8AB4', resigned: '#6E8AA0',
  sorrowful: '#5E8AB4', anguish: '#5E7AB4',
  // intense / dramatic
  intense: '#C75450', dramatic: '#C75450', passionate: '#C75450', restless: '#C7654A',
  searching: '#C7654A', rugged: '#A86045', heroic: '#C75450', strong: '#A86045',
  earnest: '#A86045', direct: '#A86045', masculine: '#A86045',
  // spiritual / mystical
  spiritual: '#9B7BC8', mystical: '#9B7BC8', devotional: '#9B7BC8',
  transcendent: '#9B7BC8', elevated: '#9B7BC8', sacred: '#9B7BC8',
  // exotic / grand
  exotic: '#C75450', ancient: '#9B7BC8', grand: '#B07BC8', majestic: '#B07BC8',
  // dark
  solemn: '#6E6E9E', deep: '#6E6E9E', dark: '#6E6E9E', profound: '#6E6E9E',
};

function moodColor(mood: string, fallback: string): string {
  const key = mood.toLowerCase().trim();
  if (MOOD_HUE[key]) return MOOD_HUE[key];
  for (const k of Object.keys(MOOD_HUE)) {
    if (key.includes(k)) return MOOD_HUE[k];
  }
  return fallback;
}

// ── Time of day → tiny sun/moon glyph ─────────────────────────────────────────
type TimeGlyph = { icon: IoniconName; color: string; label: string };

function timeGlyph(timeOfDay: string): TimeGlyph | null {
  const t = timeOfDay.toLowerCase();
  if (t.includes('dawn')) return { icon: 'partly-sunny-outline', color: '#E0A85A', label: 'Dawn' };
  if (t.includes('morning')) return { icon: 'sunny-outline', color: '#E0B85A', label: 'Morning' };
  if (t.includes('midday') || t.includes('noon')) return { icon: 'sunny', color: '#E8C84A', label: 'Midday' };
  if (t.includes('afternoon')) return { icon: 'sunny-outline', color: '#D89A4A', label: 'Afternoon' };
  if (t.includes('evening') || t.includes('dusk') || t.includes('sunset'))
    return { icon: 'partly-sunny-outline', color: '#C77A55', label: 'Evening' };
  if (t.includes('night')) return { icon: 'moon-outline', color: '#7B8FCF', label: 'Night' };
  return null;
}

// ── Brightness → tiny glyph (jazz modes have no timeOfDay) ─────────────────────
const BRIGHTNESS_GLYPH: Record<string, TimeGlyph> = {
  bright: { icon: 'sunny-outline', color: '#D8A24A', label: 'Bright' },
  neutral: { icon: 'contrast-outline', color: '#7B8FFF', label: 'Neutral' },
  dark: { icon: 'moon-outline', color: '#9B6DD4', label: 'Dark' },
};

type Props = {
  moods: string[];
  moodMap?: Record<string, string>;
  characterColor: string;
  timeOfDay?: string;
  brightness?: string;
  max?: number;
};

export function MoodBand({
  moods,
  moodMap,
  characterColor,
  timeOfDay,
  brightness,
  max = 3,
}: Props) {
  const glyph: TimeGlyph | null = timeOfDay
    ? timeGlyph(timeOfDay)
    : brightness
    ? BRIGHTNESS_GLYPH[brightness] || null
    : null;

  const shown = moods.slice(0, max);

  return (
    <View style={styles.row}>
      {glyph && (
        <View style={[styles.timeDot, { borderColor: glyph.color + '66' }]}>
          <Ionicons name={glyph.icon} size={12} color={glyph.color} />
        </View>
      )}
      <View style={styles.chips}>
        {shown.map((m) => {
          const c = moodColor(m, characterColor);
          return (
            <View
              key={m}
              style={[styles.chip, { backgroundColor: c + '22', borderColor: c + '55' }]}
            >
              <View style={[styles.swatch, { backgroundColor: c }]} />
              <Text style={[styles.chipText, { color: c }]} numberOfLines={1}>
                {moodMap?.[m] || m}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  timeDot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  chips: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', flexShrink: 1 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, borderWidth: 1,
  },
  swatch: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 11, fontWeight: '500' },
});

export default MoodBand;

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../data/constants';
import { audioEngine } from '../../audio/audioEngine';

/**
 * MakamScaleDiagram — mirrors the jazz ScaleDiagram skeleton (root picker,
 * numbered degree blocks in a row, note names beneath, Play button, tap-to-
 * play-from-degree, legend, highlighted characteristic note). Microtonal:
 * block widths fill the full row via flex, proportional to the cents interval
 * to the next degree; the label under each block is that interval in cents.
 *
 * Plays real ney samples via audioEngine (expo-audio). Transposing the root
 * shifts every degree's cents by the chosen offset.
 */

export type MakamDegree = {
  cents: number;
  name: string;
  westernNearest?: string;
  isCharacteristic?: boolean;
};

type Props = {
  makamId: string;
  scale: MakamDegree[];
  accentColor: string;
  noteNames: 'solfege' | 'western';
};

const ROOT_OPTIONS: { label: string; semitoneOffset: number }[] = [
  { label: 'A', semitoneOffset: 0 },
  { label: 'A#', semitoneOffset: 1 },
  { label: 'B', semitoneOffset: 2 },
  { label: 'C', semitoneOffset: 3 },
  { label: 'C#', semitoneOffset: 4 },
  { label: 'D', semitoneOffset: 5 },
  { label: 'D#', semitoneOffset: 6 },
  { label: 'E', semitoneOffset: 7 },
  { label: 'F', semitoneOffset: 8 },
  { label: 'F#', semitoneOffset: 9 },
  { label: 'G', semitoneOffset: 10 },
  { label: 'G#', semitoneOffset: 11 },
];

function komaLabel(cents: number): { interp: string } {
  const nearest = Math.round(cents / 100) * 100;
  const dev = cents - nearest;
  const abs = Math.abs(dev);
  const dir = dev < 0 ? '♭' : '♯';
  let interp = '';
  if (abs >= 36 && abs <= 64) interp = '¼ tone ' + dir;
  else if (abs >= 16 && abs <= 35) interp = 'slightly ' + dir;
  else if (abs >= 65 && abs <= 85) interp = '¾ tone ' + dir;
  return { interp };
}

export function MakamScaleDiagram({ makamId, scale, accentColor, noteNames }: Props) {
  const [rootOffset, setRootOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDegree, setActiveDegree] = useState<number | null>(null);

  useEffect(() => () => { audioEngine.stop(); }, []);

  const noteFor = (d: MakamDegree) =>
    noteNames === 'solfege'
      ? d.name.replace(' Koma', '').replace('Koma', '')
      : (d.westernNearest || d.name);

  // Flex weight = cents interval to the next degree → fills full width,
  // widths proportional to true intervals.
  const gapToNext = (i: number): number => {
    const here = scale[i].cents;
    if (i < scale.length - 1) return Math.abs(scale[i + 1].cents - here);
    const gaps = scale.slice(1).map((d, k) => Math.abs(d.cents - scale[k].cents));
    const mean = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 150;
    return mean;
  };
  const stepCents = (i: number): string => {
    if (i >= scale.length - 1) return '';
    return Math.round(Math.abs(scale[i + 1].cents - scale[i].cents)) + '¢';
  };

  const playFrom = async (startIndex: number) => {
    if (isPlaying) {
      await audioEngine.stop();
      setIsPlaying(false);
      setActiveDegree(null);
      return;
    }
    const semitoneCents = rootOffset * 100;
    const cents = scale.slice(startIndex).map(d => d.cents + semitoneCents);
    if (cents.length === 0) return;
    setIsPlaying(true);
    setActiveDegree(startIndex);
    await audioEngine.playScale(makamId, cents, (state, degreeIndex) => {
      setIsPlaying(state === 'playing');
      if (state === 'stopped') { setActiveDegree(null); setIsPlaying(false); }
      else if (degreeIndex != null) setActiveDegree(startIndex + degreeIndex);
    });
  };

  const handlePlayStop = () => playFrom(0);

  const handleDegreeTap = async (i: number) => {
    if (isPlaying) {
      await audioEngine.stop();
      setIsPlaying(false);
      setActiveDegree(null);
      return;
    }
    playFrom(i);
  };

  const changeRoot = async (offset: number) => {
    if (isPlaying) { await audioEngine.stop(); setIsPlaying(false); }
    setActiveDegree(null);
    setRootOffset(offset);
  };

  return (
    <View style={styles.container}>
      {/* Root picker */}
      <View style={styles.rootPickerSection}>
        <Text style={styles.rootPickerLabel}>Root</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rootPicker}>
          {ROOT_OPTIONS.map((opt) => {
            const isSelected = opt.semitoneOffset === rootOffset;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.rootNote, isSelected && { backgroundColor: accentColor + '33', borderColor: accentColor }]}
                onPress={() => changeRoot(opt.semitoneOffset)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rootNoteText, isSelected && { color: accentColor, fontWeight: '700' }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scale diagram — degree blocks fill full width via proportional flex */}
      <View style={styles.blocksRow}>
        {scale.map((d, i) => {
          const isActive = activeDegree === i;
          const isChar = !!d.isCharacteristic;
          let bgColor = COLORS.surfaceRaised;
          let borderColor = COLORS.border;
          if (isActive) { bgColor = accentColor + '55'; borderColor = accentColor; }
          else if (isChar) { bgColor = accentColor + '22'; borderColor = accentColor; }
          return (
            <TouchableOpacity
              key={i}
              style={[styles.degreeCol, { flexGrow: gapToNext(i), flexShrink: 1, flexBasis: 0 }]}
              onPress={() => handleDegreeTap(i)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.block,
                { backgroundColor: bgColor, borderColor },
                (isChar || isActive) && styles.blockGlow,
              ]}>
                <Text style={[styles.degreeLabel, (isChar || isActive) && { color: accentColor, fontWeight: '700' }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, (isChar || isActive) && { color: accentColor }]} numberOfLines={1}>
                {stepCents(i)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Note names row */}
      <View style={styles.noteNamesRow}>
        {scale.map((d, i) => {
          const isActive = activeDegree === i;
          const isChar = !!d.isCharacteristic;
          const { interp } = komaLabel(d.cents);
          return (
            <View key={i} style={[styles.noteNameCol, { flexGrow: gapToNext(i), flexShrink: 1, flexBasis: 0 }]}>
              <Text style={[
                styles.noteName,
                (isChar || isActive) && { color: accentColor, fontWeight: '700' },
                !isChar && !isActive && { color: COLORS.textSecondary },
              ]} numberOfLines={1}>
                {noteFor(d)}
              </Text>
              {interp ? (
                <Text style={[styles.noteInterp, (isChar || isActive) && { color: accentColor }]} numberOfLines={1}>
                  {interp}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Play button */}
      <TouchableOpacity
        style={[styles.playButton, isPlaying && { backgroundColor: accentColor + '22', borderColor: accentColor }]}
        onPress={handlePlayStop}
        activeOpacity={0.8}
      >
        <Ionicons name={isPlaying ? 'stop' : 'play'} size={14} color={isPlaying ? accentColor : COLORS.textSecondary} />
        <Text style={[styles.playButtonText, isPlaying && { color: accentColor }]}>
          {isPlaying ? 'Stop' : 'Play scale on ney'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.tapHint}>Tap any degree to play from there</Text>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: accentColor + '22', borderColor: accentColor }]} />
          <Text style={[styles.legendText, { color: accentColor }]}>characteristic note</Text>
        </View>
        <Text style={styles.legendText}>Numbers show the interval to the next degree in cents; block width is proportional to it.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  rootPickerSection: { marginBottom: SPACING.md },
  rootPickerLabel: {
    fontSize: 10, fontWeight: '600', color: COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  rootPicker: { flexDirection: 'row' },
  rootNote: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1,
    borderColor: COLORS.border, backgroundColor: COLORS.surfaceRaised, marginRight: 6,
  },
  rootNoteText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  blocksRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, width: '100%' },
  degreeCol: { alignItems: 'center' },
  block: {
    height: 52, borderRadius: 8, borderWidth: 1, alignSelf: 'stretch',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 2,
  },
  blockGlow: {
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 6, elevation: 4,
  },
  degreeLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
  stepLabel: { fontSize: 10, color: COLORS.textTertiary, marginTop: 4, fontWeight: '600', height: 13 },
  noteNamesRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: SPACING.sm, width: '100%' },
  noteNameCol: { alignItems: 'center', paddingHorizontal: 2 },
  noteName: { fontSize: 13, fontWeight: '500' },
  noteInterp: { fontSize: 9, color: COLORS.textTertiary, marginTop: 2, textAlign: 'center' },
  playButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: SPACING.md, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceRaised,
  },
  playButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tapHint: { fontSize: 11, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.sm },
  legend: { gap: 6, marginTop: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendColor: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: 11, color: COLORS.textTertiary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getMakamById } from '../../../data/makams';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { SPACING, ColorScheme } from '../../../data/constants';
import { audioEngine, PLAYABLE_MAKAM_IDS } from '../../../audio/audioEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Drone / Play-along. Holds the makam's durak (tonic final) as a sustained drone
// so the learner can sing or play the makam's degrees over a fixed center —
// exactly how a ney player or singer would practise a seyir. The ney samples are
// short, so audioEngine.playDrone loops the durak note seamlessly until stopped.
// Only makams the ney engine can place at a correct root are reachable here
// (PLAYABLE_MAKAM_IDS) — no faked audio. Ney only.
// ─────────────────────────────────────────────────────────────────────────────
export default function DroneScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { noteNames } = useLanguage();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const makam = getMakamById(id as string);
  const accent = makam?.color ?? colors.accent;
  const playable = !!makam && PLAYABLE_MAKAM_IDS.includes(makam.id);

  const [droning, setDroning] = useState(false);

  // Stop the ney on unmount and whenever the screen loses focus (blur).
  useEffect(() => {
    const sub = navigation.addListener('blur', () => {
      audioEngine.stop();
      setDroning(false);
    });
    return () => {
      sub();
      audioEngine.stop();
    };
  }, [navigation]);

  const toggle = async () => {
    if (droning) {
      await audioEngine.stop();
      setDroning(false);
      return;
    }
    if (!makam) return;
    setDroning(true);
    audioEngine.playDrone(makam.id, (state) => {
      if (state === 'stopped') setDroning(false);
    });
  };

  if (!makam) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.header}>
          <Text style={[styles.backText, { color: accent }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Makam not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { audioEngine.stop(); router.back(); }} style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>← {makam.name}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
          <Text style={styles.kicker}>Drone · Play along</Text>
          <Text style={styles.title}>{makam.name}</Text>
          <Text style={styles.sub}>
            Hold the durak as a steady tone, then sing or play the scale over it.
            This is how the ear learns where home is.
          </Text>
        </View>

        {!playable ? (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              The ney engine can't voice {makam.name}'s durak at a correct pitch, so the
              drone isn't available for this makam.
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.droneButton, { borderColor: accent }, droning && { backgroundColor: accent }]}
              onPress={toggle}
              activeOpacity={0.85}
            >
              <Ionicons
                name={droning ? 'stop' : 'play'}
                size={30}
                color={droning ? colors.background : accent}
              />
              <Text style={[styles.droneButtonText, { color: droning ? colors.background : accent }]}>
                {droning ? 'Stop drone' : 'Start drone'}
              </Text>
            </TouchableOpacity>

            <View style={styles.durakRow}>
              <Text style={styles.durakLabel}>DURAK</Text>
              <Text style={[styles.durakValue, { color: accent }]}>{makam.durak}</Text>
              {droning && (
                <View style={[styles.liveDot, { backgroundColor: accent }]} />
              )}
            </View>

            <Text style={styles.sectionLabel}>The scale</Text>
            <View style={styles.scaleWrap}>
              {makam.scale.map((d, i) => (
                <View
                  key={i}
                  style={[
                    styles.degree,
                    d.isCharacteristic && { borderColor: accent, backgroundColor: accent + '14' },
                    i === 0 && { borderColor: accent },
                  ]}
                >
                  <Text style={styles.degreeNum}>{i === 0 ? 'durak' : d.degree}</Text>
                  <Text style={styles.degreeName}>
                    {noteNames === 'solfege' ? d.name : (d.westernNearest ?? d.name)}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.hint}>
              Tip: start the drone, find the durak with your voice, then walk up the
              degrees and back. The highlighted notes are this makam's characteristic
              colour — lean on them.
            </Text>
          </>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  errorText: { color: COLORS.textSecondary, padding: SPACING.lg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center' },
  backButton: { alignSelf: 'flex-start' },
  backText: { fontSize: 15 },
  scroll: { paddingHorizontal: SPACING.lg },
  hero: { marginBottom: SPACING.xl, paddingTop: SPACING.sm },
  colorBar: { width: 32, height: 3, borderRadius: 999, marginBottom: SPACING.md },
  kicker: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.sm },
  title: { fontSize: 44, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1.5, marginBottom: SPACING.sm },
  sub: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  droneButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    paddingVertical: 24, borderRadius: 16, borderWidth: 2, marginBottom: SPACING.lg,
  },
  droneButtonText: { fontSize: 18, fontWeight: '600' },
  durakRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  durakLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 1.5 },
  durakValue: { fontSize: 16, fontWeight: '600' },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  scaleWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  degree: { minWidth: 64, backgroundColor: COLORS.surface, borderRadius: 10, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  degreeNum: { fontSize: 10, color: COLORS.textTertiary, marginBottom: 2 },
  degreeName: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  hint: { fontSize: 13, color: COLORS.textTertiary, lineHeight: 20, fontStyle: 'italic' },
});

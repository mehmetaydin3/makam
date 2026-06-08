import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SPACING } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';
import { getCrossroadsPiece } from '../../data/crossroads';
import { getModeById } from '../../data/traditions/modal-jazz/modes';
import { getMakamById } from '../../data/makams';
import { audioEngine, PLAYABLE_MAKAM_IDS } from '../../audio/audioEngine';
import RhodesEngine, { RhodesEngineRef } from '../../data/traditions/modal-jazz/RhodesEngine';

// Middle C anchor for the Rhodes side, matching ScaleDiagram's convention.
const JAZZ_ROOT_MIDI = 60;
// A small pause between the two sides for the "Hear both" sequence.
const BRIDGE_MS = 600;

type Side = 'jazz' | 'makam' | null;

/**
 * The Crossroads comparison — an interactive A/B view that lets you hear a
 * single cross-tradition pairing side by side: the jazz mode on the Rhodes,
 * the makam on the ney. Reached from the Crossroads list via
 * /journey/comparison?id=<pairingId>. Engines are never mixed.
 */
export default function ComparisonScreen() {
  const router = useRouter();
  const { colors: COLORS, jazzColors: JAZZ } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const piece = id ? getCrossroadsPiece(id) : undefined;
  const mode = piece?.modeId ? getModeById(piece.modeId) : undefined;
  const makam = piece?.makamId ? getMakamById(piece.makamId) : undefined;
  const comp = piece?.comparison;

  const makamPlayable = !!makam && PLAYABLE_MAKAM_IDS.includes(makam.id);

  const rhodesRef = useRef<RhodesEngineRef>(null);
  // playId guards the "Hear both" sequence so a stop/new-play cancels it.
  const playIdRef = useRef(0);
  const [active, setActive] = useState<Side>(null);   // which side is sounding
  const [makamLoading, setMakamLoading] = useState(false);
  const [bothRunning, setBothRunning] = useState(false);

  const jazzColor = JAZZ.accent;
  const makamColor = makam?.color ?? COLORS.accent;

  // The notes each side plays.
  const jazzIntervals = comp?.jazzIntervals ?? mode?.intervals ?? [];
  const jazzMidi = useMemo(() => jazzIntervals.map((i) => JAZZ_ROOT_MIDI + i), [jazzIntervals]);
  const makamCents = useMemo(() => makam?.scale.map((d) => d.cents) ?? [], [makam?.id]);

  const stopAll = useCallback(() => {
    playIdRef.current += 1;          // invalidate any pending "Hear both" step
    rhodesRef.current?.stop();
    audioEngine.stop();
    setActive(null);
    setMakamLoading(false);
    setBothRunning(false);
  }, []);

  // Stop audio whenever the screen loses focus or unmounts.
  useFocusEffect(useCallback(() => () => stopAll(), [stopAll]));
  useEffect(() => () => stopAll(), [stopAll]);

  // --- Jazz side (Rhodes) ---
  const playJazz = useCallback(
    (onComplete?: () => void) =>
      new Promise<void>((resolve) => {
        if (jazzMidi.length === 0) { onComplete?.(); resolve(); return; }
        setActive('jazz');
        rhodesRef.current?.playScale(
          jazzMidi,
          undefined,
          () => {
            setActive((s) => (s === 'jazz' ? null : s));
            onComplete?.();
            resolve();
          }
        );
      }),
    [jazzMidi]
  );

  // --- Makam side (ney) ---
  const playMakam = useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (!makam || !makamPlayable || makamCents.length === 0) { resolve(); return; }
        setMakamLoading(true);
        audioEngine.playScale(makam.id, makamCents, (state) => {
          if (state === 'playing') {
            setMakamLoading(false);
            setActive('makam');
          }
          if (state === 'stopped') {
            setActive((s) => (s === 'makam' ? null : s));
            setMakamLoading(false);
            resolve();
          }
        });
      }),
    [makam?.id, makamPlayable, makamCents]
  );

  const handleJazzTap = useCallback(() => {
    if (active === 'jazz' || bothRunning) { stopAll(); return; }
    stopAll();
    playIdRef.current += 1;
    playJazz();
  }, [active, bothRunning, stopAll, playJazz]);

  const handleMakamTap = useCallback(() => {
    if (active === 'makam' || makamLoading || bothRunning) { stopAll(); return; }
    stopAll();
    playIdRef.current += 1;
    playMakam();
  }, [active, makamLoading, bothRunning, stopAll, playMakam]);

  // "Hear both": jazz, then a short bridge, then makam — back to back.
  const handleBoth = useCallback(async () => {
    if (bothRunning) { stopAll(); return; }
    stopAll();
    const myId = ++playIdRef.current;
    setBothRunning(true);
    await playJazz();
    if (playIdRef.current !== myId) return;        // superseded
    await new Promise((r) => setTimeout(r, BRIDGE_MS));
    if (playIdRef.current !== myId) return;
    await playMakam();
    if (playIdRef.current === myId) setBothRunning(false);
  }, [bothRunning, stopAll, playJazz, playMakam]);

  if (!piece || !comp || !mode || !makam) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TopBar onBack={() => router.back()} accent={COLORS.accent} styles={styles} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>This comparison isn’t available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Hidden Rhodes WebView engine for the jazz side. */}
      <RhodesEngine ref={rhodesRef} />

      <TopBar onBack={() => router.back()} accent={COLORS.accent} styles={styles} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CROSSROADS · A/B</Text>
        <Text style={styles.headline}>{piece.title}</Text>
        <Text style={styles.subtitle}>{piece.subtitle}</Text>

        <View style={styles.panels}>
          {/* Jazz panel */}
          <Panel
            styles={styles}
            color={jazzColor}
            idleBorder={COLORS.border}
            traditionLabel="MODAL JAZZ"
            name={comp.jazzLabel ?? mode.name}
            character={mode.oneWord}
            isActive={active === 'jazz'}
            loading={false}
            playable
            onPress={handleJazzTap}
          />

          {/* Makam panel */}
          <Panel
            styles={styles}
            color={makamColor}
            idleBorder={COLORS.border}
            traditionLabel="TURKISH MAKAM"
            name={comp.makamLabel ?? makam.name}
            character={makam.mood?.[0] ?? ''}
            isActive={active === 'makam'}
            loading={makamLoading}
            playable={makamPlayable}
            onPress={handleMakamTap}
          />
        </View>

        {/* What to listen for */}
        <View style={styles.listenCard}>
          <Ionicons name="ear-outline" size={16} color={COLORS.accent} style={{ marginTop: 2 }} />
          <Text style={styles.listenText}>{comp.listenFor}</Text>
        </View>

        {/* Hear both */}
        <TouchableOpacity
          style={[styles.bothBtn, { borderColor: COLORS.accent }]}
          onPress={handleBoth}
          activeOpacity={0.85}
        >
          <Ionicons
            name={bothRunning ? 'stop' : 'swap-horizontal'}
            size={18}
            color={COLORS.accent}
          />
          <Text style={[styles.bothBtnText, { color: COLORS.accent }]}>
            {bothRunning ? 'Stop' : 'Hear both'}
          </Text>
        </TouchableOpacity>

        {!makamPlayable && (
          <Text style={styles.unplayableNote}>
            The ney engine can’t anchor this makam, so only the jazz side plays.
          </Text>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TopBar({ onBack, accent, styles }: { onBack: () => void; accent: string; styles: any }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
        <Ionicons name="chevron-back" size={22} color={accent} />
      </TouchableOpacity>
      <View style={styles.iconBtn} />
    </View>
  );
}

function Panel({
  styles, color, idleBorder, traditionLabel, name, character, isActive, loading, playable, onPress,
}: {
  styles: any;
  color: string;
  idleBorder: string;
  traditionLabel: string;
  name: string;
  character: string;
  isActive: boolean;
  loading: boolean;
  playable: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[styles.panel, { borderColor: isActive ? color : idleBorder, borderLeftColor: color, borderLeftWidth: 3 }]}>
      <Text style={[styles.panelTradition, { color }]}>{traditionLabel}</Text>
      <Text style={styles.panelName}>{name}</Text>
      {!!character && <Text style={styles.panelCharacter}>{character}</Text>}

      <TouchableOpacity
        style={[
          styles.playBtn,
          { backgroundColor: color + '1F', borderColor: color },
          !playable && styles.playBtnDisabled,
        ]}
        onPress={onPress}
        disabled={!playable}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Ionicons name={isActive ? 'stop' : 'play'} size={16} color={playable ? color : '#888'} />
        )}
        <Text style={[styles.playBtnText, { color: playable ? color : '#888' }]}>
          {loading ? 'Loading' : isActive ? 'Stop' : 'Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (COLORS: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm },
    eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
    headline: { fontSize: 30, fontWeight: '200', letterSpacing: -0.5, lineHeight: 36, color: COLORS.textPrimary, marginTop: 6 },
    subtitle: { fontSize: 14, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 6, marginBottom: SPACING.xl },

    panels: { flexDirection: 'row', gap: SPACING.md },
    panel: {
      flex: 1,
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.lg,
    },
    panelTradition: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '600' },
    panelName: { fontSize: 17, fontWeight: '500', color: COLORS.textPrimary, marginTop: 8, lineHeight: 22 },
    panelCharacter: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontStyle: 'italic' },

    playBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
      borderWidth: 1, borderRadius: 10, paddingVertical: 9, marginTop: SPACING.lg,
    },
    playBtnDisabled: { opacity: 0.5 },
    playBtnText: { fontSize: 13, fontWeight: '600' },

    listenCard: {
      flexDirection: 'row', gap: SPACING.sm,
      backgroundColor: COLORS.surface,
      borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
      padding: SPACING.lg, marginTop: SPACING.xl,
    },
    listenText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },

    bothBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderWidth: 1, borderRadius: 14, paddingVertical: 14, marginTop: SPACING.lg,
    },
    bothBtnText: { fontSize: 15, fontWeight: '600' },

    unplayableNote: { fontSize: 12, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.md, fontStyle: 'italic' },

    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center' },
  });

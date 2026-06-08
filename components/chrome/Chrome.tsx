import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SPACING, ColorScheme } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';
import { TRADITIONS, LIVE_TRADITIONS, traditionByName } from '../../data/traditions/registry';
import { TraditionIntro, hasSeenIntro } from '../intro/TraditionIntro';

type Props = {
  traditionName: string;
  accent: string;
};

/**
 * Chrome — the app-wide top bar present on every tradition screen.
 * Left: tradition chip — tap to open the tradition switcher bottom sheet.
 * Right: journey avatar — tap to open the meta-layer Journey screen.
 *
 * The switcher (3c.4) is owned here so every screen using Chrome gets it
 * for free. It lists both traditions, marks the current one, and routes on
 * select. Both traditions ship this release, so both are always selectable.
 */


export function Chrome({ traditionName, accent }: Props) {
  const traditionId = traditionByName(traditionName)?.id ?? 'modal-jazz';
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  // Show the tradition intro automatically on first entry.
  useEffect(() => {
    let cancelled = false;
    hasSeenIntro(traditionId).then((seen) => {
      if (!cancelled && !seen) setIntroOpen(true);
    });
    return () => { cancelled = true; };
  }, [traditionId]);

  const selectTradition = (route: string | undefined, name: string) => {
    setSwitcherOpen(false);
    if (route && name !== traditionName) {
      router.replace(route as any);
    }
  };

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={() => setSwitcherOpen(true)}>
        <View style={[styles.diamond, { backgroundColor: accent }]} />
        <Text style={styles.chipText}>{traditionName}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => router.push('/journey/settings' as any)}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.7}
          onPress={() => router.push('/journey' as any)}
        >
          <Ionicons name="person-circle-outline" size={28} color={accent} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={switcherOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSwitcherOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSwitcherOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetLabel}>Switch tradition</Text>
            {TRADITIONS.map((tr) => {
              const isCurrent = tr.name === traditionName;
              const live = tr.status === 'live';
              return (
                <TouchableOpacity
                  key={tr.id}
                  style={[styles.sheetRow, isCurrent && styles.sheetRowCurrent, !live && styles.sheetRowLocked]}
                  activeOpacity={live ? 0.7 : 1}
                  disabled={!live}
                  onPress={() => selectTradition(tr.route, tr.name)}
                >
                  <View style={[styles.diamond, { backgroundColor: tr.accent }, !live && { opacity: 0.5 }]} />
                  <View style={styles.sheetRowBody}>
                    <Text style={[styles.sheetRowName, !live && styles.lockedText]}>{tr.name}</Text>
                    <Text style={styles.sheetRowTagline}>{live ? tr.tagline : 'Coming soon'}</Text>
                  </View>
                  {isCurrent && <Ionicons name="checkmark" size={18} color={tr.accent} />}
                  {!live && <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.journeyRow}
              activeOpacity={0.7}
              onPress={() => { setSwitcherOpen(false); setIntroOpen(true); }}
            >
              <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.journeyRowText}>About this tradition</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.journeyRow}
              activeOpacity={0.7}
              onPress={() => { setSwitcherOpen(false); router.push('/journey' as any); }}
            >
              <Ionicons name="compass-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.journeyRowText}>View your journey</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={introOpen} animationType="fade" presentationStyle="fullScreen" onRequestClose={() => setIntroOpen(false)}>
        <TraditionIntro
          traditionId={traditionId}
          accent={accent}
          onClose={() => setIntroOpen(false)}
        />
      </Modal>
    </View>
  );
}

const makeStyles = (COLORS: ColorScheme) => StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  diamond: { width: 8, height: 8, borderRadius: 2, transform: [{ rotate: '45deg' }] },
  chipText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconButton: { padding: 2 },
  avatar: { padding: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  sheetLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
  sheetRowCurrent: { backgroundColor: COLORS.surfaceRaised, borderColor: COLORS.border },
  sheetRowLocked: { opacity: 0.6 },
  lockedText: { color: COLORS.textSecondary },
  sheetRowBody: { flex: 1, gap: 2 },
  sheetRowName: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
  sheetRowTagline: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic' },
  journeyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, marginTop: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.border },
  journeyRowText: { fontSize: 14, color: COLORS.textSecondary },
});

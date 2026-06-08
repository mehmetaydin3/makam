import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MODES, Mode } from '../../../data/traditions/modal-jazz/modes';
import { BRIGHTNESS_BASE } from '../../../data/familyColors';
import { JAZZ_COLORS, JazzColorScheme, SPACING, RADIUS } from '../../../data/traditions/modal-jazz/theme';
import { useTheme } from '../../../context/ThemeContext';
import { useProgress } from '../../../hooks/useProgress';
import { Chrome } from '../../../components/chrome';

type BrightnessFilter = 'all' | 'bright' | 'neutral' | 'dark';

const FILTERS: { label: string; value: BrightnessFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bright', value: 'bright' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Dark', value: 'dark' },
];

const brightnessColor = (c: JazzColorScheme): Record<string, string> => ({
  bright: c.bright,
  neutral: c.neutral,
  dark: c.dark,
});

export default function ModalJazzHome() {
  const router = useRouter();
  const { jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(jazzColors), [jazzColors]);
  const JAZZ_COLORS = jazzColors;
  const { markTraditionStarted } = useProgress();
  const [search, setSearch] = useState('');
  useEffect(() => { markTraditionStarted('modal-jazz'); }, []);
  const [filter, setFilter] = useState<BrightnessFilter>('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeFilterCount = filter !== 'all' ? 1 : 0;
  const searchBarAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: searchBarAnim } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const diff = currentY - lastScrollY.current;
        if (diff > 5 && currentY > 60) {
          Animated.timing(searchBarAnim, { toValue: 0, duration: 120, useNativeDriver: false }).start();
        } else if (diff < -5) {
          Animated.timing(searchBarAnim, { toValue: 1, duration: 120, useNativeDriver: false }).start();
        }
        lastScrollY.current = currentY;
      },
    }
  );

  const filtered = useMemo(() => {
    return MODES.filter((m) => {
      const matchesSearch =
        search.trim() === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.oneWord.toLowerCase().includes(search.toLowerCase()) ||
        m.character.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || m.brightness === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Chrome traditionName="Modal Jazz" accent={JAZZ_COLORS.accent} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>The Modes</Text>
          <Text style={styles.subheading}>Seven modes, seven colors of feeling.</Text>
        </View>

        {/* Animated search bar */}
        <Animated.View style={[styles.searchRow, {
          opacity: searchBarAnim,
          maxHeight: searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
          overflow: 'hidden',
        }]}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={JAZZ_COLORS.textTertiary} style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search modes…"
              placeholderTextColor={JAZZ_COLORS.textTertiary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={JAZZ_COLORS.accent} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
            onPress={() => setSheetOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={activeFilterCount > 0 ? JAZZ_COLORS.background : JAZZ_COLORS.textSecondary}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Active filter pill */}
        {activeFilterCount > 0 && (
          <View style={styles.activePillRow}>
            <TouchableOpacity style={styles.activePill} onPress={() => setFilter('all')} activeOpacity={0.7}>
              <Text style={styles.activePillText}>
                {FILTERS.find((f) => f.value === filter)?.label}
              </Text>
              <Ionicons name="close" size={11} color={JAZZ_COLORS.accent} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* Mode list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <Text style={styles.empty}>No modes match your search.</Text>
          }
          renderItem={({ item }) => (
            <ModeCard
              mode={item}
              stripeColor={BRIGHTNESS_BASE[item.brightness] || JAZZ_COLORS.accent}
              onPress={() => router.push(('/modal-jazz/mode/' + item.id) as any)}
            />
          )}
        />
      </View>

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter</Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={() => setFilter('all')}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sheetFilterLabel}>BRIGHTNESS</Text>
          <View style={styles.chipRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.chip, filter === f.value && styles.chipActive]}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={() => setSheetOpen(false)}>
            <Text style={styles.applyButtonText}>Show {filtered.length} mode{filtered.length !== 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ModeCard({ mode, stripeColor, onPress }: { mode: Mode; stripeColor: string; onPress: () => void }) {
  const { jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(jazzColors), [jazzColors]);
  const accentColor = brightnessColor(jazzColors)[mode.brightness];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.colorStrip, { backgroundColor: stripeColor }]} />
      <View style={[styles.degreeBadge, { borderColor: accentColor }]}>
        <Text style={[styles.degreeText, { color: accentColor }]}>{mode.degree}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.modeName}>{mode.name}</Text>
          <View style={[styles.brightnessPill, { backgroundColor: accentColor + '22' }]}>
            <Text style={[styles.brightnessLabel, { color: accentColor }]}>{mode.brightness}</Text>
          </View>
        </View>
        <Text style={styles.oneWord}>{mode.oneWord}</Text>
        <Text style={styles.character} numberOfLines={2}>{mode.character}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.colorNoteLabel}>Color note</Text>
          <Text style={styles.colorNoteValue}>{mode.colorNote}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (JAZZ_COLORS: JazzColorScheme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: JAZZ_COLORS.background },
  container: { flex: 1, backgroundColor: JAZZ_COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  heading: { fontSize: 40, fontWeight: '200', color: JAZZ_COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 19 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.sm, marginBottom: SPACING.md, gap: SPACING.sm,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: JAZZ_COLORS.border, paddingHorizontal: SPACING.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: JAZZ_COLORS.textPrimary, paddingVertical: 12 },
  filterButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: JAZZ_COLORS.surface, borderWidth: 1, borderColor: JAZZ_COLORS.border, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: JAZZ_COLORS.accent, borderColor: JAZZ_COLORS.accent },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: JAZZ_COLORS.error, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  activePillRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, gap: SPACING.sm },
  activePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: JAZZ_COLORS.accentMuted, borderWidth: 1, borderColor: JAZZ_COLORS.accent },
  activePillText: { fontSize: 12, color: JAZZ_COLORS.accent, fontWeight: '500' },
  backdrop: { flex: 1, backgroundColor: '#00000088' },
  sheet: { backgroundColor: JAZZ_COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, paddingBottom: 48, borderWidth: 1, borderColor: JAZZ_COLORS.border },
  sheetHandle: { width: 36, height: 4, borderRadius: 999, backgroundColor: JAZZ_COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sheetTitle: { fontSize: 18, fontWeight: '500', color: JAZZ_COLORS.textPrimary },
  clearText: { fontSize: 13, color: JAZZ_COLORS.accent },
  sheetFilterLabel: { fontSize: 11, color: JAZZ_COLORS.textTertiary, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: JAZZ_COLORS.border, backgroundColor: JAZZ_COLORS.background },
  chipActive: { backgroundColor: JAZZ_COLORS.accentMuted, borderColor: JAZZ_COLORS.accent },
  chipText: { fontSize: 13, color: JAZZ_COLORS.textSecondary },
  chipTextActive: { color: JAZZ_COLORS.accent, fontWeight: '500' },
  applyButton: { backgroundColor: JAZZ_COLORS.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  applyButtonText: { fontSize: 15, fontWeight: '600', color: JAZZ_COLORS.background },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  empty: { fontSize: 15, color: JAZZ_COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xxl },
  card: {
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: JAZZ_COLORS.border,
    marginBottom: SPACING.md, flexDirection: 'row', overflow: 'hidden',
  },
  degreeBadge: {
    width: 44, alignItems: 'center', justifyContent: 'center',
    borderRightWidth: 1, borderRightColor: JAZZ_COLORS.border,
  },
  degreeText: { fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  cardContent: { flex: 1, padding: SPACING.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  modeName: { fontSize: 18, fontWeight: '500', color: JAZZ_COLORS.textPrimary, letterSpacing: 0.5 },
  colorStrip: { width: 4, alignSelf: 'stretch', borderTopLeftRadius: RADIUS.md, borderBottomLeftRadius: RADIUS.md, marginRight: 4 },
  brightnessPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  brightnessLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  oneWord: {
    fontSize: 12, fontWeight: '600', color: JAZZ_COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  character: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.sm },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorNoteLabel: { fontSize: 11, color: JAZZ_COLORS.textTertiary, fontWeight: '500' },
  colorNoteValue: { fontSize: 11, color: JAZZ_COLORS.accent, fontWeight: '500' },
});

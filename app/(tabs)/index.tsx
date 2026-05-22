import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Modal, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MAKAMS } from '../../data/makams';
import { COLORS, SPACING } from '../../data/constants';

const SEYIR_OPTIONS = ['All', 'Ascending', 'Descending', 'Undulating'];
const FAMILY_OPTIONS = ['All', 'Rast', 'Ussak', 'Hicaz', 'Saba', 'Segah', 'Kurd', 'Buselik', 'Cargah', 'Nihavend'];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [seyirFilter, setSeyirFilter] = useState('All');
  const [familyFilter, setFamilyFilter] = useState('All');
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilterCount = (seyirFilter !== 'All' ? 1 : 0) + (familyFilter !== 'All' ? 1 : 0);

  const filtered = MAKAMS.filter((m) => {
    const q = query.toLowerCase();
    const matchesQuery = q === '' ||
      m.name.toLowerCase().includes(q) ||
      m.mood.some((mood) => mood.toLowerCase().includes(q)) ||
      m.description.toLowerCase().includes(q);
    const matchesSeyir = seyirFilter === 'All' || m.seyir.toLowerCase() === seyirFilter.toLowerCase();
    const matchesFamily = familyFilter === 'All' || m.family.toLowerCase().replace(/[^a-z]/g, '') === familyFilter.toLowerCase().replace(/[^a-z]/g, '');
    return matchesQuery && matchesSeyir && matchesFamily;
  });

  const clearFilters = () => {
    setSeyirFilter('All');
    setFamilyFilter('All');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
            <Text style={styles.heading}>Makam</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subheading}>A melodic framework — scale, mood, and movement combined.</Text>
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textTertiary} style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, mood..."
            placeholderTextColor={COLORS.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
          onPress={() => setSheetOpen(true)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFilterCount > 0 ? COLORS.background : COLORS.textSecondary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ACTIVE FILTER PILLS */}
      {activeFilterCount > 0 && (
        <View style={styles.activePillRow}>
          {seyirFilter !== 'All' && (
            <TouchableOpacity style={styles.activePill} onPress={() => setSeyirFilter('All')}>
              <Text style={styles.activePillText}>{seyirFilter}</Text>
              <Ionicons name="close" size={11} color={COLORS.accent} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
          {familyFilter !== 'All' && (
            <TouchableOpacity style={styles.activePill} onPress={() => setFamilyFilter('All')}>
              <Text style={styles.activePillText}>{familyFilter}</Text>
              <Ionicons name="close" size={11} color={COLORS.accent} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* LIST */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No makams found</Text>
            <Text style={styles.emptySubtext}>Try a different search or filter</Text>
          </View>
        ) : (
          filtered.map((makam) => (
            <TouchableOpacity
              key={makam.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(('/makam/' + makam.id) as any)}
            >
              <View style={[styles.colorStrip, { backgroundColor: makam.color }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.makamName}>{makam.name}</Text>
                  <Text style={styles.makamPronunciation}>/{makam.pronunciation}/</Text>
                </View>
                <Text style={styles.makamDesc} numberOfLines={2}>{makam.description}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.moodRow}>
                    {makam.mood.slice(0, 2).map((m) => (
                      <View key={m} style={styles.moodTag}>
                        <Text style={styles.moodText}>{m}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[styles.seyirBadge, { color: makam.color }]}>{makam.seyir} ›</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FILTER SHEET */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter</Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.filterGroupLabel}>SEYIR</Text>
          <View style={styles.chipRow}>
            {SEYIR_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, seyirFilter === f && styles.chipActive]}
                onPress={() => setSeyirFilter(f)}
              >
                <Text style={[styles.chipText, seyirFilter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterGroupLabel}>FAMILY</Text>
          <View style={styles.chipRow}>
            {FAMILY_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, familyFilter === f && styles.chipActive]}
                onPress={() => setFamilyFilter(f)}
              >
                <Text style={[styles.chipText, familyFilter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={() => setSheetOpen(false)}>
            <Text style={styles.doneButtonText}>
              Show {filtered.length} makam{filtered.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 4 },
  settingsButton: { padding: 4, marginTop: 6 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, marginVertical: SPACING.sm, gap: SPACING.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 12 },
  filterButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  activePillRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  activePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: COLORS.accent + '55', backgroundColor: COLORS.accentMuted },
  activePillText: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingTop: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', flexDirection: 'row' },
  colorStrip: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm },
  makamName: { fontSize: 22, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: -0.5 },
  makamPronunciation: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
  makamDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodRow: { flexDirection: 'row', gap: 6 },
  moodTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  moodText: { fontSize: 11, color: COLORS.textSecondary },
  seyirBadge: { fontSize: 12, textTransform: 'capitalize', fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60, gap: SPACING.sm },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 13, color: COLORS.textTertiary },
  backdrop: { flex: 1, backgroundColor: '#00000088' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, paddingBottom: 48, borderWidth: 1, borderColor: COLORS.border },
  sheetHandle: { width: 36, height: 4, borderRadius: 999, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sheetTitle: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  clearText: { fontSize: 14, color: COLORS.accent },
  filterGroupLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.background, fontWeight: '600' },
  doneButton: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.sm },
  doneButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.background },
});
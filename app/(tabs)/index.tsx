import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MAKAMS } from '../../data/makams';
import { COLORS, SPACING } from '../../data/constants';

const FILTERS = ['All', 'Ascending', 'Descending', 'Undulating'];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [seyirFilter, setSeyirFilter] = useState('All');

  const filtered = MAKAMS.filter((m) => {
    const q = query.toLowerCase();
    const matchesQuery =
      q === '' ||
      m.name.toLowerCase().includes(q) ||
      m.mood.some((mood) => mood.toLowerCase().includes(q)) ||
      m.description.toLowerCase().includes(q);
    const matchesSeyir =
      seyirFilter === 'All' || m.seyir.toLowerCase() === seyirFilter.toLowerCase();
    return matchesQuery && matchesSeyir;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.subheading}>A makam is a melodic framework — a scale, mood, and movement combined.</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, mood, character..."
          placeholderTextColor={COLORS.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={{ marginBottom: 4 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, seyirFilter === f && styles.filterChipActive]}
            onPress={() => setSeyirFilter(f)}
          >
            <Text style={[styles.filterText, seyirFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
              onPress={() => router.push(`/makam/${makam.id}`)}
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
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, marginVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 12 },
  clearButton: { fontSize: 14, color: COLORS.textTertiary, padding: 4 },
  filters: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm, flexDirection: "row" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginRight: 8 },
  filterChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterText: { fontSize: 13, color: COLORS.textSecondary },
  filterTextActive: { color: '#0A0A0B', fontWeight: '600' },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
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
});

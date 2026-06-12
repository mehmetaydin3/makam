import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, ColorScheme } from '../../data/constants';
import { ARTISTS, getArtistAppearances, ArtistTradition } from '../../data/artists';

type Filter = 'all' | ArtistTradition;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'turkish-makam', label: 'Makam' },
  { key: 'modal-jazz', label: 'Jazz' },
];

export default function ArtistDirectoryScreen() {
  const router = useRouter();
  const { tradition } = useLocalSearchParams();
  const { colors, jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const initialFilter: Filter =
    tradition === 'modal-jazz' || tradition === 'turkish-makam' ? (tradition as Filter) : 'all';
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState('');

  const accent = filter === 'modal-jazz' ? jazzColors.accent : colors.accent;

  // Precompute appearance counts once.
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of ARTISTS) m[a.id] = getArtistAppearances(a.id).length;
    return m;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTISTS.filter((a) => {
      if (filter !== 'all' && a.tradition !== filter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, filter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.eyebrow, { color: accent }]}>Reference</Text>
        <Text style={styles.title}>Musicians</Text>
        <Text style={styles.subtitle}>The people behind the recordings — {ARTISTS.length} in all.</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search musicians…"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const c = f.key === 'modal-jazz' ? jazzColors.accent : colors.accent;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && { backgroundColor: c + '22', borderColor: c + '77' }]}
            >
              <Text style={[styles.chipText, active && { color: c, fontWeight: '600' }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.length === 0 ? (
          <Text style={styles.empty}>No musicians match “{query}”.</Text>
        ) : (
          results.map((a) => {
            const c = a.tradition === 'modal-jazz' ? jazzColors.accent : colors.accent;
            const lifespan = a.born ? `${a.born}${a.died ? '–' + a.died : '–present'}` : null;
            const n = counts[a.id] ?? 0;
            return (
              <TouchableOpacity
                key={a.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(('/artist/' + a.id) as any)}
              >
                <View style={[styles.avatar, { backgroundColor: c + '1A', borderColor: c + '55' }]}>
                  <Text style={[styles.avatarText, { color: c }]}>{a.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{a.name}</Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {a.instrument}
                    {lifespan ? '  ·  ' + lifespan : ''}
                  </Text>
                  {n > 0 && (
                    <Text style={[styles.count, { color: c }]}>
                      {n} {n === 1 ? 'appearance' : 'appearances'}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xs },
    backButton: { alignSelf: 'flex-start' },
    backText: { fontSize: 15 },
    titleBlock: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
    eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.xs },
    title: { fontSize: 34, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 4 },
    subtitle: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginHorizontal: SPACING.lg,
      paddingHorizontal: SPACING.md,
      paddingVertical: 10,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 15, padding: 0 },
    filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    chipText: { fontSize: 13, color: COLORS.textSecondary },
    list: { paddingHorizontal: SPACING.lg },
    empty: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic', paddingVertical: SPACING.lg },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
    },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    avatarText: { fontSize: 18, fontWeight: '400' },
    name: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary, marginBottom: 2 },
    meta: { fontSize: 12, color: COLORS.textSecondary },
    count: { fontSize: 11, marginTop: 3 },
  });

import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, RADIUS, ColorScheme } from '../data/constants';
import { GLOSSARY, searchGlossary, GlossaryTradition } from '../data/glossary';

type Filter = 'all' | GlossaryTradition;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'turkish-makam', label: 'Makam' },
  { key: 'modal-jazz', label: 'Jazz' },
  { key: 'shared', label: 'Shared' },
];

const TRADITION_LABEL: Record<GlossaryTradition, string> = {
  'turkish-makam': 'Makam',
  'modal-jazz': 'Jazz',
  shared: 'Shared',
};

export default function GlossaryScreen() {
  const router = useRouter();
  const { tradition } = useLocalSearchParams();
  const { colors, jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const initialFilter: Filter =
    tradition === 'modal-jazz' || tradition === 'turkish-makam' ? (tradition as Filter) : 'all';
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState('');

  const accent = filter === 'modal-jazz' ? jazzColors.accent : colors.accent;
  const tagColor = (t: GlossaryTradition) =>
    t === 'modal-jazz' ? jazzColors.accent : t === 'turkish-makam' ? colors.accent : colors.textTertiary;

  const results = useMemo(
    () => searchGlossary(query, filter === 'all' ? undefined : filter),
    [query, filter],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.eyebrow, { color: accent }]}>Reference</Text>
        <Text style={styles.title}>Glossary</Text>
        <Text style={styles.subtitle}>
          The vocabulary of both traditions, in plain language.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms…"
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
              style={[
                styles.chip,
                active && { backgroundColor: c + '22', borderColor: c + '77' },
              ]}
            >
              <Text style={[styles.chipText, active && { color: c, fontWeight: '600' }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.length === 0 ? (
          <Text style={styles.empty}>No terms match “{query}”.</Text>
        ) : (
          results.map((t) => (
            <View key={t.term} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.term}>{t.term}</Text>
                {t.pronunciation ? (
                  <Text style={styles.pron}>/{t.pronunciation}/</Text>
                ) : null}
                <View style={{ flex: 1 }} />
                <View style={[styles.tag, { borderColor: tagColor(t.tradition) + '55' }]}>
                  <Text style={[styles.tagText, { color: tagColor(t.tradition) }]}>
                    {TRADITION_LABEL[t.tradition]}
                  </Text>
                </View>
              </View>
              <Text style={styles.def}>{t.definition}</Text>
            </View>
          ))
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
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
    },
    cardHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 6 },
    term: { fontSize: 17, fontWeight: '600', color: COLORS.textPrimary },
    pron: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
    tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
    tagText: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
    def: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
  });

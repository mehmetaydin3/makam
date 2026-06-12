import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getArtistById, getArtistAppearances, getArtistImage } from '../../data/artists';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, ColorScheme } from '../../data/constants';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, jazzColors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const artist = getArtistById(id as string);
  const accent = artist?.tradition === 'modal-jazz' ? jazzColors.accent : colors.accent;
  const appearances = useMemo(() => (artist ? getArtistAppearances(artist.id) : []), [artist?.id]);

  if (!artist) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.header}>
          <Text style={[styles.backText, { color: accent }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Artist not found.</Text>
      </SafeAreaView>
    );
  }

  const lifespan = artist.born
    ? `${artist.born}${artist.died ? '–' + artist.died : '–present'}`
    : null;

  const traditionLabel = artist.tradition === 'modal-jazz' ? 'Modal Jazz' : 'Turkish Makam';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <View style={[styles.colorBar, { backgroundColor: accent }]} />
          {getArtistImage(artist.id) ? (
            <Image
              source={{ uri: getArtistImage(artist.id) }}
              style={[styles.portrait, { borderColor: accent + '55' }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.portrait, styles.portraitFallback, { borderColor: accent + '55', backgroundColor: accent + '1A' }]}>
              <Text style={[styles.portraitInitial, { color: accent }]}>{artist.name.charAt(0)}</Text>
            </View>
          )}
          <Text style={[styles.eyebrow, { color: accent }]}>{traditionLabel}</Text>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.role}>{artist.role}</Text>

          <View style={styles.metaRow}>
            {lifespan && (
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
                <Text style={styles.metaChipText}>{lifespan}</Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Ionicons name="musical-notes-outline" size={13} color={colors.textTertiary} />
              <Text style={styles.metaChipText}>{artist.instrument}</Text>
            </View>
            <View style={[styles.metaChip, { borderColor: accent + '55' }]}>
              <Text style={[styles.metaChipText, { color: accent }]}>{artist.era}</Text>
            </View>
          </View>
        </View>

        {/* BIO */}
        <View style={styles.section}>
          {artist.bio.map((para, i) => (
            <Text key={i} style={[styles.bio, i > 0 && { marginTop: SPACING.md }]}>
              {para}
            </Text>
          ))}
        </View>

        {/* APPEARANCES — the layered hub back into the app */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: accent }]}>Hear them in the app</Text>
          {appearances.length === 0 ? (
            <Text style={styles.emptyText}>
              No recordings featuring {artist.name.split(' ')[0]} are catalogued yet.
            </Text>
          ) : (
            <View style={{ gap: SPACING.sm }}>
              {appearances.map((a, i) => (
                <TouchableOpacity
                  key={a.refId + a.title + i}
                  style={[styles.appearance, { borderLeftColor: a.color }]}
                  activeOpacity={0.85}
                  onPress={() => router.push(a.route as any)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.appearanceTitle} numberOfLines={2}>
                      {a.title}
                    </Text>
                    <Text style={styles.appearanceMeta}>
                      <Text style={{ color: a.color }}>{a.refName}</Text>
                      {'  ·  ' + a.roleLabel}
                      {a.year ? '  ·  ' + a.year : ''}
                    </Text>
                  </View>
                  {a.hasVideo && (
                    <View style={[styles.playDot, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
                      <Ionicons name="play" size={12} color={accent} />
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    errorText: { color: COLORS.textSecondary, padding: SPACING.lg },
    header: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: { alignSelf: 'flex-start' },
    backText: { fontSize: 15 },
    scroll: { paddingHorizontal: SPACING.lg },
    hero: { marginBottom: SPACING.lg, paddingTop: SPACING.sm },
    colorBar: { width: 32, height: 3, borderRadius: 999, marginBottom: SPACING.md },
    portrait: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, marginBottom: SPACING.md },
    portraitFallback: { alignItems: 'center', justifyContent: 'center' },
    portraitInitial: { fontSize: 36, fontWeight: '300' },
    eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.sm },
    name: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
    role: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.md },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    metaChipText: { fontSize: 12, color: COLORS.textSecondary },
    section: { marginBottom: SPACING.xl },
    sectionLabel: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
    bio: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 25 },
    emptyText: { fontSize: 14, color: COLORS.textTertiary, lineHeight: 22, fontStyle: 'italic' },
    appearance: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderLeftWidth: 3,
    },
    appearanceTitle: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500', marginBottom: 3 },
    appearanceMeta: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
    playDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
  });

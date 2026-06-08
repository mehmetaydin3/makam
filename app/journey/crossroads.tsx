import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../data/constants';
import { CROSSROADS, CrossroadsPiece } from '../../data/crossroads';
import { LessonReader } from '../../components/lessons/LessonReader';

/**
 * Crossroads — comparative pieces that live between the two traditions.
 * A list of pieces (pairings + essays); tapping one opens it in the shared
 * LessonReader. Reached from the Journey screen once both traditions are begun.
 */
export default function CrossroadsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<CrossroadsPiece | null>(null);

  if (selected) {
    return (
      <LessonReader
        key={selected.id}
        lesson={selected}
        isComplete={false}
        onClose={() => setSelected(null)}
        onComplete={() => setSelected(null)}
      />
    );
  }

  const pairings = CROSSROADS.filter((p) => p.kind === 'pairing');
  const essays = CROSSROADS.filter((p) => p.kind === 'essay');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
        </TouchableOpacity>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CROSSROADS</Text>
        <Text style={styles.headline}>Where the two{'\n'}traditions meet</Text>
        <Text style={styles.intro}>
          Comparative pieces that only make sense because you have both — how a feeling travels between worlds, and how each tradition reaches it.
        </Text>

        <Text style={styles.sectionLabel}>PAIRINGS</Text>
        {pairings.map((p) => (
          <PieceCard
            key={p.id}
            piece={p}
            onPress={() => setSelected(p)}
            onCompare={p.comparison ? () => router.push(`/journey/comparison?id=${p.id}` as any) : undefined}
          />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: SPACING.xl }]}>ESSAYS</Text>
        {essays.map((p) => (
          <PieceCard
            key={p.id}
            piece={p}
            onPress={() => setSelected(p)}
            onCompare={p.comparison ? () => router.push(`/journey/comparison?id=${p.id}` as any) : undefined}
          />
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PieceCard({
  piece, onPress, onCompare,
}: {
  piece: CrossroadsPiece;
  onPress: () => void;
  onCompare?: () => void;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardMain} onPress={onPress} activeOpacity={0.8}>
        <Ionicons
          name={piece.kind === 'pairing' ? 'git-compare-outline' : 'book-outline'}
          size={18}
          color={COLORS.accent}
          style={styles.cardIcon}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{piece.title}</Text>
          <Text style={styles.cardSubtitle}>{piece.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
      </TouchableOpacity>

      {onCompare && (
        <TouchableOpacity style={styles.compareRow} onPress={onCompare} activeOpacity={0.8}>
          <Ionicons name="play-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.compareText}>Hear them side by side</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  headline: { fontSize: 34, fontWeight: '200', letterSpacing: -0.5, lineHeight: 40, color: COLORS.textPrimary, marginTop: 6 },
  intro: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginTop: SPACING.md, marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.md, overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg,
  },
  cardIcon: {},
  compareRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  compareText: { fontSize: 13, fontWeight: '600', color: COLORS.accent },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '500', color: COLORS.textPrimary },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 3, fontStyle: 'italic' },
});

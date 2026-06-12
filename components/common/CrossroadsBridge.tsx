import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CrossroadsPiece } from '../../data/crossroads';
import { SPACING, RADIUS } from '../../data/constants';

/**
 * CrossroadsBridge — the cross-tradition hook on a makam/mode detail screen.
 * Given the pairing that links this makam or mode, it teases its twin in the
 * other tradition and routes into the interactive A/B comparison (or the
 * Crossroads reader when a piece has no playable comparison).
 *
 * `fromSide` is the tradition the user is currently in; the card foregrounds
 * the OTHER side as the discovery.
 */
export function CrossroadsBridge({
  piece,
  fromSide,
  // Colors are passed in so the card adopts each screen's theme.
  makamColor,
  jazzColor,
  surface,
  textPrimary,
  textSecondary,
  textTertiary,
  border,
}: {
  piece: CrossroadsPiece;
  fromSide: 'makam' | 'jazz';
  makamColor: string;
  jazzColor: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
}) {
  const router = useRouter();
  const comp = piece.comparison;

  // The label of the tradition the user is crossing TO.
  const otherLabel =
    fromSide === 'makam'
      ? comp?.jazzLabel ?? 'a jazz mode'
      : comp?.makamLabel ?? 'a Turkish makam';
  // Strip any trailing em-dash clause for a tighter headline.
  const otherName = otherLabel.split(/ [—–-] /)[0];

  const otherWord = fromSide === 'makam' ? 'jazz' : 'Turkish';
  const accentTo = fromSide === 'makam' ? jazzColor : makamColor;
  const accentFrom = fromSide === 'makam' ? makamColor : jazzColor;

  const hasComparison = !!comp;
  const onPress = () => {
    if (hasComparison) router.push(('/journey/comparison?id=' + piece.id) as any);
    else router.push(('/journey/crossroads') as any);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Two-tone seam: the two traditions meeting at an edge. */}
      <View style={styles.seam}>
        <View style={{ flex: 1, backgroundColor: accentFrom }} />
        <View style={{ flex: 1, backgroundColor: accentTo }} />
      </View>

      <View style={styles.row}>
        <Ionicons name="git-compare-outline" size={16} color={accentTo} />
        <Text style={[styles.eyebrow, { color: accentTo }]}>CROSS-TRADITION</Text>
      </View>

      <Text style={[styles.title, { color: textPrimary }]}>{piece.subtitle}</Text>

      <Text style={[styles.body, { color: textSecondary }]}>
        This sound has a {otherWord} cousin — <Text style={{ color: accentTo, fontWeight: '600' }}>{otherName}</Text>.{' '}
        {comp?.listenFor ?? 'Hear how one feeling travels between two worlds.'}
      </Text>

      <View style={styles.ctaRow}>
        <Text style={[styles.cta, { color: accentTo }]}>
          {hasComparison ? 'Hear them side by side' : 'Read the connection'}
        </Text>
        <Ionicons name="arrow-forward" size={14} color={accentTo} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    overflow: 'hidden',
  },
  seam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    flexDirection: 'row',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: SPACING.sm },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 21 },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: SPACING.md },
  cta: { fontSize: 14, fontWeight: '600' },
});

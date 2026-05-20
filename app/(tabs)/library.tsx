import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../data/constants';
import { MAKAMS } from '../../data/makams';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Turkish Makam</Text>
        <Text style={styles.heading}>Library</Text>
        <Text style={styles.subheading}>{MAKAMS.length} makams</Text>
      </View>
      <FlatList
        data={MAKAMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View style={styles.cardText}>
              <Text style={styles.makamName}>{item.name}</Text>
              <Text style={styles.makamMeta}>{item.family} family · {item.seyir}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  eyebrow: {
    fontSize: 11,
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  heading: {
    fontSize: 40,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  cardText: {
    flex: 1,
  },
  makamName: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  makamMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  chevron: {
    fontSize: 20,
    color: COLORS.textTertiary,
  },
});

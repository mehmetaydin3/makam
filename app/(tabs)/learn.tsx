import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../data/constants';
import { LESSONS } from '../../data/education';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Turkish Makam</Text>
        <Text style={styles.heading}>Learn</Text>
        <Text style={styles.subheading}>{LESSONS.length} lessons</Text>
      </View>
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardInner}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>
              <Text style={styles.lessonMeta}>{item.estimatedMinutes} min read</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardInner: {
    gap: SPACING.xs,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  lessonSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  lessonMeta: {
    fontSize: 12,
    color: COLORS.accent,
    marginTop: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

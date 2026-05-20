import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { LESSONS } from '../../data/education';
import { COLORS, SPACING } from '../../data/constants';

function LessonReader({ lesson, onClose }: { lesson: any; onClose: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.readerHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>← Learn</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.readerScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.lessonEyebrow}>{lesson.category?.toUpperCase()}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonDivider} />
        <Text style={styles.lessonBody}>{lesson.content}</Text>
        {lesson.keyPoints && (
          <View style={styles.keyPointsCard}>
            <Text style={styles.keyPointsLabel}>KEY POINTS</Text>
            {lesson.keyPoints.map((point: string, i: number) => (
              <View key={i} style={styles.keyPoint}>
                <View style={styles.keyPointDot} />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function LearnScreen() {
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  if (selectedLesson) {
    return <LessonReader lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={styles.heading}>Learn</Text>
        <Text style={styles.subheading}>Deepen your understanding of the Turkish makam tradition.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {LESSONS.map((lesson, i) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => setSelectedLesson(lesson)}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.lessonNumber}>{String(i + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardCategory}>{lesson.category?.toUpperCase()}</Text>
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <Text style={styles.cardSummary} numberOfLines={2}>{lesson.summary}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  list: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1,
    borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, gap: SPACING.md,
  },
  cardLeft: { width: 36, alignItems: 'center' },
  lessonNumber: { fontSize: 20, fontWeight: '200', color: COLORS.accent, letterSpacing: -1 },
  cardBody: { flex: 1, gap: 4 },
  cardCategory: { fontSize: 10, color: COLORS.textTertiary, letterSpacing: 1.5 },
  cardTitle: { fontSize: 16, fontWeight: '400', color: COLORS.textPrimary },
  cardSummary: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  arrow: { fontSize: 20, color: COLORS.textTertiary },
  readerHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  readerScroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  lessonEyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, marginBottom: SPACING.sm },
  lessonTitle: { fontSize: 36, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, lineHeight: 42, marginBottom: SPACING.lg },
  lessonDivider: { width: 40, height: 2, backgroundColor: COLORS.accent, borderRadius: 999, marginBottom: SPACING.lg },
  lessonBody: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 28 },
  keyPointsCard: { marginTop: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  keyPointsLabel: { fontSize: 11, color: COLORS.accent, letterSpacing: 2 },
  keyPoint: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  keyPointDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: COLORS.accent, marginTop: 7 },
  keyPointText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
});

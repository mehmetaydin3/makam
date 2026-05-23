import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
        <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonTime}>{lesson.estimatedMinutes} min read</Text>
        <View style={styles.lessonDivider} />
        {lesson.sections && lesson.sections.map((section: any, i: number) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
            {section.callout ? (
              <View style={styles.calloutCard}>
                <Text style={styles.calloutText}>{section.callout}</Text>
              </View>
            ) : null}
            {section.table ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>{section.table.headers[0]}</Text>
                  <Text style={styles.tableHeaderCell}>{section.table.headers[1]}</Text>
                </View>
                {section.table.rows.map((row: string[], j: number) => (
                  <View key={j} style={[styles.tableRow, j % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={styles.tableCell}>{row[0]}</Text>
                    <Text style={styles.tableCell}>{row[1]}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {section.steps ? (
              <View style={styles.stepsRow}>
                {section.steps.map((step: {note: string, size: string, highlight?: boolean}, j: number) => (
                  <View key={j} style={styles.stepItem}>
                    <View style={[styles.stepBox, step.highlight && styles.stepBoxHighlight]}>
                      <Text style={[styles.stepNote, step.highlight && styles.stepNoteHighlight]}>{step.note}</Text>
                    </View>
                    {j < section.steps.length - 1 && (
                      <Text style={styles.stepArrow}>{step.size === 'aug' ? '↑↑' : step.size === 'half' ? '½' : '→'}</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function LearnScreen() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

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
          <TouchableOpacity key={lesson.id} style={styles.card} activeOpacity={0.75} onPress={() => setSelectedLesson(lesson)}>
            <View style={styles.cardLeft}>
              <Text style={styles.lessonNumber}>{String(i + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <Text style={styles.cardSummary} numberOfLines={2}>{lesson.subtitle}</Text>
              <Text style={styles.cardTime}>{lesson.estimatedMinutes} min read</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
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
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  cardLeft: { width: 36, alignItems: 'center' },
  lessonNumber: { fontSize: 20, fontWeight: '200', color: COLORS.accent, letterSpacing: -1 },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 16, fontWeight: '400', color: COLORS.textPrimary },
  cardSummary: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  cardTime: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  arrow: { fontSize: 20, color: COLORS.textTertiary },
  readerHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  readerScroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  lessonSubtitle: { fontSize: 12, color: COLORS.textTertiary, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  lessonTitle: { fontSize: 34, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, lineHeight: 40 },
  lessonTime: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  lessonDivider: { width: 40, height: 2, backgroundColor: COLORS.accent, borderRadius: 999, marginVertical: SPACING.lg },
  section: { marginBottom: SPACING.xl, gap: SPACING.sm },
  sectionHeading: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  sectionBody: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26 },
  table: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginTop: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.surface },
  tableHeaderCell: { flex: 1, padding: 10, fontSize: 11, fontWeight: '600', color: COLORS.accent, letterSpacing: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row' },
  tableRowAlt: { backgroundColor: COLORS.surface + '44' },
  tableCell: { flex: 1, padding: 10, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  stepsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 8 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  stepBoxHighlight: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  stepNote: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  stepNoteHighlight: { color: COLORS.accent, fontWeight: '700' },
  stepArrow: { fontSize: 11, color: COLORS.textTertiary },
  calloutCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.accent, borderWidth: 1, borderColor: COLORS.border },
  calloutText: { fontSize: 14, color: COLORS.accent, lineHeight: 22, fontStyle: 'italic' },
});

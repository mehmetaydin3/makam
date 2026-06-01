import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LESSONS, CATEGORY_ORDER, CATEGORY_LABELS, Lesson, LessonCategory } from '../../../data/education';
import { LessonReader } from '../../../components/lessons/LessonReader';
import { COLORS, SPACING } from '../../../data/constants';
import { Chrome } from '../../../components/chrome';
import { useProgress } from '../../../hooks/useProgress';

const TRADITION_ID = 'turkish-makam';

type CardProps = {
  lesson: Lesson;
  completed: boolean;
  unlocked: boolean;
  isLast: boolean;       // last lesson in the entire flow (no connector after)
  onPress: () => void;
};

function LessonCard({ lesson, completed, unlocked, isLast, onPress }: CardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, !unlocked && styles.cardLocked]}
      onPress={onPress}
      activeOpacity={unlocked ? 0.8 : 1}
      disabled={!unlocked}
    >
      <View style={styles.numberCol}>
        {completed ? (
          <View style={styles.completedDot}>
            <Ionicons name="checkmark" size={14} color={COLORS.background} />
          </View>
        ) : unlocked ? (
          <Text style={styles.number}>{lesson.number}</Text>
        ) : (
          <Ionicons name="lock-closed" size={16} color={COLORS.textTertiary} />
        )}
        {!isLast && <View style={[styles.connector, completed && styles.connectorDone]} />}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={[styles.title, !unlocked && styles.titleLocked]}>{lesson.title}</Text>
          <Text style={styles.duration}>{lesson.pages.length} pages</Text>
        </View>
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>
        <View style={styles.statusRow}>
          {completed ? (
            <View style={[styles.statusPill, styles.statusCompleted]}>
              <Text style={[styles.statusText, styles.statusTextCompleted]}>Explored</Text>
            </View>
          ) : unlocked ? (
            <View style={[styles.statusPill, styles.statusReady]}>
              <Text style={[styles.statusText, styles.statusTextReady]}>Start lesson</Text>
            </View>
          ) : (
            <View style={[styles.statusPill, styles.statusLocked]}>
              <Text style={[styles.statusText, styles.statusTextLocked]}>Locked</Text>
            </View>
          )}
        </View>
      </View>

      {unlocked && !completed && (
        <Ionicons name="arrow-forward" size={16} color={COLORS.textTertiary} style={styles.cardArrow} />
      )}
    </TouchableOpacity>
  );
}

export default function LearnScreen() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { isLessonComplete, isLessonUnlocked, isCategoryUnlocked, markLessonComplete } = useProgress();

  const nextOf = (l: Lesson): Lesson | null => {
    const idx = LESSONS.findIndex((x) => x.id === l.id);
    return idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;
  };

  if (selectedLesson) {
    return (
      <LessonReader
        lesson={selectedLesson}
        nextLesson={nextOf(selectedLesson)}
        isComplete={isLessonComplete(TRADITION_ID, selectedLesson.id)}
        onClose={() => setSelectedLesson(null)}
        onComplete={(id) => markLessonComplete(TRADITION_ID, id)}
        onStartNext={(id) => {
          const nl = LESSONS.find((x) => x.id === id) || null;
          setSelectedLesson(nl);
        }}
      />
    );
  }

  const lastLessonId = LESSONS[LESSONS.length - 1]?.id;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Chrome traditionName="Turkish Makam" accent={COLORS.accent} />
      <View style={styles.header}>
        <Text style={styles.heading}>Learn</Text>
        <Text style={styles.subheading}>Your path through the makam tradition.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {CATEGORY_ORDER.map((cat) => {
          const lessonsInCat = LESSONS.filter((l) => l.category === cat);
          if (lessonsInCat.length === 0) return null;
          const catUnlocked = isCategoryUnlocked(TRADITION_ID, cat, CATEGORY_ORDER, LESSONS);
          return (
            <View key={cat}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryLabel}>{CATEGORY_LABELS[cat as LessonCategory]}</Text>
                {!catUnlocked && <Ionicons name="lock-closed" size={12} color={COLORS.textTertiary} />}
              </View>
              {lessonsInCat.map((lesson) => {
                const completed = isLessonComplete(TRADITION_ID, lesson.id);
                const unlocked = catUnlocked && isLessonUnlocked(TRADITION_ID, lesson);
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    completed={completed}
                    unlocked={unlocked}
                    isLast={lesson.id === lastLessonId}
                    onPress={() => unlocked && setSelectedLesson(lesson)}
                  />
                );
              })}
            </View>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  categoryLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase' },
  card: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: SPACING.md },
  cardLocked: { opacity: 0.5 },
  numberCol: { width: 40, alignItems: 'center', paddingTop: 2 },
  number: { fontSize: 18, fontWeight: '300', color: COLORS.accent, letterSpacing: 0.5 },
  completedDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  connector: { width: 1, flex: 1, minHeight: 28, backgroundColor: COLORS.border, marginTop: 6 },
  connectorDone: { backgroundColor: COLORS.accent },
  cardContent: { flex: 1, paddingLeft: SPACING.sm, paddingBottom: SPACING.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  title: { fontSize: 17, fontWeight: '500', color: COLORS.textPrimary, flex: 1 },
  titleLocked: { color: COLORS.textTertiary },
  duration: { fontSize: 12, color: COLORS.textTertiary, marginLeft: SPACING.sm, marginTop: 2 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  statusRow: { flexDirection: 'row' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
  statusCompleted: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  statusReady: { backgroundColor: COLORS.accentMuted, borderColor: COLORS.accent },
  statusLocked: { backgroundColor: 'transparent', borderColor: COLORS.border },
  statusText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  statusTextCompleted: { color: COLORS.accent },
  statusTextReady: { color: COLORS.accent },
  statusTextLocked: { color: COLORS.textTertiary },
  cardArrow: { alignSelf: 'center', marginLeft: SPACING.sm },
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
  imageContainer: { borderRadius: 12, overflow: 'hidden', marginVertical: 8 },
  lessonImage: { width: '100%', height: 200, borderRadius: 12 },
  imageCaption: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6, fontStyle: 'italic', textAlign: 'center' },
  calloutCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.accent, borderWidth: 1, borderColor: COLORS.border },
  calloutText: { fontSize: 14, color: COLORS.accent, lineHeight: 22, fontStyle: 'italic' },
});

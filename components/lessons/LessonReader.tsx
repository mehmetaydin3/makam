import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, LessonPage, LessonPageType } from '../../data/education';
import { COLORS, SPACING } from '../../data/constants';

/**
 * LessonReader — the shared paged lesson reader for ALL traditions.
 *
 * Adapted from Modality's LessonScreen: nav bar (close + "Lesson N" + page
 * counter), progress-fill bar, typed pages (icon + accent per type), progress
 * dots, footer back/next where the last page completes the lesson, then a
 * completion screen with an "up next" card.
 *
 * Extended beyond Modality to render Makam's apparatus pages: table, steps
 * (scale diagrams), callout, and image. One reader, both traditions.
 *
 * Navigation-agnostic: takes callbacks (onClose / onComplete / onStartNext)
 * so it works with Expo Router without a navigation prop.
 */

const PAGE_TYPE_ICON: Record<LessonPageType, string> = {
  intro:   'book-outline',
  concept: 'bulb-outline',
  listen:  'ear-outline',
  compare: 'git-compare-outline',
  chord:   'layers-outline',
  summary: 'checkmark-circle-outline',
};

// All types use the tradition accent; type variety comes from the icon + label.
// (Makam is monochromatic-gold by design; we don't introduce Modality's multi-hue.)
function typeColor() {
  return COLORS.accent;
}

type Props = {
  lesson: Lesson;
  nextLesson?: Lesson | null;
  isComplete?: boolean;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
  onStartNext?: (lessonId: string) => void;
};

export function LessonReader({ lesson, nextLesson, isComplete, onClose, onComplete, onStartNext }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const pages = lesson.pages || [];
  const page: LessonPage | undefined = pages[currentPage];
  const isLast = currentPage === pages.length - 1;
  const progress = pages.length ? (currentPage + 1) / pages.length : 0;

  const goTo = (index: number) => {
    setCurrentPage(index);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleFinish = () => {
    onComplete(lesson.id);
    setFinished(true);
  };

  if (!page) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  // ── Completion screen ──
  if (finished) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.completeContainer}>
          <View style={styles.completeIcon}>
            <Ionicons name="checkmark" size={36} color={COLORS.background} />
          </View>
          <Text style={styles.completeTitle}>Lesson explored</Text>
          <Text style={styles.completeLesson}>{lesson.title}</Text>

          {nextLesson && (
            <View style={styles.nextCard}>
              <Text style={styles.nextCardLabel}>Up next</Text>
              <Text style={styles.nextCardTitle}>{nextLesson.title}</Text>
              <Text style={styles.nextCardSubtitle}>{nextLesson.subtitle}</Text>
            </View>
          )}

          <View style={styles.completeButtons}>
            {nextLesson && onStartNext && (
              <TouchableOpacity style={styles.nextLessonButton} onPress={() => onStartNext(nextLesson.id)}>
                <Text style={styles.nextLessonButtonText}>Start next lesson</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.backToLearnButton} onPress={onClose}>
              <Text style={styles.backToLearnText}>Back to lessons</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const tColor = typeColor();
  const tIcon = PAGE_TYPE_ICON[page.type] || 'document-outline';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.lessonLabel}>Lesson {lesson.number}</Text>
        <Text style={styles.pageCount}>{currentPage + 1} / {pages.length}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.typeRow}>
          <View style={[styles.typeIcon, { backgroundColor: tColor + '22' }]}>
            <Ionicons name={tIcon as any} size={16} color={tColor} />
          </View>
          <Text style={[styles.typeLabel, { color: tColor }]}>{page.type}</Text>
        </View>

        {page.heading ? <Text style={styles.heading}>{page.heading}</Text> : null}
        {page.body ? <Text style={styles.body}>{page.body}</Text> : null}

        {page.callout ? (
          <View style={styles.calloutCard}>
            <Text style={styles.calloutText}>{page.callout}</Text>
          </View>
        ) : null}

        {page.image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: page.image.uri }} style={styles.lessonImage} resizeMode="cover" />
            <Text style={styles.imageCaption}>{page.image.caption}</Text>
          </View>
        ) : null}

        {page.table ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>{page.table.headers[0]}</Text>
              <Text style={styles.tableHeaderCell}>{page.table.headers[1]}</Text>
            </View>
            {page.table.rows.map((row, j) => (
              <View key={j} style={[styles.tableRow, j % 2 === 0 && styles.tableRowAlt]}>
                <Text style={styles.tableCell}>{row[0]}</Text>
                <Text style={styles.tableCell}>{row[1]}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {page.steps ? (
          <View style={styles.stepsRow}>
            {page.steps.map((step, j) => (
              <View key={j} style={styles.stepItem}>
                <View style={[styles.stepBox, step.highlight && styles.stepBoxHighlight]}>
                  <Text style={[styles.stepNote, step.highlight && styles.stepNoteHighlight]}>{step.note}</Text>
                </View>
                {j < page.steps!.length - 1 && (
                  <Text style={styles.stepArrow}>{step.size === 'aug' ? '↑↑' : step.size === 'half' ? '½' : '→'}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.dotsRow}>
        {pages.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => i < currentPage && goTo(i)} activeOpacity={0.7}>
            <View style={[styles.dot, i === currentPage && styles.dotActive, i < currentPage && styles.dotDone]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonSecondary, currentPage === 0 && styles.navButtonDisabled]}
          onPress={() => currentPage > 0 && goTo(currentPage - 1)}
          activeOpacity={currentPage === 0 ? 1 : 0.8}
        >
          <Ionicons name="arrow-back" size={18} color={currentPage === 0 ? COLORS.textTertiary : COLORS.textPrimary} />
        </TouchableOpacity>

        {isLast ? (
          <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleFinish}>
            <Text style={styles.navButtonPrimaryText}>{isComplete ? 'Review complete' : 'Complete lesson'}</Text>
            <Ionicons name="checkmark" size={16} color={COLORS.background} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={() => goTo(currentPage + 1)}>
            <Text style={styles.navButtonPrimaryText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  errorText: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  closeButton: { padding: 4 },
  lessonLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  pageCount: { fontSize: 13, color: COLORS.textTertiary },
  progressTrack: { height: 2, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg, borderRadius: 1, marginBottom: SPACING.md },
  progressFill: { height: 2, backgroundColor: COLORS.accent, borderRadius: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  typeIcon: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  heading: { fontSize: 26, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: 0.3, marginBottom: SPACING.lg, lineHeight: 34 },
  body: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 28, marginBottom: SPACING.lg },
  calloutCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.accent, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  calloutText: { fontSize: 14, color: COLORS.accent, lineHeight: 22, fontStyle: 'italic' },
  imageContainer: { borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.lg },
  lessonImage: { width: '100%', height: 200, borderRadius: 12 },
  imageCaption: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6, fontStyle: 'italic', textAlign: 'center' },
  table: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.surface },
  tableHeaderCell: { flex: 1, padding: 10, fontSize: 11, fontWeight: '600', color: COLORS.accent, letterSpacing: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row' },
  tableRowAlt: { backgroundColor: COLORS.surface + '44' },
  tableCell: { flex: 1, padding: 10, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  stepsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginBottom: SPACING.lg },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  stepBoxHighlight: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  stepNote: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  stepNoteHighlight: { color: COLORS.accent, fontWeight: '700' },
  stepArrow: { fontSize: 11, color: COLORS.textTertiary },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: SPACING.sm, flexWrap: 'wrap' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border, marginVertical: 2 },
  dotActive: { width: 20, backgroundColor: COLORS.accent },
  dotDone: { backgroundColor: COLORS.accent + '99' },
  footer: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, paddingTop: SPACING.sm, gap: SPACING.sm },
  navButton: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  navButtonSecondary: { width: 48, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  navButtonDisabled: { opacity: 0.3 },
  navButtonPrimary: { flex: 1, backgroundColor: COLORS.accent },
  navButtonPrimaryText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  completeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.lg, gap: SPACING.lg },
  completeIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  completeTitle: { fontSize: 13, fontWeight: '600', color: COLORS.accent, letterSpacing: 1.5, textTransform: 'uppercase' },
  completeLesson: { fontSize: 24, fontWeight: '300', color: COLORS.textPrimary, textAlign: 'center' },
  nextCard: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg },
  nextCardLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  nextCardTitle: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary, marginBottom: 2 },
  nextCardSubtitle: { fontSize: 13, color: COLORS.textSecondary },
  completeButtons: { width: '100%', gap: SPACING.sm },
  nextLessonButton: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm },
  nextLessonButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  backToLearnButton: { paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  backToLearnText: { fontSize: 15, color: COLORS.textSecondary },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildLeveledQuizSession, countQuestionsAtLevel, QuizQuestion, QuizLevel } from '../../../data/traditions/turkish-makam/quiz';
import { useProgress } from '../../../hooks/useProgress';
import { QUIZ_PASS_THRESHOLD, nextQuizLevel } from '../../../data/progress';
import { COLORS, SPACING, RADIUS } from '../../../data/constants';
import { Chrome } from '../../../components/chrome';


type QuizState = 'home' | 'question' | 'answer' | 'result';

export default function PracticeScreen() {
  const { recordQuizAnswer, isQuizLevelUnlocked, unlockQuizLevel } = useProgress();
  const [quizState, setQuizState] = useState<QuizState>('home');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<QuizLevel>('beginner');
  const [justUnlocked, setJustUnlocked] = useState<QuizLevel | null>(null);

  const startLevel = (level: QuizLevel) => {
    const session = buildLeveledQuizSession(level, 10);
    setCurrentLevel(level);
    setQuestions(session);
    setCurrentIndex(0);
    setScore(0);
    setFinalScore(0);
    setSelectedAnswer(null);
    setJustUnlocked(null);
    setQuizState('question');
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizState('answer');
  };

  const handleNext = () => {
    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    // Feed the mastery model: correct, makam-tagged answers deepen that makam.
    recordQuizAnswer('turkish-makam', question.makamId, isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setQuizState('question');
    } else {
      setFinalScore(newScore);
      const pct = newScore / questions.length;
      const next = nextQuizLevel(currentLevel);
      if (pct >= QUIZ_PASS_THRESHOLD && next && !isQuizLevelUnlocked('turkish-makam', next)) {
        unlockQuizLevel('turkish-makam', next);
        setJustUnlocked(next);
      }
      setQuizState('result');
    }
  };

  if (quizState === 'home') {
    return (
      <HomeView
        onStartLevel={startLevel}
        isUnlocked={(lvl) => isQuizLevelUnlocked('turkish-makam', lvl)}
      />
    );
  }

  if (quizState === 'result') {
    return (
      <ResultView
        score={finalScore}
        total={questions.length}
        justUnlocked={justUnlocked}
        onRestart={() => setQuizState('home')}
        onRetry={() => startLevel(currentLevel)}
      />
    );
  }

  const question = questions[currentIndex];

  return (
    <QuestionView
      question={question}
      questionNumber={currentIndex + 1}
      total={questions.length}
      selectedAnswer={selectedAnswer}
      showAnswer={quizState === 'answer'}
      score={score}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onQuit={() => setQuizState('home')}
    />
  );
}

function HomeView({ onStartLevel, isUnlocked }: {
  onStartLevel: (level: QuizLevel) => void;
  isUnlocked: (level: QuizLevel) => boolean;
}) {
  const levels: { level: QuizLevel; label: string; desc: string; count: number }[] = [
    { level: 'beginner', label: 'Beginner', desc: 'Seyir, families, and character', count: countQuestionsAtLevel('beginner') },
    { level: 'intermediate', label: 'Intermediate', desc: 'Durak, relationships, and finer traits', count: countQuestionsAtLevel('intermediate') },
    { level: 'advanced', label: 'Advanced', desc: 'Subtle distinctions between makams', count: countQuestionsAtLevel('advanced') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Chrome traditionName="Turkish Makam" accent={COLORS.accent} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.heading}>Practice</Text>
          <Text style={styles.subheading}>Three levels. Pass one to unlock the next.</Text>
        </View>

        <View style={styles.levelList}>
          {levels.map(({ level, label, desc, count }, i) => {
            const unlocked = isUnlocked(level);
            const prev = i > 0 ? levels[i - 1].label : null;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.levelCard, !unlocked && styles.levelCardLocked]}
                activeOpacity={unlocked ? 0.8 : 1}
                onPress={() => unlocked && onStartLevel(level)}
                disabled={!unlocked}
              >
                <View style={styles.levelCardHeader}>
                  <View style={styles.levelTitleRow}>
                    <Text style={[styles.levelLabel, !unlocked && styles.levelLabelLocked]}>{label}</Text>
                    {!unlocked && <Ionicons name="lock-closed" size={14} color={COLORS.textTertiary} />}
                  </View>
                  <Text style={styles.levelCount}>{count} questions</Text>
                </View>
                <Text style={[styles.levelDesc, !unlocked && styles.levelLabelLocked]}>
                  {unlocked ? desc : `Score 70% on ${prev} to unlock`}
                </Text>
                {unlocked && (
                  <View style={styles.levelStartRow}>
                    <Text style={styles.levelStartText}>Start</Text>
                    <Ionicons name="arrow-forward" size={15} color={COLORS.accent} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


function QuestionView({
  question, questionNumber, total, selectedAnswer,
  showAnswer, score, onAnswer, onNext, onQuit,
}: {
  question: QuizQuestion; questionNumber: number; total: number;
  selectedAnswer: string | null; showAnswer: boolean; score: number;
  onAnswer: (a: string) => void; onNext: () => void; onQuit: () => void;
}) {
  const progress = questionNumber / total;
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onQuit} style={styles.quitButton}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.questionCount}>{questionNumber} / {total}</Text>
        <Text style={styles.scoreDisplay}>{score} ✓</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>

        <View style={styles.difficultyRow}>
          <View style={[styles.difficultyPill, {
            backgroundColor: question.difficulty === 'beginner'
              ? COLORS.success + '22'
              : question.difficulty === 'intermediate'
              ? COLORS.warning + '22'
              : COLORS.dark + '22',
          }]}>
            <Text style={[styles.difficultyText, {
              color: question.difficulty === 'beginner'
                ? COLORS.success
                : question.difficulty === 'intermediate'
                ? COLORS.warning
                : COLORS.dark,
            }]}>
              {question.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.optionsGrid}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correctAnswer;
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            if (showAnswer) {
              if (isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, color: COLORS.success };
              } else if (isSelected && !isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionWrong };
                textStyle = { ...styles.optionText, color: COLORS.warning };
              } else {
                optionStyle = { ...styles.option, ...styles.optionDim };
              }
            } else if (isSelected) {
              optionStyle = { ...styles.option, ...styles.optionSelected };
            }
            return (
              <TouchableOpacity
                key={option}
                style={optionStyle}
                onPress={() => !showAnswer && onAnswer(option)}
                activeOpacity={showAnswer ? 1 : 0.8}
              >
                {showAnswer && isCorrectOption && (
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                )}
                {showAnswer && isSelected && !isCorrectOption && (
                  <Ionicons name="close-circle" size={16} color={COLORS.warning} />
                )}
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showAnswer && (
          <View style={[styles.explanationCard, { borderLeftColor: isCorrect ? COLORS.success : COLORS.warning }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                size={16}
                color={isCorrect ? COLORS.success : COLORS.warning}
              />
              <Text style={[styles.explanationLabel, { color: isCorrect ? COLORS.success : COLORS.warning }]}>
                {isCorrect ? 'Correct' : 'Not quite'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {showAnswer && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>
              {questionNumber === total ? 'See result' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function ResultView({ score, total, justUnlocked, onRestart, onRetry }: {
  score: number; total: number; justUnlocked?: QuizLevel | null;
  onRestart: () => void; onRetry: () => void;
}) {
  const levelLabel = justUnlocked
    ? justUnlocked.charAt(0).toUpperCase() + justUnlocked.slice(1)
    : null;
  const percentage = Math.round((score / total) * 100);
  const getMessage = () => {
    if (percentage === 100) return 'Perfect. Your ear is developing.';
    if (percentage >= 70) return 'Good. Keep listening.';
    return 'Keep practicing. The ear takes time.';
  };
  const getColor = () => {
    if (percentage === 100) return COLORS.success;
    if (percentage >= 70) return COLORS.accent;
    return COLORS.warning;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.resultContainer}>
        <View style={[styles.scoreCircle, { borderColor: getColor() }]}>
          <Text style={[styles.scoreNumber, { color: getColor() }]}>{score}</Text>
          <Text style={styles.scoreTotal}>of {total}</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.resultMessage}>{getMessage()}</Text>

        {justUnlocked && (
          <View style={styles.unlockBanner}>
            <Ionicons name="sparkles" size={18} color={COLORS.accent} />
            <Text style={styles.unlockText}>{levelLabel} level unlocked!</Text>
          </View>
        )}

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Correct</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.success }]}>{score}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Incorrect</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.warning }]}>{total - score}</Text>
          </View>
          <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.breakdownLabel}>Total</Text>
            <Text style={styles.breakdownValue}>{total}</Text>
          </View>
        </View>


        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>Back to practice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color={COLORS.accent} />
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  homeContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  homeHeader: { paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  levelList: { gap: SPACING.md },
  levelCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, gap: 6 },
  levelCardLocked: { opacity: 0.55 },
  levelCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelLabel: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  levelLabelLocked: { color: COLORS.textTertiary },
  levelCount: { fontSize: 12, color: COLORS.textTertiary },
  levelDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  levelStartRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  levelStartText: { fontSize: 14, fontWeight: '600', color: COLORS.accent },
  unlockBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.accentMuted, borderRadius: 10, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.lg },
  unlockText: { fontSize: 14, fontWeight: '600', color: COLORS.accent },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.warning + '44',
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  streakText: { fontSize: 14, color: COLORS.warning, fontWeight: '500' },
  quizCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg,
  },
  quizCardTitle: { fontSize: 20, fontWeight: '500', color: COLORS.textPrimary, marginBottom: 4 },
  quizCardSubtitle: { fontSize: 13, color: COLORS.textTertiary, marginBottom: SPACING.lg },
  typeList: { gap: SPACING.md, marginBottom: SPACING.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  typeIconWrap: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentMuted, alignItems: 'center', justifyContent: 'center',
  },
  typeText: { flex: 1 },
  typeLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  typeDesc: { fontSize: 12, color: COLORS.textTertiary },
  startButton: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm,
  },
  startButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
  },
  quitButton: { padding: 4 },
  questionCount: { fontSize: 13, color: COLORS.textSecondary },
  scoreDisplay: { fontSize: 13, color: COLORS.success, fontWeight: '600' },
  progressTrack: {
    height: 2, backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg, borderRadius: 1, marginBottom: SPACING.lg,
  },
  progressFill: { height: 2, backgroundColor: COLORS.accent, borderRadius: 1 },
  questionContent: { paddingHorizontal: SPACING.lg },
  videoWrapper: { marginBottom: SPACING.md },
  videoLabel: {
    fontSize: 11, fontWeight: '600', color: COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  difficultyRow: { marginBottom: SPACING.md },
  difficultyPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  difficultyText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  prompt: {
    fontSize: 22, fontWeight: '300', color: COLORS.textPrimary,
    lineHeight: 32, marginBottom: SPACING.xl,
  },
  optionsGrid: { gap: SPACING.sm, marginBottom: SPACING.lg },
  option: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
  },
  optionSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentMuted },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: COLORS.success + '11' },
  optionWrong: { borderColor: COLORS.warning, backgroundColor: COLORS.warning + '11' },
  optionDim: { opacity: 0.4 },
  optionText: { fontSize: 15, color: COLORS.textPrimary, flex: 1 },
  explanationCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderLeftWidth: 3, padding: SPACING.md,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  explanationLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  explanationText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, paddingTop: SPACING.sm },
  nextButton: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm,
  },
  nextButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  resultScroll: { flexGrow: 1, justifyContent: 'center' },
  resultContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.lg, gap: SPACING.lg,
  },
  scoreCircle: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
  },
  scoreNumber: { fontSize: 40, fontWeight: '200' },
  scoreTotal: { fontSize: 13, color: COLORS.textTertiary },
  percentage: { fontSize: 48, fontWeight: '200', color: COLORS.textPrimary },
  resultMessage: {
    fontSize: 16, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 24, maxWidth: 280,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, width: '100%', overflow: 'hidden',
  },
  breakdownRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  breakdownLabel: { fontSize: 14, color: COLORS.textSecondary },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  restartButton: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, width: '100%', alignItems: 'center',
  },
  restartText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: SPACING.md },
  retryText: { fontSize: 14, color: COLORS.accent },
});

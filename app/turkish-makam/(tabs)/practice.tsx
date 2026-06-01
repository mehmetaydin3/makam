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
import { buildQuizSession, QuizQuestion } from '../../../data/traditions/turkish-makam/quiz';
import { COLORS, SPACING, RADIUS } from '../../../data/constants';
import { Chrome } from '../../../components/chrome';


type QuizState = 'home' | 'question' | 'answer' | 'result';

export default function PracticeScreen() {
  const [quizState, setQuizState] = useState<QuizState>('home');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const startQuiz = () => {
    const session = buildQuizSession(10);
    setQuestions(session);
    setCurrentIndex(0);
    setScore(0);
    setFinalScore(0);
    setSelectedAnswer(null);
    setQuizState('question');
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizState('answer');
  };

  const handleNext = () => {
    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setQuizState('question');
    } else {
      setFinalScore(newScore);
      setQuizState('result');
    }
  };

  if (quizState === 'home') {
    return <HomeView onStart={startQuiz} />;
  }

  if (quizState === 'result') {
    return (
      <ResultView
        score={finalScore}
        total={questions.length}
        onRestart={() => setQuizState('home')}
        onRetry={startQuiz}
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

function HomeView({ onStart }: { onStart: () => void }) {
  const questionTypes = [
    { icon: 'trending-up-outline', label: 'Seyir', desc: 'Which way does the melody move?' },
    { icon: 'git-network-outline', label: 'Families', desc: 'Which makams are related?' },
    { icon: 'heart-outline', label: 'Character', desc: 'The emotional world of each makam' },
    { icon: 'location-outline', label: 'Durak', desc: 'Where does the makam rest?' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Chrome traditionName="Turkish Makam" accent={COLORS.accent} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.heading}>Practice</Text>
          <Text style={styles.subheading}>Test your knowledge of the makams</Text>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizCardTitle}>Makam quiz</Text>
          <Text style={styles.quizCardSubtitle}>10 questions · mixed difficulty</Text>
          <View style={styles.typeList}>
            {questionTypes.map((t, i) => (
              <View key={i} style={styles.typeRow}>
                <View style={styles.typeIconWrap}>
                  <Ionicons name={t.icon as any} size={16} color={COLORS.accent} />
                </View>
                <View style={styles.typeText}>
                  <Text style={styles.typeLabel}>{t.label}</Text>
                  <Text style={styles.typeDesc}>{t.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Start quiz</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </TouchableOpacity>
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

function ResultView({ score, total, onRestart, onRetry }: {
  score: number; total: number; onRestart: () => void; onRetry: () => void;
}) {
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
      <View style={styles.resultContainer}>
        <View style={[styles.scoreCircle, { borderColor: getColor() }]}>
          <Text style={[styles.scoreNumber, { color: getColor() }]}>{score}</Text>
          <Text style={styles.scoreTotal}>of {total}</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.resultMessage}>{getMessage()}</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  homeContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  homeHeader: { paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
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

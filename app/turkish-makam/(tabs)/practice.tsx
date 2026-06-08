import React, { useState, useRef, useEffect } from 'react';
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
import { buildMakamEarSession, EarQuestion, EarOption, EarLevel, EAR_TRAINING_AVAILABLE } from '../../../data/traditions/turkish-makam/earTraining';
import { audioEngine } from '../../../audio/audioEngine';
import { useProgress } from '../../../hooks/useProgress';
import { QUIZ_PASS_THRESHOLD, nextQuizLevel } from '../../../data/progress';
import { COLORS, SPACING, RADIUS } from '../../../data/constants';
import { Chrome } from '../../../components/chrome';
import { RewardBurst } from '../../../components/rewards';
import { PressableScale, Pop, Bounce, BreathingView } from '../../../components/common/motion';


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
  // Celebratory overlay shown when a session finishes well / a level unlocks.
  const [reward, setReward] = useState<{ kind: 'level' | 'daily'; title: string; subtitle?: string } | null>(null);

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
        const label = next.charAt(0).toUpperCase() + next.slice(1);
        setReward({ kind: 'level', title: `${label} unlocked`, subtitle: 'A new level of questions is open.' });
      } else if (pct >= QUIZ_PASS_THRESHOLD) {
        setReward({ kind: 'daily', title: 'Nicely done', subtitle: `${newScore} of ${questions.length} — you passed.` });
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
      <>
        <ResultView
          score={finalScore}
          total={questions.length}
          justUnlocked={justUnlocked}
          onRestart={() => setQuizState('home')}
          onRetry={() => startLevel(currentLevel)}
        />
        <RewardBurst
          visible={!!reward}
          kind={reward?.kind ?? 'daily'}
          title={reward?.title ?? ''}
          subtitle={reward?.subtitle}
          accent={COLORS.accent}
          textPrimary={COLORS.textPrimary}
          textSecondary={COLORS.textSecondary}
          onDone={() => setReward(null)}
        />
      </>
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
  // Quiz + "By ear" share this home. The ear flow (MakamEarFlow) plays scales
  // through the ney engine and is fully self-contained.
  const [section, setSection] = useState<'quiz' | 'ear'>('quiz');
  const [earLevel, setEarLevel] = useState<EarLevel | null>(null);

  if (earLevel) {
    return <MakamEarFlow level={earLevel} onExit={() => setEarLevel(null)} />;
  }

  const levels: { level: QuizLevel; label: string; desc: string; count: number }[] = [
    { level: 'beginner', label: 'Beginner', desc: 'Seyir, families, and character', count: countQuestionsAtLevel('beginner') },
    { level: 'intermediate', label: 'Intermediate', desc: 'Durak, relationships, and finer traits', count: countQuestionsAtLevel('intermediate') },
    { level: 'advanced', label: 'Advanced', desc: 'Subtle distinctions between makams', count: countQuestionsAtLevel('advanced') },
  ];

  const earLevels: { level: EarLevel; label: string; desc: string }[] = [
    { level: 'beginner', label: 'Beginner', desc: 'Two contrasting makams — which did you hear?' },
    { level: 'intermediate', label: 'Intermediate', desc: 'Three makams, anchored on the durak' },
    { level: 'advanced', label: 'Advanced', desc: 'Full ID, same-family cousins — a real ear test' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Chrome traditionName="Turkish Makam" accent={COLORS.accent} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.heading}>Practice</Text>
          <Text style={styles.subheading}>
            {section === 'quiz'
              ? 'Three levels. Pass one to unlock the next.'
              : 'Listen to the ney, then name the makam. Replay as often as you like.'}
          </Text>
        </View>

        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segment, section === 'quiz' && styles.segmentActive]}
            onPress={() => setSection('quiz')}
            activeOpacity={0.85}
          >
            <Ionicons name="list" size={15} color={section === 'quiz' ? COLORS.background : COLORS.textSecondary} />
            <Text style={[styles.segmentText, section === 'quiz' && styles.segmentTextActive]}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, section === 'ear' && styles.segmentActive]}
            onPress={() => setSection('ear')}
            activeOpacity={0.85}
          >
            <Ionicons name="ear" size={15} color={section === 'ear' ? COLORS.background : COLORS.textSecondary} />
            <Text style={[styles.segmentText, section === 'ear' && styles.segmentTextActive]}>By ear</Text>
          </TouchableOpacity>
        </View>

        {section === 'quiz' ? (
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
        ) : !EAR_TRAINING_AVAILABLE ? (
          <View style={styles.levelCard}>
            <Text style={styles.levelDesc}>Ear training is unavailable — no playable makams found.</Text>
          </View>
        ) : (
          <View style={styles.levelList}>
            {earLevels.map(({ level, label, desc }) => (
              <TouchableOpacity
                key={level}
                style={styles.levelCard}
                activeOpacity={0.8}
                onPress={() => setEarLevel(level)}
              >
                <View style={styles.levelCardHeader}>
                  <View style={styles.levelTitleRow}>
                    <Ionicons name="musical-notes" size={15} color={COLORS.accent} />
                    <Text style={styles.levelLabel}>{label}</Text>
                  </View>
                </View>
                <Text style={styles.levelDesc}>{desc}</Text>
                <View style={styles.levelStartRow}>
                  <Text style={styles.levelStartText}>Start listening</Text>
                  <Ionicons name="arrow-forward" size={15} color={COLORS.accent} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ear training: "Name that makam by ear". Self-contained — drives the shared
// ney engine (audio/audioEngine.ts) via playScale. The ney is the *only* engine
// makam ear training uses. Only makams the engine can anchor at a correct root
// are eligible (see earTraining.ts / PLAYABLE_MAKAM_IDS).
// ─────────────────────────────────────────────────────────────────────────────
const EAR_SESSION_LENGTH = 8;
const ANCHOR_TO_PHRASE_GAP = 520;   // ms of silence between the durak and the scale
const AB_GAP = 650;                 // ms of silence between A/B candidates

function MakamEarFlow({ level, onExit }: { level: EarLevel; onExit: () => void }) {
  const { recordQuizAnswer } = useProgress();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [questions, setQuestions] = useState<EarQuestion[]>(() => buildMakamEarSession(level, EAR_SESSION_LENGTH));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [activity, setActivity] = useState<'idle' | 'anchor' | 'phrase' | 'compare'>('idle');
  const [hasPlayed, setHasPlayed] = useState(false);
  // Celebratory overlay: streak milestones + a strong finish.
  const [reward, setReward] = useState<{ kind: 'streak' | 'daily'; title: string; subtitle?: string } | null>(null);

  const question = questions[index];

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };
  const stopAll = () => {
    clearTimers();
    audioEngine.stop();
    setActivity('idle');
  };

  // Stop the ney + timers when leaving the flow.
  useEffect(() => () => { clearTimers(); audioEngine.stop(); }, []);

  // Play the durak anchor ("home"), then after a breath of silence the scale.
  // Both go through audioEngine.playScale with the makam's id, so the engine
  // places them at the makam's true sounding root (ROOT_OFFSETS).
  const playAnchoredPhrase = (makamId: string, anchor: number[], phrase: number[], onEnd?: () => void) => {
    setActivity('anchor');
    audioEngine.playScale(makamId, anchor, (state) => {
      if (state !== 'stopped') return;
      const t = setTimeout(() => {
        setActivity('phrase');
        audioEngine.playScale(makamId, phrase, (s2) => {
          if (s2 === 'stopped') { setActivity('idle'); onEnd?.(); }
        });
      }, ANCHOR_TO_PHRASE_GAP);
      timersRef.current.push(t);
    });
  };

  // The main Play / Replay: durak first, then the makam you must identify.
  const playItem = () => {
    if (!question) return;
    stopAll();
    setHasPlayed(true);
    playAnchoredPhrase(question.makamId, question.anchorCents, question.phraseCents);
  };

  // Auto-play "durak → scale" once each new question appears.
  useEffect(() => {
    if (done || !question) return;
    const t = setTimeout(() => playItem(), 350);
    timersRef.current.push(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, done]);

  // A/B compare: play each candidate's scale (each prefixed by the SAME durak
  // anchor, placed at that candidate's own root) so they can be weighed.
  const compareOptions = () => {
    if (!question) return;
    stopAll();
    setHasPlayed(true);
    setActivity('compare');
    const opts = question.options;
    const runFrom = (i: number) => {
      if (i >= opts.length) { setActivity('idle'); return; }
      const opt = opts[i];
      setActivity('anchor');
      audioEngine.playScale(opt.makamId, question.anchorCents, (state) => {
        if (state !== 'stopped') return;
        const t1 = setTimeout(() => {
          setActivity('phrase');
          audioEngine.playScale(opt.makamId, opt.cents, (s2) => {
            if (s2 !== 'stopped') return;
            const t2 = setTimeout(() => runFrom(i + 1), AB_GAP);
            timersRef.current.push(t2);
          });
        }, ANCHOR_TO_PHRASE_GAP);
        timersRef.current.push(t1);
      });
    };
    runFrom(0);
  };

  const handleSelect = (value: string) => {
    if (showAnswer) return;
    stopAll();
    setSelected(value);
    setShowAnswer(true);
    const correct = value === question.correctAnswer;
    if (correct) {
      setScore((s) => s + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      // Celebrate notable streaks (every 3 in a row) without nagging.
      if (nextStreak >= 3 && nextStreak % 3 === 0) {
        setReward({ kind: 'streak', title: `${nextStreak} in a row`, subtitle: 'Your ear is locking in.' });
      }
    } else setStreak(0);
    recordQuizAnswer('turkish-makam', question.makamId, correct);
  };

  const handleNext = () => {
    stopAll();
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected(null);
      setShowAnswer(false);
      setHasPlayed(false);
    } else {
      // The final answer is already scored, so `score` is current here.
      if (score / questions.length >= 0.7) {
        setReward({ kind: 'daily', title: 'Good ears', subtitle: `${score} of ${questions.length} by ear.` });
      }
      setDone(true);
    }
  };

  const restart = () => {
    stopAll();
    setReward(null);
    setQuestions(buildMakamEarSession(level, EAR_SESSION_LENGTH));
    setIndex(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setStreak(0);
    setDone(false);
    setHasPlayed(false);
  };

  if (done) {
    return <EarResultView score={score} total={questions.length} onRestart={onExit} onRetry={restart} />;
  }

  const progress = (index + 1) / questions.length;
  const isCorrect = selected === question.correctAnswer;
  const isBusy = activity !== 'idle';
  const playLabel =
    activity === 'anchor' ? 'Durak…' :
    activity === 'phrase' ? 'Listen…' :
    activity === 'compare' ? 'Comparing…' :
    hasPlayed ? 'Replay' : 'Play';

  const kicker =
    question.task === 'ab' ? 'Which makam?'
    : question.task === 'three' ? 'Name that makam'
    : 'Name that makam';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => { stopAll(); onExit(); }} style={styles.quitButton}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.questionCount}>{index + 1} / {questions.length}</Text>
        <Bounce trigger={score} style={styles.scorePillRow}>
          {streak >= 2 && <Text style={styles.streakPill}>{streak}🔥</Text>}
          <Text style={styles.scoreDisplay}>{score} ✓</Text>
        </Bounce>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.earKicker}>{kicker}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        <BreathingView active={!isBusy && !hasPlayed && !showAnswer}>
          <TouchableOpacity
            style={[styles.playButton, isBusy && styles.playButtonActive]}
            onPress={isBusy ? stopAll : playItem}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isBusy ? 'stop' : hasPlayed ? 'refresh' : 'play'}
              size={26}
              color={COLORS.background}
            />
            <Text style={styles.playButtonText}>{isBusy ? 'Stop' : playLabel}</Text>
          </TouchableOpacity>
        </BreathingView>

        {/* A/B compare — hear every candidate, each anchored on its durak */}
        <TouchableOpacity
          style={styles.compareButton}
          onPress={compareOptions}
          activeOpacity={0.85}
          disabled={isBusy}
        >
          <Ionicons name="git-compare" size={16} color={isBusy ? COLORS.textTertiary : COLORS.accent} />
          <Text style={[styles.compareButtonText, isBusy && { color: COLORS.textTertiary }]}>
            {question.task === 'ab' ? 'Compare the two' : 'Compare the options'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.earHint}>
          {showAnswer
            ? `Played on the ney, anchored on the durak (${question.durak}).`
            : 'You hear the durak first, then the makam. Replay or compare as needed.'}
        </Text>

        <View style={styles.optionsGrid}>
          {question.options.map((opt: EarOption) => {
            const isSelected = selected === opt.value;
            const isCorrectOption = opt.value === question.correctAnswer;
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
              <Pop key={opt.value} trigger={showAnswer && isCorrectOption}>
                <TouchableOpacity
                  style={optionStyle}
                  onPress={() => handleSelect(opt.value)}
                  activeOpacity={showAnswer ? 1 : 0.8}
                >
                  {showAnswer && isCorrectOption && (
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  )}
                  {showAnswer && isSelected && !isCorrectOption && (
                    <Ionicons name="close-circle" size={16} color={COLORS.warning} />
                  )}
                  <Text style={textStyle}>{opt.label}</Text>
                </TouchableOpacity>
              </Pop>
            );
          })}
        </View>

        {showAnswer && (
          <View style={[styles.explanationCard, { borderLeftColor: isCorrect ? COLORS.success : COLORS.warning }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'sparkles' : 'information-circle'}
                size={16}
                color={isCorrect ? COLORS.success : COLORS.warning}
              />
              <Text style={[styles.explanationLabel, { color: isCorrect ? COLORS.success : COLORS.warning }]}>
                {isCorrect ? (streak >= 3 ? `Nice — ${streak} in a row!` : 'You heard it!') : 'Not quite'}
              </Text>
            </View>
            <View style={styles.revealRow}>
              <Text style={styles.revealMakam}>{question.makamName}</Text>
              <View style={styles.revealTag}>
                <Text style={styles.revealTagText}>{question.family} family · {question.seyir}</Text>
              </View>
            </View>
            <Text style={styles.explanationText}>{question.teaching}</Text>
            {question.mood.length > 0 && (
              <Text style={styles.revealMood}>{question.mood.slice(0, 3).join(' · ')}</Text>
            )}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {showAnswer && (
        <View style={styles.footer}>
          <PressableScale style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {index === questions.length - 1 ? 'See result' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </PressableScale>
        </View>
      )}

      <RewardBurst
        visible={!!reward}
        kind={reward?.kind ?? 'streak'}
        title={reward?.title ?? ''}
        subtitle={reward?.subtitle}
        accent={COLORS.accent}
        textPrimary={COLORS.textPrimary}
        textSecondary={COLORS.textSecondary}
        onDone={() => setReward(null)}
      />
    </SafeAreaView>
  );
}


function EarResultView({ score, total, onRestart, onRetry }: {
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
      <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.resultContainer}>
          <View style={[styles.scoreCircle, { borderColor: getColor() }]}>
            <Text style={[styles.scoreNumber, { color: getColor() }]}>{score}</Text>
            <Text style={styles.scoreTotal}>of {total}</Text>
          </View>
          <Text style={styles.percentage}>{percentage}%</Text>
          <Text style={styles.resultMessage}>{getMessage()}</Text>

          <PressableScale style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.restartText}>Back to practice</Text>
          </PressableScale>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Ionicons name="refresh" size={16} color={COLORS.accent} />
            <Text style={styles.retryText}>New ears</Text>
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
        <Bounce trigger={score}>
          <Text style={styles.scoreDisplay}>{score} ✓</Text>
        </Bounce>
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
              <Pop key={option} trigger={showAnswer && isCorrectOption}>
                <TouchableOpacity
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
              </Pop>
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
          <PressableScale style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>
              {questionNumber === total ? 'See result' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.background} />
          </PressableScale>
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


        <PressableScale style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>Back to practice</Text>
        </PressableScale>
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
  // Ear-training additions
  segmented: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: 4, marginBottom: SPACING.lg, gap: 4,
  },
  segment: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: RADIUS.sm,
  },
  segmentActive: { backgroundColor: COLORS.accent },
  segmentText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  segmentTextActive: { color: COLORS.background },
  earKicker: {
    fontSize: 11, fontWeight: '600', color: COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  playButton: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.lg,
    paddingVertical: 22, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  playButtonActive: { backgroundColor: COLORS.success },
  playButtonText: { fontSize: 18, fontWeight: '600', color: COLORS.background },
  earHint: {
    fontSize: 12, color: COLORS.textTertiary, textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scorePillRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakPill: { fontSize: 13, fontWeight: '700', color: COLORS.warning },
  compareButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  compareButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.accent },
  revealRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  revealMakam: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  revealTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full, backgroundColor: COLORS.accentMuted, borderWidth: 1, borderColor: COLORS.accent + '33' },
  revealTagText: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  revealMood: { fontSize: 12, color: COLORS.textTertiary, marginTop: SPACING.sm, fontStyle: 'italic' },
});

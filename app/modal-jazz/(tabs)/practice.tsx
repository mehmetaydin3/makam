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
import { buildLeveledQuizSession, countQuestionsAtLevel, QuizQuestion, QuizLevel, getRandomVideoId } from '../../../data/traditions/modal-jazz/quiz';
import { buildEarSession, EarQuestion, EarLevel } from '../../../data/traditions/modal-jazz/earTraining';
import RhodesEngine, { RhodesEngineRef } from '../../../data/traditions/modal-jazz/RhodesEngine';
import { useProgress } from '../../../hooks/useProgress';
import { QUIZ_PASS_THRESHOLD, nextQuizLevel } from '../../../data/progress';
import { JAZZ_COLORS, SPACING, RADIUS } from '../../../data/traditions/modal-jazz/theme';
import { Chrome } from '../../../components/chrome';
import { RewardBurst } from '../../../components/rewards';
import { PressableScale, Pop, Bounce, BreathingView } from '../../../components/common/motion';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = (SCREEN_WIDTH - SPACING.lg * 2) * 9 / 16;

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
  // Store random video ID per question so it doesn't change on re-render
  const sessionVideoIds = useRef<Record<string, string | null>>({});

  const startLevel = (level: QuizLevel) => {
    const session = buildLeveledQuizSession(level, 10);
    const videoMap: Record<string, string | null> = {};
    session.forEach(q => { videoMap[q.id] = getRandomVideoId(q); });
    sessionVideoIds.current = videoMap;
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
    // Feed the mastery model: correct, mode-tagged answers deepen that mode.
    recordQuizAnswer('modal-jazz', question.modeId, isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setQuizState('question');
    } else {
      setFinalScore(newScore);
      // Pass check: >= threshold unlocks the next level (persists).
      const pct = newScore / questions.length;
      const next = nextQuizLevel(currentLevel);
      if (pct >= QUIZ_PASS_THRESHOLD && next && !isQuizLevelUnlocked('modal-jazz', next)) {
        unlockQuizLevel('modal-jazz', next);
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
        isUnlocked={(lvl) => isQuizLevelUnlocked('modal-jazz', lvl)}
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
          accent={JAZZ_COLORS.accent}
          textPrimary={JAZZ_COLORS.textPrimary}
          textSecondary={JAZZ_COLORS.textSecondary}
          onDone={() => setReward(null)}
        />
      </>
    );
  }

  const question = questions[currentIndex];
  const videoId = sessionVideoIds.current[question.id] ?? null;

  return (
    <QuestionView
      question={question}
      questionNumber={currentIndex + 1}
      total={questions.length}
      selectedAnswer={selectedAnswer}
      showAnswer={quizState === 'answer'}
      score={score}
      videoId={videoId}
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
  // Two practice modes share the home screen: the multiple-choice Quiz and the
  // new "By ear" ear-training. The ear flow is self-contained (EarTrainingFlow)
  // and owns its own Rhodes engine, so it never disturbs the quiz.
  const [section, setSection] = useState<'quiz' | 'ear'>('quiz');
  const [earLevel, setEarLevel] = useState<EarLevel | null>(null);

  if (earLevel) {
    return <EarTrainingFlow level={earLevel} onExit={() => setEarLevel(null)} />;
  }

  const levels: { level: QuizLevel; label: string; desc: string; count: number }[] = [
    { level: 'beginner', label: 'Beginner', desc: 'The core modes and their colors', count: countQuestionsAtLevel('beginner') },
    { level: 'intermediate', label: 'Intermediate', desc: 'Chord context and finer distinctions', count: countQuestionsAtLevel('intermediate') },
    { level: 'advanced', label: 'Advanced', desc: 'Subtle theory and modal interchange', count: countQuestionsAtLevel('advanced') },
  ];

  const earLevels: { level: EarLevel; label: string; desc: string }[] = [
    { level: 'beginner', label: 'Brighter or Darker?', desc: 'Hear home, then one mode — just call the feeling' },
    { level: 'intermediate', label: 'Same Color', desc: 'Three modes share a color — which did you hear?' },
    { level: 'advanced', label: 'Name the Mode', desc: 'Full mode ID, anchored to home — a real ear test' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Chrome traditionName="Modal Jazz" accent={JAZZ_COLORS.accent} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.heading}>Practice</Text>
          <Text style={styles.subheading}>
            {section === 'quiz'
              ? 'Three levels. Pass one to unlock the next.'
              : 'Hear home, then the mode. Three levels, from easy to expert.'}
          </Text>
        </View>

        {/* Segmented toggle: Quiz vs By ear */}
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segment, section === 'quiz' && styles.segmentActive]}
            onPress={() => setSection('quiz')}
            activeOpacity={0.85}
          >
            <Ionicons name="list" size={15} color={section === 'quiz' ? JAZZ_COLORS.background : JAZZ_COLORS.textSecondary} />
            <Text style={[styles.segmentText, section === 'quiz' && styles.segmentTextActive]}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, section === 'ear' && styles.segmentActive]}
            onPress={() => setSection('ear')}
            activeOpacity={0.85}
          >
            <Ionicons name="ear" size={15} color={section === 'ear' ? JAZZ_COLORS.background : JAZZ_COLORS.textSecondary} />
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
                      {!unlocked && <Ionicons name="lock-closed" size={14} color={JAZZ_COLORS.textTertiary} />}
                    </View>
                    <Text style={styles.levelCount}>{count} questions</Text>
                  </View>
                  <Text style={[styles.levelDesc, !unlocked && styles.levelLabelLocked]}>
                    {unlocked ? desc : `Score 70% on ${prev} to unlock`}
                  </Text>
                  {unlocked && (
                    <View style={styles.levelStartRow}>
                      <Text style={styles.levelStartText}>Start</Text>
                      <Ionicons name="arrow-forward" size={15} color={JAZZ_COLORS.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
                    <Ionicons name="musical-notes" size={15} color={JAZZ_COLORS.accent} />
                    <Text style={styles.levelLabel}>{label}</Text>
                  </View>
                </View>
                <Text style={styles.levelDesc}>{desc}</Text>
                <View style={styles.levelStartRow}>
                  <Text style={styles.levelStartText}>Start listening</Text>
                  <Ionicons name="arrow-forward" size={15} color={JAZZ_COLORS.accent} />
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
// Ear training V2: "Hear the color of a mode". Self-contained — mounts its own
// RhodesEngine and runs an 8-question session generated at runtime from MODES.
//
// Every item is ANCHORED: we sound "home" (root → 5th → root) first, pause, then
// play the mode's phrase, so the color lands against a center rather than in the
// abstract. The Rhodes can't hold a drone, so the anchor is a clearly-sounded
// reference, replayable on demand. An A/B "Compare" control plays each candidate
// (each prefixed by the same anchor) back-to-back before the learner commits.
// Rhodes is the *only* engine jazz ear training uses.
// ─────────────────────────────────────────────────────────────────────────────
const EAR_SESSION_LENGTH = 8;
// Within an item: the anchor (root–5th→root) needs a clear breath before the
// phrase so the ear resets to "home" yet still holds it — ~600ms reads as a
// deliberate pause without dragging. Between A/B candidates the gap is longer so
// each anchored candidate lands as its own unit (between-item breath > within).
const ANCHOR_TO_PHRASE_GAP = 600;   // ms of silence between "home" and the phrase
const AB_GAP = 850;                 // ms of silence between A/B candidates

function EarTrainingFlow({ level, onExit }: { level: EarLevel; onExit: () => void }) {
  const { recordQuizAnswer } = useProgress();
  const engineRef = useRef<RhodesEngineRef>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [questions, setQuestions] = useState<EarQuestion[]>(() => buildEarSession(level, EAR_SESSION_LENGTH));
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
  // Teach-first: meet the session's first sound before being quizzed on anything.
  const [phase, setPhase] = useState<'teach' | 'quiz'>('teach');

  const question = questions[index];

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };
  const stopAll = () => {
    clearTimers();
    engineRef.current?.stop();
    setActivity('idle');
  };

  // Stop audio + timers when leaving the flow.
  useEffect(() => () => { clearTimers(); engineRef.current?.stop(); }, []);

  // Auto-play "home → phrase" once each new question appears.
  useEffect(() => {
    if (done || !question || phase !== 'quiz') return;
    const t = setTimeout(() => playItem(), 450); // brief settle before "home" sounds
    timersRef.current.push(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, done, phase]);

  // Play the anchor ("home"), then after a breath of silence the given phrase.
  const playAnchoredPhrase = (phrase: number[], onEnd?: () => void) => {
    setActivity('anchor');
    engineRef.current?.playScale(question.anchorNotes, undefined, () => {
      const t = setTimeout(() => {
        setActivity('phrase');
        engineRef.current?.playScale(phrase, undefined, () => {
          setActivity('idle');
          onEnd?.();
        });
      }, ANCHOR_TO_PHRASE_GAP);
      timersRef.current.push(t);
    });
  };

  // The main "Play / Replay": home, then the actual mode you must identify.
  const playItem = () => {
    if (!question) return;
    stopAll();
    setHasPlayed(true);
    playAnchoredPhrase(question.phraseNotes);
  };

  // "Hear home": just the anchor (root -> 5th -> root), any time.
  const playHome = () => {
    if (!question) return;
    stopAll();
    setActivity('anchor');
    engineRef.current?.playScale(question.anchorNotes, undefined, () => setActivity('idle'));
  };

  // After a wrong answer: play YOUR pick, then the right one, back to back.
  const playDifference = () => {
    if (!question || !selected) return;
    const mine = question.options.find((o) => o.value === selected);
    const right = question.options.find((o) => o.isCorrect);
    if (!mine || !right) return;
    stopAll();
    playAnchoredPhrase(mine.phraseNotes, () => {
      const t = setTimeout(() => playAnchoredPhrase(right.phraseNotes), AB_GAP);
      timersRef.current.push(t);
    });
  };

  // A/B compare: play each option's phrase (each prefixed by home) in turn, so
  // the learner can weigh the candidates before answering.
  const compareOptions = () => {
    if (!question) return;
    stopAll();
    setHasPlayed(true);
    setActivity('compare');
    const opts = question.options;
    const runFrom = (i: number) => {
      if (i >= opts.length) { setActivity('idle'); return; }
      setActivity('anchor');
      engineRef.current?.playScale(question.anchorNotes, undefined, () => {
        const t1 = setTimeout(() => {
          setActivity('phrase');
          engineRef.current?.playScale(opts[i].phraseNotes, undefined, () => {
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
    // Feed the same mastery model the quiz uses, tagged by mode.
    recordQuizAnswer('modal-jazz', question.modeId, correct);
  };

  const handleNext = () => {
    stopAll();
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected(null);
      setShowAnswer(false);
      setHasPlayed(false);
    } else {
      // The final answer is already scored (handleSelect ran on selection),
      // so `score` is current here — celebrate a strong finish.
      if (score / questions.length >= 0.7) {
        setReward({ kind: 'daily', title: 'Good ears', subtitle: `${score} of ${questions.length} by ear.` });
      }
      setDone(true);
    }
  };

  const restart = () => {
    stopAll();
    setReward(null);
    setQuestions(buildEarSession(level, EAR_SESSION_LENGTH));
    setIndex(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setStreak(0);
    setDone(false);
    setHasPlayed(false);
  };

  if (done) {
    return (
      <>
        <RhodesEngine ref={engineRef} />
        <EarResultView score={score} total={questions.length} onRestart={onExit} onRetry={restart} />
      </>
    );
  }

  const isTeachBusy = activity !== 'idle';

  // ── TEACH: meet the first sound before any question ────────────────────────
  if (phase === 'teach' && question) {
    return (
      <SafeAreaView style={styles.safe}>
        <RhodesEngine ref={engineRef} />
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => { stopAll(); onExit(); }} style={styles.quitButton}>
            <Ionicons name="close" size={22} color={JAZZ_COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.questionCount}>Warm up</Text>
          <View style={{ width: 22 }} />
        </View>
        <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.earKicker}>Meet the sound</Text>
          <Text style={styles.prompt}>{question.rootLabel} {question.modeName}</Text>
          <Text style={styles.earInstruction}>
            Before you're asked anything, just listen. Home plays first, then the mode.
            {'\n'}Listen for {question.colorNote}.
          </Text>
          <BreathingView active={!isTeachBusy}>
            <TouchableOpacity
              style={[styles.playButton, isTeachBusy && styles.playButtonActive]}
              onPress={isTeachBusy ? stopAll : playItem}
              activeOpacity={0.85}
            >
              <Ionicons name={isTeachBusy ? 'stop' : 'play'} size={26} color={JAZZ_COLORS.background} />
              <Text style={styles.playButtonText}>{isTeachBusy ? 'Stop' : hasPlayed ? 'Hear it again' : 'Play it'}</Text>
            </TouchableOpacity>
          </BreathingView>
          <Text style={styles.earHint}>
            {`That ${question.colorNote} floating over home — that's the sound that makes it ${question.modeName}.`}
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <PressableScale style={styles.nextButton} onPress={() => { stopAll(); setHasPlayed(false); setPhase('quiz'); }}>
            <Text style={styles.nextButtonText}>I'm ready — quiz me</Text>
            <Ionicons name="arrow-forward" size={16} color={JAZZ_COLORS.background} />
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (index + 1) / questions.length;
  const isCorrect = selected === question.correctAnswer;
  const isBusy = activity !== 'idle';
  const playLabel =
    activity === 'anchor' ? 'Home…' :
    activity === 'phrase' ? 'Listen…' :
    hasPlayed ? 'Replay' : 'Play';
  const playIcon = isBusy ? 'musical-note' : hasPlayed ? 'refresh' : 'play';

  return (
    <SafeAreaView style={styles.safe}>
      <RhodesEngine ref={engineRef} />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => { stopAll(); onExit(); }} style={styles.quitButton}>
          <Ionicons name="close" size={22} color={JAZZ_COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.questionCount}>{index + 1} / {questions.length}</Text>
        <Bounce trigger={score} style={styles.scorePillRow}>
          {streak >= 2 && (
            <Text style={styles.streakPill}>{streak}🔥</Text>
          )}
          <Text style={styles.scoreDisplay}>{score} ✓</Text>
        </Bounce>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.earKicker}>
          {question.mode === 'brightness' ? 'Bright or dark?'
            : 'Which mode?'}
        </Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        {/* Always-visible instruction: spell out exactly what to do. */}
        <Text style={styles.earInstruction}>
          {question.mode === 'brightness'
            ? 'Tap Play to hear it, then choose what you heard. Not sure? Tap Hear bright vs dark.'
            : 'Tap Play to hear it, then choose the mode you heard. Not sure? Tap Hear each option.'}
        </Text>

        {/* Big Play / Replay control — sounds home, then the mode.
            A subtle breathing pulse invites the first tap. */}
        <BreathingView active={!isBusy && !hasPlayed && !showAnswer}>
          <TouchableOpacity
            style={[styles.playButton, isBusy && styles.playButtonActive]}
            onPress={isBusy ? stopAll : playItem}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isBusy ? 'stop' : (playIcon as any)}
              size={26}
              color={JAZZ_COLORS.background}
            />
            <Text style={styles.playButtonText}>{isBusy ? 'Stop' : playLabel}</Text>
          </TouchableOpacity>
        </BreathingView>

        {/* A/B compare — hear every candidate, each anchored to home */}
        <TouchableOpacity
          style={styles.compareButton}
          onPress={compareOptions}
          activeOpacity={0.85}
          disabled={isBusy}
        >
          <Ionicons name="git-compare" size={16} color={isBusy ? JAZZ_COLORS.textTertiary : JAZZ_COLORS.accent} />
          <Text style={[styles.compareButtonText, isBusy && { color: JAZZ_COLORS.textTertiary }]}>
            {question.mode === 'brightness' ? 'Hear bright vs dark' : 'Hear each option'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.compareButton}
          onPress={playHome}
          activeOpacity={0.85}
          disabled={isBusy}
        >
          <Ionicons name="home" size={15} color={isBusy ? JAZZ_COLORS.textTertiary : JAZZ_COLORS.accent} />
          <Text style={[styles.compareButtonText, isBusy && { color: JAZZ_COLORS.textTertiary }]}>
            Hear home ({question.rootLabel})
          </Text>
        </TouchableOpacity>

        <Text style={styles.earHint}>
          {showAnswer
            ? `Anchored in ${question.rootLabel} — home was the low ${question.rootLabel}.`
            : 'Each Play sounds “home” first, then the phrase you’re identifying.'}
        </Text>

        <View style={styles.optionsGrid}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            const isCorrectOption = opt.value === question.correctAnswer;
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            if (showAnswer) {
              if (isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, color: JAZZ_COLORS.success };
              } else if (isSelected && !isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionWrong };
                textStyle = { ...styles.optionText, color: JAZZ_COLORS.warning };
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
                    <Ionicons name="checkmark-circle" size={16} color={JAZZ_COLORS.success} />
                  )}
                  {showAnswer && isSelected && !isCorrectOption && (
                    <Ionicons name="close-circle" size={16} color={JAZZ_COLORS.warning} />
                  )}
                  <Text style={textStyle}>{opt.label}</Text>
                </TouchableOpacity>
              </Pop>
            );
          })}
        </View>

        {showAnswer && (
          <View style={[styles.explanationCard, { borderLeftColor: isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'sparkles' : 'information-circle'}
                size={16}
                color={isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning}
              />
              <Text style={[styles.explanationLabel, { color: isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning }]}>
                {isCorrect ? (streak >= 3 ? `Nice — ${streak} in a row!` : 'You heard it!') : 'Not quite'}
              </Text>
            </View>
            <View style={styles.revealRow}>
              <View style={[styles.brightnessTag, {
                backgroundColor: (question.brightness === 'bright' ? JAZZ_COLORS.bright
                  : question.brightness === 'dark' ? JAZZ_COLORS.dark
                  : JAZZ_COLORS.neutral) + '22',
              }]}>
                <Text style={[styles.brightnessTagText, {
                  color: question.brightness === 'bright' ? JAZZ_COLORS.bright
                    : question.brightness === 'dark' ? JAZZ_COLORS.dark
                    : JAZZ_COLORS.neutral,
                }]}>
                  {question.oneWord}
                </Text>
              </View>
              <Text style={styles.revealMode}>{question.rootLabel} {question.modeName}</Text>
            </View>
            <Text style={styles.explanationText}>
              {`That ${question.colorNote} you heard floating over home — that's what makes it ${question.modeName}.`}
            </Text>
            {!isCorrect && (
              <TouchableOpacity style={styles.compareButton} onPress={playDifference} activeOpacity={0.85} disabled={isBusy}>
                <Ionicons name="swap-horizontal" size={15} color={isBusy ? JAZZ_COLORS.textTertiary : JAZZ_COLORS.accent} />
                <Text style={[styles.compareButtonText, isBusy && { color: JAZZ_COLORS.textTertiary }]}>
                  Hear the difference — yours, then {question.modeName}
                </Text>
              </TouchableOpacity>
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
            <Ionicons name="arrow-forward" size={16} color={JAZZ_COLORS.background} />
          </PressableScale>
        </View>
      )}

      <RewardBurst
        visible={!!reward}
        kind={reward?.kind ?? 'streak'}
        title={reward?.title ?? ''}
        subtitle={reward?.subtitle}
        accent={JAZZ_COLORS.accent}
        textPrimary={JAZZ_COLORS.textPrimary}
        textSecondary={JAZZ_COLORS.textSecondary}
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
    if (percentage === 100) return JAZZ_COLORS.success;
    if (percentage >= 70) return JAZZ_COLORS.accent;
    return JAZZ_COLORS.warning;
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
            <Ionicons name="refresh" size={16} color={JAZZ_COLORS.accent} />
            <Text style={styles.retryText}>New ears</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestionView({
  question, questionNumber, total, selectedAnswer,
  showAnswer, score, videoId, onAnswer, onNext, onQuit,
}: {
  question: QuizQuestion; questionNumber: number; total: number;
  selectedAnswer: string | null; showAnswer: boolean; score: number;
  videoId: string | null;
  onAnswer: (a: string) => void; onNext: () => void; onQuit: () => void;
}) {
  const progress = questionNumber / total;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const showVideo = question.type === 'tune_name' && videoId;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onQuit} style={styles.quitButton}>
          <Ionicons name="close" size={22} color={JAZZ_COLORS.textPrimary} />
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
        {/* YouTube player for tune_name questions */}
        {showVideo && (
          <View style={styles.videoWrapper}>
            <Text style={styles.videoLabel}>Listen before you answer</Text>
            <YoutubePlayer
              height={PLAYER_HEIGHT}
              videoId={videoId!}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
              }}
              initialPlayerParams={{ rel: false, modestbranding: true }}
            />
          </View>
        )}

        <View style={styles.difficultyRow}>
          <View style={[styles.difficultyPill, {
            backgroundColor: question.difficulty === 'beginner'
              ? JAZZ_COLORS.success + '22'
              : question.difficulty === 'intermediate'
              ? JAZZ_COLORS.warning + '22'
              : JAZZ_COLORS.dark + '22',
          }]}>
            <Text style={[styles.difficultyText, {
              color: question.difficulty === 'beginner'
                ? JAZZ_COLORS.success
                : question.difficulty === 'intermediate'
                ? JAZZ_COLORS.warning
                : JAZZ_COLORS.dark,
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
                textStyle = { ...styles.optionText, color: JAZZ_COLORS.success };
              } else if (isSelected && !isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionWrong };
                textStyle = { ...styles.optionText, color: JAZZ_COLORS.warning };
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
                    <Ionicons name="checkmark-circle" size={16} color={JAZZ_COLORS.success} />
                  )}
                  {showAnswer && isSelected && !isCorrectOption && (
                    <Ionicons name="close-circle" size={16} color={JAZZ_COLORS.warning} />
                  )}
                  <Text style={textStyle}>{option}</Text>
                </TouchableOpacity>
              </Pop>
            );
          })}
        </View>

        {showAnswer && (
          <View style={[styles.explanationCard, { borderLeftColor: isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                size={16}
                color={isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning}
              />
              <Text style={[styles.explanationLabel, { color: isCorrect ? JAZZ_COLORS.success : JAZZ_COLORS.warning }]}>
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
            <Ionicons name="arrow-forward" size={16} color={JAZZ_COLORS.background} />
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
    if (percentage === 100) return JAZZ_COLORS.success;
    if (percentage >= 70) return JAZZ_COLORS.accent;
    return JAZZ_COLORS.warning;
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
            <Ionicons name="sparkles" size={18} color={JAZZ_COLORS.accent} />
            <Text style={styles.unlockText}>{levelLabel} level unlocked!</Text>
          </View>
        )}

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Correct</Text>
            <Text style={[styles.breakdownValue, { color: JAZZ_COLORS.success }]}>{score}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Incorrect</Text>
            <Text style={[styles.breakdownValue, { color: JAZZ_COLORS.warning }]}>{total - score}</Text>
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
          <Ionicons name="refresh" size={16} color={JAZZ_COLORS.accent} />
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: JAZZ_COLORS.background },
  homeContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  homeHeader: { paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  levelList: { gap: SPACING.md },
  levelCard: { backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: JAZZ_COLORS.border, padding: SPACING.lg, gap: 6 },
  levelCardLocked: { opacity: 0.55 },
  levelCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelLabel: { fontSize: 18, fontWeight: '500', color: JAZZ_COLORS.textPrimary },
  levelLabelLocked: { color: JAZZ_COLORS.textTertiary },
  levelCount: { fontSize: 12, color: JAZZ_COLORS.textTertiary },
  levelDesc: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 19 },
  levelStartRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  levelStartText: { fontSize: 14, fontWeight: '600', color: JAZZ_COLORS.accent },
  unlockBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: JAZZ_COLORS.accentMuted, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.lg },
  unlockText: { fontSize: 14, fontWeight: '600', color: JAZZ_COLORS.accent },
  heading: { fontSize: 40, fontWeight: '200', color: JAZZ_COLORS.textPrimary, letterSpacing: -1, marginBottom: 6 },
  subheading: { fontSize: 13, color: JAZZ_COLORS.textSecondary, lineHeight: 19 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: JAZZ_COLORS.warning + '44',
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  streakText: { fontSize: 14, color: JAZZ_COLORS.warning, fontWeight: '500' },
  quizCard: {
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: JAZZ_COLORS.border, padding: SPACING.lg,
  },
  quizCardTitle: { fontSize: 20, fontWeight: '500', color: JAZZ_COLORS.textPrimary, marginBottom: 4 },
  quizCardSubtitle: { fontSize: 13, color: JAZZ_COLORS.textTertiary, marginBottom: SPACING.lg },
  typeList: { gap: SPACING.md, marginBottom: SPACING.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  typeIconWrap: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    backgroundColor: JAZZ_COLORS.accentMuted, alignItems: 'center', justifyContent: 'center',
  },
  typeText: { flex: 1 },
  typeLabel: { fontSize: 14, color: JAZZ_COLORS.textPrimary, fontWeight: '500' },
  typeDesc: { fontSize: 12, color: JAZZ_COLORS.textTertiary },
  startButton: {
    backgroundColor: JAZZ_COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm,
  },
  startButtonText: { fontSize: 15, fontWeight: '600', color: JAZZ_COLORS.background },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
  },
  quitButton: { padding: 4 },
  questionCount: { fontSize: 13, color: JAZZ_COLORS.textSecondary },
  scoreDisplay: { fontSize: 13, color: JAZZ_COLORS.success, fontWeight: '600' },
  progressTrack: {
    height: 2, backgroundColor: JAZZ_COLORS.border,
    marginHorizontal: SPACING.lg, borderRadius: 1, marginBottom: SPACING.lg,
  },
  progressFill: { height: 2, backgroundColor: JAZZ_COLORS.accent, borderRadius: 1 },
  questionContent: { paddingHorizontal: SPACING.lg },
  videoWrapper: { marginBottom: SPACING.md },
  videoLabel: {
    fontSize: 11, fontWeight: '600', color: JAZZ_COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  difficultyRow: { marginBottom: SPACING.md },
  difficultyPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  difficultyText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  prompt: {
    fontSize: 22, fontWeight: '300', color: JAZZ_COLORS.textPrimary,
    lineHeight: 32, marginBottom: SPACING.xl,
  },
  optionsGrid: { gap: SPACING.sm, marginBottom: SPACING.lg },
  option: {
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: JAZZ_COLORS.border,
    padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
  },
  optionSelected: { borderColor: JAZZ_COLORS.accent, backgroundColor: JAZZ_COLORS.accentMuted },
  optionCorrect: { borderColor: JAZZ_COLORS.success, backgroundColor: JAZZ_COLORS.success + '11' },
  optionWrong: { borderColor: JAZZ_COLORS.warning, backgroundColor: JAZZ_COLORS.warning + '11' },
  optionDim: { opacity: 0.4 },
  optionText: { fontSize: 15, color: JAZZ_COLORS.textPrimary, flex: 1 },
  explanationCard: {
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md,
    borderLeftWidth: 3, padding: SPACING.md,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  explanationLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  explanationText: { fontSize: 14, color: JAZZ_COLORS.textSecondary, lineHeight: 22 },
  footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, paddingTop: SPACING.sm },
  nextButton: {
    backgroundColor: JAZZ_COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm,
  },
  nextButtonText: { fontSize: 15, fontWeight: '600', color: JAZZ_COLORS.background },
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
  scoreTotal: { fontSize: 13, color: JAZZ_COLORS.textTertiary },
  percentage: { fontSize: 48, fontWeight: '200', color: JAZZ_COLORS.textPrimary },
  resultMessage: {
    fontSize: 16, color: JAZZ_COLORS.textSecondary,
    textAlign: 'center', lineHeight: 24, maxWidth: 280,
  },
  breakdownCard: {
    backgroundColor: JAZZ_COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: JAZZ_COLORS.border, width: '100%', overflow: 'hidden',
  },
  breakdownRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: JAZZ_COLORS.border,
  },
  breakdownLabel: { fontSize: 14, color: JAZZ_COLORS.textSecondary },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: JAZZ_COLORS.textPrimary },
  restartButton: {
    backgroundColor: JAZZ_COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, width: '100%', alignItems: 'center',
  },
  restartText: { fontSize: 15, fontWeight: '600', color: JAZZ_COLORS.background },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: SPACING.md },
  retryText: { fontSize: 14, color: JAZZ_COLORS.accent },
  // Ear-training additions
  segmented: {
    flexDirection: 'row', backgroundColor: JAZZ_COLORS.surface,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.border,
    padding: 4, marginBottom: SPACING.lg, gap: 4,
  },
  segment: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: RADIUS.sm,
  },
  segmentActive: { backgroundColor: JAZZ_COLORS.accent },
  segmentText: { fontSize: 14, fontWeight: '600', color: JAZZ_COLORS.textSecondary },
  segmentTextActive: { color: JAZZ_COLORS.background },
  earKicker: {
    fontSize: 11, fontWeight: '600', color: JAZZ_COLORS.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  earInstruction: {
    fontSize: 14, color: JAZZ_COLORS.textSecondary, lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  playButton: {
    backgroundColor: JAZZ_COLORS.accent, borderRadius: RADIUS.lg,
    paddingVertical: 22, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  playButtonActive: { backgroundColor: JAZZ_COLORS.success },
  playButtonText: { fontSize: 18, fontWeight: '600', color: JAZZ_COLORS.background },
  earHint: {
    fontSize: 12, color: JAZZ_COLORS.textTertiary, textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scorePillRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakPill: { fontSize: 13, fontWeight: '700', color: JAZZ_COLORS.warning },
  compareButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, marginBottom: SPACING.sm,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: JAZZ_COLORS.accent,
    backgroundColor: JAZZ_COLORS.accentMuted,
  },
  compareButtonText: { fontSize: 14, fontWeight: '600', color: JAZZ_COLORS.accent },
  revealRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  brightnessTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  brightnessTagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  revealMode: { fontSize: 15, fontWeight: '600', color: JAZZ_COLORS.textPrimary },
});

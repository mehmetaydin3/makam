import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { buildDailyChallenge, dailyChallengeTitle, DailyQuestion } from '../../data/dailyChallenge';
import { RewardBurst } from '../../components/rewards';

const JAZZ_ACCENT = '#7B8FFF';

/**
 * Daily Challenge - one fresh, seeded quiz per day per tradition.
 *
 * Flow: intro -> question/answer loop -> result. Each correct answer feeds
 * recordQuizAnswer (XP + mastery + streak). Finishing logs the day's result
 * (recordDailyChallenge), which extends the streak and pops a reward burst.
 * Re-entering after completion shows the "done today" state instead of the run.
 */

type Phase = 'intro' | 'question' | 'answer' | 'result' | 'done';

export default function DailyChallengeScreen() {
  const router = useRouter();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const { tradition } = useLocalSearchParams();
  const traditionId = (tradition as string) === 'modal-jazz' ? 'modal-jazz' : 'turkish-makam';
  const isMakam = traditionId === 'turkish-makam';
  const accent = isMakam ? COLORS.accent : JAZZ_ACCENT;
  const unit = isMakam ? 'makam' : 'mode';
  const traditionName = isMakam ? 'Turkish Makam' : 'Modal Jazz';

  const { recordQuizAnswer, recordDailyChallenge, isDailyChallengeDone, dailyChallengeResult } = useProgress();

  const questions = useMemo<DailyQuestion[]>(() => buildDailyChallenge(traditionId), [traditionId]);
  const title = useMemo(() => dailyChallengeTitle(), []);

  const alreadyDone = isDailyChallengeDone(traditionId);
  const priorResult = dailyChallengeResult(traditionId);

  const [phase, setPhase] = useState<Phase>(alreadyDone ? 'done' : 'intro');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(priorResult?.score ?? 0);
  const [reward, setReward] = useState<{ title: string; subtitle: string } | null>(null);

  const q = questions[index];

  const start = () => {
    setPhase('question'); setIndex(0); setSelected(null); setScore(0);
  };

  const choose = (opt: string) => {
    if (phase !== 'question') return;
    setSelected(opt);
    setPhase('answer');
  };

  const next = async () => {
    const correct = selected === q.correctAnswer;
    await recordQuizAnswer(traditionId, q.targetId, correct);
    const newScore = correct ? score + 1 : score;
    setScore(newScore);
    if (index < questions.length - 1) {
      setIndex(index + 1); setSelected(null); setPhase('question');
    } else {
      setFinalScore(newScore);
      const res = await recordDailyChallenge(traditionId, newScore, questions.length);
      setPhase('result');
      if (res.firstToday) {
        setReward({
          title: 'Challenge complete!',
          subtitle: `+${res.xpAwarded} XP${res.streak > 0 ? `  -  ${res.streak} day streak` : ''}`,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={accent} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Daily Challenge</Text>
        <View style={styles.iconBtn} />
      </View>

      {phase === 'intro' && (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={[styles.heroIcon, { borderColor: accent }]}>
            <Ionicons name="sparkles" size={30} color={accent} />
          </View>
          <Text style={styles.eyebrow}>{traditionName.toUpperCase()}</Text>
          <Text style={styles.headline}>{title}</Text>
          <Text style={styles.sub}>
            {questions.length} quick questions, fresh today. Finish to extend your streak and earn XP - your stars brighten with every correct answer.
          </Text>
          <TouchableOpacity style={[styles.cta, { backgroundColor: accent }]} onPress={start} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Begin</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {(phase === 'question' || phase === 'answer') && q && (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.progressRow}>
            {questions.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.pip,
                  { backgroundColor: i < index ? accent : i === index ? accent : COLORS.border, opacity: i <= index ? 1 : 0.5 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.qCount}>Question {index + 1} of {questions.length}</Text>
          <Text style={styles.prompt}>{q.prompt}</Text>
          <View style={styles.options}>
            {q.options.map((opt) => {
              const isSel = selected === opt;
              const isCorrect = opt === q.correctAnswer;
              const showAnswer = phase === 'answer';
              let borderColor = COLORS.border;
              let bg = COLORS.surface;
              if (showAnswer && isCorrect) { borderColor = COLORS.success; bg = COLORS.success + '18'; }
              else if (showAnswer && isSel && !isCorrect) { borderColor = '#C25B52'; bg = '#C25B5218'; }
              else if (isSel) { borderColor = accent; }
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, { borderColor, backgroundColor: bg }]}
                  onPress={() => choose(opt)}
                  disabled={showAnswer}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, showAnswer && isCorrect && { color: COLORS.success }]}>{opt}</Text>
                  {showAnswer && isCorrect && <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />}
                  {showAnswer && isSel && !isCorrect && <Ionicons name="close-circle" size={18} color="#C25B52" />}
                </TouchableOpacity>
              );
            })}
          </View>
          {phase === 'answer' && (
            <View style={[styles.explainCard, { borderColor: COLORS.border }]}>
              <Text style={styles.explain}>{q.explanation}</Text>
              <TouchableOpacity style={[styles.cta, { backgroundColor: accent, marginTop: SPACING.md }]} onPress={next} activeOpacity={0.85}>
                <Text style={styles.ctaText}>{index < questions.length - 1 ? 'Next' : 'Finish'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {(phase === 'result' || phase === 'done') && (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={[styles.heroIcon, { borderColor: accent }]}>
            <Ionicons name="checkmark-done" size={30} color={accent} />
          </View>
          <Text style={styles.eyebrow}>{phase === 'done' ? "TODAY'S CHALLENGE" : 'DONE FOR TODAY'}</Text>
          <Text style={styles.headline}>
            {finalScore} / {questions.length} correct
          </Text>
          <Text style={styles.sub}>
            {phase === 'done'
              ? `You have already completed today's ${traditionName} challenge. A new one arrives tomorrow.`
              : `Nicely done. Come back tomorrow for a fresh ${unit} challenge to keep your streak alive.`}
          </Text>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: accent }]}
            onPress={() => router.push(`/journey/sky?tradition=${traditionId}` as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles-outline" size={16} color={COLORS.background} />
            <Text style={[styles.ctaText, { marginLeft: 6 }]}>See your sky</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => router.back()}>
            <Text style={[styles.secondaryText, { color: accent }]}>Back to Journey</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <RewardBurst
        visible={!!reward}
        kind="daily"
        title={reward?.title ?? ''}
        subtitle={reward?.subtitle}
        accent={accent}
        textPrimary={COLORS.textPrimary}
        textSecondary={COLORS.textSecondary}
        onDone={() => setReward(null)}
      />
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  body: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  heroIcon: { width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  headline: { fontSize: 30, fontWeight: '200', letterSpacing: -0.5, color: COLORS.textPrimary, marginTop: 6 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 10, lineHeight: 21 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 999, marginTop: SPACING.xl },
  ctaText: { fontSize: 15, fontWeight: '600', color: COLORS.background },
  secondary: { alignItems: 'center', paddingVertical: SPACING.md, marginTop: SPACING.sm },
  secondaryText: { fontSize: 14, fontWeight: '500' },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: SPACING.md },
  pip: { flex: 1, height: 4, borderRadius: 999 },
  qCount: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 1, textTransform: 'uppercase' },
  prompt: { fontSize: 21, fontWeight: '300', color: COLORS.textPrimary, marginTop: 8, lineHeight: 28 },
  options: { gap: SPACING.sm, marginTop: SPACING.lg },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18 },
  optionText: { fontSize: 15, color: COLORS.textPrimary, flex: 1 },
  explainCard: { borderWidth: 1, borderRadius: 14, padding: SPACING.md, marginTop: SPACING.lg },
  explain: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
});

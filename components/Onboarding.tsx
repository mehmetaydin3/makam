import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SPACING } from '../data/constants';

const { width } = Dimensions.get('window');
const KEY = 'makam_onboarding_v2';

const slides = [
  {
    key: 'welcome',
    eyebrow: 'TURKISH CLASSICAL MUSIC',
    title: 'Music that lives between the notes.',
    body: 'Western scales divide sound into 12 equal parts. Turkish makam uses 53 — creating intervals that exist nowhere on a piano. That is where the emotion lives.',
    accent: '#C8975A',
    isLast: false,
    quote: null,
  },
  {
    key: 'makam',
    eyebrow: 'MORE THAN A SCALE',
    title: 'Each makam is a world.',
    body: 'Rast is a morning makam — bright, grounded, hopeful. Hicaz burns with the drama of distant lands. Huzzam descends into grief that no Western scale can reach.',
    accent: '#A0785A',
    isLast: false,
    quote: 'Rast · Hicaz · Uşşak · Saba · Huzzam',
  },
  {
    key: 'explore',
    eyebrow: 'YOUR GUIDE',
    title: 'Start anywhere. Go deep.',
    body: 'Browse 19 makams by mood, family, or rhythm. Hear the ney play each scale. Read the theory. Search by song.',
    accent: '#C8975A',
    isLast: true,
    quote: null,
  },
];

export async function hasSeenOnboarding(): Promise<boolean> {
  try { return (await SecureStore.getItemAsync(KEY)) === 'true'; } catch { return false; }
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleNext = () => {
    const next = currentIndex + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setCurrentIndex(next);
  };

  const handleComplete = async () => {
    try { await SecureStore.setItemAsync(KEY, 'true'); } catch {}
    onComplete();
  };

  const slide = slides[currentIndex];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView ref={scrollRef} horizontal pagingEnabled scrollEnabled={false} showsHorizontalScrollIndicator={false}>
        {slides.map((s) => (
          <View key={s.key} style={styles.slide}>
            <View style={styles.content}>
              <Text style={styles.eyebrow}>{s.eyebrow}</Text>
              <Text style={[styles.title, { color: s.accent }]}>{s.title}</Text>
              <View style={[styles.divider, { backgroundColor: s.accent }]} />
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && { width: 20, backgroundColor: slide.accent }]} />
        ))}
      </View>
      <View style={styles.buttonRow}>
        {!slide.isLast ? (
          <>
            <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: slide.accent }]}>
              <Text style={styles.nextText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleComplete} style={[styles.startButton, { backgroundColor: slide.accent }]}>
            <Text style={styles.nextText}>Begin Exploring</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0A0A0B', zIndex: 999 },
  slide: { width, flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl, paddingTop: 80 },
  content: { gap: SPACING.lg },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  title: { fontSize: 38, fontWeight: '200', letterSpacing: -1, lineHeight: 44 },
  divider: { width: 40, height: 2, borderRadius: 999 },
  body: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26 },
  quoteBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 8 },
  quoteText: { fontSize: 13, letterSpacing: 2, textAlign: 'center', fontWeight: '300' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: SPACING.lg },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: COLORS.border },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: 48 },
  skipButton: { padding: SPACING.md },
  skipText: { fontSize: 14, color: COLORS.textTertiary },
  nextButton: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 },
  startButton: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 999 },
  nextText: { fontSize: 15, fontWeight: '600', color: '#0A0A0B' },
});

import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SPACING } from '../data/constants';

const { width } = Dimensions.get('window');
const KEY = 'makam_onboarding_v1';

const slides = [
  { key: 'makam', eyebrow: 'THE SOUL OF TURKISH MUSIC', title: 'What is a Makam?', body: 'A makam is more than a scale. It is a world — carrying a mood, a time of day, a season, and a characteristic melodic movement passed down for centuries.\n\nEach makam has its own emotional gravity. Rast lifts the spirit at dawn. Uşşak aches with longing. Hicaz burns with the drama of distant lands.', accent: '#C8975A', isLast: false },
  { key: 'seyir', eyebrow: 'THE PATH OF THE MELODY', title: 'What is Seyir?', body: 'Seyir is the journey a makam takes — its characteristic melodic movement through the scale.\n\nSome makams ascend, rising from the root like the sun. Others descend, falling inward toward resolution. Others undulate, searching both directions before coming to rest.\n\nWithout seyir, a scale is just notes. With it, it becomes music.', accent: '#8B7355', isLast: false },
  { key: 'explore', eyebrow: 'YOUR GUIDE', title: 'How to Explore', body: 'Three paths await you.\n\n💡  DISCOVER — Browse all makams, feel their moods, understand their character.\n\n📖  MAKAMS — The full library. Every makam with its scale, seyir, and notable pieces.\n\n🏛  LEARN — Lessons on Turkish music theory, tuning, and musical families.', accent: '#C8975A', isLast: true },
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
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: SPACING.lg },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: COLORS.border },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: 48 },
  skipButton: { padding: SPACING.md },
  skipText: { fontSize: 14, color: COLORS.textTertiary },
  nextButton: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 },
  startButton: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 999 },
  nextText: { fontSize: 15, fontWeight: '600', color: '#0A0A0B' },
});

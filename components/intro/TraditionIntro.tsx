import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SPACING } from '../../data/constants';
import { TRADITION_INTROS, introSeenKey } from '../../data/traditionIntros';

const { width } = Dimensions.get('window');

export async function hasSeenIntro(traditionId: string): Promise<boolean> {
  try { return (await SecureStore.getItemAsync(introSeenKey(traditionId))) === 'true'; }
  catch { return false; }
}

/**
 * TraditionIntro — a reusable per-tradition intro pager. Shown on first entry
 * into a tradition and re-openable anytime via "About this tradition". Content
 * comes from data/traditionIntros; styling adapts to the tradition's accent.
 */
export function TraditionIntro({
  traditionId,
  accent,
  onClose,
}: {
  traditionId: string;
  accent: string;
  onClose: () => void;
}) {
  const slides = TRADITION_INTROS[traditionId] ?? [];
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  if (slides.length === 0) { onClose(); return null; }

  const isLast = index === slides.length - 1;
  const slide = slides[index];

  const next = () => {
    const n = index + 1;
    scrollRef.current?.scrollTo({ x: n * width, animated: true });
    setIndex(n);
  };

  const done = async () => {
    try { await SecureStore.setItemAsync(introSeenKey(traditionId), 'true'); } catch {}
    onClose();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <ScrollView ref={scrollRef} horizontal pagingEnabled scrollEnabled={false} showsHorizontalScrollIndicator={false}>
        {slides.map((s) => (
          <View key={s.key} style={styles.slide}>
            <View style={styles.content}>
              <Text style={styles.eyebrow}>{s.eyebrow}</Text>
              <Text style={[styles.title, { color: accent }]}>{s.title}</Text>
              <View style={[styles.divider, { backgroundColor: accent }]} />
              <Text style={styles.body}>{s.body}</Text>
              {s.quote ? (
                <View style={[styles.quoteBox, { borderColor: accent + '55' }]}>
                  <Text style={[styles.quoteText, { color: accent }]}>{s.quote}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && { width: 20, backgroundColor: accent }]} />
        ))}
      </View>

      <View style={styles.buttonRow}>
        {!isLast ? (
          <>
            <TouchableOpacity onPress={done} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={next} style={[styles.nextButton, { backgroundColor: accent }]}>
              <Text style={styles.nextText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={done} style={[styles.startButton, { backgroundColor: accent }]}>
            <Text style={styles.nextText}>Begin exploring</Text>
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

import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { COLORS, SPACING } from '../data/constants';
import { getLastTradition, setLastTradition, TraditionId } from '../lib/lastTradition';

const { width } = Dimensions.get('window');

// Picking Jazz first suppresses the Makam-specific in-tradition intro
// (components/Onboarding.tsx) so it doesn't appear out of context.
const MAKAM_INTRO_KEY = 'makam_onboarding_v3';

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    key: 'concept',
    eyebrow: 'MODAL MUSIC',
    title: 'Music as feeling,\nnot formula.',
    body:
      'Most music theory teaches you rules. Modal traditions teach you colors — each mode, each makam, is a distinct emotional world. The same notes, rearranged, become joy or grief or longing. This app is a guide to hearing that.',
  },
  {
    key: 'traditions',
    eyebrow: 'TWO TRADITIONS',
    title: 'Two ways\nof listening.',
    body:
      "Turkish Makam divides sound into 53 microtones, finding feeling in the spaces a piano can't reach. Modal Jazz takes seven Western modes and turns them into a language of mood. Different worlds — the same idea: that a scale can be a state of mind.",
  },
  {
    key: 'explore',
    eyebrow: 'HOW TO EXPLORE',
    title: 'Start anywhere.\nGo deep.',
    body:
      "Browse by feeling. Hear each scale played. Read the theory when you're ready — or just listen. There's no syllabus and no streak to keep. Wander, return, and let your ear lead.",
  },
];

type Choice = {
  id: TraditionId;
  name: string;
  tagline: string;
  accent: string;
  route: string;
};

const TRADITIONS: Choice[] = [
  {
    id: 'turkish-makam',
    name: 'Turkish Makam',
    tagline: 'The microtonal poetry of Anatolia — where the emotion lives between the notes.',
    accent: '#C8975A',
    route: '/turkish-makam',
  },
  {
    id: 'modal-jazz',
    name: 'Modal Jazz',
    tagline: 'The American conversation with the modes — seven colors of feeling.',
    accent: '#7B8FFF',
    route: '/modal-jazz',
  },
];

export default function Index() {
  const router = useRouter();
  const [resolved, setResolved] = useState<'loading' | 'intro' | TraditionId>('loading');
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getLastTradition().then((last) => {
      setResolved(last ?? 'intro');
    });
  }, []);

  useEffect(() => {
    if (resolved === 'intro') {
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    }
  }, [resolved]);

  if (resolved === 'turkish-makam') return <Redirect href={'/turkish-makam' as any} />;
  if (resolved === 'modal-jazz') return <Redirect href={'/modal-jazz' as any} />;
  if (resolved === 'loading') return <View style={styles.safe} />;

  const PICKER_INDEX = SLIDES.length; // picker is the page after the 3 slides
  const totalPages = SLIDES.length + 1;

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setIndex(i);
  };

  const onScroll = (e: any) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const choose = async (c: Choice) => {
    await setLastTradition(c.id);
    if (c.id === 'modal-jazz') {
      try { await SecureStore.setItemAsync(MAKAM_INTRO_KEY, 'true'); } catch {}
    }
    router.replace(c.route as any);
  };

  return (
    <Animated.View style={[styles.safe, { opacity: fade }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {SLIDES.map((s) => (
          <View key={s.key} style={styles.slide}>
            <View style={styles.slideContent}>
              <Text style={styles.eyebrow}>{s.eyebrow}</Text>
              <Text style={styles.title}>{s.title}</Text>
              <View style={styles.rule} />
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </View>
        ))}

        {/* Final page — the picker */}
        <View style={styles.slide}>
          <View style={styles.pickerContent}>
            <View style={styles.markRow}>
              <View style={[styles.diamond, { backgroundColor: '#C8975A' }]} />
              <View style={[styles.diamond, { backgroundColor: '#7B8FFF', marginLeft: -6 }]} />
            </View>
            <Text style={styles.eyebrow}>BEGIN HERE</Text>
            <Text style={styles.pickerTitle}>Choose where{'\n'}to start.</Text>
            <View style={styles.cards}>
              {TRADITIONS.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.85}
                  style={[styles.card, { borderColor: c.accent + '55' }]}
                  onPress={() => choose(c)}
                >
                  <View style={[styles.cardAccent, { backgroundColor: c.accent }]} />
                  <View style={styles.cardBody}>
                    <Text style={[styles.cardName, { color: c.accent }]}>{c.name}</Text>
                    <Text style={styles.cardTagline}>{c.tagline}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.footnote}>You can switch anytime from the chip at the top.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer: dots + next/skip (hidden on picker page) */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        {index < PICKER_INDEX ? (
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => goTo(PICKER_INDEX)} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo(index + 1)} style={styles.nextBtn}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0B' },
  pager: { flex: 1 },
  slide: { width, flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl },
  slideContent: { gap: SPACING.lg, paddingBottom: 80 },
  eyebrow: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 3, textTransform: 'uppercase' },
  title: { fontSize: 40, fontWeight: '200', letterSpacing: -1, lineHeight: 46, color: COLORS.textPrimary },
  rule: { width: 40, height: 2, borderRadius: 999, backgroundColor: COLORS.accent },
  body: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26 },
  // Picker page
  pickerContent: { gap: SPACING.md, paddingBottom: 80 },
  markRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  diamond: { width: 18, height: 18, borderRadius: 4, transform: [{ rotate: '45deg' }] },
  pickerTitle: { fontSize: 36, fontWeight: '200', letterSpacing: -1, lineHeight: 42, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  cards: { gap: SPACING.md, marginTop: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: COLORS.surface, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.lg, gap: 8 },
  cardName: { fontSize: 22, fontWeight: '400', letterSpacing: -0.3 },
  cardTagline: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
  footnote: { fontSize: 12, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.lg },
  // Footer
  footer: { paddingHorizontal: SPACING.xl, paddingBottom: 48, gap: SPACING.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.accent, width: 18 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navSpacer: { height: 48 },
  skipBtn: { padding: SPACING.md },
  skipText: { fontSize: 14, color: COLORS.textTertiary },
  nextBtn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999, backgroundColor: COLORS.accent },
  nextText: { fontSize: 15, fontWeight: '600', color: '#0A0A0B' },
});

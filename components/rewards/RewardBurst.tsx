import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * RewardBurst — a lightweight celebratory overlay shown when something good
 * happens: a star lights, a level unlocks, the streak extends, a daily
 * challenge is finished. A radial halo + a ring of particles scale-and-fade
 * out from the center while a title/subtitle rise into view. Tap (or the
 * auto-dismiss timer) closes it.
 *
 * Heavy / continuous animation is intentionally out of scope — this is a
 * single, self-resolving moment, theme-aware via the passed accent.
 */

export type RewardKind = 'star' | 'streak' | 'level' | 'daily';

const ICONS: Record<RewardKind, keyof typeof Ionicons.glyphMap> = {
  star: 'star',
  streak: 'flame',
  level: 'sparkles',
  daily: 'checkmark-done',
};

type Props = {
  visible: boolean;
  kind: RewardKind;
  title: string;
  subtitle?: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  onDone: () => void;
};

const { width } = Dimensions.get('window');
const PARTICLES = 10;

export function RewardBurst({ visible, kind, title, subtitle, accent, textPrimary, textSecondary, onDone }: Props) {
  const t = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    t.setValue(0); text.setValue(0);
    Animated.parallel([
      Animated.timing(t, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(text, { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const haloScale = t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 2.4] });
  const haloOpacity = t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.35, 0] });
  const iconScale = text.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.4, 1.15, 1] });

  return (
    <Pressable style={styles.overlay} onPress={onDone}>
      <View style={styles.center} pointerEvents="none">
        {/* Halo */}
        <Animated.View
          style={[
            styles.halo,
            { backgroundColor: accent, opacity: haloOpacity, transform: [{ scale: haloScale }] },
          ]}
        />
        {/* Particles */}
        {Array.from({ length: PARTICLES }).map((_, i) => {
          const ang = (i / PARTICLES) * Math.PI * 2;
          const dist = t.interpolate({ inputRange: [0, 1], outputRange: [0, 90] });
          const tx = Animated.multiply(dist, new Animated.Value(Math.cos(ang)));
          const ty = Animated.multiply(dist, new Animated.Value(Math.sin(ang)));
          return (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  backgroundColor: accent,
                  opacity: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
                  transform: [{ translateX: tx }, { translateY: ty }, { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) }],
                },
              ]}
            />
          );
        })}
        {/* Icon */}
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons name={ICONS[kind]} size={48} color={accent} />
        </Animated.View>
      </View>

      <Animated.View
        style={{
          opacity: text,
          transform: [{ translateY: text.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          alignItems: 'center', marginTop: 24,
        }}
      >
        <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: textSecondary }]}>{subtitle}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 100,
  },
  center: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 120, height: 120, borderRadius: 60 },
  particle: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: -0.3, textAlign: 'center' },
  subtitle: { fontSize: 14, marginTop: 6, textAlign: 'center', maxWidth: width * 0.7, lineHeight: 20 },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  AccessibilityInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * motion.tsx — tiny, additive animation helpers shared across the app.
 *
 * Everything here is built on React Native's stock `Animated` (no extra deps),
 * runs on the native driver (transform/opacity only, so it never blocks the JS
 * thread), and is purely decorative: removing any of it changes nothing about
 * behaviour. Each helper quietly respects the OS "reduce motion" setting.
 */

// Module-level cache of the reduce-motion preference, kept in sync with the OS.
let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { reduceMotion = v; }).catch(() => {});
AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v) => { reduceMotion = v; });

/** Subscribe to the reduce-motion preference for render-time decisions. */
export function useReduceMotion(): boolean {
  const [value, setValue] = useState(reduceMotion);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (alive) setValue(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v) => { if (alive) setValue(v); });
    return () => { alive = false; sub?.remove?.(); };
  }, []);
  return value;
}

/**
 * PressableScale — a drop-in Pressable that adds a subtle spring "press in"
 * scale (default 0.97). Use for primary CTAs. Forwards every Pressable prop, so
 * existing onPress / disabled / accessibility behaviour is unchanged.
 */
type PressableScaleProps = PressableProps & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};

export function PressableScale({ scaleTo = 0.97, style, children, ...rest }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) => {
    if (reduceMotion) return;
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => { animateTo(scaleTo); rest.onPressIn?.(e); }}
      onPressOut={(e) => { animateTo(1); rest.onPressOut?.(e); }}
    >
      <Animated.View style={[style as any, { transform: [{ scale }] }]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Pop — wraps content and plays a quick scale "pop" each time `trigger` flips
 * to a new truthy value (e.g. the moment an answer is revealed correct). Cheap,
 * self-resolving, native-driven. Layout is untouched.
 */
export function Pop({
  trigger,
  children,
  style,
  intensity = 1.08,
}: {
  trigger: boolean | number | string | null;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const prev = useRef(trigger);

  useEffect(() => {
    const changed = prev.current !== trigger;
    prev.current = trigger;
    if (!changed || !trigger || reduceMotion) return;
    scale.setValue(1);
    Animated.sequence([
      Animated.spring(scale, { toValue: intensity, useNativeDriver: true, speed: 50, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
  }, [trigger, intensity, scale]);

  return <Animated.View style={[style as any, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

/**
 * Bounce — a tiny one-shot vertical nudge + scale, good for a score/streak that
 * just changed. Plays whenever `trigger` changes value.
 */
export function Bounce({
  trigger,
  children,
  style,
}: {
  trigger: number | string | boolean | null;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useRef(new Animated.Value(0)).current;
  const prev = useRef(trigger);

  useEffect(() => {
    const changed = prev.current !== trigger;
    prev.current = trigger;
    if (!changed || reduceMotion) return;
    v.setValue(0);
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(v, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 10 }),
    ]).start();
  }, [trigger, v]);

  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <Animated.View style={[style as any, { transform: [{ translateY }, { scale }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * BreathingView — a very subtle, continuous idle pulse (opacity + scale) used to
 * make a "play" affordance gently invite a tap. Pauses (holds still) when
 * `active` is false or reduce-motion is on.
 */
export function BreathingView({
  active = true,
  style,
  children,
  minScale = 1,
  maxScale = 1.025,
  minOpacity = 0.92,
  duration = 1700,
}: {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  duration?: number;
}) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || reduceMotion) {
      v.stopAnimation();
      Animated.timing(v, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, duration, v]);

  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [minScale, maxScale] });
  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [minOpacity, 1] });

  return (
    <Animated.View style={[style as any, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

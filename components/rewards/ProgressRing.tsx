import { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * ProgressRing — an SVG-free circular progress ring.
 *
 * The app has no react-native-svg dependency, so the arc is drawn with the
 * classic two-half-disk mask technique: a circular track, then two rotating
 * half-rings clipped to left/right halves. For progress <= 0.5 only the right
 * half rotates; past 0.5 the right half is pinned at 180° and the left half
 * sweeps the remainder. The whole sweep animates on mount / when value changes.
 *
 * Renders any children centered inside the ring (e.g. a level number).
 */

type Props = {
  size: number;
  stroke: number;
  progress: number;       // 0..1
  color: string;
  trackColor: string;
  children?: React.ReactNode;
};

export function ProgressRing({ size, stroke, progress, color, trackColor, children }: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: p, duration: 700, delay: 120, useNativeDriver: true }).start();
  }, [p]);

  const half = size / 2;

  // Right half sweeps 0..180deg as progress goes 0..0.5.
  const rightRotate = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '180deg'],
  });
  // Left half sweeps 0..180deg as progress goes 0.5..1.
  const leftRotate = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  const ringStyle = (rotate: Animated.AnimatedInterpolation<string>): any => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: stroke,
    borderColor: color,
    // show only the right half of this ring by masking the left with transparent
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotateZ: '-45deg' }, { rotateZ: rotate }],
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Track */}
      <View
        style={{
          position: 'absolute', width: size, height: size, borderRadius: half,
          borderWidth: stroke, borderColor: trackColor,
        }}
      />
      {/* Right-half sweep (clipped to right side) */}
      <View style={[styles.clip, { width: half, height: size, left: half }]}>
        <Animated.View style={[ringStyle(rightRotate), { left: -half }]} />
      </View>
      {/* Left-half sweep (clipped to left side) */}
      <View style={[styles.clip, { width: half, height: size, left: 0 }]}>
        <Animated.View style={[ringStyle(leftRotate), { left: 0 }]} />
      </View>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { position: 'absolute', top: 0, overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
});

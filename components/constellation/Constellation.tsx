import { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

/**
 * Constellation — the living map of a tradition's modes.
 *
 * Each mode is a STAR whose brightness scales with mastery (0..5). Stars are
 * positioned in clusters by group (makam family / jazz brightness), with faint
 * lines linking stars within a group so the tradition's structure emerges as
 * the user progresses. Tapping a star fires onSelectStar(id).
 *
 * No SVG dependency — stars are absolutely-positioned animated Views, glow via
 * shadow + a halo ring. Lines are thin rotated Views between star centers.
 */

export type StarDatum = {
  id: string;
  name: string;
  group: string;      // family (makam) or brightness (jazz)
  level: number;      // mastery level 0..5
  covered: boolean;   // explored (deliberately visited)
};

type Props = {
  stars: StarDatum[];
  accent: string;
  width: number;
  height: number;
  onSelectStar?: (id: string) => void;
  selectedId?: string | null;
  compact?: boolean;  // preview mode (smaller, no labels, no interaction)
};

type Placed = StarDatum & { x: number; y: number };

// Deterministic pseudo-random from a string (stable star jitter per id).
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

// Lay out stars into cluster centers arranged on a loose grid, with jitter.
function layout(stars: StarDatum[], W: number, H: number, pad: number): { placed: Placed[]; groups: Record<string, Placed[]> } {
  const groups: Record<string, StarDatum[]> = {};
  for (const s of stars) (groups[s.group] ??= []).push(s);
  const groupNames = Object.keys(groups);
  const n = groupNames.length;

  // Arrange cluster centers on a grid (cols x rows) within the canvas.
  const cols = n <= 3 ? n : Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cellW = (W - pad * 2) / cols;
  const cellH = (H - pad * 2) / rows;

  const placed: Placed[] = [];
  const placedGroups: Record<string, Placed[]> = {};

  groupNames.forEach((g, gi) => {
    const col = gi % cols;
    const row = Math.floor(gi / cols);
    const cx = pad + cellW * (col + 0.5);
    const cy = pad + cellH * (row + 0.5);
    const members = groups[g];
    const clusterR = Math.min(cellW, cellH) * 0.32;
    placedGroups[g] = [];
    members.forEach((m, mi) => {
      // distribute members around the cluster center on a small ring + jitter
      const ang = (mi / Math.max(1, members.length)) * Math.PI * 2 + hash(m.id) * Math.PI;
      const rr = members.length === 1 ? 0 : clusterR * (0.5 + hash(m.id + 'r') * 0.6);
      const x = cx + Math.cos(ang) * rr + (hash(m.id + 'x') - 0.5) * 14;
      const y = cy + Math.sin(ang) * rr + (hash(m.id + 'y') - 0.5) * 14;
      const p: Placed = { ...m, x, y };
      placed.push(p);
      placedGroups[g].push(p);
    });
  });

  return { placed, groups: placedGroups };
}

// Visual size + opacity per mastery level.
function starVisual(level: number, compact: boolean) {
  const base = compact ? 3 : 5;
  const size = base + level * (compact ? 1.4 : 2.6);     // L0 small -> L5 large
  const opacity = level === 0 ? 0.18 : 0.4 + level * 0.12; // unlit faint, brighter by level
  const glow = level >= 4;                                 // halo at proficient+
  return { size, opacity, glow };
}

export function Constellation({ stars, accent, width, height, onSelectStar, selectedId, compact = false }: Props) {
  const pad = compact ? 14 : 44;
  const { placed, groups } = useMemo(() => layout(stars, width, height, pad), [stars, width, height, pad]);

  // Twinkle animation: each star fades/scales in with a staggered delay.
  const anims = useRef<Record<string, Animated.Value>>({}).current;
  placed.forEach((p) => { if (!anims[p.id]) anims[p.id] = new Animated.Value(0); });

  useEffect(() => {
    const seq = placed.map((p, i) =>
      Animated.timing(anims[p.id], {
        toValue: 1,
        duration: 420,
        delay: i * (compact ? 18 : 45),
        useNativeDriver: true,
      })
    );
    Animated.stagger(compact ? 18 : 45, seq).start();
  }, [placed.length]);

  // Build the family connector lines (within-group edges).
  const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  Object.values(groups).forEach((members) => {
    for (let i = 0; i < members.length - 1; i++) {
      const a = members[i], b = members[i + 1];
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: a.id + '-' + b.id });
    }
  });

  return (
    <View style={[styles.canvas, { width, height }]}>
      {/* Connector lines (within family) */}
      {lines.map((ln) => {
        const dx = ln.x2 - ln.x1, dy = ln.y2 - ln.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View
            key={ln.key}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: ln.x1,
              top: ln.y1,
              width: len,
              height: 1,
              backgroundColor: accent,
              opacity: compact ? 0.1 : 0.14,
              transform: [{ translateX: 0 }, { translateY: 0 }, { rotateZ: `${angle}deg` }],
              transformOrigin: 'left center',
            }}
          />
        );
      })}

      {/* Stars */}
      {placed.map((p) => {
        const { size, opacity, glow } = starVisual(p.level, compact);
        const a = anims[p.id];
        const isSel = selectedId === p.id;
        const StarTag: any = compact || !onSelectStar ? View : TouchableOpacity;
        return (
          <StarTag
            key={p.id}
            activeOpacity={0.7}
            onPress={onSelectStar ? () => onSelectStar(p.id) : undefined}
            style={{ position: 'absolute', left: p.x - 22, top: p.y - 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            {/* halo for high mastery */}
            {glow && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: size + 16, height: size + 16, borderRadius: (size + 16) / 2,
                  backgroundColor: accent, opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }),
                }}
              />
            )}
            <Animated.View
              style={{
                width: size, height: size, borderRadius: size / 2,
                backgroundColor: p.level === 0 ? '#8A8A99' : accent,
                opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0, opacity] }),
                transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.3, isSel ? 1.4 : 1] }) }],
                shadowColor: accent,
                shadowOpacity: glow ? 0.9 : 0,
                shadowRadius: glow ? 8 : 0,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
            {/* label (full mode only, for covered or selected stars) */}
            {!compact && (p.covered || isSel) && (
              <Animated.Text
                numberOfLines={1}
                style={{
                  position: 'absolute', top: 26, width: 80, textAlign: 'center',
                  fontSize: 9, color: isSel ? accent : '#9A9AA8',
                  opacity: a,
                }}
              >
                {p.name}
              </Animated.Text>
            )}
          </StarTag>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { position: 'relative' },
});

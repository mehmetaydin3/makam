/**
 * data/design-tokens.ts
 *
 * The single source of truth for all shared design tokens.
 * Per-tradition variable tokens (accent, accentMuted, motif) live in
 * data/traditions/{slug}/theme.ts — not here.
 *
 * Existing imports of COLORS, SPACING, RADIUS from data/constants.ts
 * continue to work unchanged. This file is additive.
 */

export const tokens = {

  // ─── Spatial ────────────────────────────────────────────────────────────────
  spacing: {
    xs:  4,
    sm:  8,
    md:  12,
    lg:  20,
    xl:  32,
    '2xl': 48,
  },

  radius: {
    sm:   8,
    md:   12,
    lg:   16,
    xl:   24,
    pill: 999,
  },

  // ─── Typography ─────────────────────────────────────────────────────────────
  type: {
    eyebrow:    { size: 11, weight: '600' as const, tracking: 2,    transform: 'uppercase' as const },
    heading:    { size: 40, weight: '200' as const, tracking: -1 },
    subheading: { size: 13, weight: '400' as const, lineHeight: 19 },
    body:       { size: 15, weight: '400' as const, lineHeight: 22 },
    cardTitle:  { size: 22, weight: '300' as const, tracking: -0.5 },
    cardMeta:   { size: 11, weight: '400' as const },
    label:      { size: 10, weight: '600' as const, tracking: 1.5, transform: 'uppercase' as const },
  },

  // ─── Color — shared, app-wide ───────────────────────────────────────────────
  // Tradition-specific accent/accentMuted live in each tradition's theme.ts
  color: {
    background:    '#0E0E0F',
    surface:       '#16161A',
    surfaceRaised: '#1E1E22',
    border:        '#26262C',
    textPrimary:   '#F2F2F4',
    textSecondary: '#A8A8B0',
    textTertiary:  '#6C6C74',
    error:         '#E5484D',
  },

} as const;

export type Tokens = typeof tokens;

import { COLORS } from '../../constants';

/**
 * Turkish Makam tradition theme.
 *
 * The variable tokens for a tradition are: id, name, tagline, accent, accentMuted, motif.
 * Everything else (background, surface, type ramp, spacing, radius) is shared across
 * traditions and lives in data/constants.ts and data/design-tokens.ts.
 *
 * To add a new tradition: create data/traditions/{slug}/theme.ts with the same shape.
 */
export const turkishMakamTheme = {
  id: 'turkish-makam' as const,
  name: 'Turkish Makam',
  tagline: 'The microtonal poetry of Anatolia.',

  // Visual identity
  accent: COLORS.accent,
  accentMuted: COLORS.accentMuted,
  motif: 'kilim' as const,

  // Audio identity (informational for now; will be consumed by audio engine routing later)
  audioEngine: 'react-native-sound' as const,
} as const;

export type TraditionTheme = typeof turkishMakamTheme;

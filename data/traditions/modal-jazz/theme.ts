import { COLORS, SPACING, RADIUS } from '../../constants';

/**
 * Modal Jazz tradition theme.
 *
 * Accent is the blue-violet from the Modality app icon (#7B8FFF) — chosen
 * over the icon's gold half because that gold is nearly identical to Turkish
 * Makam's kilim gold; the blue keeps the two traditions instantly distinct.
 *
 * Shares all structural tokens (spacing, radius, base palette) with
 * data/constants.ts. Only accent/accentMuted/motif vary per spec §10.2.
 */
export const modalJazzTheme = {
  id: 'modal-jazz' as const,
  name: 'Modal Jazz',
  tagline: 'The American conversation with the modes.',

  // Visual identity
  accent: '#7B8FFF',
  accentMuted: '#7B8FFF18',
  motif: 'staff' as const,

  // Audio identity (Rhodes electric piano engine, ported in 3d.2)
  audioEngine: 'rhodes' as const,
} as const;

export type ModalJazzTheme = typeof modalJazzTheme;

/**
 * JAZZ_COLORS — the palette the Modal Jazz screens import, exactly mirroring
 * the shape of Makam's COLORS so jazz screens read identically to makam ones.
 *
 * Base/text tokens are SHARED with Makam (app identity, not tradition identity).
 * What differs: accent (blue, not gold) + the brightness tags (bright/neutral/
 * dark) that jazz modes carry. This is the per-tradition override, centralized.
 */
export const JAZZ_COLORS = {
  // Base — shared with Makam
  background: COLORS.background,
  surface: COLORS.surface,
  surfaceRaised: COLORS.surfaceRaised,
  border: COLORS.border,

  // Text — shared with Makam
  textPrimary: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textTertiary: COLORS.textTertiary,

  // Accent — Modal Jazz blue-violet (the tradition override)
  accent: '#7B8FFF',
  accentMuted: '#7B8FFF22',

  // Brightness tags — jazz modes are tagged bright / neutral / dark
  bright: '#FFD166',
  neutral: '#7B8FFF',
  dark: '#A855C8',

  // Status
  warning: '#FFB347',

  // Utility — shared
  white: COLORS.white,
  black: COLORS.black,
  error: COLORS.error,
} as const;

// Re-export shared spacing/radius so jazz screens have one import site
export { SPACING, RADIUS };

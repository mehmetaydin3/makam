// ─── Typography ───────────────────────────────────────────────────────────────
export const FONTS = {
  // We'll use system fonts for now — clean and fast
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

// ─── Colors ───────────────────────────────────────────────────────────────────
export const COLORS = {
  // Base
  background: '#0E0E0F',
  surface: '#1A1A1C',
  surfaceRaised: '#222225',
  border: '#2A2A2E',

  // Text
  textPrimary: '#F0EDE8',
  textSecondary: '#8A8680',
  textTertiary: '#504E4A',

  // Accent — single warm gold
  accent: '#C8975A',
  accentMuted: '#C8975A22',

  // Seyir colors (subtle, for tags only)
  ascending: '#5A8A6A',
  descending: '#7A6E9E',
  undulating: '#B85C38',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  error: '#E05252',

  // Quiz feedback + difficulty (Practice tab)
  success: '#5A8A6A',
  warning: '#C8975A',
  dark: '#7A6E9E',
};

// ─── Colors (Light) ───────────────────────────────────────────────────────────
// Light counterpart to COLORS. The dark COLORS object above is kept byte-for-byte
// unchanged so there is zero dark regression; this is the additive light palette.
export const COLORS_LIGHT = {
  // Base
  background: '#FAF8F4',
  surface: '#FFFFFF',
  surfaceRaised: '#F1EEE8',
  border: '#E2DDD4',

  // Text
  textPrimary: '#1A1916',
  textSecondary: '#6B665E',
  textTertiary: '#A29C92',

  // Accent — same warm gold, slightly deepened for contrast on light
  accent: '#A9743A',
  accentMuted: '#A9743A1A',

  // Seyir colors (subtle, for tags only)
  ascending: '#3E6E4E',
  descending: '#5E5286',
  undulating: '#9C4622',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  error: '#C23838',

  // Quiz feedback + difficulty (Practice tab)
  success: '#3E6E4E',
  warning: '#A9743A',
  dark: '#5E5286',
};

export type ColorScheme = { [K in keyof typeof COLORS]: string };

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ─── Seyir Labels ─────────────────────────────────────────────────────────────
export const SEYIR_LABELS: Record<string, string> = {
  ascending: 'Ascending',
  descending: 'Descending',
  undulating: 'Undulating',
};

export const SEYIR_DESCRIPTIONS: Record<string, string> = {
  ascending: 'Melody rises from root upward',
  descending: 'Melody descends from high to root',
  undulating: 'Melody moves in both directions',
};

// ─── Feature Flags ───────────────────────────────────────────────────────────
// Ship switches for features that exist but aren't ready for users yet.
// Flip to true to restore the UI entry points — no other changes needed.
export const FEATURES = {
  /** "Dem · Play along" drone on makam detail screens. */
  dronePlayAlong: false,
  /** "By ear" ear-training sections in both Practice tabs. */
  earTraining: false,
} as const;

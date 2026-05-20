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
};

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

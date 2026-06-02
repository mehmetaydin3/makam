// Family color system — each makam family has one base color representing its
// emotional character; members are an evolving gradient of that base, so the
// family reads as a coherent color world rather than random per-makam hues.

// Base colors keyed by the family name used in the home screen's FAMILY_ORDER.
// (The "Hicazkar" group bundles Hicaz-family makams.)
export const FAMILY_BASE: Record<string, string> = {
  Rast:      '#C8975A', // warm gold — bright, joyful, "morning," major-like
  Neva:      '#C8975A', // Rast family
  Uşşak:     '#C98BA0', // soft rose — tender, longing, melancholic
  Hüseyni:   '#C98BA0', // Uşşak family
  Hicaz:     '#C75450', // deep crimson — dramatic, exotic, passionate
  Hicazkar:  '#C75450', // Hicaz family (Hicazkar/Kurdilihicazkar/Uzzal)
  Segah:     '#9B7BC8', // violet — mystical, transcendent, devotional
  Saba:      '#5E8AB4', // cool slate-blue — grief, weeping
  Kurd:      '#6E6E9E', // deep indigo — dark, solemn, introspective
  Nihavend:  '#5FA39A', // muted teal — melancholic minor
  Buselik:   '#6F8FB0', // steel blue — earnest, grounded
  Cargah:    '#D4B94E', // clear yellow — bright, uncomplicated, major-like
  Other:     '#8A8A99', // neutral fallback
};

// ── HSL helpers ──────────────────────────────────────────────────────────────
function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const lum = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lum > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue /= 6;
  }
  return [hue * 360, sat * 100, lum * 100];
}

function hslToHex(hh: number, ss: number, ll: number): string {
  const h = ((hh % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(100, ss)) / 100;
  const l = Math.max(0, Math.min(100, ll)) / 100;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/**
 * Derive a member's shade from the family base by its position in the family.
 * The gradient evolves across the family: a gentle hue drift plus a
 * lightness sweep, so members are clearly related yet individually distinct.
 */
export function familyShade(family: string | null | undefined, index: number, total: number): string {
  const base = (family && FAMILY_BASE[family]) || FAMILY_BASE.Other;
  return shadeFromBase(base, index, total);
}


// ── Jazz: brightness spectrum ────────────────────────────────────────────────
// Jazz modes group by brightness (bright/neutral/dark) — an ordered spectrum,
// not separate families. The three group bases form a luminance journey
// (warm-gold -> blue-violet -> deep purple); members evolve within each group.
export const BRIGHTNESS_BASE: Record<string, string> = {
  bright:  '#C8975A', // warm gold — at rest, major-leaning
  neutral: '#7B8FFF', // blue-violet — balanced
  dark:    '#9B6DD4', // deep purple — brooding, unresolved
};

export const BRIGHTNESS_ORDER = ['bright', 'neutral', 'dark'] as const;
export const BRIGHTNESS_LABEL: Record<string, string> = {
  bright:  'Bright',
  neutral: 'Neutral',
  dark:    'Dark',
};
export const BRIGHTNESS_DESC: Record<string, string> = {
  bright:  'At rest — major-leaning, luminous',
  neutral: 'Balanced — between light and shadow',
  dark:    'Brooding — unresolved, ancient',
};

// Derive a shade from an explicit base color + position (used by both systems).
export function shadeFromBase(base: string, index: number, total: number): string {
  if (total <= 1) return base;
  const [h, s, l] = hexToHsl(base);
  const t = index / (total - 1);
  return hslToHex(h + (t - 0.5) * 28, s + (t - 0.5) * 8, l + (0.5 - t) * 16);
}

// Shade for a jazz mode by its position within its brightness group.
export function brightnessShade(brightness: string, index: number, total: number): string {
  return shadeFromBase(BRIGHTNESS_BASE[brightness] || '#8A8A99', index, total);
}

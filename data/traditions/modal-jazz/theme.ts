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

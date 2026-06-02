// Tradition registry — the single source of truth for every tradition in
// The Modality. Picker, switcher, and Journey all read from this; adding a
// tradition means adding one entry here, not editing screens.

import { COLORS } from '../constants';

export type TraditionStatus = 'live' | 'coming-soon';

export type TraditionEntry = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  accent: string;
  status: TraditionStatus;
  route?: string;
};

export const TRADITIONS: TraditionEntry[] = [
  {
    id: 'modal-jazz',
    name: 'Modal Jazz',
    tagline: 'The American conversation with the modes.',
    blurb: 'Seven colors hidden in one scale — the sound Miles Davis set free on Kind of Blue.',
    accent: '#7B8FFF',
    status: 'live',
    route: '/modal-jazz',
  },
  {
    id: 'turkish-makam',
    name: 'Turkish Makam',
    tagline: 'The microtonal poetry of Anatolia.',
    blurb: 'Fifty-three commas to the octave — feeling found in the spaces a piano cannot reach.',
    accent: COLORS.accent,
    status: 'live',
    route: '/turkish-makam',
  },
  {
    id: 'indian-raga',
    name: 'Indian Raga',
    tagline: 'Melody bound to time and season.',
    blurb: 'The ragas of India — each a living being with its own hour of the day, its own mood, its own rules.',
    accent: '#E8A33D',
    status: 'coming-soon',
  },
  {
    id: 'gregorian',
    name: 'Gregorian Chant',
    tagline: 'Where the mode names were born.',
    blurb: 'The church modes of medieval plainsong — Dorian, Phrygian, Lydian: the very names jazz would borrow a thousand years later.',
    accent: '#B8A99A',
    status: 'coming-soon',
  },
  {
    id: 'persian-dastgah',
    name: 'Persian Dastgah',
    tagline: 'A thousand melodies, held in memory.',
    blurb: 'The dastgah of Iran — the radif, a canon of melodic figures carried in breath and ornament.',
    accent: '#5B6FB0',
    status: 'coming-soon',
  },
  {
    id: 'flamenco',
    name: 'Flamenco',
    tagline: 'The deep song of Andalusia.',
    blurb: 'The palos of flamenco — Phrygian fire wrung from the guitar, cante jondo at its rawest.',
    accent: '#B33A3A',
    status: 'coming-soon',
  },
];

export const LIVE_TRADITIONS = TRADITIONS.filter((t) => t.status === 'live');
export const COMING_SOON_TRADITIONS = TRADITIONS.filter((t) => t.status === 'coming-soon');

export function getTradition(id: string): TraditionEntry | undefined {
  return TRADITIONS.find((t) => t.id === id);
}
export function traditionByName(name: string): TraditionEntry | undefined {
  return TRADITIONS.find((t) => t.name === name);
}

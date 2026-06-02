// Per-tradition intro slides. Shown on first entry into a tradition, and
// re-openable anytime via "About this tradition".

export type IntroSlide = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  quote?: string | null;
};

export const TRADITION_INTROS: Record<string, IntroSlide[]> = {
  'turkish-makam': [
    {
      key: 'welcome',
      eyebrow: 'TURKISH CLASSICAL MUSIC',
      title: 'Music that lives between the notes.',
      body: 'Western scales divide sound into 12 equal parts. Turkish makam uses 53 — creating intervals that exist nowhere on a piano. That is where the emotion lives.',
    },
    {
      key: 'makam',
      eyebrow: 'MORE THAN A SCALE',
      title: 'Each makam is a world.',
      body: 'Rast is a morning makam — bright, grounded, hopeful. Hicaz burns with the drama of distant lands. Huzzam descends into grief that no Western scale can reach.',
      quote: 'Rast · Hicaz · Uşşak · Saba · Huzzam',
    },
    {
      key: 'explore',
      eyebrow: 'YOUR GUIDE',
      title: 'Start anywhere. Go deep.',
      body: 'Browse 19 makams by mood, family, or rhythm. Hear the ney play each scale. Read the theory. Search by song.',
    },
  ],
  'modal-jazz': [
    {
      key: 'welcome',
      eyebrow: 'MODAL JAZZ',
      title: 'Seven colors of one scale.',
      body: 'Major and minor are just two of seven modes hiding in every scale. Shift where you start and the same notes become bright, brooding, suspended, or strange. Modal jazz is the art of living inside one of those colors.',
    },
    {
      key: 'modes',
      eyebrow: 'EACH MODE A MOOD',
      title: 'Each mode is a feeling.',
      body: 'Ionian is arrival — bright and at rest. Dorian is hopeful melancholy. Phrygian carries something ancient and unresolved. Lydian floats, weightless, never wanting to land.',
      quote: 'Ionian · Dorian · Phrygian · Lydian · Mixolydian',
    },
    {
      key: 'explore',
      eyebrow: 'YOUR GUIDE',
      title: 'Start anywhere. Go deep.',
      body: 'Browse seven modes by brightness. Hear each one played. Learn when to reach for it, and which note gives it its color.',
    },
  ],
};

// SecureStore key for "has seen the intro for this tradition".
export const introSeenKey = (traditionId: string) => `intro_seen_${traditionId}_v1`;

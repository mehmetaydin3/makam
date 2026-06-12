// ─── Glossary ────────────────────────────────────────────────────────────────
// A plain-language reference for the vocabulary both traditions assume. Terms
// are tagged by tradition so the glossary screen can filter; "shared" terms are
// common musical concepts that apply to both makam and modal jazz.

export type GlossaryTradition = 'turkish-makam' | 'modal-jazz' | 'shared';

export type GlossaryTerm = {
  term: string;
  pronunciation?: string;
  tradition: GlossaryTradition;
  definition: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  // ── Turkish Makam ──────────────────────────────────────────────────────────
  {
    term: 'Makam',
    pronunciation: 'mah-KAHM',
    tradition: 'turkish-makam',
    definition:
      'A modal framework — not just a scale, but a set of rules for how melody moves through it: which notes are emphasized, where it rests, and the direction it tends to travel (its seyir).',
  },
  {
    term: 'Seyir',
    pronunciation: 'seh-YEER',
    tradition: 'turkish-makam',
    definition:
      'The melodic "pathway" of a makam — whether it generally ascends, descends, or undulates, and the order in which it visits its important tones. Two makams can share a scale yet differ entirely in seyir.',
  },
  {
    term: 'Perde',
    pronunciation: 'per-DEH',
    tradition: 'turkish-makam',
    definition:
      'A named pitch in the Turkish system (e.g. dügâh, çârgâh, nevâ, hüseynî). Perde names label specific tones the way Western names label C, D, E — but mapped onto the 53-comma scale.',
  },
  {
    term: 'Durak',
    pronunciation: 'doo-RAHK',
    tradition: 'turkish-makam',
    definition:
      'The final, resting tone of a makam — its tonic. Phrases come home to the durak, and a taksim almost always settles there at the end.',
  },
  {
    term: 'Güçlü',
    pronunciation: 'gooch-LOO',
    tradition: 'turkish-makam',
    definition:
      'The dominant — a secondary center of gravity (often the 4th or 5th degree) where the makam pauses and around which its upper region is organized.',
  },
  {
    term: 'Çeşni',
    pronunciation: 'chesh-NEE',
    tradition: 'turkish-makam',
    definition:
      'Literally "flavor": a small tetrachord or trichord color introduced within a makam to tint a passage. Makams are built and varied by stacking and swapping these flavors.',
  },
  {
    term: 'Taksim',
    pronunciation: 'tahk-SEEM',
    tradition: 'turkish-makam',
    definition:
      'A free, non-metered solo improvisation that explores a makam — no fixed rhythm or composed melody. It is the purest way to hear what a makam actually sounds like.',
  },
  {
    term: 'Usul',
    pronunciation: 'oo-SOOL',
    tradition: 'turkish-makam',
    definition:
      'A rhythmic cycle — a repeating pattern of strong, medium, and weak beats that gives a composition its pulse and form. Usuls range from short (Sofyan, 4 beats) to vast (dozens of beats).',
  },
  {
    term: 'Koma',
    pronunciation: 'KO-mah',
    tradition: 'turkish-makam',
    definition:
      'The comma — the small interval unit at the heart of Turkish tuning. The whole tone is divided into 9 komas, and the octave into 53, which is how the tradition reaches pitches no piano can play.',
  },
  {
    term: 'Yeden',
    pronunciation: 'yeh-DEN',
    tradition: 'turkish-makam',
    definition:
      'The leading tone — the note just below the durak that pulls the ear toward resolution, much like the Western leading tone but often a comma or two away from it.',
  },
  {
    term: 'Fasıl',
    pronunciation: 'fah-SUHL',
    tradition: 'turkish-makam',
    definition:
      'A suite: a sequence of vocal and instrumental pieces all in the same makam, performed in a traditional order (often opening with a peşrev and closing with a saz semaisi).',
  },
  {
    term: 'Peşrev',
    pronunciation: 'pesh-REV',
    tradition: 'turkish-makam',
    definition:
      'A composed instrumental piece that traditionally opens a fasıl, laying out the makam before the vocal works arrive.',
  },
  {
    term: 'Saz Semaisi',
    pronunciation: 'sahz seh-mah-ee-SEE',
    tradition: 'turkish-makam',
    definition:
      'A composed instrumental piece, usually in aksak semai usul, that traditionally closes a fasıl.',
  },
  {
    term: 'Şarkı',
    pronunciation: 'shar-KUH',
    tradition: 'turkish-makam',
    definition:
      'The shorter, lyrical vocal song form — the most popular and accessible classical form, and the home of much of the beloved repertoire.',
  },
  {
    term: 'Beste',
    pronunciation: 'bes-TEH',
    tradition: 'turkish-makam',
    definition:
      'A large-scale classical vocal composition with an extended structure — weightier and more formal than a şarkı.',
  },
  {
    term: 'Kâr',
    pronunciation: 'kyar',
    tradition: 'turkish-makam',
    definition:
      'An elaborate, virtuosic vocal form, often the grand opening of a classical suite.',
  },
  {
    term: 'Ayin',
    pronunciation: 'ah-YEEN',
    tradition: 'turkish-makam',
    definition:
      'The Mevlevi ceremonial suite — the music of the whirling dervishes, among the most spiritually charged repertoire in the tradition.',
  },
  {
    term: 'İlahi',
    pronunciation: 'ee-lah-HEE',
    tradition: 'turkish-makam',
    definition:
      'A religious hymn — devotional song outside the formal court repertoire, often folk-rooted and widely sung.',
  },
  {
    term: 'Meşk',
    pronunciation: 'meshk',
    tradition: 'turkish-makam',
    definition:
      'The traditional method of transmission: learning by heart, ear, and repetition directly from a master, rather than from notation.',
  },

  // ── Modal Jazz ─────────────────────────────────────────────────────────────
  {
    term: 'Mode',
    tradition: 'modal-jazz',
    definition:
      'A scale defined by its starting degree within a parent scale — each mode a different rotation of the same notes, and so a different "color." The seven modes of the major scale run Ionian through Locrian.',
  },
  {
    term: 'Modal jazz',
    tradition: 'modal-jazz',
    definition:
      'An approach that improvises over a mode held for long stretches, rather than navigating fast-moving chord changes. Pioneered on Miles Davis\'s "Kind of Blue" (1959).',
  },
  {
    term: 'Color note',
    tradition: 'modal-jazz',
    definition:
      'The degree that gives a mode its identity — Lydian\'s raised 4th, Dorian\'s natural 6th, Phrygian\'s flat 2nd. Remove it and the mode loses its character.',
  },
  {
    term: 'Avoid note',
    tradition: 'modal-jazz',
    definition:
      'A scale degree that clashes against the underlying chord (e.g. the 4th over a major chord). Not forbidden — just handled with care, usually as a passing tone rather than a landing.',
  },
  {
    term: 'Vamp',
    tradition: 'modal-jazz',
    definition:
      'A short repeated figure — often one or two chords — that sustains a single mode, giving the soloist open space to explore it. "So What" is built on a two-chord Dorian vamp.',
  },
  {
    term: 'Voicing',
    tradition: 'modal-jazz',
    definition:
      'The specific way a chord\'s notes are arranged and spaced. The same chord can be voiced countless ways, each with its own color.',
  },
  {
    term: 'Quartal voicing',
    tradition: 'modal-jazz',
    definition:
      'A chord built by stacking 4ths instead of 3rds — open, ambiguous, and a signature sound of modal jazz (McCoy Tyner, Herbie Hancock).',
  },
  {
    term: 'Comping',
    tradition: 'modal-jazz',
    definition:
      'Accompanying — the chords and rhythm a pianist or guitarist plays behind a soloist, shaping the harmonic space without leading it.',
  },
  {
    term: 'ii–V–I',
    tradition: 'modal-jazz',
    definition:
      'The central cadence of tonal jazz — a three-chord pull toward home. Modal jazz is partly defined by stepping away from it, letting harmony rest instead of resolve.',
  },
  {
    term: 'Brightness',
    tradition: 'modal-jazz',
    definition:
      'How light or dark a mode sounds, set by how many of its degrees are raised or lowered. Lydian is the brightest, Locrian the darkest — a spectrum this app uses to order the modes.',
  },
  {
    term: 'Changes',
    tradition: 'modal-jazz',
    definition:
      'The chord progression of a tune. "Playing the changes" means improvising lines that follow each passing chord — the opposite pole from staying inside one mode.',
  },

  // ── Shared concepts ────────────────────────────────────────────────────────
  {
    term: 'Tonic',
    tradition: 'shared',
    definition:
      'The home pitch of a scale or mode — the note that feels like rest and resolution. Called the durak in Turkish makam.',
  },
  {
    term: 'Scale degree',
    tradition: 'shared',
    definition:
      'A numbered position within a scale (1st, 2nd, 3rd…). Much of both traditions is the art of which degrees you emphasize, raise, lower, or avoid.',
  },
  {
    term: 'Interval',
    tradition: 'shared',
    definition:
      'The distance between two pitches. The character of a mode or makam lives in its particular pattern of intervals.',
  },
  {
    term: 'Tetrachord',
    tradition: 'shared',
    definition:
      'A four-note segment spanning roughly a fourth — a building block scales and makams are assembled from. Stacking and swapping tetrachords is how new colors are made.',
  },
  {
    term: 'Cents',
    tradition: 'shared',
    definition:
      'A fine unit of pitch: 100 cents make a semitone, 1200 an octave. Cents let you measure the microtonal intervals that Western note names can\'t capture.',
  },
  {
    term: 'Microtone',
    tradition: 'shared',
    definition:
      'An interval smaller than a Western semitone — the spaces "between the keys." Central to makam, and the reason a piano can only approximate it.',
  },
  {
    term: 'Improvisation',
    tradition: 'shared',
    definition:
      'Spontaneous melodic creation within the rules of a system — the makam taksim and the jazz solo are two traditions\' answers to the same impulse.',
  },
];

const TRADITION_RANK: Record<GlossaryTradition, number> = {
  'turkish-makam': 0,
  'modal-jazz': 1,
  shared: 2,
};

/** Alphabetical within each tradition group is handled in the screen; this just
 *  filters by an optional tradition and a free-text query over term + definition. */
export function searchGlossary(query: string, tradition?: GlossaryTradition): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  return GLOSSARY.filter((t) => {
    if (tradition && t.tradition !== tradition) return false;
    if (!q) return true;
    return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
  }).sort(
    (a, b) =>
      TRADITION_RANK[a.tradition] - TRADITION_RANK[b.tradition] || a.term.localeCompare(b.term),
  );
}

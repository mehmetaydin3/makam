export interface ChordContext {
  chordType: string;
  chordSymbol: string;
  description: string;
  commonProgressions: string[];
}

export interface Tune {
  title: string;
  artist: string;
  year: number;
  whyThisTune: string;
  youtubeId?: string;
}

export interface Mode {
  id: string;
  name: string;
  degree: number;
  parentScale: string;
  oneWord: string;
  character: string;
  colorNote: string;
  colorNoteInterval: string;
  avoidNote?: string;
  avoidNoteInterval?: string;
  intervals: number[];
  formula: string;
  relativeKey: string;
  chordContexts: ChordContext[];
  classicTunes: Tune[];
  notablePlayers: string[];
  audioUrl?: string;
  demoChordUrl?: string;
  brightness: 'bright' | 'neutral' | 'dark';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedModes: string[];
}

export const MODES: Mode[] = [
  {
    id: 'ionian',
    name: 'Ionian',
    degree: 1,
    parentScale: 'major',
    oneWord: 'Resolved',
    character:
      'Ionian is the sound of arrival — bright, stable, at peace with itself. ' +
      'It carries no tension it needs to resolve, no shadow it needs to escape. ' +
      'When a melody wants to feel complete and at home, it reaches for Ionian.',
    colorNote: 'the major 7th',
    colorNoteInterval: '7',
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    formula: 'W W H W W W H',
    relativeKey: 'C Ionian = C major',
    chordContexts: [
      {
        chordType: 'maj7',
        chordSymbol: 'Cmaj7',
        description:
          'Ionian is the natural home of the major 7 chord. The maj7 interval is the ' +
          'defining color — it lifts the sound from ordinary major to luminous.',
        commonProgressions: ['Imaj7–IVmaj7', 'Imaj7–V7–Imaj7'],
      },
    ],
    classicTunes: [
      {
        title: 'Misty',
        artist: 'Erroll Garner',
        year: 1954,
        whyThisTune:
          'The A section lives squarely in Ionian — the maj7 color note appears in the ' +
          'opening melodic phrase.',
      },
    ],
    notablePlayers: ['Bill Evans', 'Oscar Peterson', 'McCoy Tyner'],
    brightness: 'bright',
    difficulty: 'beginner',
    relatedModes: ['lydian', 'mixolydian'],
  },
  {
    id: 'dorian',
    name: 'Dorian',
    degree: 2,
    parentScale: 'major',
    oneWord: 'Cool',
    character:
      'Dorian is the most balanced of the minor modes — dark enough to feel blue, ' +
      'but with a raised 6th that keeps it from sounding tragic. ' +
      'It is the sound of Miles Davis on a Tuesday night: effortlessly cool, emotionally present, unhurried.',
    colorNote: 'the natural 6th',
    colorNoteInterval: '6',
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    formula: 'W H W W W H W',
    relativeKey: 'D Dorian = C major starting on D',
    chordContexts: [
      {
        chordType: 'min7',
        chordSymbol: 'Dm7',
        description:
          'The m7 chord is Dorian\'s home. That natural 6th over Dm7 is ' +
          'what separates Dorian from Aeolian.',
        commonProgressions: ['im7–IV7', 'im7–bVII7–IV7'],
      },
    ],
    classicTunes: [
      {
        title: 'So What',
        artist: 'Miles Davis',
        year: 1959,
        whyThisTune:
          'The definitive Dorian tune. The entire A section is a D Dorian vamp.',
      },
      {
        title: 'Maiden Voyage',
        artist: 'Herbie Hancock',
        year: 1965,
        whyThisTune:
          'Herbie\'s signature tune floats on suspended Dorian harmony — the ' +
          'natural 6th over the m7 chords gives it that open, oceanic calm.',
      },
    ],
    notablePlayers: ['Miles Davis', 'John Coltrane', 'Herbie Hancock'],
    brightness: 'neutral',
    difficulty: 'beginner',
    relatedModes: ['aeolian', 'phrygian'],
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    degree: 3,
    parentScale: 'major',
    oneWord: 'Dark',
    character:
      'Phrygian carries the weight of something ancient and unresolved. ' +
      'That lowered 2nd gives it a Spanish gravity, a flamenco darkness. ' +
      'It does not resolve so much as brood.',
    colorNote: 'the flat 2nd',
    colorNoteInterval: 'b2',
    avoidNote: 'the flat 2nd (use with intention)',
    avoidNoteInterval: 'b2',
    intervals: [0, 1, 3, 5, 7, 8, 10, 12],
    formula: 'H W W W H W W',
    relativeKey: 'E Phrygian = C major starting on E',
    chordContexts: [
      {
        chordType: 'min7b9',
        chordSymbol: 'Em7(b9)',
        description:
          'Phrygian\'s natural home. The b9 extension directly reflects the flat 2nd color note.',
        commonProgressions: ['im–bII', 'im7–bII7'],
      },
    ],
    classicTunes: [
      {
        title: 'Impressions',
        artist: 'John Coltrane',
        year: 1963,
        whyThisTune:
          'The B section moves to Eb Phrygian against D Dorian in the A section.',
      },
      {
        title: 'Spain',
        artist: 'Chick Corea',
        year: 1972,
        whyThisTune:
          'Its flamenco-tinged theme leans on the Phrygian "Spanish" color — ' +
          'the half-step from the root that flamenco guitar is built on.',
      },
    ],
    notablePlayers: ['John Coltrane', 'Chick Corea', 'Wayne Shorter'],
    brightness: 'dark',
    difficulty: 'intermediate',
    relatedModes: ['aeolian', 'locrian'],
  },
  {
    id: 'lydian',
    name: 'Lydian',
    degree: 4,
    parentScale: 'major',
    oneWord: 'Floating',
    character:
      'Lydian is the sound of suspension — bright like Ionian but with a raised 4th ' +
      'that lifts it off the ground. It floats, never quite landing.',
    colorNote: 'the raised 4th (#4)',
    colorNoteInterval: '#4',
    intervals: [0, 2, 4, 6, 7, 9, 11, 12],
    formula: 'W W W H W W H',
    relativeKey: 'F Lydian = C major starting on F',
    chordContexts: [
      {
        chordType: 'maj7#11',
        chordSymbol: 'Fmaj7#11',
        description:
          'The #11 extension IS the Lydian color note as a chord tone. ' +
          'This voicing is Lydian at its most direct.',
        commonProgressions: ['Imaj7#11 vamp', 'Imaj7#11–IIm7'],
      },
    ],
    classicTunes: [
      {
        title: 'Inner Urge',
        artist: 'Joe Henderson',
        year: 1964,
        whyThisTune:
          'The definitive Lydian jazz tune — the head moves through a chain of maj7#11 chords, ' +
          'each one the raised-4th color in pure form. Joe Henderson built the sound into the composition itself.',
      },
    ],
    notablePlayers: ['Joe Henderson', 'Wayne Shorter', 'Herbie Hancock', 'George Russell'],
    brightness: 'bright',
    difficulty: 'intermediate',
    relatedModes: ['ionian'],
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    degree: 5,
    parentScale: 'major',
    oneWord: 'Bluesy',
    character:
      'Mixolydian sits at the crossroads of major and blues. ' +
      'Bright like a major scale but that flat 7th pulls it earthward, ' +
      'keeps it from being too clean, too resolved.',
    colorNote: 'the flat 7th',
    colorNoteInterval: 'b7',
    intervals: [0, 2, 4, 5, 7, 9, 10, 12],
    formula: 'W W H W W H W',
    relativeKey: 'G Mixolydian = C major starting on G',
    chordContexts: [
      {
        chordType: 'dom7',
        chordSymbol: 'G7',
        description:
          'Mixolydian is the natural language for any dominant 7th chord.',
        commonProgressions: ['V7 vamp', 'I7–IV7 (blues)'],
      },
    ],
    classicTunes: [
      {
        title: 'All Blues',
        artist: 'Miles Davis',
        year: 1959,
        whyThisTune:
          'From Kind of Blue — a G dominant vamp that never resolves, the flat 7th ringing through ' +
          'the whole tune. The recording that turned the Mixolydian sound into modal jazz.',
      },
    ],
    notablePlayers: ['Miles Davis', 'Wes Montgomery', 'Cannonball Adderley'],
    brightness: 'neutral',
    difficulty: 'beginner',
    relatedModes: ['ionian', 'dorian'],
  },
  {
    id: 'aeolian',
    name: 'Aeolian',
    degree: 6,
    parentScale: 'major',
    oneWord: 'Melancholic',
    character:
      'Aeolian is the natural minor scale — the one that sounds like sadness ' +
      'when sadness wants to be understood. ' +
      'Unlike Dorian\'s cool composure, Aeolian allows itself to grieve.',
    colorNote: 'the flat 6th',
    colorNoteInterval: 'b6',
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    formula: 'W H W W H W W',
    relativeKey: 'A Aeolian = C major starting on A',
    chordContexts: [
      {
        chordType: 'min7',
        chordSymbol: 'Am7',
        description:
          'Aeolian and Dorian share the m7 chord. The difference is the 6th: ' +
          'Aeolian\'s b6 darkens the sound.',
        commonProgressions: ['im–bVI–bVII–im', 'im7–iv7'],
      },
    ],
    classicTunes: [
      {
        title: 'My Funny Valentine',
        artist: 'Chet Baker',
        year: 1954,
        whyThisTune:
          'The A section descends through Aeolian harmony. ' +
          'The descending chromatic bass line is an Aeolian signature.',
      },
      {
        title: 'Summertime',
        artist: 'Michel Petrucciani',
        year: 1993,
        whyThisTune:
          'Gershwin\'s standard sits squarely in Aeolian (natural minor); ' +
          'Petrucciani leans into its descending minor harmony.',
      },
    ],
    notablePlayers: ['Chet Baker', 'Bill Evans', 'Keith Jarrett'],
    brightness: 'dark',
    difficulty: 'beginner',
    relatedModes: ['dorian', 'phrygian'],
  },
  {
    id: 'locrian',
    name: 'Locrian',
    degree: 7,
    parentScale: 'major',
    oneWord: 'Unstable',
    character:
      'Locrian is the outlier — the only mode whose tonic chord is diminished. ' +
      'It lives in permanent harmonic suspension. ' +
      'Jazz uses it carefully: over the half-diminished chord, briefly, before moving on.',
    colorNote: 'the flat 5th (tritone)',
    colorNoteInterval: 'b5',
    avoidNote: 'the flat 5th (handle with care)',
    avoidNoteInterval: 'b5',
    intervals: [0, 1, 3, 5, 6, 8, 10, 12],
    formula: 'H W W H W W W',
    relativeKey: 'B Locrian = C major starting on B',
    chordContexts: [
      {
        chordType: 'min7b5',
        chordSymbol: 'Bø7',
        description:
          'The half-diminished chord is Locrian\'s only natural home — ' +
          'the ii chord in minor ii-V-i progressions.',
        commonProgressions: ['iiø7–V7alt–im'],
      },
    ],
    classicTunes: [
      {
        title: 'Autumn Leaves (minor ii-V)',
        artist: 'Bill Evans',
        year: 1959,
        whyThisTune:
          'Every minor ii-V-i contains a moment of Locrian over the ø7 chord.',
      },
    ],
    notablePlayers: ['John Coltrane', 'Wayne Shorter', 'Eric Dolphy'],
    brightness: 'dark',
    difficulty: 'advanced',
    relatedModes: ['phrygian', 'aeolian'],
  },

  // ─── Modes of the MELODIC MINOR scale ───────────────────────────────────────
  // The second harmonic universe of modal jazz. Where the major modes give you
  // seven colors of consonance, melodic minor gives you the language of tension:
  // the min(maj7) sound, the two essential dominant scales (Lydian dominant and
  // altered), and the half-diminished. These are color scales — often deployed
  // chord-by-chord rather than as long vamps — so the focus is the chord they
  // voice, not a single signature tune.
  {
    id: 'melodic-minor',
    name: 'Melodic Minor',
    degree: 1,
    parentScale: 'melodic minor',
    oneWord: 'Bittersweet',
    character:
      'The melodic minor scale (jazz players use the ascending form in both directions) ' +
      'is a minor scale with a major-7th lift. That single raised note turns grief into ' +
      'something nobler — a minor world that can still see the light above it. It is the ' +
      'tonic home of the min(maj7) chord and the parent of six further modes.',
    colorNote: 'the major 7th over a minor 3rd',
    colorNoteInterval: '7',
    intervals: [0, 2, 3, 5, 7, 9, 11, 12],
    formula: 'W H W W W W H',
    relativeKey: 'C Melodic Minor = C natural minor with a raised 7th',
    chordContexts: [
      {
        chordType: 'min(maj7)',
        chordSymbol: 'Cm(maj7)',
        description:
          'The defining chord: a minor triad with a major 7th. Tender and unstable at once — ' +
          'the raised 7th pulls upward while the minor 3rd holds it down.',
        commonProgressions: ['im(maj7)–im7', 'im(maj7) tonic minor'],
      },
    ],
    classicTunes: [
      {
        title: 'Yesterdays',
        artist: 'Jerome Kern',
        year: 1933,
        whyThisTune:
          'The classic vehicle for the min(maj7) sound — the tonic minor chord rings with that ' +
          'raised 7th, the signature melodic-minor color.',
      },
    ],
    notablePlayers: ['Bill Evans', 'Wayne Shorter', 'Herbie Hancock'],
    brightness: 'neutral',
    difficulty: 'intermediate',
    relatedModes: ['dorian', 'lydian-dominant', 'altered'],
  },
  {
    id: 'dorian-b2',
    name: 'Dorian ♭2',
    degree: 2,
    parentScale: 'melodic minor',
    oneWord: 'Brooding',
    character:
      'Also called Phrygian ♮6 — a Phrygian darkness with a raised 6th that keeps it from ' +
      'collapsing into despair. The ♭2 gives it a Spanish, suspended gravity; it is most often ' +
      'heard voicing a sus♭9 chord, hanging unresolved.',
    colorNote: 'the flat 2nd',
    colorNoteInterval: 'b2',
    avoidNote: 'the flat 2nd (use with intention)',
    avoidNoteInterval: 'b2',
    intervals: [0, 1, 3, 5, 7, 9, 10, 12],
    formula: 'H W W W W H W',
    relativeKey: 'D Dorian ♭2 = C melodic minor starting on D',
    chordContexts: [
      {
        chordType: 'sus♭9',
        chordSymbol: 'Dsus(♭9)',
        description:
          'A suspended chord with a ♭9 — open, modal, and faintly ominous. The raised 6th keeps ' +
          'air in it where Phrygian would close.',
        commonProgressions: ['sus♭9 vamp', 'phrygian-color over a pedal'],
      },
    ],
    classicTunes: [],
    notablePlayers: ['Wayne Shorter', 'Chick Corea', 'Joe Henderson'],
    brightness: 'dark',
    difficulty: 'advanced',
    relatedModes: ['phrygian', 'melodic-minor'],
  },
  {
    id: 'lydian-augmented',
    name: 'Lydian Augmented',
    degree: 3,
    parentScale: 'melodic minor',
    oneWord: 'Luminous',
    character:
      'Lydian with a raised 5th as well as a raised 4th — two notes lifting at once. It floats ' +
      'even further off the ground than Lydian, weightless and slightly unstable, the sound of ' +
      'wonder with no floor under it. The home of the maj7♯5 chord.',
    colorNote: 'the raised 5th (♯5)',
    colorNoteInterval: 'b6',
    intervals: [0, 2, 4, 6, 8, 9, 11, 12],
    formula: 'W W W W H W H',
    relativeKey: 'E♭ Lydian Augmented = C melodic minor starting on E♭',
    chordContexts: [
      {
        chordType: 'maj7♯5',
        chordSymbol: 'E♭maj7♯5',
        description:
          'A major 7th chord with a raised 5th. The ♯5 and ♯11 together give it a shimmering, ' +
          'unresolved brightness — luminous but never settled.',
        commonProgressions: ['Imaj7♯5–IV7', 'maj7♯5 as a tonic color'],
      },
    ],
    classicTunes: [],
    notablePlayers: ['Wayne Shorter', 'Woody Shaw', 'Herbie Hancock'],
    brightness: 'bright',
    difficulty: 'advanced',
    relatedModes: ['lydian', 'melodic-minor'],
  },
  {
    id: 'lydian-dominant',
    name: 'Lydian Dominant',
    degree: 4,
    parentScale: 'melodic minor',
    oneWord: 'Electric',
    character:
      'Lydian dominant — Lydian with a flat 7th, also called the overtone or acoustic scale — ' +
      'is one of the two essential dominant sounds in jazz. It keeps the bright ♯11 lift of ' +
      'Lydian but adds the bluesy pull of the ♭7, so a dominant chord can shine and growl at ' +
      'once. The natural scale for any unaltered 7♯11 chord.',
    colorNote: 'the raised 4th over a flat 7th',
    colorNoteInterval: '#4',
    intervals: [0, 2, 4, 6, 7, 9, 10, 12],
    formula: 'W W W H W H W',
    relativeKey: 'F Lydian Dominant = C melodic minor starting on F',
    chordContexts: [
      {
        chordType: '7♯11',
        chordSymbol: 'F7♯11',
        description:
          'The signature chord: a dominant 7th with a raised 11th. Used for non-resolving ' +
          'dominants — the ♭VII7, the tritone-sub, the bright unresolved V — where you want ' +
          'tension without the bite of the altered scale.',
        commonProgressions: ['♭VII7♯11–Imaj7', 'tritone-sub V7♯11'],
      },
    ],
    classicTunes: [],
    notablePlayers: ['Wayne Shorter', 'Michael Brecker', 'Chick Corea'],
    brightness: 'bright',
    difficulty: 'advanced',
    relatedModes: ['lydian', 'mixolydian', 'altered'],
  },
  {
    id: 'mixolydian-b6',
    name: 'Mixolydian ♭6',
    degree: 5,
    parentScale: 'melodic minor',
    oneWord: 'Resigned',
    character:
      'Mixolydian with a flat 6th — also called the Hindu scale or Aeolian dominant. The bright ' +
      'dominant top half meets a minor-tinged ♭6, giving a dominant chord a heavy, world-weary ' +
      'pull. The natural sound of a V7♭13 resolving down into a minor key.',
    colorNote: 'the flat 6th over a dominant 7th',
    colorNoteInterval: 'b6',
    intervals: [0, 2, 4, 5, 7, 8, 10, 12],
    formula: 'W W H W H W W',
    relativeKey: 'G Mixolydian ♭6 = C melodic minor starting on G',
    chordContexts: [
      {
        chordType: '7♭13',
        chordSymbol: 'G7♭13',
        description:
          'A dominant 7th carrying a ♭13 (the ♭6). The classic cadential dominant into a minor ' +
          'tonic — gravity and resignation built into the chord.',
        commonProgressions: ['V7♭13–im', 'iiø7–V7♭13–im'],
      },
    ],
    classicTunes: [],
    notablePlayers: ['John Coltrane', 'Joe Henderson', 'McCoy Tyner'],
    brightness: 'neutral',
    difficulty: 'advanced',
    relatedModes: ['mixolydian', 'aeolian'],
  },
  {
    id: 'locrian-natural-2',
    name: 'Locrian ♮2',
    degree: 6,
    parentScale: 'melodic minor',
    oneWord: 'Unsettled',
    character:
      'Locrian with a natural 2nd — the half-diminished scale jazz players actually use. The ' +
      'restored 2nd softens Locrian\'s harshness just enough to make the m7♭5 chord sing rather ' +
      'than clash. This is the sound of the ii chord in every minor ii–V–i.',
    colorNote: 'the flat 5th',
    colorNoteInterval: '#4',
    intervals: [0, 2, 3, 5, 6, 8, 10, 12],
    formula: 'W H W H W W W',
    relativeKey: 'A Locrian ♮2 = C melodic minor starting on A',
    chordContexts: [
      {
        chordType: 'm7♭5',
        chordSymbol: 'Am7♭5',
        description:
          'The half-diminished chord. With the natural 9th available, it becomes a usable, ' +
          'colorful sound rather than a dead end — the gateway into a minor cadence.',
        commonProgressions: ['iiø7–V7alt–im', 'm7♭5 as a minor-key ii'],
      },
    ],
    classicTunes: [
      {
        title: 'Stella by Starlight',
        artist: 'Victor Young',
        year: 1944,
        whyThisTune:
          'The tune famously opens on a half-diminished chord — Locrian ♮2 is the scale that ' +
          'voices that unsettled first sound.',
      },
    ],
    notablePlayers: ['Bill Evans', 'Herbie Hancock', 'Wayne Shorter'],
    brightness: 'dark',
    difficulty: 'advanced',
    relatedModes: ['locrian', 'altered'],
  },
  {
    id: 'altered',
    name: 'Altered',
    degree: 7,
    parentScale: 'melodic minor',
    oneWord: 'Volatile',
    character:
      'The altered scale — super Locrian, the diminished whole-tone — is maximum dominant ' +
      'tension in seven notes. Every extension a dominant chord can alter (♭9, ♯9, ♯11, ♭13) ' +
      'lives here at once. Play it over the V of a minor ii–V–i and the resolution lands like ' +
      'a release of pressure. The other essential dominant scale beside Lydian dominant.',
    colorNote: 'the flat 9th and sharp 9th together',
    colorNoteInterval: 'b2',
    intervals: [0, 1, 3, 4, 6, 8, 10, 12],
    formula: 'H W H W W W W',
    relativeKey: 'B Altered = C melodic minor starting on B',
    chordContexts: [
      {
        chordType: '7alt',
        chordSymbol: 'B7alt',
        description:
          'The fully altered dominant: ♭9, ♯9, ♯11, ♭13 all available. The sound of the V chord ' +
          'straining toward home — used on the dominant of a minor ii–V–i for maximum pull.',
        commonProgressions: ['iiø7–V7alt–im', 'V7alt–Imaj7'],
      },
    ],
    classicTunes: [],
    notablePlayers: ['Michael Brecker', 'John Coltrane', 'Chick Corea'],
    brightness: 'dark',
    difficulty: 'advanced',
    relatedModes: ['lydian-dominant', 'locrian-natural-2', 'mixolydian'],
  },
];

export function getModeById(id: string): Mode | undefined {
  return MODES.find((m) => m.id === id);
}

export function getModesByBrightness(brightness: Mode['brightness']): Mode[] {
  return MODES.filter((m) => m.brightness === brightness);
}

export function getRelatedModes(modeId: string): Mode[] {
  const mode = getModeById(modeId);
  if (!mode) return [];
  return mode.relatedModes.map((id) => getModeById(id)).filter(Boolean) as Mode[];
}

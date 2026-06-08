import { MODES } from './modes';

export type QuestionType =
  | 'id_by_ear'
  | 'color_note'
  | 'chord_fit'
  | 'tune_name'
  | 'avoid_note'
  | 'brightness';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  modeId?: string;
  concept?: string;  // groups questions testing the SAME fact so a session never repeats one
  audioUrl?: string;
  videoIds?: string[];  // multiple IDs — one picked randomly per session
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ── Color note questions ───────────────────────────────────────────────

  {
    id: 'q-cn-dorian',
    concept: 'dorian-6th',
    type: 'color_note',
    prompt: 'What is the color note of Dorian?',
    options: ['The flat 3rd', 'The natural 6th', 'The flat 7th', 'The raised 4th'],
    correctAnswer: 'The natural 6th',
    explanation:
      'The natural 6th is what separates Dorian from Aeolian. ' +
      'Over a minor chord, that raised 6th adds brightness and forward motion — ' +
      'the defining sound of Dorian.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-lydian',
    concept: 'lydian-sharp4',
    type: 'color_note',
    prompt: 'What is the color note of Lydian?',
    options: ['The major 7th', 'The flat 7th', 'The raised 4th', 'The natural 6th'],
    correctAnswer: 'The raised 4th',
    explanation:
      'The #4 gives Lydian its floating, suspended quality. ' +
      'Without it, Lydian collapses into Ionian.',
    modeId: 'lydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-mixolydian',
    concept: 'mixo-b7',
    type: 'color_note',
    prompt: 'What is the color note of Mixolydian?',
    options: ['The raised 4th', 'The flat 6th', 'The flat 2nd', 'The flat 7th'],
    correctAnswer: 'The flat 7th',
    explanation:
      'The flat 7th makes Mixolydian sound bluesy instead of major. ' +
      'It is also the note that defines every dominant 7th chord.',
    modeId: 'mixolydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-phrygian',
    concept: 'phrygian-b2',
    type: 'color_note',
    prompt: 'What is the color note of Phrygian?',
    options: ['The flat 5th', 'The flat 6th', 'The flat 2nd', 'The flat 7th'],
    correctAnswer: 'The flat 2nd',
    explanation:
      'The flat 2nd — just a half step above the root — gives Phrygian its Spanish, ancient quality.',
    modeId: 'phrygian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-aeolian',
    concept: 'aeolian-b6',
    type: 'color_note',
    prompt: 'What is the color note of Aeolian?',
    options: ['The flat 2nd', 'The flat 5th', 'The natural 6th', 'The flat 6th'],
    correctAnswer: 'The flat 6th',
    explanation:
      'The flat 6th darkens Aeolian compared to Dorian. ' +
      'That single note is the difference between cool and melancholic.',
    modeId: 'aeolian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-locrian',
    concept: 'locrian-b5',
    type: 'color_note',
    prompt: 'What is the color note of Locrian?',
    options: ['The flat 2nd', 'The flat 6th', 'The flat 5th', 'The flat 7th'],
    correctAnswer: 'The flat 5th',
    explanation:
      'The flat 5th is a tritone from the root — the most destabilizing interval. ' +
      'It is why Locrian\'s tonic chord is diminished.',
    modeId: 'locrian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cn-ionian',
    concept: 'ionian-maj7',
    type: 'color_note',
    prompt: 'What is the color note of Ionian?',
    options: ['The flat 7th', 'The raised 4th', 'The major 7th', 'The natural 6th'],
    correctAnswer: 'The major 7th',
    explanation:
      'The major 7th — one half step below the octave — gives Ionian its luminous, resolved quality.',
    modeId: 'ionian',
    difficulty: 'beginner',
  },

  // ── Chord fit questions ────────────────────────────────────────────────

  {
    id: 'q-cf-m7',
    concept: 'dorian-m7-chord',
    type: 'chord_fit',
    prompt: 'You see a Dm7 chord that sits for 8 bars. Which mode is the best default choice?',
    options: ['Aeolian', 'Phrygian', 'Dorian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian is the jazz default for minor 7 chords. ' +
      'Its natural 6th gives it forward motion without losing the minor quality.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-maj7',
    concept: 'ionian-maj7-chord',
    type: 'chord_fit',
    prompt: 'You see a Cmaj7 chord. Which mode is the natural choice?',
    options: ['Mixolydian', 'Lydian', 'Ionian', 'Dorian'],
    correctAnswer: 'Ionian',
    explanation:
      'Ionian is the natural language for major 7 chords. ' +
      'The major 7th in the chord is the same note as the color note of the mode.',
    modeId: 'ionian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-maj7sharp11',
    concept: 'lydian-maj7sharp11-chord',
    type: 'chord_fit',
    prompt: 'The chart says Fmaj7#11. Which mode is being requested?',
    options: ['Ionian', 'Mixolydian', 'Aeolian', 'Lydian'],
    correctAnswer: 'Lydian',
    explanation:
      'The #11 in a chord symbol is a direct instruction: use Lydian. ' +
      'The #11 extension IS the raised 4th color note of Lydian.',
    modeId: 'lydian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-dom7',
    concept: 'mixo-dom7-chord',
    type: 'chord_fit',
    prompt: 'You are playing over a G7 chord in a blues. Which mode fits?',
    options: ['Ionian', 'Dorian', 'Mixolydian', 'Lydian'],
    correctAnswer: 'Mixolydian',
    explanation:
      'Mixolydian is the natural language for dominant 7th chords. ' +
      'G Mixolydian over G7 is the foundation of blues and jazz.',
    modeId: 'mixolydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-halfdim',
    concept: 'locrian-halfdim-chord',
    type: 'chord_fit',
    prompt: 'You see a Bø7 (half-diminished) chord in a minor ii-V-i. Which mode fits?',
    options: ['Phrygian', 'Aeolian', 'Dorian', 'Locrian'],
    correctAnswer: 'Locrian',
    explanation:
      'Locrian is the only mode that fits naturally over a half-diminished chord. ' +
      'This is Locrian\'s primary use in jazz.',
    modeId: 'locrian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-m7b9',
    concept: 'phrygian-m7b9-chord',
    type: 'chord_fit',
    prompt: 'The chord is Em7(b9) with a Spanish feel. Which mode fits?',
    options: ['Aeolian', 'Dorian', 'Locrian', 'Phrygian'],
    correctAnswer: 'Phrygian',
    explanation:
      'The b9 extension directly reflects Phrygian\'s flat 2nd. ' +
      'The Spanish quality of the chord and the mode are the same sound.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },

  // ── Tune name questions with multiple video IDs ────────────────────────

  {
    id: 'q-tn-sowhat',
    concept: 'tune-dorian',
    type: 'tune_name',
    prompt: '"So What" by Miles Davis. Which mode is this tune built on?',
    options: ['Aeolian', 'Mixolydian', 'Dorian', 'Lydian'],
    correctAnswer: 'Dorian',
    explanation:
      'This is "So What" by Miles Davis. The entire A section is a D Dorian vamp over Dm7. ' +
      'Miles, Coltrane, and Bill Evans all demonstrate the mode at its most essential.',
    modeId: 'dorian',
    videoIds: [
      'y_hl3w74J2I',  // Michel Petrucciani Montreux 1996 BMG official
      'zqNTltOGh5c',  // Official video
      '6w4FI0Jq0lI',  // Live 1959
    ],
    difficulty: 'beginner',
  },
  {
    id: 'q-tn-impressions',
    concept: 'tune-phrygian',
    type: 'tune_name',
    prompt: `Coltrane's "Impressions" — the B section uses which mode?`,
    options: ['Dorian', 'Aeolian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Phrygian',
    explanation:
      'This is Coltrane\'s "Impressions." The B section moves to Eb Phrygian. ' +
      'The contrast between Dorian lifting and Phrygian pressing down is visceral.',
    modeId: 'phrygian',
    videoIds: [
      'OZZYm6rUsS0',  // Coltrane + Eric Dolphy Village Gate official
      'SK1B_-PBhZk',  // Live enhanced
      'OZZYm6rUsS0',  // Village Gate
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-maidenvoyage',
    concept: 'tune-dorian',
    type: 'tune_name',
    prompt: `Herbie Hancock's "Maiden Voyage." Which mode is primarily used?`,
    options: ['Ionian', 'Lydian', 'Mixolydian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'This is Herbie Hancock\'s "Maiden Voyage" — suspended Dorian harmony over slow-moving chords.',
    modeId: 'dorian',
    videoIds: [
      'hwmRQ0PBtXU',  // Original
      'S9kVjAzNf3s',  // Live Japan 1998
      'IAxVKxGpC18',  // Live Chicago 1977
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-spain',
    concept: 'tune-phrygian',
    type: 'tune_name',
    prompt: `Chick Corea's "Spain." Which mode does the opening melody draw from?`,
    options: ['Aeolian', 'Locrian', 'Dorian', 'Phrygian'],
    correctAnswer: 'Phrygian',
    explanation:
      'This is Chick Corea\'s "Spain." The opening melody draws on Phrygian\'s flat 2nd for its Spanish character.',
    modeId: 'phrygian',
    videoIds: [
      'XfQJMhMRUcw',  // Main version
    ],
    difficulty: 'intermediate',
  },

  // ── Brightness questions ───────────────────────────────────────────────

  {
    id: 'q-br-brightest',
    concept: 'bright-lydian',
    type: 'brightness',
    prompt: 'Which mode is considered the brightest of all seven diatonic modes?',
    options: ['Ionian', 'Mixolydian', 'Dorian', 'Lydian'],
    correctAnswer: 'Lydian',
    explanation:
      'Lydian raises the 4th above Ionian, creating a floating quality that goes beyond major.',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-darkest',
    concept: 'locrian-instability',
    type: 'brightness',
    prompt: 'Which mode is the most harmonically unstable?',
    options: ['Phrygian', 'Aeolian', 'Dorian', 'Locrian'],
    correctAnswer: 'Locrian',
    explanation:
      'Locrian is the only mode whose tonic chord is diminished — it can never truly resolve.',
    modeId: 'locrian',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-neutral-minor',
    concept: 'dorian-neutral',
    type: 'brightness',
    prompt: 'Which minor mode is the most balanced — neither especially dark nor light?',
    options: ['Aeolian', 'Phrygian', 'Locrian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian\'s natural 6th lifts it above Aeolian and Phrygian, making it the most versatile minor mode.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },

  // ── Avoid note questions ───────────────────────────────────────────────

  {
    id: 'q-an-phrygian',
    concept: 'phrygian-b2',
    type: 'avoid_note',
    prompt: 'Phrygian has a note to use with care. Which is it?',
    options: ['The flat 5th', 'The flat 7th', 'The flat 2nd', 'The raised 4th'],
    correctAnswer: 'The flat 2nd',
    explanation:
      'The flat 2nd is both Phrygian\'s color note and its most dangerous note. ' +
      'Used deliberately it defines the mode; carelessly it clashes hard.',
    modeId: 'phrygian',
    difficulty: 'advanced',
  },
  {
    id: 'q-an-locrian',
    concept: 'locrian-b5',
    type: 'avoid_note',
    prompt: 'Which interval makes Locrian impossible to use as a tonal center?',
    options: ['The flat 2nd', 'The flat 6th', 'The flat 7th', 'The flat 5th'],
    correctAnswer: 'The flat 5th',
    explanation:
      'The flat 5th forms a tritone with the root. ' +
      'Because the tonic chord is diminished, Locrian can never create a stable tonal center.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },

  // ── Confusion pair questions ───────────────────────────────────────────

  {
    id: 'q-cp-dorian-aeolian',
    concept: 'dorian-aeolian-6th',
    type: 'color_note',
    prompt: 'Dorian and Aeolian are both minor modes. What is the only note that differs?',
    options: ['The 3rd', 'The 5th', 'The 7th', 'The 6th'],
    correctAnswer: 'The 6th',
    explanation:
      'Dorian has a natural 6th. Aeolian has a flat 6th. ' +
      'That single note is the difference between cool and melancholic.',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cp-ionian-lydian',
    concept: 'lydian-sharp4',
    type: 'color_note',
    prompt: 'Ionian and Lydian are both major modes. What is the only note that differs?',
    options: ['The 2nd', 'The 7th', 'The 3rd', 'The 4th'],
    correctAnswer: 'The 4th',
    explanation:
      'Ionian has a natural 4th. Lydian has a raised 4th. ' +
      'That raised 4th lifts Lydian from grounded to floating.',
    difficulty: 'intermediate',
  },
  {
    id: 'jq-adv-dorian-chord',
    concept: 'dorian-m7-chord',
    type: 'chord_fit',
    prompt: 'Over a minor 7th chord functioning as ii in a major key, which mode is the natural choice?',
    options: ['Dorian', 'Phrygian', 'Aeolian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian is the default mode over a ii-7 chord — its natural 6th brightens the minor sound without the darkness of Aeolian\'s flat 6th.',
    modeId: 'dorian',
    difficulty: 'advanced',
  },
  {
    id: 'jq-adv-lydian-vs-ionian',
    concept: 'lydian-sharp4',
    type: 'color_note',
    prompt: 'What single note distinguishes Lydian from Ionian, giving it that floating quality?',
    options: ['The raised 4th', 'The flat 7th', 'The natural 6th', 'The flat 2nd'],
    correctAnswer: 'The raised 4th',
    explanation:
      'Lydian is Ionian with a #4. That raised fourth removes the tension of the perfect-4th-against-the-major-3rd, letting the mode float without pull to resolve.',
    modeId: 'lydian',
    difficulty: 'advanced',
  },
  {
    id: 'jq-adv-mixo-dominant',
    concept: 'mixo-dom7-chord',
    type: 'chord_fit',
    prompt: 'Which mode is the primary choice over an unaltered dominant 7th chord?',
    options: ['Mixolydian', 'Lydian', 'Dorian', 'Ionian'],
    correctAnswer: 'Mixolydian',
    explanation:
      'Mixolydian — major 3rd plus flat 7th — spells a dominant 7th chord exactly, making it the home mode for unaltered V7 harmony.',
    modeId: 'mixolydian',
    difficulty: 'advanced',
  },
  {
    id: 'jq-adv-phrygian-flat2',
    concept: 'phrygian-b2',
    type: 'color_note',
    prompt: 'The flat 2nd is the signature of Phrygian. What harmonic flavour does it most evoke?',
    options: ['Spanish / flamenco color', 'Bright pop major', 'Suspended floating', 'Bluesy dominant'],
    correctAnswer: 'Spanish / flamenco color',
    explanation:
      'Phrygian\'s flat 2nd is the sound of flamenco and Spanish music — the half-step from root to b2 gives that dark, exotic pull.',
    modeId: 'phrygian',
    difficulty: 'advanced',
  },
  {
    id: 'jq-adv-locrian-halfdim',
    concept: 'locrian-halfdim-chord',
    type: 'chord_fit',
    prompt: 'Locrian is the usual mode over which chord quality?',
    options: ['Half-diminished (m7b5)', 'Major 7th', 'Dominant 7th', 'Minor 6th'],
    correctAnswer: 'Half-diminished (m7b5)',
    explanation:
      'Locrian — with its flat 5th and flat 7th — outlines a half-diminished (m7b5) chord, its natural harmonic home, typically the ii of a minor key.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },
  {
    id: 'jq-adv-aeolian-vs-dorian',
    concept: 'dorian-aeolian-6th',
    type: 'color_note',
    prompt: 'Aeolian and Dorian are both minor modes. Which note separates them?',
    options: ['The 6th (flat in Aeolian, natural in Dorian)', 'The 3rd', 'The 2nd', 'The 5th'],
    correctAnswer: 'The 6th (flat in Aeolian, natural in Dorian)',
    explanation:
      'Both have a flat 3rd and flat 7th; the difference is the 6th — Aeolian\'s is flat (darker, the natural minor), Dorian\'s is natural (brighter, hopeful).',
    modeId: 'aeolian',
    difficulty: 'advanced',
  },

  // ══════════════════════════════════════════════════════════════════════
  // ADDED: depth questions — weighted to intermediate & advanced, spread
  // across all 7 modes and every type, each with a distinct concept tag.
  // ══════════════════════════════════════════════════════════════════════

  // ── Color note: filling out every mode / new angles ────────────────────
  {
    id: 'q-cn-mixo-vs-ionian',
    concept: 'mixo-vs-ionian-7th',
    type: 'color_note',
    prompt: 'Ionian and Mixolydian are both major-quality modes. What single note separates them?',
    options: ['The 4th', 'The 7th', 'The 2nd', 'The 6th'],
    correctAnswer: 'The 7th',
    explanation:
      'Ionian has a major 7th; Mixolydian flats it. That one note turns a luminous major scale into a bluesy dominant.',
    modeId: 'mixolydian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cn-phrygian-vs-aeolian',
    concept: 'phrygian-vs-aeolian-2nd',
    type: 'color_note',
    prompt: 'Phrygian and Aeolian share the same notes except one. Which degree differs?',
    options: ['The 2nd', 'The 6th', 'The 7th', 'The 5th'],
    correctAnswer: 'The 2nd',
    explanation:
      'Both are natural-minor in flavour, but Phrygian flats the 2nd. That half step above the root is the whole difference between melancholy and menace.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cn-locrian-vs-phrygian',
    concept: 'locrian-vs-phrygian-5th',
    type: 'color_note',
    prompt: 'Locrian is Phrygian with one further alteration. Which note is changed?',
    options: ['The 5th is flatted', 'The 2nd is raised', 'The 7th is raised', 'The 3rd is raised'],
    correctAnswer: 'The 5th is flatted',
    explanation:
      'Locrian = Phrygian with a flat 5th. Flatting the fifth collapses the tonic into a diminished chord — the source of Locrian\'s instability.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },
  {
    id: 'q-cn-dorian-two-colors',
    concept: 'dorian-natural6-over-b3',
    type: 'color_note',
    prompt: 'Dorian places a bright color note over a minor framework. Which pairing creates its signature tension?',
    options: ['Flat 3rd with natural 6th', 'Major 3rd with flat 7th', 'Flat 2nd with flat 6th', 'Flat 5th with flat 7th'],
    correctAnswer: 'Flat 3rd with natural 6th',
    explanation:
      'Dorian\'s minor 3rd keeps it minor, while the natural 6th sitting a major sixth above the root brightens it — that flat-3rd-against-natural-6th pull is its identity.',
    modeId: 'dorian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cn-lydian-vs-mixo-bright',
    concept: 'lydian-sharp4-vs-mixo',
    type: 'color_note',
    prompt: 'Lydian dominant aside, plain Lydian differs from Mixolydian by two notes. Which pair?',
    options: ['Lydian has a #4 and a major 7th', 'Lydian has a b7 and b6', 'Lydian has a b2 and #4', 'Lydian has a natural 4 and b7'],
    correctAnswer: 'Lydian has a #4 and a major 7th',
    explanation:
      'Mixolydian is #4-less and has a flat 7th; Lydian raises the 4th and keeps a major 7th. Lydian floats and resolves bright; Mixolydian pulls and resolves bluesy.',
    modeId: 'lydian',
    difficulty: 'advanced',
  },

  // ── Chord fit: richer harmonic contexts ────────────────────────────────
  {
    id: 'q-cf-m6',
    concept: 'dorian-m6-chord',
    type: 'chord_fit',
    prompt: 'The chord is Cm6 (minor with a natural 6th in the voicing). Which mode matches it note-for-note?',
    options: ['Aeolian', 'Dorian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'A minor 6 chord spells out the natural 6th — exactly Dorian\'s color note. Aeolian would clash, since its 6th is flat.',
    modeId: 'dorian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-dom7sharp11',
    concept: 'lydian-dom-7sharp11-chord',
    type: 'chord_fit',
    prompt: 'You see G7#11. Which scale provides that #11 while keeping the dominant 7th?',
    options: ['Mixolydian', 'Lydian dominant (Lydian b7)', 'Ionian', 'Locrian'],
    correctAnswer: 'Lydian dominant (Lydian b7)',
    explanation:
      'A 7#11 chord wants the #4/#11 over a dominant 7th — that is Lydian dominant (the 4th mode of melodic minor), heard as Lydian\'s #4 grafted onto Mixolydian\'s b7.',
    modeId: 'lydian',
    difficulty: 'advanced',
  },
  {
    id: 'q-cf-tonic-major',
    concept: 'ionian-Imaj-chord',
    type: 'chord_fit',
    prompt: 'A Cmaj7 acts as the tonic I chord of C major, with no #11 marked. Which mode is safest?',
    options: ['Lydian', 'Ionian', 'Mixolydian', 'Dorian'],
    correctAnswer: 'Ionian',
    explanation:
      'On a functioning I chord with no #11, Ionian is home. Lydian fits, but its #4 floats away from the grounded tonic the chart is asking for.',
    modeId: 'ionian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-iv-major-lydian',
    concept: 'lydian-IVmaj-chord',
    type: 'chord_fit',
    prompt: 'Over the IV chord (Fmaj7) in the key of C, which mode lets you sound bright without leaving the key?',
    options: ['Ionian', 'F Lydian', 'F Mixolydian', 'Aeolian'],
    correctAnswer: 'F Lydian',
    explanation:
      'The IV chord\'s natural #11 is already in the parent key (B natural over F). F Lydian is the diatonic mode of the IV chord, so it floats while staying in C major.',
    modeId: 'lydian',
    difficulty: 'advanced',
  },
  {
    id: 'q-cf-sus-dominant',
    concept: 'mixo-sus-chord',
    type: 'chord_fit',
    prompt: 'The chart says G7sus4 sitting for several bars. Which mode is the natural fit?',
    options: ['Lydian', 'Mixolydian', 'Locrian', 'Phrygian'],
    correctAnswer: 'Mixolydian',
    explanation:
      'A sus dominant keeps the natural 4th (the suspension) and the flat 7th — both live in Mixolydian, which is the default colour over sus7 chords.',
    modeId: 'mixolydian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-minor-tonic-aeolian',
    concept: 'aeolian-im-tonic-chord',
    type: 'chord_fit',
    prompt: 'A Cm chord is the tonic i of a dark minor-key ballad. Which mode supplies that natural-minor gravity?',
    options: ['Dorian', 'Aeolian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Aeolian',
    explanation:
      'When the minor tonic wants weight and shadow rather than Dorian\'s lift, Aeolian\'s flat 6th is the natural-minor sound a ballad reaches for.',
    modeId: 'aeolian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-iii-phrygian',
    concept: 'phrygian-iii-chord',
    type: 'chord_fit',
    prompt: 'Over the iii chord (Em7) in the key of C, which mode is diatonically correct?',
    options: ['E Aeolian', 'E Dorian', 'E Phrygian', 'E Locrian'],
    correctAnswer: 'E Phrygian',
    explanation:
      'The iii chord built on the 3rd degree of a major key yields Phrygian — the same seven notes of C major starting on E, complete with that flat 2nd (F natural).',
    modeId: 'phrygian',
    difficulty: 'advanced',
  },
  {
    id: 'q-cf-vii-locrian',
    concept: 'locrian-vii-chord',
    type: 'chord_fit',
    prompt: 'The vii chord of a major key (Bm7b5 in C) appears. Which mode is its diatonic match?',
    options: ['B Phrygian', 'B Locrian', 'B Aeolian', 'B Dorian'],
    correctAnswer: 'B Locrian',
    explanation:
      'The mode built on the 7th degree of a major key is Locrian — and its half-diminished tonic chord is exactly the vii(m7b5) you are looking at.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },

  // ── Brightness: ordering & relative-darkness reasoning ─────────────────
  {
    id: 'q-br-order-major',
    concept: 'brightness-order-major',
    type: 'brightness',
    prompt: 'Ranking the three major-quality modes from brightest to darkest, which order is correct?',
    options: ['Lydian, Ionian, Mixolydian', 'Ionian, Lydian, Mixolydian', 'Mixolydian, Ionian, Lydian', 'Lydian, Mixolydian, Ionian'],
    correctAnswer: 'Lydian, Ionian, Mixolydian',
    explanation:
      'Lydian (#4) is brightest, Ionian sits in the middle, and Mixolydian (b7) is the darkest of the major-3rd modes.',
    difficulty: 'intermediate',
  },
  {
    id: 'q-br-order-minor',
    concept: 'brightness-order-minor',
    type: 'brightness',
    prompt: 'From brightest to darkest, how do the three common minor modes rank?',
    options: ['Dorian, Aeolian, Phrygian', 'Phrygian, Aeolian, Dorian', 'Aeolian, Dorian, Phrygian', 'Dorian, Phrygian, Aeolian'],
    correctAnswer: 'Dorian, Aeolian, Phrygian',
    explanation:
      'Dorian\'s natural 6th makes it the brightest minor; Aeolian flats the 6th; Phrygian flats both 6th and 2nd, making it the darkest of the three.',
    difficulty: 'advanced',
  },
  {
    id: 'q-br-brightening-mechanism',
    concept: 'brightness-mechanism-sharps',
    type: 'brightness',
    prompt: 'As you move through the modes from Lydian toward Locrian, what consistently happens to make each darker?',
    options: ['One more scale degree is lowered', 'The root rises a half step', 'The 5th alternates', 'The tempo slows'],
    correctAnswer: 'One more scale degree is lowered',
    explanation:
      'Order the modes Lydian-Ionian-Mixo-Dorian-Aeolian-Phrygian-Locrian and each successive mode flats exactly one more degree — a tidy ladder from brightest to darkest.',
    difficulty: 'advanced',
  },
  {
    id: 'q-br-mixo-vs-ionian',
    concept: 'brightness-mixo-darker-ionian',
    type: 'brightness',
    prompt: 'Why is Mixolydian considered darker than Ionian despite both having a major 3rd?',
    options: ['Its flat 7th removes the leading-tone pull', 'Its raised 4th', 'Its flat 2nd', 'Its diminished 5th'],
    correctAnswer: 'Its flat 7th removes the leading-tone pull',
    explanation:
      'Lowering the 7th strips away the major scale\'s luminous leading tone, relaxing the brightness into the earthier, bluesier dominant sound.',
    modeId: 'mixolydian',
    difficulty: 'intermediate',
  },

  // ── Avoid note: extend to other modes ──────────────────────────────────
  {
    id: 'q-an-ionian-4th',
    concept: 'ionian-avoid-4th',
    type: 'avoid_note',
    prompt: 'Which note is the classic "avoid note" when improvising over a Cmaj7 in Ionian?',
    options: ['The major 7th', 'The natural 4th', 'The 6th', 'The 2nd'],
    correctAnswer: 'The natural 4th',
    explanation:
      'The natural 4th sits a half step above the major 3rd of the chord, creating a harsh clash. Players either pass through it quickly or raise it — which is precisely why Lydian exists.',
    modeId: 'ionian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-an-mixo-4th',
    concept: 'mixo-avoid-4th',
    type: 'avoid_note',
    prompt: 'Over a G7 in Mixolydian, which tone do soloists generally treat as an avoid note?',
    options: ['The flat 7th', 'The natural 4th', 'The major 3rd', 'The 5th'],
    correctAnswer: 'The natural 4th',
    explanation:
      'Just as in Ionian, the natural 4th clashes a half step above the chord\'s major 3rd. It is fine as a suspension or passing tone, but lingering on it muddies the dominant sound.',
    modeId: 'mixolydian',
    difficulty: 'advanced',
  },
  {
    id: 'q-an-dorian-6th-careful',
    concept: 'dorian-color-careful',
    type: 'avoid_note',
    prompt: 'Dorian\'s natural 6th is its color note, but why must it be handled with care over a static minor vamp?',
    options: ['It can pull the ear toward the relative major', 'It is dissonant against the root', 'It is a tritone from the 3rd', 'It clashes with the 5th'],
    correctAnswer: 'It can pull the ear toward the relative major',
    explanation:
      'The natural 6th is a strong, bright tone; leaning on it too hard can make the vamp sound like its relative major rather than minor. Used as a target or passing colour it defines Dorian; overused it dissolves the minor centre.',
    modeId: 'dorian',
    difficulty: 'advanced',
  },

  // ── Tune name: more repertoire across modes ────────────────────────────
  {
    id: 'q-tn-flamenco-sketches',
    concept: 'tune-phrygian-flamenco',
    type: 'tune_name',
    prompt: 'Miles Davis’ "Flamenco Sketches" and the Sketches of Spain palette lean on which mode for their Spanish colour?',
    options: ['Dorian', 'Phrygian', 'Lydian', 'Mixolydian'],
    correctAnswer: 'Phrygian',
    explanation:
      'The Spanish/flamenco colour Miles reached for is the Phrygian flat 2nd — the same half-step-from-the-root sound that defines flamenco guitar.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-little-sunflower',
    concept: 'tune-dorian-sunflower',
    type: 'tune_name',
    prompt: 'Freddie Hubbard’s "Little Sunflower" rides a long suspended minor vamp. Which mode does it live in?',
    options: ['Aeolian', 'Dorian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'Like "So What" and "Maiden Voyage," "Little Sunflower" floats on a Dorian vamp — its natural 6th giving the minor groove that open, hovering brightness.',
    modeId: 'dorian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-fire-dorian',
    concept: 'tune-dorian-evans-modal',
    type: 'tune_name',
    prompt: 'The slow modal vamps of the Kind of Blue session mostly explore which minor mode?',
    options: ['Aeolian', 'Phrygian', 'Dorian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'Kind of Blue is the landmark Dorian record — extended vamps that let players paint with the mode\'s natural-6th colour rather than chase chord changes.',
    modeId: 'dorian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-maria-lydian',
    concept: 'tune-lydian-maria',
    type: 'tune_name',
    prompt: 'The dreamy, floating opening of "Maria" (West Side Story) is a textbook example of which mode’s color?',
    options: ['Ionian', 'Lydian', 'Mixolydian', 'Dorian'],
    correctAnswer: 'Lydian',
    explanation:
      'That suspended, wonderstruck lift on the word "Maria" comes from Lydian\'s raised 4th — the brightest, most floating sound in the diatonic system.',
    modeId: 'lydian',
    difficulty: 'advanced',
  },
  {
    id: 'q-tn-allblues',
    concept: 'tune-mixo-allblues',
    type: 'tune_name',
    prompt: 'Miles Davis’ "All Blues" sits in a 6/8 G groove. Which mode colours its dominant tonality?',
    options: ['Ionian', 'Mixolydian', 'Lydian', 'Dorian'],
    correctAnswer: 'Mixolydian',
    explanation:
      '"All Blues" lives on a G dominant feel; G Mixolydian, with its flat 7th, supplies the bluesy modal colour over the slow waltz.',
    modeId: 'mixolydian',
    difficulty: 'advanced',
  },

];

// ── Utilities ──────────────────────────────────────────────────────────────

export function getQuestionsByType(type: QuestionType): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.type === type);
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion['difficulty']): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByMode(modeId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.modeId === modeId);
}

export function getRandomVideoId(question: QuizQuestion): string | null {
  if (!question.videoIds || question.videoIds.length === 0) return null;
  const index = Math.floor(Math.random() * question.videoIds.length);
  return question.videoIds[index];
}

export function getRandomQuestions(count: number, modeId?: string): QuizQuestion[] {
  const pool = modeId ? getQuestionsByMode(modeId) : QUIZ_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export type QuizLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Build a quiz session for a specific difficulty level. Draws only that
 * level's questions (shuffled), with options shuffled too. Length adapts to
 * how many questions exist at that level (up to questionCount).
 */
// Order easier question types first so a session EASES IN instead of opening
// with a hard application question. Lower number = simpler = shown earlier.
const TYPE_EASE: Record<QuestionType, number> = {
  color_note: 0,
  brightness: 0,
  avoid_note: 1,
  chord_fit: 2,
  tune_name: 2,
  id_by_ear: 3,
};

/**
 * Pick up to `count` questions with NO overlap: never two that test the same
 * `concept`, and at most two questions about the same mode — so one session
 * can't feel repetitive. Backfills (still concept-unique) if the caps run short.
 */
function pickVaried(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const seenConcept = new Set<string>();
  const modeCount: Record<string, number> = {};
  const out: QuizQuestion[] = [];
  for (const q of questions) {
    if (out.length >= count) break;
    const c = q.concept ?? q.id;
    if (seenConcept.has(c)) continue;
    const mode = q.modeId ?? '';
    if (mode && (modeCount[mode] ?? 0) >= 2) continue;
    seenConcept.add(c);
    if (mode) modeCount[mode] = (modeCount[mode] ?? 0) + 1;
    out.push(q);
  }
  if (out.length < count) {
    for (const q of questions) {
      if (out.length >= count) break;
      const c = q.concept ?? q.id;
      if (seenConcept.has(c)) continue;
      seenConcept.add(c);
      out.push(q);
    }
  }
  return out;
}

/**
 * Build a quiz session for a difficulty level. Draws that level's questions,
 * removes overlap (one per concept, max two per mode), then orders them
 * EASY-FIRST so the session starts basic and ramps up. Options are shuffled.
 */
export function buildLeveledQuizSession(level: QuizLevel, questionCount = 10): QuizQuestion[] {
  const pool = [...QUIZ_QUESTIONS.filter((q) => q.difficulty === level)].sort(
    () => Math.random() - 0.5,
  );
  return pickVaried(pool, questionCount)
    .sort((a, b) => (TYPE_EASE[a.type] - TYPE_EASE[b.type]) || Math.random() - 0.5)
    .map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
}

export function countQuestionsAtLevel(level: QuizLevel): number {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === level).length;
}

export function buildQuizSession(questionCount = 10): QuizQuestion[] {
  const beginner = getQuestionsByDifficulty('beginner');
  const intermediate = getQuestionsByDifficulty('intermediate');
  const advanced = getQuestionsByDifficulty('advanced');

  const pool = [
    ...beginner.sort(() => Math.random() - 0.5).slice(0, 5),
    ...intermediate.sort(() => Math.random() - 0.5).slice(0, 4),
    ...advanced.sort(() => Math.random() - 0.5).slice(0, 1),
  ];

  return pool.sort(() => Math.random() - 0.5).slice(0, questionCount);
}

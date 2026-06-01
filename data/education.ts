export type LessonCategory = 'foundations' | 'melody' | 'rhythm' | 'tradition';

export const CATEGORY_ORDER: LessonCategory[] = ['foundations', 'melody', 'rhythm', 'tradition'];

export const CATEGORY_LABELS: Record<LessonCategory, string> = {
  foundations: 'Foundations',
  melody: 'The Grammar of Melody',
  rhythm: 'The Grammar of Rhythm',
  tradition: 'The Living Tradition',
};

export type LessonPageType = 'intro' | 'concept' | 'listen' | 'compare' | 'chord' | 'summary';

export type LessonPage = {
  id: string;
  type: LessonPageType;
  heading: string;
  body: string;
  callout?: string;
  table?: { headers: [string, string]; rows: string[][] };
  steps?: { note: string; size: string; highlight?: boolean }[];
  image?: { uri: string; caption: string };
  // Optional fields used by some traditions (e.g. Modal Jazz listen pages)
  modeId?: string;
  audioUrl?: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  category: string;          // tradition-agnostic; each tradition defines its own categories
  number: number;
  unlockedBy?: string;
  durationMinutes?: number;  // optional (Modal Jazz carries this; Makam uses page count)
  pages: LessonPage[];
};

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-makam',
    title: 'What is a Makam?',
    subtitle: 'More than a scale — a melodic identity',
    category: 'foundations',
    number: 1,
    pages: [
      {
        id: 'what-is-makam-p1',
        type: 'intro',
        heading: 'Not just a scale',
        body: 'In Western music, a scale is a set of notes. In Turkish music, a makam is much more than that. A makam is a complete melodic personality — it includes which notes to use, which notes to emphasize, how the melody should move, where it should begin, where it should rest, and where it must end.',
        callout: 'Think of a makam less like a scale and more like a character.',
      },
      {
        id: 'what-is-makam-p2',
        type: 'concept',
        heading: 'Every makam has a soul',
        body: 'Each makam is associated with a specific mood, a time of day, even a season. Rast is a morning makam — bright and hopeful. Saba is played at dawn and carries deep grief.',
      },
      {
        id: 'what-is-makam-p3',
        type: 'concept',
        heading: '',
        body: 'This isn\'t superstition; it reflects centuries of accumulated musical wisdom about how certain interval relationships affect human emotion.',
      },
      {
        id: 'what-is-makam-p4',
        type: 'concept',
        heading: 'The three rules of a makam',
        body: 'Every makam is defined by three things: its scale (which notes are used and their precise tuning), its seyir (the direction and shape of melodic movement), and its characteristic phrases (specific melodic gestures that identify it). Learn these three things for any makam and you truly know it.',
        callout: 'Scale + Seyir + Characteristic Phrases = A Makam',
      },
      {
        id: 'what-is-makam-p5',
        type: 'summary',
        heading: 'How many makams exist?',
        body: 'Historically, hundreds of makams have been documented in Ottoman and Turkish classical music. Today, around 50–60 are in active use, and roughly 10–15 form the core that every musician must know deeply. This app begins with those 10 foundational makams and is designed to grow alongside you.',
      }
    ],
  },
  {
    id: 'turkish-tuning',
    title: 'The Turkish Tuning System',
    subtitle: 'Why some notes live between the piano keys',
    category: 'foundations',
    number: 2,
    unlockedBy: 'what-is-makam',
    pages: [
      {
        id: 'turkish-tuning-p1',
        type: 'intro',
        heading: 'The Western compromise',
        body: 'Western music uses equal temperament — the octave is divided into exactly 12 equal semitones. This is a mathematical compromise invented to make keyboard instruments playable in all keys. It works, but it flattens the natural resonance of certain intervals.',
      },
      {
        id: 'turkish-tuning-p2',
        type: 'concept',
        heading: 'The Turkish system: 53 commas',
        body: 'Turkish classical music divides the octave into 53 equal parts called "commas" (koma). This allows for far greater precision in tuning. Where Western music has one B♭, Turkish music has multiple versions of that pitch — each a comma or two apart, each with a different emotional quality.',
        callout: 'A comma is approximately 22.6 cents — about one quarter of a Western semitone.',
      },
      {
        id: 'turkish-tuning-p3',
        type: 'compare',
        heading: 'Western vs Turkish: the key differences',
        body: 'The two systems approach pitch, rhythm, and emotion differently:',
        table: {
                  headers: ['Western Music', 'Turkish Makam'],
                  rows: [
                    ['12 equal semitones', '53 unequal commas'],
                    ['Major / Minor scales', 'Makams with seyir'],
                    ['Fixed pitch (A=440Hz)', 'Flexible microtonal pitch'],
                    ['Harmony-centred', 'Melody-centred'],
                    ['Emotion is subjective', 'Emotion is defined by makam'],
                  ],
                },
      },
      {
        id: 'turkish-tuning-p4',
        type: 'concept',
        heading: 'The neutral intervals',
        body: 'The most important consequence of this system is the neutral second and neutral third. These are intervals that sit precisely between the minor and major versions of those intervals.',
      },
      {
        id: 'turkish-tuning-p5',
        type: 'concept',
        heading: '',
        body: 'They exist nowhere on a standard piano. They are the most characteristic sound of Turkish music and the hardest thing for Western-trained ears to internalize.',
      },
      {
        id: 'turkish-tuning-p6',
        type: 'listen',
        heading: 'How to hear microtones',
        body: 'The best way to internalize microtones is not to think about them mathematically but to sing them. Listen to the audio examples in each makam, then try to sing along.',
      },
      {
        id: 'turkish-tuning-p7',
        type: 'summary',
        heading: '',
        body: 'Your ear will find the pitch before your brain can name it. This is how Turkish musicians have always taught — by ear, by imitation, by repetition.',
        callout: 'The goal is not to measure microtones. The goal is to feel them.',
      }
    ],
  },
  {
    id: 'how-to-listen',
    title: 'How to Listen to Turkish Music',
    subtitle: 'A guide for Western ears',
    category: 'foundations',
    number: 3,
    unlockedBy: 'turkish-tuning',
    pages: [
      {
        id: 'how-to-listen-p1',
        type: 'intro',
        heading: 'Your ears are not broken',
        body: 'When Western listeners first hear Turkish classical music, they often feel disoriented. The melodies seem to go nowhere familiar. The tuning sounds slightly "off."',
      },
      {
        id: 'how-to-listen-p2',
        type: 'listen',
        heading: '',
        body: 'The rhythms are irregular. This is not a deficiency in the music or in your ears — it is the sound of a completely different musical logic, one that has been refined over centuries to express things that Western music cannot.',
        callout: 'The notes that sound "out of tune" are the most important notes in the music.',
      },
      {
        id: 'how-to-listen-p3',
        type: 'concept',
        heading: 'Stop waiting for the beat',
        body: 'Western popular music trains us to expect a regular pulse. Turkish classical music — especially taksim — does not provide this. The rhythm is shaped by the phrase, not the other way around.',
      },
      {
        id: 'how-to-listen-p4',
        type: 'concept',
        heading: '',
        body: 'A note is held as long as it needs to be held. Let go of your expectation of pulse and follow the breath of the melody instead.',
      },
      {
        id: 'how-to-listen-p5',
        type: 'listen',
        heading: 'Learn one makam at a time',
        body: 'The fastest way to understand Turkish music is to pick one makam — Rast is a good start — and listen to multiple recordings in that makam before moving on.',
      },
      {
        id: 'how-to-listen-p6',
        type: 'listen',
        heading: '',
        body: 'Your ear will begin to recognize the characteristic phrases, the emotional signature, the way the melody moves. Once you know Rast in your body, Hicaz will teach itself by contrast.',
      },
      {
        id: 'how-to-listen-p7',
        type: 'concept',
        heading: 'The microtones are the message',
        body: 'The notes that sit between the piano keys are not ornaments or accidents. They are the emotional core of Turkish music. The neutral third of Uşşak — not quite minor, not quite major — carries a quality of longing that neither Western scale can achieve. Train yourself to hear these intervals as deliberate choices, not approximations.',
        callout: 'What Western ears hear as "between the notes" is exactly where Turkish music lives.',
      },
      {
        id: 'how-to-listen-p8',
        type: 'concept',
        heading: 'Start with the masters',
        body: 'Begin with Tanburi Cemil Bey\'s recordings from the early 1900s. They are scratchy and ancient-sounding, but they are the clearest possible expression of what this music is.',
      },
      {
        id: 'how-to-listen-p9',
        type: 'summary',
        heading: '',
        body: 'Then move to Münir Nurettin Selçuk for the vocal tradition. Then Niyazi Sayın for the ney. Each reveals a different dimension of the same world.',
      }
    ],
  },
  {
    id: 'what-is-seyir',
    title: 'What is Seyir?',
    subtitle: 'The direction and soul of melodic movement',
    category: 'melody',
    number: 4,
    unlockedBy: 'how-to-listen',
    pages: [
      {
        id: 'what-is-seyir-p1',
        type: 'intro',
        heading: 'The path a melody takes',
        body: 'Seyir (pronounced "say-EAR") means "journey" or "movement" in Turkish. In the context of makam, it describes the characteristic direction a melody travels through its scale. This is not optional — seyir is a rule. Playing a makam\'s notes in the wrong direction changes its identity entirely.',
      },
      {
        id: 'what-is-seyir-p2',
        type: 'concept',
        heading: 'Three types of seyir',
        body: 'Ascending seyir (çıkıcı): the melody begins in the lower register and moves upward, gaining energy. Rast and Hicaz are ascending. Descending seyir (inici): the melody begins high and resolves downward.',
      },
      {
        id: 'what-is-seyir-p3',
        type: 'concept',
        heading: '',
        body: 'Uşşak and Kurd are descending. Undulating seyir (inici-çıkıcı): the melody moves in both directions, circling around a central point.',
        callout: 'Seyir is the difference between asking a question and answering one.',
      },
      {
        id: 'what-is-seyir-p4',
        type: 'concept',
        heading: 'Hicaz scale — ascending seyir',
        body: 'Notice the augmented second between the 2nd and 3rd degrees — the most characteristic interval:',
        steps: [
                  { note: 'La', size: 'half' },
                  { note: 'Si♭', size: 'aug', highlight: true },
                  { note: 'Do#', size: 'half', highlight: true },
                  { note: 'Re', size: 'whole' },
                  { note: 'Mi', size: 'half' },
                  { note: 'Fa', size: 'whole' },
                  { note: 'Sol', size: 'whole' },
                  { note: 'La', size: 'whole' },
                ],
      },
      {
        id: 'what-is-seyir-p5',
        type: 'concept',
        heading: 'Why seyir matters for your playing',
        body: 'When you improvise or compose in a makam, you must honor its seyir. An ascending makam should feel like it is climbing toward something.',
      },
      {
        id: 'what-is-seyir-p6',
        type: 'summary',
        heading: '',
        body: 'A descending makam should feel like it is arriving, settling, concluding. Ignoring seyir produces technically correct notes in emotionally wrong order — like speaking grammatically correct sentences in the wrong sequence.',
      }
    ],
  },
  {
    id: 'makam-families',
    title: 'Makam Families',
    subtitle: 'How makams relate to each other',
    category: 'melody',
    number: 5,
    unlockedBy: 'what-is-seyir',
    pages: [
      {
        id: 'makam-families-p1',
        type: 'intro',
        heading: 'Shared tetrachords',
        body: 'Makams are built from smaller melodic units called tetrachords (dörtlü) and pentachords (beşli). When two makams share the same lower tetrachord, they belong to the same family.',
      },
      {
        id: 'makam-families-p2',
        type: 'concept',
        heading: '',
        body: 'This is why Uşşak and Hüseyni sound related — they share identical lower four notes, but diverge in their upper range and seyir.',
      },
      {
        id: 'makam-families-p3',
        type: 'concept',
        heading: 'The main families',
        body: 'The Rast family includes Rast, Neva, Mahur, and Rehavi — all share a warmth and brightness. The Uşşak family includes Uşşak, Hüseyni, Bayati, and Muhayyer — all share that characteristic neutral second. The Hicaz family includes Hicaz, Hicazkar, and Uzzal — all feature the dramatic augmented second.',
      },
      {
        id: 'makam-families-p4',
        type: 'summary',
        heading: 'Why families matter',
        body: 'Understanding families helps you learn faster. Once you know Rast deeply, Neva becomes much easier. Once Uşşak is in your ear, Hüseyni is already halfway learned. The 10 makams in this app were chosen to represent the major families, so you build a foundation that scales.',
      }
    ],
  },
  {
    id: 'makam-and-emotion',
    title: 'Makam and Emotion',
    subtitle: 'Why music makes you feel what it makes you feel',
    category: 'melody',
    number: 6,
    unlockedBy: 'makam-families',
    pages: [
      {
        id: 'makam-and-emotion-p1',
        type: 'intro',
        heading: 'Emotion is not subjective in makam',
        body: 'In Western music theory, the emotional quality of music is considered largely subjective. In the Turkish makam tradition, it is not. Each makam has a documented emotional character — a hal — that has been refined and agreed upon over centuries.',
      },
      {
        id: 'makam-and-emotion-p2',
        type: 'concept',
        heading: '',
        body: 'Hicaz produces longing and drama. Saba produces grief that is specific, not general. Rast produces calm joy. These are not suggestions; they are the makam\'s identity.',
        callout: 'A makam without its characteristic emotion is like a word without its meaning.',
      },
      {
        id: 'makam-and-emotion-p3',
        type: 'concept',
        heading: 'The science behind the feeling',
        body: 'The emotional quality of a makam comes from the interaction of several factors: the specific tuning of its characteristic intervals (especially the microtonal ones), the tension and resolution created by its seyir, and the accumulated cultural memory of how the makam has been used.',
      },
      {
        id: 'makam-and-emotion-p4',
        type: 'concept',
        heading: '',
        body: 'When you hear Saba, you are hearing centuries of funeral music, laments, and expressions of loss — even if you don\'t know it consciously.',
      },
      {
        id: 'makam-and-emotion-p5',
        type: 'concept',
        heading: 'Time, place, and mood',
        body: 'Traditionally, different makams were considered appropriate for different times of day and seasons. Rast was a morning makam. Uşşak was played at dusk. This was not arbitrary — it reflected an understanding that human emotional states shift through the day, and certain interval relationships resonate more deeply at certain times.',
      },
      {
        id: 'makam-and-emotion-p6',
        type: 'concept',
        heading: '',
        body: 'Whether or not you believe this system, it reveals how seriously the tradition took the relationship between music and human experience.',
      },
      {
        id: 'makam-and-emotion-p7',
        type: 'summary',
        heading: 'Using this in your own music',
        body: 'If you are a composer or producer, understanding makam emotion gives you a precise emotional vocabulary. Instead of "I want this to feel sad," you can ask: "Do I want the resigned sadness of Uşşak, the grief-stricken depth of Saba, or the anguished cry of Huzzam?" Each produces a different kind of sadness — and the difference is audible.',
        callout: 'Turkish music has more words for sadness than English does — and each one sounds different.',
      }
    ],
  },
  {
    id: 'what-is-usul',
    title: 'What is Usul?',
    subtitle: 'The rhythmic heartbeat beneath the melody',
    category: 'rhythm',
    number: 7,
    unlockedBy: 'makam-and-emotion',
    pages: [
      {
        id: 'what-is-usul-p1',
        type: 'intro',
        heading: 'More than a time signature',
        body: 'In Western music, rhythm is often reduced to a time signature — 4/4, 3/4, 6/8. In Turkish music, usul is something far richer. It is a complete rhythmic personality: a specific pattern of strong and weak beats, a tempo character, and an emotional weight that shapes everything the melody can do.',
        callout: 'Usul is to rhythm what makam is to melody — a framework with a soul.',
      },
      {
        id: 'what-is-usul-p2',
        type: 'concept',
        heading: 'The architecture of the beat',
        body: 'Each usul has a fixed number of beats arranged into a specific pattern. Düyek moves in eight beats with a steady, grounded pulse. Aksak limps forward in nine, its asymmetry creating an irresistible forward lean.',
      },
      {
        id: 'what-is-usul-p3',
        type: 'concept',
        heading: '',
        body: 'Semai glides in three, elegant and circular. These are not interchangeable — each usul carries a distinct character that shapes the emotional world of the piece.',
      },
      {
        id: 'what-is-usul-p4',
        type: 'concept',
        heading: 'Simple and complex usuls',
        body: 'Some usuls are simple: Sofyan is 4 beats, Düyek is 8. Others are complex: Devr-i Hindi is 14 beats, Muhammes is 32. The complex usuls create a sense of suspended time — the listener cannot easily predict when the cycle will complete, which creates a particular kind of tension and release that simpler rhythms cannot achieve.',
      },
      {
        id: 'what-is-usul-p5',
        type: 'concept',
        heading: 'Strong and weak beats',
        body: 'Within each usul, beats are not equal. Some are struck strongly (düm), others lightly (tek), and others with medium weight. This hierarchy of beats creates the rhythmic identity of the usul — and an experienced listener can identify an usul from its pattern alone, the way a Western listener might recognize a waltz from its first three beats.',
      },
      {
        id: 'what-is-usul-p6',
        type: 'concept',
        heading: 'The darbuka and kudüm',
        body: 'The primary rhythmic instruments in Turkish classical music are the darbuka (a goblet drum played with the fingers) and the kudüm (a pair of small kettledrums used in Sufi ceremonies).',
      },
      {
        id: 'what-is-usul-p7',
        type: 'concept',
        heading: '',
        body: 'The darbuka produces sharp, precise strokes that articulate the usul pattern. In the best performances, the rhythm and melody breathe together — the usul is not a cage but a conversation partner.',
      },
      {
        id: 'what-is-usul-p8',
        type: 'concept',
        heading: 'The usul as a living thing',
        body: 'In performance, the usul is not just counted — it is felt. Drummers and percussionists internalize the pattern until it becomes instinctive.',
      },
      {
        id: 'what-is-usul-p9',
        type: 'summary',
        heading: '',
        body: 'Melodic instruments breathe within the usul, sometimes anticipating beats, sometimes delaying resolution. This interplay between the fixed usul and the expressive melody is the heartbeat of Turkish classical music.',
        callout: 'You cannot fully hear a makam until you feel the usul beneath it.',
      }
    ],
  },
  {
    id: 'makam-and-usul',
    title: 'Makam and Usul Together',
    subtitle: 'How melody and rhythm create a complete musical world',
    category: 'rhythm',
    number: 8,
    unlockedBy: 'what-is-usul',
    pages: [
      {
        id: 'makam-and-usul-p1',
        type: 'intro',
        heading: 'Two pillars of one tradition',
        body: 'Turkish classical music rests on two foundations: makam and usul. Makam governs the melodic world — which notes to use, how to move between them, where to rest and where to resolve.',
      },
      {
        id: 'makam-and-usul-p2',
        type: 'concept',
        heading: '',
        body: 'Usul governs the rhythmic world — the pulse, the weight of beats, the tempo character. Together they define not just how a piece sounds, but how it feels.',
      },
      {
        id: 'makam-and-usul-p3',
        type: 'concept',
        heading: 'The same makam, different worlds',
        body: 'A makam sounds different depending on which usul carries it. Hicaz in Aksak — with its nine limping beats — feels dramatic and searching.',
      },
      {
        id: 'makam-and-usul-p4',
        type: 'concept',
        heading: '',
        body: 'Hicaz in Sofyan — steady and four-square — feels more dignified, almost ceremonial. The makam provides the emotional palette; the usul determines how that emotion moves through time.',
        callout: 'Changing the usul is like changing the weather in which the makam lives.',
      },
      {
        id: 'makam-and-usul-p5',
        type: 'concept',
        heading: 'Traditional pairings',
        body: 'Over centuries, certain makam-usul combinations became deeply established. Uşşak in Aksak is among the most beloved pairings in Turkish music — the limping rhythm perfectly matching the makam’s yearning character.',
      },
      {
        id: 'makam-and-usul-p6',
        type: 'concept',
        heading: '',
        body: 'Rast in Düyek is the grounded, morning pairing. These are not rules but accumulated wisdom — the result of thousands of compositions finding their natural home.',
      },
      {
        id: 'makam-and-usul-p7',
        type: 'concept',
        heading: 'For the practitioner',
        body: 'If you are composing or improvising in a makam, your choice of usul is one of the most powerful decisions you can make. Start by feeling the makam’s emotional character.',
      },
      {
        id: 'makam-and-usul-p8',
        type: 'summary',
        heading: '',
        body: 'Then ask: does this emotion need the urgency of Aksak, the steadiness of Düyek, the grace of Semai? The right pairing will feel inevitable — as if the melody and rhythm were always meant for each other.',
        callout: 'The great composers did not choose makam and usul separately. They heard them as one thing.',
      }
    ],
  },
  {
    id: 'what-is-taksim',
    title: 'What is Taksim?',
    subtitle: 'The art of improvisation in Turkish music',
    category: 'tradition',
    number: 9,
    unlockedBy: 'makam-and-usul',
    pages: [
      {
        id: 'what-is-taksim-p1',
        type: 'intro',
        heading: 'No sheet music, no fixed rhythm',
        body: 'A taksim is a free-form improvisation performed without a fixed rhythm or composed melody. The musician explores a makam spontaneously, moving through its characteristic phrases, testing its emotional range, and revealing its personality in real time. There is no sheet music. There is no conductor. There is only the musician and the makam.',
        callout: 'A taksim is a conversation between the musician and the makam.',
      },
      {
        id: 'what-is-taksim-p2',
        type: 'concept',
        heading: 'The structure within freedom',
        body: 'Though taksim sounds free, it follows deep rules. The musician must respect the makam\'s seyir — its characteristic direction of movement.',
      },
      {
        id: 'what-is-taksim-p3',
        type: 'concept',
        heading: '',
        body: 'They must visit the makam\'s important degrees in the right order, establish its identity clearly, then explore its upper and lower registers before returning to rest on the finalis. Freedom within form is the essence of taksim.',
      },
      {
        id: 'what-is-taksim-p4',
        type: 'concept',
        heading: 'Why taksim matters',
        body: 'In Turkish classical music, taksim is considered the highest form of musical expression. A composed piece shows what a musician has learned; a taksim shows who they are.',
      },
      {
        id: 'what-is-taksim-p5',
        type: 'concept',
        heading: '',
        body: 'The greatest musicians — Tanburi Cemil Bey, Münir Nurettin Selçuk, Niyazi Sayın — are remembered as much for their taksim as for any composed work.',
        callout: 'Listen to a taksim before listening to a composed piece in the same makam. It will open your ears.',
      },
      {
        id: 'what-is-taksim-p6',
        type: 'listen',
        heading: 'How to listen to a taksim',
        body: 'When listening to a taksim, follow the journey rather than waiting for a melody. Notice when the musician lingers on a note — that note matters.',
      },
      {
        id: 'what-is-taksim-p7',
        type: 'summary',
        heading: '',
        body: 'Notice when the music rises with urgency and when it settles into stillness. A great taksim has the architecture of a short story: exposition, development, climax, resolution.',
      }
    ],
  },
  {
    id: 'the-instruments',
    title: 'The Instruments',
    subtitle: 'The voices of Turkish classical music',
    category: 'tradition',
    number: 10,
    unlockedBy: 'what-is-taksim',
    pages: [
      {
        id: 'the-instruments-p1',
        type: 'intro',
        heading: 'The Ney',
        body: 'The ney is an end-blown flute made from a hollow reed. It is one of the oldest instruments in human history, depicted in Egyptian carvings over 5,000 years old.',
      },
      {
        id: 'the-instruments-p2',
        type: 'concept',
        heading: '',
        body: 'In Turkish and Sufi music, the ney carries a special spiritual weight — its breathy, slightly raw tone is heard as the sound of longing itself.',
      },
      {
        id: 'the-instruments-p3',
        type: 'concept',
        heading: '',
        body: 'Rumi opens the Masnavi with the ney\'s cry as a metaphor for the soul\'s separation from its origin.',
        callout: 'The ney does not produce a note — it releases one.',
      },
      {
        id: 'the-instruments-p4',
        type: 'concept',
        heading: 'The Tanbur',
        body: 'The tanbur is a long-necked lute with a deep, pear-shaped body. It is the primary melodic instrument of Ottoman classical music and the instrument most associated with makam theory.',
      },
      {
        id: 'the-instruments-p5',
        type: 'concept',
        heading: '',
        body: 'Its frets are movable, allowing it to be tuned to the microtonal intervals of the 53-comma system. Tanburi Cemil Bey, who essentially defined Turkish classical music on recording, played the tanbur.',
      },
      {
        id: 'the-instruments-p6',
        type: 'concept',
        heading: 'The Oud',
        body: 'The oud (ud in Turkish) is the fretless short-necked lute that gave its name to the European lute. Without frets, the oud player has complete freedom to produce any microtonal interval.',
      },
      {
        id: 'the-instruments-p7',
        type: 'concept',
        heading: '',
        body: 'This makes it both the most expressive and the most demanding instrument in the tradition — every note must be found by ear, every time. The oud is the heart of Arabic, Turkish, and Persian classical music.',
      },
      {
        id: 'the-instruments-p8',
        type: 'concept',
        heading: 'The Kemençe',
        body: 'The kemençe is a small bowed instrument held vertically on the knee. Its sound is nasal, intense, and immediately recognizable — somewhere between a fiddle and a human voice at its most strained.',
      },
      {
        id: 'the-instruments-p9',
        type: 'concept',
        heading: '',
        body: 'Tanburi Cemil Bey also recorded on kemençe, and those recordings remain among the most emotionally raw in the entire tradition.',
      },
      {
        id: 'the-instruments-p10',
        type: 'concept',
        heading: 'The Kanun',
        body: 'The kanun (qanun) is a large zither with 72 or more strings, played flat on the lap. Levers under each course of strings allow the player to make microtonal adjustments mid-performance.',
      },
      {
        id: 'the-instruments-p11',
        type: 'summary',
        heading: '',
        body: 'A skilled kanun player can adjust a string\'s pitch by a comma between phrases — producing the precise tuning that makam requires in real time.',
      }
    ],
  },
  {
    id: 'ottoman-to-republic',
    title: 'Ottoman to Republic',
    subtitle: 'The great rupture in Turkish musical history',
    category: 'tradition',
    number: 11,
    unlockedBy: 'the-instruments',
    pages: [
      {
        id: 'ottoman-to-republic-p1',
        type: 'intro',
        heading: 'The Ottoman tradition',
        body: 'For five centuries, the Ottoman Empire maintained one of the most sophisticated classical music traditions in the world. Centered in Istanbul, it blended Persian, Arabic, Byzantine, and Central Asian influences into a unique synthesis.',
      },
      {
        id: 'ottoman-to-republic-p2',
        type: 'concept',
        heading: '',
        body: 'The makam system we use today is largely Ottoman in origin — refined in the imperial courts, performed in the great mosques, and transmitted through a rigorous apprenticeship tradition.',
      },
      {
        id: 'ottoman-to-republic-p3',
        type: 'concept',
        heading: 'The Republic and Western music',
        body: 'When Mustafa Kemal Atatürk founded the Turkish Republic in 1923, he pursued a radical modernization program that included music. Western classical music was promoted as the music of civilization.',
      },
      {
        id: 'ottoman-to-republic-p4',
        type: 'concept',
        heading: '',
        body: 'Turkish radio banned traditional makam music at various points. Music conservatories were reorganized along European lines. The rupture was deliberate and profound.',
        callout: 'For a period, you could not hear traditional Turkish music on Turkish radio.',
      },
      {
        id: 'ottoman-to-republic-p5',
        type: 'concept',
        heading: 'What survived',
        body: 'Despite official suppression, the tradition survived — in private homes, in coffeehouses, in the recordings of Tanburi Cemil Bey made before 1915, in the voice of Münir Nurettin Selçuk who continued performing throughout.',
      },
      {
        id: 'ottoman-to-republic-p6',
        type: 'concept',
        heading: '',
        body: 'The tradition proved more resilient than the policy that tried to erase it. By the 1970s, there was a significant revival, and today Turkish classical music is studied, performed, and celebrated worldwide.',
      },
      {
        id: 'ottoman-to-republic-p7',
        type: 'concept',
        heading: 'The living tradition',
        body: 'Turkish classical music today exists in a complex relationship with its own past. It is simultaneously ancient and contemporary — the makams are centuries old, but they are performed by living musicians who bring their own voice to them.',
      },
      {
        id: 'ottoman-to-republic-p8',
        type: 'summary',
        heading: '',
        body: 'The tradition is not a museum piece. It is a living system capable of producing new music, new interpretations, and new emotional territories.',
      }
    ],
  }
];

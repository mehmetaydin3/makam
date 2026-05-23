export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  sections: LessonSection[];
};

export type LessonSection = {
  heading: string;
  body: string;
  callout?: string;
  table?: { headers: [string, string]; rows: string[][] };
  steps?: { note: string; size: string; highlight?: boolean }[];
  image?: { uri: string; caption: string };
};

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-makam',
    title: 'What is a Makam?',
    subtitle: 'More than a scale — a melodic identity',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'Not just a scale',
        body: 'In Western music, a scale is a set of notes. In Turkish music, a makam is much more than that. A makam is a complete melodic personality — it includes which notes to use, which notes to emphasize, how the melody should move, where it should begin, where it should rest, and where it must end.',
        callout: 'Think of a makam less like a scale and more like a character.',
      },
      {
        heading: 'Every makam has a soul',
        body: 'Each makam is associated with a specific mood, a time of day, even a season. Rast is a morning makam — bright and hopeful. Saba is played at dawn and carries deep grief. This isn\'t superstition; it reflects centuries of accumulated musical wisdom about how certain interval relationships affect human emotion.',
      },
      {
        heading: 'The three rules of a makam',
        body: 'Every makam is defined by three things: its scale (which notes are used and their precise tuning), its seyir (the direction and shape of melodic movement), and its characteristic phrases (specific melodic gestures that identify it). Learn these three things for any makam and you truly know it.',
        callout: 'Scale + Seyir + Characteristic Phrases = A Makam',
      },
      {
        heading: 'How many makams exist?',
        body: 'Historically, hundreds of makams have been documented in Ottoman and Turkish classical music. Today, around 50–60 are in active use, and roughly 10–15 form the core that every musician must know deeply. This app begins with those 10 foundational makams and is designed to grow alongside you.',
      },
    ],
  },
  {
    id: 'what-is-seyir',
    title: 'What is Seyir?',
    subtitle: 'The direction and soul of melodic movement',
    estimatedMinutes: 3,
    sections: [
      {
        heading: 'The path a melody takes',
        body: 'Seyir (pronounced "say-EAR") means "journey" or "movement" in Turkish. In the context of makam, it describes the characteristic direction a melody travels through its scale. This is not optional — seyir is a rule. Playing a makam\'s notes in the wrong direction changes its identity entirely.',
      },
      {
        heading: 'Three types of seyir',
        body: 'Ascending seyir (çıkıcı): the melody begins in the lower register and moves upward, gaining energy. Rast and Hicaz are ascending. Descending seyir (inici): the melody begins high and resolves downward. Uşşak and Kurd are descending. Undulating seyir (inici-çıkıcı): the melody moves in both directions, circling around a central point.',
        callout: 'Seyir is the difference between asking a question and answering one.',
      },
      {
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
        heading: 'Why seyir matters for your playing',
        body: 'When you improvise or compose in a makam, you must honor its seyir. An ascending makam should feel like it is climbing toward something. A descending makam should feel like it is arriving, settling, concluding. Ignoring seyir produces technically correct notes in emotionally wrong order — like speaking grammatically correct sentences in the wrong sequence.',
      },
    ],
  },
  {
    id: 'turkish-tuning',
    title: 'The Turkish Tuning System',
    subtitle: 'Why some notes live between the piano keys',
    estimatedMinutes: 5,
    sections: [
      {
        heading: 'The Western compromise',
        body: 'Western music uses equal temperament — the octave is divided into exactly 12 equal semitones. This is a mathematical compromise invented to make keyboard instruments playable in all keys. It works, but it flattens the natural resonance of certain intervals.',
      },
      {
        heading: 'The Turkish system: 53 commas',
        body: 'Turkish classical music divides the octave into 53 equal parts called "commas" (koma). This allows for far greater precision in tuning. Where Western music has one B♭, Turkish music has multiple versions of that pitch — each a comma or two apart, each with a different emotional quality.',
        callout: 'A comma is approximately 22.6 cents — about one quarter of a Western semitone.',
      },
      {
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
        heading: 'The neutral intervals',
        body: 'The most important consequence of this system is the neutral second and neutral third. These are intervals that sit precisely between the minor and major versions of those intervals. They exist nowhere on a standard piano. They are the most characteristic sound of Turkish music and the hardest thing for Western-trained ears to internalize.',
      },
      {
        heading: 'How to hear microtones',
        body: 'The best way to internalize microtones is not to think about them mathematically but to sing them. Listen to the audio examples in each makam, then try to sing along. Your ear will find the pitch before your brain can name it. This is how Turkish musicians have always taught — by ear, by imitation, by repetition.',
        callout: 'The goal is not to measure microtones. The goal is to feel them.',
      },
    ],
  },
  {
    id: 'makam-families',
    title: 'Makam Families',
    subtitle: 'How makams relate to each other',
    estimatedMinutes: 3,
    sections: [
      {
        heading: 'Shared tetrachords',
        body: 'Makams are built from smaller melodic units called tetrachords (dörtlü) and pentachords (beşli). When two makams share the same lower tetrachord, they belong to the same family. This is why Uşşak and Hüseyni sound related — they share identical lower four notes, but diverge in their upper range and seyir.',
      },
      {
        heading: 'The main families',
        body: 'The Rast family includes Rast, Neva, Mahur, and Rehavi — all share a warmth and brightness. The Uşşak family includes Uşşak, Hüseyni, Bayati, and Muhayyer — all share that characteristic neutral second. The Hicaz family includes Hicaz, Hicazkar, and Uzzal — all feature the dramatic augmented second.',
      },
      {
        heading: 'Why families matter',
        body: 'Understanding families helps you learn faster. Once you know Rast deeply, Neva becomes much easier. Once Uşşak is in your ear, Hüseyni is already halfway learned. The 10 makams in this app were chosen to represent the major families, so you build a foundation that scales.',
      },
    ],
  },

  {
    id: 'what-is-usul',
    title: 'What is Usul?',
    subtitle: 'The rhythmic heartbeat beneath the melody',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'More than a time signature',
        body: 'In Western music, rhythm is often reduced to a time signature — 4/4, 3/4, 6/8. In Turkish music, usul is something far richer. It is a complete rhythmic personality: a specific pattern of strong and weak beats, a tempo character, and an emotional weight that shapes everything the melody can do.',
        callout: 'Usul is to rhythm what makam is to melody — a framework with a soul.',
      },
      {
        heading: 'The architecture of the beat',
        body: 'Each usul has a fixed number of beats arranged into a specific pattern. Düyek moves in eight beats with a steady, grounded pulse. Aksak limps forward in nine, its asymmetry creating an irresistible forward lean. Semai glides in three, elegant and circular. These are not interchangeable — each usul carries a distinct character that shapes the emotional world of the piece.',
      },
      {
        heading: 'Strong and weak beats',
        body: 'Within each usul, beats are not equal. Some are struck strongly (düm), others lightly (tek), and others with medium weight. This hierarchy of beats creates the rhythmic identity of the usul — and an experienced listener can identify an usul from its pattern alone, the way a Western listener might recognize a waltz from its first three beats.',
      },
      {
        heading: 'The usul as a living thing',
        body: 'In performance, the usul is not just counted — it is felt. Drummers and percussionists internalize the pattern until it becomes instinctive. Melodic instruments breathe within the usul, sometimes anticipating beats, sometimes delaying resolution. This interplay between the fixed usul and the expressive melody is the heartbeat of Turkish classical music.',
        callout: 'You cannot fully hear a makam until you feel the usul beneath it.',
      },
    ],
  },
  {
    id: 'makam-and-usul',
    title: 'Makam and Usul Together',
    subtitle: 'How melody and rhythm create a complete musical world',
    estimatedMinutes: 5,
    sections: [
      {
        heading: 'Two pillars of one tradition',
        body: 'Turkish classical music rests on two foundations: makam and usul. Makam governs the melodic world — which notes to use, how to move between them, where to rest and where to resolve. Usul governs the rhythmic world — the pulse, the weight of beats, the tempo character. Together they define not just how a piece sounds, but how it feels.',
      },
      {
        heading: 'The same makam, different worlds',
        body: 'A makam sounds different depending on which usul carries it. Hicaz in Aksak — with its nine limping beats — feels dramatic and searching. Hicaz in Sofyan — steady and four-square — feels more dignified, almost ceremonial. The makam provides the emotional palette; the usul determines how that emotion moves through time.',
        callout: 'Changing the usul is like changing the weather in which the makam lives.',
      },
      {
        heading: 'Traditional pairings',
        body: 'Over centuries, certain makam-usul combinations became deeply established. Uşşak in Aksak is among the most beloved pairings in Turkish music — the limping rhythm perfectly matching the makam’s yearning character. Rast in Düyek is the grounded, morning pairing. These are not rules but accumulated wisdom — the result of thousands of compositions finding their natural home.',
      },
      {
        heading: 'For the practitioner',
        body: 'If you are composing or improvising in a makam, your choice of usul is one of the most powerful decisions you can make. Start by feeling the makam’s emotional character. Then ask: does this emotion need the urgency of Aksak, the steadiness of Düyek, the grace of Semai? The right pairing will feel inevitable — as if the melody and rhythm were always meant for each other.',
        callout: 'The great composers did not choose makam and usul separately. They heard them as one thing.',
      },
    ],
  },

  {
    id: 'what-is-taksim',
    title: 'What is Taksim?',
    subtitle: 'The art of improvisation in Turkish music',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'No sheet music, no fixed rhythm',
        body: 'A taksim is a free-form improvisation performed without a fixed rhythm or composed melody. The musician explores a makam spontaneously, moving through its characteristic phrases, testing its emotional range, and revealing its personality in real time. There is no sheet music. There is no conductor. There is only the musician and the makam.',
        callout: 'A taksim is a conversation between the musician and the makam.',
      },
      {
        heading: 'The structure within freedom',
        body: 'Though taksim sounds free, it follows deep rules. The musician must respect the makam\'s seyir — its characteristic direction of movement. They must visit the makam\'s important degrees in the right order, establish its identity clearly, then explore its upper and lower registers before returning to rest on the finalis. Freedom within form is the essence of taksim.',
      },
      {
        heading: 'Why taksim matters',
        body: 'In Turkish classical music, taksim is considered the highest form of musical expression. A composed piece shows what a musician has learned; a taksim shows who they are. The greatest musicians — Tanburi Cemil Bey, Münir Nurettin Selçuk, Niyazi Sayın — are remembered as much for their taksim as for any composed work.',
        callout: 'Listen to a taksim before listening to a composed piece in the same makam. It will open your ears.',
      },
      {
        heading: 'How to listen to a taksim',
        body: 'When listening to a taksim, follow the journey rather than waiting for a melody. Notice when the musician lingers on a note — that note matters. Notice when the music rises with urgency and when it settles into stillness. A great taksim has the architecture of a short story: exposition, development, climax, resolution.',
      },
    ],
  },
  {
    id: 'how-to-listen',
    title: 'How to Listen to Turkish Music',
    subtitle: 'A guide for Western ears',
    estimatedMinutes: 5,
    sections: [
      {
        heading: 'Your ears are not broken',
        body: 'When Western listeners first hear Turkish classical music, they often feel disoriented. The melodies seem to go nowhere familiar. The tuning sounds slightly "off." The rhythms are irregular. This is not a deficiency in the music or in your ears — it is the sound of a completely different musical logic, one that has been refined over centuries to express things that Western music cannot.',
        callout: 'The notes that sound "out of tune" are the most important notes in the music.',
      },
      {
        heading: 'Stop waiting for the beat',
        body: 'Western popular music trains us to expect a regular pulse. Turkish classical music — especially taksim — does not provide this. The rhythm is shaped by the phrase, not the other way around. A note is held as long as it needs to be held. Let go of your expectation of pulse and follow the breath of the melody instead.',
      },
      {
        heading: 'Learn one makam at a time',
        body: 'The fastest way to understand Turkish music is to pick one makam — Rast is a good start — and listen to multiple recordings in that makam before moving on. Your ear will begin to recognize the characteristic phrases, the emotional signature, the way the melody moves. Once you know Rast in your body, Hicaz will teach itself by contrast.',
      },
      {
        heading: 'The microtones are the message',
        body: 'The notes that sit between the piano keys are not ornaments or accidents. They are the emotional core of Turkish music. The neutral third of Uşşak — not quite minor, not quite major — carries a quality of longing that neither Western scale can achieve. Train yourself to hear these intervals as deliberate choices, not approximations.',
        callout: 'What Western ears hear as "between the notes" is exactly where Turkish music lives.',
      },
      {
        heading: 'Start with the masters',
        body: 'Begin with Tanburi Cemil Bey\'s recordings from the early 1900s. They are scratchy and ancient-sounding, but they are the clearest possible expression of what this music is. Then move to Münir Nurettin Selçuk for the vocal tradition. Then Niyazi Sayın for the ney. Each reveals a different dimension of the same world.',
      },
    ],
  },
  {
    id: 'the-instruments',
    title: 'The Instruments',
    subtitle: 'The voices of Turkish classical music',
    estimatedMinutes: 5,
    sections: [
      {
        heading: 'The Ney',
        image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/KizNey.jpg/120px-KizNey.jpg', caption: 'A Turkish ney — made from hollow reed' },
        body: 'The ney is an end-blown flute made from a hollow reed. It is one of the oldest instruments in human history, depicted in Egyptian carvings over 5,000 years old. In Turkish and Sufi music, the ney carries a special spiritual weight — its breathy, slightly raw tone is heard as the sound of longing itself. Rumi opens the Masnavi with the ney\'s cry as a metaphor for the soul\'s separation from its origin.',
        callout: 'The ney does not produce a note — it releases one.',
      },
      {
        heading: 'The Tanbur',
        image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tanbur_2.jpg/120px-Tanbur_2.jpg', caption: 'The tanbur — primary instrument of Ottoman classical music' },
        body: 'The tanbur is a long-necked lute with a deep, pear-shaped body. It is the primary melodic instrument of Ottoman classical music and the instrument most associated with makam theory. Its frets are movable, allowing it to be tuned to the microtonal intervals of the 53-comma system. Tanburi Cemil Bey, who essentially defined Turkish classical music on recording, played the tanbur.',
      },
      {
        heading: 'The Oud',
        body: 'The oud (ud in Turkish) is the fretless short-necked lute that gave its name to the European lute. Without frets, the oud player has complete freedom to produce any microtonal interval. This makes it both the most expressive and the most demanding instrument in the tradition — every note must be found by ear, every time. The oud is the heart of Arabic, Turkish, and Persian classical music.',
      },
      {
        heading: 'The Kemençe',
        body: 'The kemençe is a small bowed instrument held vertically on the knee. Its sound is nasal, intense, and immediately recognizable — somewhere between a fiddle and a human voice at its most strained. Tanburi Cemil Bey also recorded on kemençe, and those recordings remain among the most emotionally raw in the entire tradition.',
      },
      {
        heading: 'The Kanun',
        body: 'The kanun (qanun) is a large zither with 72 or more strings, played flat on the lap. Levers under each course of strings allow the player to make microtonal adjustments mid-performance. A skilled kanun player can adjust a string\'s pitch by a comma between phrases — producing the precise tuning that makam requires in real time.',
      },
    ],
  },
  {
    id: 'makam-and-emotion',
    title: 'Makam and Emotion',
    subtitle: 'Why music makes you feel what it makes you feel',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'Emotion is not subjective in makam',
        body: 'In Western music theory, the emotional quality of music is considered largely subjective. In the Turkish makam tradition, it is not. Each makam has a documented emotional character — a hal — that has been refined and agreed upon over centuries. Hicaz produces longing and drama. Saba produces grief that is specific, not general. Rast produces calm joy. These are not suggestions; they are the makam\'s identity.',
        callout: 'A makam without its characteristic emotion is like a word without its meaning.',
      },
      {
        heading: 'The science behind the feeling',
        body: 'The emotional quality of a makam comes from the interaction of several factors: the specific tuning of its characteristic intervals (especially the microtonal ones), the tension and resolution created by its seyir, and the accumulated cultural memory of how the makam has been used. When you hear Saba, you are hearing centuries of funeral music, laments, and expressions of loss — even if you don\'t know it consciously.',
      },
      {
        heading: 'Time, place, and mood',
        body: 'Traditionally, different makams were considered appropriate for different times of day and seasons. Rast was a morning makam. Uşşak was played at dusk. This was not arbitrary — it reflected an understanding that human emotional states shift through the day, and certain interval relationships resonate more deeply at certain times. Whether or not you believe this system, it reveals how seriously the tradition took the relationship between music and human experience.',
      },
      {
        heading: 'Using this in your own music',
        body: 'If you are a composer or producer, understanding makam emotion gives you a precise emotional vocabulary. Instead of "I want this to feel sad," you can ask: "Do I want the resigned sadness of Uşşak, the grief-stricken depth of Saba, or the anguished cry of Huzzam?" Each produces a different kind of sadness — and the difference is audible.',
        callout: 'Turkish music has more words for sadness than English does — and each one sounds different.',
      },
    ],
  },
  {
    id: 'ottoman-to-republic',
    title: 'Ottoman to Republic',
    subtitle: 'The great rupture in Turkish musical history',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'The Ottoman tradition',
        image: { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cemil.jpg/150px-Cemil.jpg', caption: 'Tanburi Cemil Bey (1873–1916) — the defining voice of Ottoman classical music on record' },
        body: 'For five centuries, the Ottoman Empire maintained one of the most sophisticated classical music traditions in the world. Centered in Istanbul, it blended Persian, Arabic, Byzantine, and Central Asian influences into a unique synthesis. The makam system we use today is largely Ottoman in origin — refined in the imperial courts, performed in the great mosques, and transmitted through a rigorous apprenticeship tradition.',
      },
      {
        heading: 'The Republic and Western music',
        body: 'When Mustafa Kemal Atatürk founded the Turkish Republic in 1923, he pursued a radical modernization program that included music. Western classical music was promoted as the music of civilization. Turkish radio banned traditional makam music at various points. Music conservatories were reorganized along European lines. The rupture was deliberate and profound.',
        callout: 'For a period, you could not hear traditional Turkish music on Turkish radio.',
      },
      {
        heading: 'What survived',
        body: 'Despite official suppression, the tradition survived — in private homes, in coffeehouses, in the recordings of Tanburi Cemil Bey made before 1915, in the voice of Münir Nurettin Selçuk who continued performing throughout. The tradition proved more resilient than the policy that tried to erase it. By the 1970s, there was a significant revival, and today Turkish classical music is studied, performed, and celebrated worldwide.',
      },
      {
        heading: 'The living tradition',
        body: 'Turkish classical music today exists in a complex relationship with its own past. It is simultaneously ancient and contemporary — the makams are centuries old, but they are performed by living musicians who bring their own voice to them. The tradition is not a museum piece. It is a living system capable of producing new music, new interpretations, and new emotional territories.',
      },
    ],
  },
  {
    id: 'usul-and-rhythm',
    title: 'Usul and Rhythm',
    subtitle: 'The heartbeat beneath the melody',
    estimatedMinutes: 4,
    sections: [
      {
        heading: 'What is usul?',
        body: 'Usul (pronounced "oo-SOOL") is the rhythmic cycle that underlies Turkish classical music. Like the tala in Indian classical music or the iqa in Arabic music, usul is not simply a time signature — it is a named pattern of strong and weak beats with a specific character. Each usul has a personality that interacts with the makam it accompanies.',
        callout: 'A makam without its usul is like a poem without its meter.',
      },
      {
        heading: 'Simple and complex usuls',
        body: 'Some usuls are simple: Sofyan is 4 beats, Düyek is 8. Others are complex: Devr-i Hindi is 14 beats, Muhammes is 32. The complex usuls create a sense of suspended time — the listener cannot easily predict when the cycle will complete, which creates a particular kind of tension and release that simpler rhythms cannot achieve.',
      },
      {
        heading: 'The darbuka and kudüm',
        body: 'The primary rhythmic instruments in Turkish classical music are the darbuka (a goblet drum played with the fingers) and the kudüm (a pair of small kettledrums used in Sufi ceremonies). The darbuka produces sharp, precise strokes that articulate the usul pattern. In the best performances, the rhythm and melody breathe together — the usul is not a cage but a conversation partner.',
      },
      {
        heading: 'Usul and makam together',
        body: 'Certain usuls are traditionally paired with certain makams. Hicaz is often paired with Aksak (9 beats). Rast frequently uses Düyek (8 beats). These pairings are not rules but accumulated wisdom — over centuries, musicians discovered which rhythmic cycles brought out the best in each makam. Learning these pairings is part of understanding the tradition at its deepest level.',
        callout: 'When the right usul meets the right makam, the music seems to play itself.',
      },
    ],
  },
];

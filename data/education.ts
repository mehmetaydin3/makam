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
  callout?: string; // highlighted pull quote or key concept
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
];

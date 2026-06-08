// Turkish Makam quiz — 40 questions grounded in the makam data.
// Mirrors the Modal Jazz quiz structure so both traditions' Practice tabs
// share the same screen logic. Question types are makam-specific.

export type QuestionType =
  | 'seyir'
  | 'family'
  | 'emotion'
  | 'durak'
  | 'feature'
  | 'relationship';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  makamId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mq-seyir-hicaz',
    type: 'seyir',
    prompt: 'Which direction does the melody of Hicaz travel?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Hicaz is an ascending (çıkıcı) makam — it begins low and climbs, building tension through its dramatic augmented second.',
    makamId: 'hicaz',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-ussak',
    type: 'seyir',
    prompt: 'What is the seyir of Uşşak?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Descending',
    explanation:
      'Uşşak is descending (inici) — it begins in the upper register and resolves downward, giving it its settling, melancholic quality.',
    makamId: 'ussak',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-rast',
    type: 'seyir',
    prompt: 'Which way does Rast move?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Rast ascends — a bright, hopeful climb from its Sol (G) durak, fitting its joyful morning character.',
    makamId: 'rast',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-kurd',
    type: 'seyir',
    prompt: 'What is the seyir of Kurd?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Descending',
    explanation:
      'Kurd is descending, contributing to its dark, introspective, settling character.',
    makamId: 'kurd',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-saba',
    type: 'seyir',
    prompt: 'Which direction does Saba travel?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Saba is ascending, though its grief-laden intervals make the climb feel like a yearning rather than a triumph.',
    makamId: 'saba',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-seyir-muhayyer',
    type: 'seyir',
    prompt: 'What is the seyir of Muhayyer?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Descending',
    explanation:
      'Muhayyer descends — wandering down from the high register, which gives it its free, introspective feel.',
    makamId: 'muhayyer',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-seyir-nihavend',
    type: 'seyir',
    prompt: 'Which way does Nihavend move?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Descending',
    explanation:
      'Nihavend is descending, reinforcing its resigned, melancholic mood.',
    makamId: 'nihavend',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-seyir-buselik',
    type: 'seyir',
    prompt: 'What is the seyir of Buselik?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Buselik ascends — direct and earnest, climbing with a strong, masculine character.',
    makamId: 'buselik',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-huseyni',
    type: 'family',
    prompt: 'Which family does Hüseyni belong to?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Uşşak',
    explanation:
      'Hüseyni is part of the Uşşak family — it shares the same lower tetrachord as Uşşak but ascends rather than descends.',
    makamId: 'huseyni',
    difficulty: 'beginner',
  },
  {
    id: 'mq-fam-neva',
    type: 'family',
    prompt: 'To which family does Neva belong?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Rast',
    explanation:
      'Neva is in the Rast family, sharing its warmth and brightness. Once you know Rast, Neva is half-learned.',
    makamId: 'neva',
    difficulty: 'beginner',
  },
  {
    id: 'mq-fam-huzzam',
    type: 'family',
    prompt: 'Which family does Huzzam belong to?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Segah',
    explanation:
      'Huzzam is part of the Segah family, built on the distinctive Segah pitch — mystical and intense.',
    makamId: 'huzzam',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-uzzal',
    type: 'family',
    prompt: 'To which family does Uzzal belong?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Hicaz',
    explanation:
      'Uzzal is in the Hicaz family, sharing the dramatic augmented second that defines that family.',
    makamId: 'uzzal',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-mahur',
    type: 'family',
    prompt: 'Which family does Mahur belong to?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Rast',
    explanation:
      'Mahur belongs to the Rast family — bright and confident, with that characteristic Rast brightness.',
    makamId: 'mahur',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-beyati',
    type: 'family',
    prompt: 'To which family does Beyati belong?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Uşşak',
    explanation:
      'Beyati is part of the Uşşak family, sharing its tender, longing character and neutral second.',
    makamId: 'beyati',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-hicazkar',
    type: 'family',
    prompt: 'Which family does Hicazkar belong to?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Hicaz',
    explanation:
      'Hicazkar is in the Hicaz family — a grand, majestic expansion of the Hicaz sound.',
    makamId: 'hicazkar',
    difficulty: 'advanced',
  },
  {
    id: 'mq-fam-irak',
    type: 'family',
    prompt: 'To which family does Irak belong?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Rast',
    explanation:
      'Irak belongs to the Rast family, though it is ancient and solemn where Rast is joyful.',
    makamId: 'irak',
    difficulty: 'advanced',
  },
  {
    id: 'mq-emo-saba',
    type: 'emotion',
    prompt: 'Which makam is associated with grief, weeping, and profound sadness?',
    options: ['Saba', 'Rast', 'Çargah', 'Mahur'],
    correctAnswer: 'Saba',
    explanation:
      'Saba carries deep grief and spiritual sorrow — traditionally played at dawn, it is the sound of weeping in Turkish music.',
    makamId: 'saba',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-rast',
    type: 'emotion',
    prompt: 'Which makam expresses joyful, serene, dignified feeling?',
    options: ['Rast', 'Saba', 'Huzzam', 'Kurd'],
    correctAnswer: 'Rast',
    explanation:
      'Rast is bright and hopeful — a morning makam, dignified and serene. It is often the first makam a student learns.',
    makamId: 'rast',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-hicaz',
    type: 'emotion',
    prompt: 'Which makam is described as exotic, dramatic, and yearning?',
    options: ['Hicaz', 'Neva', 'Buselik', 'Çargah'],
    correctAnswer: 'Hicaz',
    explanation:
      'Hicaz is intense and dramatic, its augmented second giving it an exotic, yearning quality.',
    makamId: 'hicaz',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-kurd',
    type: 'emotion',
    prompt: 'Which makam carries a dark, solemn, introspective mood?',
    options: ['Kurd', 'Rast', 'Mahur', 'Neva'],
    correctAnswer: 'Kurd',
    explanation:
      'Kurd is dark and rugged — solemn and introspective, descending into stillness.',
    makamId: 'kurd',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-emo-cargah',
    type: 'emotion',
    prompt: 'Which makam is bright, clear, joyful, and uncomplicated?',
    options: ['Çargah', 'Saba', 'Huzzam', 'Kurd'],
    correctAnswer: 'Çargah',
    explanation:
      'Çargah is the most straightforward bright makam — clear and joyful, often compared to a Western major scale.',
    makamId: 'cargah',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-emo-huzzam',
    type: 'emotion',
    prompt: 'Which makam combines grief and anguish with spiritual intensity?',
    options: ['Huzzam', 'Rast', 'Çargah', 'Neva'],
    correctAnswer: 'Huzzam',
    explanation:
      'Huzzam is intensely emotional — grief and anguish elevated to spiritual expression.',
    makamId: 'huzzam',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-emo-segah',
    type: 'emotion',
    prompt: 'Which makam is mystical, devotional, and transcendent?',
    options: ['Segah', 'Buselik', 'Mahur', 'Kurd'],
    correctAnswer: 'Segah',
    explanation:
      'Segah is elevated and devotional — built on its distinctive pitch, it carries a transcendent, mystical quality.',
    makamId: 'segah',
    difficulty: 'advanced',
  },
  {
    id: 'mq-emo-nihavend',
    type: 'emotion',
    prompt: 'Which makam feels melancholic, resigned, and tender?',
    options: ['Nihavend', 'Rast', 'Hicaz', 'Çargah'],
    correctAnswer: 'Nihavend',
    explanation:
      'Nihavend is resigned and tender — often compared to a Western minor scale in its melancholy.',
    makamId: 'nihavend',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-rast',
    type: 'durak',
    prompt: 'On which note does Rast come to rest (its durak)?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Sol (G)',
    explanation:
      'Rast rests on Sol (G) — its durak, the note of final repose.',
    makamId: 'rast',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-ussak',
    type: 'durak',
    prompt: 'What is the durak (resting note) of Uşşak?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'La (A)',
    explanation:
      'Uşşak rests on La (A), the tonal home it descends toward.',
    makamId: 'ussak',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-hicaz',
    type: 'durak',
    prompt: 'On which note does Hicaz rest?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Re (D)',
    explanation:
      'Hicaz has its durak on Re (D).',
    makamId: 'hicaz',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-cargah',
    type: 'durak',
    prompt: 'What is the durak of Çargah?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Do (C)',
    explanation:
      'Çargah rests on Do (C) — fitting its clear, uncomplicated character (çargah literally relates to the 4th position).',
    makamId: 'cargah',
    difficulty: 'advanced',
  },
  {
    id: 'mq-durak-huseyni',
    type: 'durak',
    prompt: 'What is the resting note of Hüseyni?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'La (A)',
    explanation:
      'Hüseyni rests on La (A), shared with its Uşşak-family relatives.',
    makamId: 'huseyni',
    difficulty: 'advanced',
  },
  {
    id: 'mq-durak-saba',
    type: 'durak',
    prompt: 'On which note does Saba rest?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Re (D)',
    explanation:
      'Saba rests on Re (D), the ground beneath its grief-laden ascent.',
    makamId: 'saba',
    difficulty: 'advanced',
  },
  {
    id: 'mq-feat-augsecond',
    type: 'feature',
    prompt: 'Which makam is defined by its dramatic augmented second?',
    options: ['Hicaz', 'Rast', 'Uşşak', 'Çargah'],
    correctAnswer: 'Hicaz',
    explanation:
      'The augmented second between the 2nd and 3rd degrees is the signature of Hicaz — the most characteristic interval in the makam.',
    makamId: 'hicaz',
    difficulty: 'beginner',
  },
  {
    id: 'mq-feat-huseyni-ussak',
    type: 'feature',
    prompt: 'Hüseyni and Uşşak share an identical lower tetrachord. How do they differ?',
    options: ['Hüseyni ascends, Uşşak descends', 'They are identical', 'Different durak', 'Different family'],
    correctAnswer: 'Hüseyni ascends, Uşşak descends',
    explanation:
      'They share the same lower four notes, but Hüseyni ascends (noble, heroic) while Uşşak descends (melancholic) — seyir is what separates them.',
    makamId: 'huseyni',
    difficulty: 'advanced',
  },
  {
    id: 'mq-feat-neutral-ussak',
    type: 'feature',
    prompt: 'Which makam family is known for its characteristic neutral second?',
    options: ['Uşşak', 'Hicaz', 'Çargah', 'Rast'],
    correctAnswer: 'Uşşak',
    explanation:
      'The Uşşak family is defined by its neutral second — the microtonal interval between minor and major that gives it its longing quality.',
    makamId: 'ussak',
    difficulty: 'advanced',
  },
  {
    id: 'mq-feat-cargah-western',
    type: 'feature',
    prompt: 'Which makam most resembles a Western major scale?',
    options: ['Çargah', 'Hicaz', 'Saba', 'Kurd'],
    correctAnswer: 'Çargah',
    explanation:
      'Çargah, with its clear and uncomplicated brightness, is the closest makam to a Western major scale.',
    makamId: 'cargah',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-feat-nihavend-western',
    type: 'feature',
    prompt: 'Which makam is often compared to the Western minor scale?',
    options: ['Nihavend', 'Rast', 'Hicaz', 'Segah'],
    correctAnswer: 'Nihavend',
    explanation:
      'Nihavend closely parallels the Western harmonic/natural minor in its melancholic resignation.',
    makamId: 'nihavend',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-feat-saba-unusual',
    type: 'feature',
    prompt: 'Saba is unusual among makams because of what feature?',
    options: ['Its unexpected interval that thwarts resolution', 'It has no durak', 'It uses only 4 notes', 'It is purely descending'],
    correctAnswer: 'Its unexpected interval that thwarts resolution',
    explanation:
      'Saba contains a famously unsettling interval that denies the ear an expected resolution — the musical source of its grief.',
    makamId: 'saba',
    difficulty: 'advanced',
  },
  {
    id: 'mq-rel-rast-neva',
    type: 'relationship',
    prompt: 'Rast and Neva belong to the same family. What do they share?',
    options: ['Warmth and brightness', 'The augmented second', 'A neutral second', 'Descending seyir'],
    correctAnswer: 'Warmth and brightness',
    explanation:
      'Both Rast-family makams share a characteristic warmth and brightness — learning Rast makes Neva far easier.',
    makamId: 'neva',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-rel-segah-huzzam',
    type: 'relationship',
    prompt: 'What connects Segah and Huzzam?',
    options: ['Both built on the Segah pitch', 'Both descend', 'Both rest on Sol', 'Both are bright'],
    correctAnswer: 'Both built on the Segah pitch',
    explanation:
      'Segah and Huzzam share the distinctive Segah pitch as their foundation, giving both their elevated, intense quality.',
    makamId: 'huzzam',
    difficulty: 'advanced',
  },
  {
    id: 'mq-rel-hicaz-family',
    type: 'relationship',
    prompt: 'Hicaz, Uzzal, and Hicazkar all share what defining feature?',
    options: ['The augmented second', 'A descending seyir', 'The same durak', 'A neutral third'],
    correctAnswer: 'The augmented second',
    explanation:
      'All three Hicaz-family makams feature the dramatic augmented second that gives the family its passionate, exotic character.',
    difficulty: 'advanced',
  },
  {
    id: 'mq-rel-ussak-family',
    type: 'relationship',
    prompt: 'Uşşak, Hüseyni, Beyati, and Muhayyer form one family. What unites them?',
    options: ['A shared neutral second', 'The augmented second', 'A Do durak', 'Bright major character'],
    correctAnswer: 'A shared neutral second',
    explanation:
      'The Uşşak family is bound by its characteristic neutral second — the microtonal interval at the heart of its longing.',
    difficulty: 'advanced',
  },

  // ══════════════════════════════════════════════════════════════════════
  // ADDED: depth questions — weighted to beginner & intermediate so a
  // beginner session is varied rather than dominated by one makam. All
  // grounded in the makam data (seyir, durak, family, character).
  // ══════════════════════════════════════════════════════════════════════

  {
    id: 'mq-seyir-neva',
    type: 'seyir',
    prompt: 'Which direction does Neva travel?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Neva ascends, sharing the bright, rising character of its Rast family.',
    makamId: 'neva',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-huseyni',
    type: 'seyir',
    prompt: 'What is the seyir of Hüseyni?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Hüseyni ascends purposefully toward its dominant — the opposite emotional arc from its sighing relative Uşşak, which descends.',
    makamId: 'huseyni',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-mahur',
    type: 'seyir',
    prompt: 'Which way does Mahur move?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Mahur ascends — bright and confident, climbing in true Rast-family fashion.',
    makamId: 'mahur',
    difficulty: 'beginner',
  },
  {
    id: 'mq-seyir-uzzal',
    type: 'seyir',
    prompt: 'What is the seyir of Uzzal?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Uzzal ascends, like its Hicaz-family kin, climbing through the dramatic augmented second.',
    makamId: 'uzzal',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-seyir-hicazkar',
    type: 'seyir',
    prompt: 'Which direction does Hicazkar travel?',
    options: ['Ascending', 'Descending', 'Undulating'],
    correctAnswer: 'Ascending',
    explanation:
      'Hicazkar ascends — a grand, majestic expansion of the rising Hicaz sound.',
    makamId: 'hicazkar',
    difficulty: 'intermediate',
  },

  {
    id: 'mq-emo-ussak',
    type: 'emotion',
    prompt: 'Which makam is the sound of longing and sighing, unresolved emotion?',
    options: ['Uşşak', 'Çargah', 'Mahur', 'Rast'],
    correctAnswer: 'Uşşak',
    explanation:
      'Uşşak descends like a sigh; its neutral second gives an ache no piano key can produce — the makam of longing.',
    makamId: 'ussak',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-huseyni',
    type: 'emotion',
    prompt: 'Which makam expresses a noble, heroic ache — the complex feeling of evening and longing, neither pure grief nor joy?',
    options: ['Hüseyni', 'Saba', 'Çargah', 'Mahur'],
    correctAnswer: 'Hüseyni',
    explanation:
      'Hüseyni climbs with noble intention; it carries the bittersweet ache of evening — aware, alive, and longing.',
    makamId: 'huseyni',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-neva',
    type: 'emotion',
    prompt: 'Which makam shares Rast’s warmth and brightness, feeling bright and uplifting?',
    options: ['Neva', 'Saba', 'Kurd', 'Huzzam'],
    correctAnswer: 'Neva',
    explanation:
      'Neva belongs to the Rast family and carries its warm, bright, uplifting character.',
    makamId: 'neva',
    difficulty: 'beginner',
  },
  {
    id: 'mq-emo-mahur',
    type: 'emotion',
    prompt: 'Which makam is bright, confident, and grand — full of Rast-family brightness?',
    options: ['Mahur', 'Saba', 'Kurd', 'Uşşak'],
    correctAnswer: 'Mahur',
    explanation:
      'Mahur is bright and confident, expanding the Rast family\'s characteristic brightness on a grand scale.',
    makamId: 'mahur',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-emo-buselik',
    type: 'emotion',
    prompt: 'Which makam has a direct, earnest, strong character as it climbs?',
    options: ['Buselik', 'Saba', 'Huzzam', 'Uşşak'],
    correctAnswer: 'Buselik',
    explanation:
      'Buselik ascends with a strong, earnest, direct character — plainspoken and resolute.',
    makamId: 'buselik',
    difficulty: 'intermediate',
  },

  {
    id: 'mq-fam-muhayyer',
    type: 'family',
    prompt: 'To which family does Muhayyer belong?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Uşşak',
    explanation:
      'Muhayyer is an Uşşak-family makam, sharing its neutral second, though it wanders down from the high register.',
    makamId: 'muhayyer',
    difficulty: 'beginner',
  },
  {
    id: 'mq-fam-saba',
    type: 'family',
    prompt: 'Which family does Saba belong to?',
    options: ['Rast', 'Uşşak', 'Saba', 'Hicaz'],
    correctAnswer: 'Saba',
    explanation:
      'Saba heads its own family — its unsettling interval that thwarts resolution is too distinctive to fold into another group.',
    makamId: 'saba',
    difficulty: 'beginner',
  },
  {
    id: 'mq-fam-kurd',
    type: 'family',
    prompt: 'To which family does Kurd belong?',
    options: ['Rast', 'Kurd', 'Hicaz', 'Segah'],
    correctAnswer: 'Kurd',
    explanation:
      'Kurd anchors its own family, marked by its dark, descending, introspective character.',
    makamId: 'kurd',
    difficulty: 'beginner',
  },
  {
    id: 'mq-fam-segah',
    type: 'family',
    prompt: 'Which family does Segah belong to?',
    options: ['Rast', 'Uşşak', 'Hicaz', 'Segah'],
    correctAnswer: 'Segah',
    explanation:
      'Segah heads the Segah family, built on its own distinctive pitch — mystical and devotional.',
    makamId: 'segah',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-fam-nihavend',
    type: 'family',
    prompt: 'To which family does Nihavend belong?',
    options: ['Rast', 'Uşşak', 'Nihavend', 'Segah'],
    correctAnswer: 'Nihavend',
    explanation:
      'Nihavend heads its own family — often likened to the Western minor scale in its resigned melancholy.',
    makamId: 'nihavend',
    difficulty: 'intermediate',
  },

  {
    id: 'mq-durak-neva',
    type: 'durak',
    prompt: 'On which note does Neva come to rest?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'La (A)',
    explanation:
      'Neva rests on La (A), even though, like Rast, it is a bright ascending makam.',
    makamId: 'neva',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-kurd',
    type: 'durak',
    prompt: 'What is the durak of Kurd?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Re (D)',
    explanation:
      'Kurd rests on Re (D), descending into stillness on its durak.',
    makamId: 'kurd',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-mahur',
    type: 'durak',
    prompt: 'On which note does Mahur rest?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Sol (G)',
    explanation:
      'Mahur rests on Sol (G), the same durak as Rast, the family it belongs to.',
    makamId: 'mahur',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-nihavend',
    type: 'durak',
    prompt: 'What is the durak of Nihavend?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'Re (D)',
    explanation:
      'Nihavend rests on Re (D), settling there in its resigned, minor-like descent.',
    makamId: 'nihavend',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-durak-buselik',
    type: 'durak',
    prompt: 'On which note does Buselik rest?',
    options: ['Sol (G)', 'La (A)', 'Re (D)', 'Do (C)'],
    correctAnswer: 'La (A)',
    explanation:
      'Buselik rests on La (A), climbing earnestly from and back to that durak.',
    makamId: 'buselik',
    difficulty: 'intermediate',
  },

  {
    id: 'mq-feat-rast-warm-third',
    type: 'feature',
    prompt: 'What gives Rast its warmth that a Western major scale cannot replicate?',
    options: ['A slightly lowered 3rd and 6th degree', 'An augmented second', 'A flat 2nd', 'A diminished 5th'],
    correctAnswer: 'A slightly lowered 3rd and 6th degree',
    explanation:
      'Rast tunes its 3rd and 6th degrees slightly lower than Western equivalents (the koma-flattened pitches), giving a warmth no equal-tempered major scale can match.',
    makamId: 'rast',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-feat-hicaz-interval-order',
    type: 'feature',
    prompt: 'What is the signature melodic move of Hicaz?',
    options: ['A minor second followed by an augmented second', 'Two whole tones in a row', 'A descending neutral second', 'A perfect fourth leap'],
    correctAnswer: 'A minor second followed by an augmented second',
    explanation:
      'Hicaz lurches upward from a lowered 2nd to a raised 3rd — a minor second immediately followed by an augmented second, the dramatic gesture at its heart.',
    makamId: 'hicaz',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-feat-ussak-neutral-second',
    type: 'feature',
    prompt: 'Uşşak opens with which characteristic gesture?',
    options: ['A droop to its neutral second', 'A leap to the augmented third', 'A rise to the sharp fourth', 'A fall to the flat fifth'],
    correctAnswer: 'A droop to its neutral second',
    explanation:
      'Uşşak begins on the root and immediately droops to the neutral second before settling on the third — that falling sigh is its emotional signature.',
    makamId: 'ussak',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-rel-ussak-huseyni-seyir',
    type: 'relationship',
    prompt: 'Uşşak and Hüseyni share the same lower tetrachord. What sets them apart?',
    options: ['Their seyir — Uşşak descends, Hüseyni ascends', 'Their durak', 'Their family', 'The augmented second'],
    correctAnswer: 'Their seyir — Uşşak descends, Hüseyni ascends',
    explanation:
      'Same lower four notes, opposite motion: Uşşak sighs downward (melancholic) while Hüseyni climbs (noble, heroic). Seyir is what distinguishes the pair.',
    makamId: 'huseyni',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-rel-rast-mahur',
    type: 'relationship',
    prompt: 'Mahur and Rast belong to the same family. What do they share?',
    options: ['Brightness and the Sol durak', 'A descending seyir', 'The augmented second', 'A neutral second'],
    correctAnswer: 'Brightness and the Sol durak',
    explanation:
      'Both are bright, confident Rast-family makams resting on Sol (G) — Mahur is essentially Rast made grand.',
    makamId: 'mahur',
    difficulty: 'intermediate',
  },
  {
    id: 'mq-rel-saba-grief',
    type: 'relationship',
    prompt: 'What musical feature is the source of Saba’s grief?',
    options: ['An unexpected interval that denies resolution', 'A bright raised fourth', 'A major third', 'A perfect cadence'],
    correctAnswer: 'An unexpected interval that denies resolution',
    explanation:
      'Saba contains an unsettling interval that thwarts the resolution the ear expects — the musical root of its weeping, grief-laden character.',
    makamId: 'saba',
    difficulty: 'intermediate',
  },

];

export function getQuestionsByType(type: QuestionType): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.type === type);
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion['difficulty']): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByMakam(makamId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.makamId === makamId);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Build a quiz session for a specific difficulty level — only that level's
 * questions, shuffled, with options shuffled too.
 */
// Easier, more intuitive question types first so a session eases in.
const TYPE_EASE: Record<QuestionType, number> = {
  seyir: 0,
  emotion: 0,
  family: 1,
  durak: 1,
  feature: 2,
  relationship: 2,
};

/**
 * Pick `count` questions that feel VARIED: cap how many of one question-type a
 * single session can have (so it isn't five "which seyir?" in a row), at most
 * two about the same makam, and never the exact same makam+type twice.
 */
function pickVaried(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const maxPerType = Math.max(2, Math.ceil(count * 0.35));
  const seen = new Set<string>();
  const typeCount: Record<string, number> = {};
  const makamCount: Record<string, number> = {};
  const out: QuizQuestion[] = [];
  const consider = (enforce: boolean) => {
    for (const q of questions) {
      if (out.length >= count) break;
      const key = (q.makamId ?? '') + '|' + q.type;
      if (seen.has(key)) continue;
      if (enforce) {
        if ((typeCount[q.type] ?? 0) >= maxPerType) continue;
        const mk = q.makamId ?? '';
        if (mk && (makamCount[mk] ?? 0) >= 2) continue;
      }
      seen.add(key);
      typeCount[q.type] = (typeCount[q.type] ?? 0) + 1;
      if (q.makamId) makamCount[q.makamId] = (makamCount[q.makamId] ?? 0) + 1;
      out.push(q);
    }
  };
  consider(true);
  if (out.length < count) consider(false); // backfill, still no exact makam+type repeat
  return out;
}

export function buildLeveledQuizSession(level: QuizLevel, questionCount = 10): QuizQuestion[] {
  const pool = shuffle(QUIZ_QUESTIONS.filter((q) => q.difficulty === level));
  return pickVaried(pool, questionCount)
    .sort((a, b) => (TYPE_EASE[a.type] - TYPE_EASE[b.type]) || Math.random() - 0.5)
    .map((q) => ({ ...q, options: shuffle(q.options) }));
}

export function countQuestionsAtLevel(level: QuizLevel): number {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === level).length;
}

export function buildQuizSession(questionCount = 10): QuizQuestion[] {
  // Shuffle questions AND their options for variety each session.
  return shuffle(QUIZ_QUESTIONS).slice(0, questionCount).map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
}

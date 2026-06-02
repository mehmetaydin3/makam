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
export function buildLeveledQuizSession(level: QuizLevel, questionCount = 10): QuizQuestion[] {
  const pool = QUIZ_QUESTIONS.filter((q) => q.difficulty === level);
  return shuffle(pool).slice(0, questionCount).map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
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

export type Seyir = 'ascending' | 'descending' | 'undulating';

export type ScaleDegree = {
  degree: number;
  name: string;
  cents: number; // distance from root in cents
  westernNearest: string; // closest western note name
  isCharacteristic?: boolean; // is this the note that defines the makam's color
};

export type Makam = {
  id: string;
  name: string;
  pronunciation: string;
  family: string;
  seyir: Seyir;
  durak: string; // root / finalis
  guclu: string; // dominant
  scale: ScaleDegree[];
  mood: string[];
  timeOfDay: string;
  season: string;
  description: string;
  characteristicPhrase: string;
  relatedMakams: string[];
  audio: {
    toneFile: string | null;
    sampleFile: string | null;
  };
  notablePieces: {
    title: string;
    composer: string;
  }[];
  color: string; // UI accent per makam
};

export const MAKAMS: Makam[] = [
  {
    id: 'rast',
    name: 'Rast',
    pronunciation: 'rahst',
    family: 'Rast',
    seyir: 'ascending',
    durak: 'Sol (G)',
    guclu: 'Re (D)',
    scale: [
      { degree: 1, name: 'Sol', cents: 0, westernNearest: 'G', isCharacteristic: false },
      { degree: 2, name: 'La', cents: 204, westernNearest: 'A' },
      { degree: 3, name: 'Si Koma♭', cents: 294, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 4, name: 'Do', cents: 498, westernNearest: 'C' },
      { degree: 5, name: 'Re', cents: 702, westernNearest: 'D' },
      { degree: 6, name: 'Mi Koma♭', cents: 906, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 7, name: 'Fa#', cents: 1088, westernNearest: 'F#' },
      { degree: 8, name: 'Sol', cents: 1200, westernNearest: 'G' },
    ],
    mood: ['Joyful', 'Serene', 'Dignified', 'Hopeful'],
    timeOfDay: 'Morning',
    season: 'Spring',
    description:
      'Rast is the most foundational of all makams — often called the "mother makam." It is the starting point for most students of Turkish classical music. Its character is bright, calm, and uplifting. The third and sixth degrees are tuned slightly lower than their Western equivalents, giving it a warmth that a major scale cannot replicate.',
    characteristicPhrase:
      'Begins on the root, rises stepwise through the fifth, then reaches upward with a characteristic flutter on the sixth degree before resolving.',
    relatedMakams: ['Mahur', 'Neva', 'Rehavi'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Rast Saz Semaisi', composer: 'Tanburi Cemil Bey' },
      { title: 'Yine Bir Gülnihal', composer: 'Hacı Arif Bey' },
    ],
    color: '#C8975A',
  },
  {
    id: 'ussak',
    name: 'Uşşak',
    pronunciation: 'oosh-SHAHK',
    family: 'Uşşak',
    seyir: 'descending',
    durak: 'La (A)',
    guclu: 'Re (D)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si♭ koma+', cents: 151, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 3, name: 'Do', cents: 294, westernNearest: 'C' },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E' },
      { degree: 6, name: 'Fa', cents: 853, westernNearest: 'F' },
      { degree: 7, name: 'Sol', cents: 1000, westernNearest: 'G' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Melancholic', 'Longing', 'Tender', 'Intimate'],
    timeOfDay: 'Late afternoon',
    season: 'Autumn',
    description:
      'Uşşak is one of the oldest and most beloved makams in Turkish music. Its defining feature is the neutral second — the second degree sits between a minor and major second, producing an ache that is impossible to achieve on a Western piano. It descends naturally, as if sighing. It is the makam of longing and unresolved emotion.',
    characteristicPhrase:
      'Opens on the root and immediately droops to the characteristic neutral second before settling on the third — this falling gesture is the emotional signature of Uşşak.',
    relatedMakams: ['Bayati', 'Hüseyni', 'Muhayyer'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Uşşak Peşrev', composer: 'Hammamizade İsmail Dede Efendi' },
      { title: 'Geçti Bezm-i Safâ', composer: 'Hacı Arif Bey' },
    ],
    color: '#7A6E9E',
  },
  {
    id: 'hicaz',
    name: 'Hicaz',
    pronunciation: 'hee-JAHZ',
    family: 'Hicaz',
    seyir: 'ascending',
    durak: 'Re (D)',
    guclu: 'La (A)',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D' },
      { degree: 2, name: 'Mi♭', cents: 90, westernNearest: 'E♭' },
      { degree: 3, name: 'Fa#', cents: 408, westernNearest: 'F#', isCharacteristic: true },
      { degree: 4, name: 'Sol', cents: 498, westernNearest: 'G' },
      { degree: 5, name: 'La', cents: 702, westernNearest: 'A' },
      { degree: 6, name: 'Si♭', cents: 792, westernNearest: 'B♭' },
      { degree: 7, name: 'Do', cents: 996, westernNearest: 'C' },
      { degree: 8, name: 'Re', cents: 1200, westernNearest: 'D' },
    ],
    mood: ['Exotic', 'Dramatic', 'Intense', 'Yearning'],
    timeOfDay: 'Midday',
    season: 'Summer',
    description:
      'Hicaz is perhaps the most immediately recognizable makam to Western ears — its augmented second between the second and third degrees is striking and unmistakable. It carries a dramatic, almost cinematic intensity. Named after the Hejaz region of Arabia, it evokes desert landscapes and spiritual longing. Its ascending leaping motion is its defining gesture.',
    characteristicPhrase:
      'The signature move is the leap from the lowered second to the raised third — a minor second followed immediately by an augmented second, creating a dramatic lurch upward.',
    relatedMakams: ['Hicazkar', 'Uzzal', 'Zirgüleli Hicaz'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Hicaz Saz Semaisi', composer: 'Tanburi Cemil Bey' },
      { title: 'Dil Bir Perî-veş Yâre Düştü', composer: 'Hammamizade İsmail Dede Efendi' },
    ],
    color: '#B85C38',
  },
  {
    id: 'huseyni',
    name: 'Hüseyni',
    pronunciation: 'hoo-SAY-nee',
    family: 'Uşşak',
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Mi (E)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si♭ koma+', cents: 151, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 3, name: 'Do', cents: 294, westernNearest: 'C' },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E', isCharacteristic: true },
      { degree: 6, name: 'Fa', cents: 853, westernNearest: 'F' },
      { degree: 7, name: 'Sol', cents: 1000, westernNearest: 'G' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Noble', 'Heroic', 'Deep', 'Resolved'],
    timeOfDay: 'Afternoon',
    season: 'Spring / Summer',
    description:
      'Hüseyni shares its lower tetrachord with Uşşak but differs in its seyir — it climbs purposefully toward the fifth (Mi) as its dominant, giving it a more resolved, noble character compared to Uşşak\'s sighing descent. It is one of the most structurally important makams and serves as a gateway to understanding the Uşşak family.',
    characteristicPhrase:
      'Rises with intention from the root through the neutral second and third, landing with confidence on the dominant fifth — the opposite emotional arc from Uşşak.',
    relatedMakams: ['Uşşak', 'Muhayyer', 'Beyati'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Hüseyni Peşrev', composer: 'Hafız Post' },
      { title: 'Mey İçmekten Men Etme', composer: 'Mustafa Itri' },
    ],
    color: '#4A7C59',
  },
  {
    id: 'saba',
    name: 'Saba',
    pronunciation: 'sah-BAH',
    family: 'Saba',
    seyir: 'ascending',
    durak: 'Re (D)',
    guclu: 'La♭ (A♭)',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D' },
      { degree: 2, name: 'Mi♭ koma+', cents: 151, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 3, name: 'Fa', cents: 294, westernNearest: 'F' },
      { degree: 4, name: 'Sol♭', cents: 430, westernNearest: 'G♭', isCharacteristic: true },
      { degree: 5, name: 'La♭', cents: 566, westernNearest: 'A♭' },
      { degree: 6, name: 'Si♭', cents: 792, westernNearest: 'B♭' },
      { degree: 7, name: 'Do', cents: 996, westernNearest: 'C' },
      { degree: 8, name: 'Re', cents: 1200, westernNearest: 'D' },
    ],
    mood: ['Grief', 'Weeping', 'Profound sadness', 'Spiritual depth'],
    timeOfDay: 'Dawn',
    season: 'Winter',
    description:
      'Saba is the makam of grief. Its compressed lower tetrachord — with two consecutive neutral intervals stacked closely together — creates a sound of almost unbearable sadness. It is traditionally associated with funerals, laments, and deep spiritual poetry. No other makam conveys raw sorrow as directly as Saba.',
    characteristicPhrase:
      'Hovers in the lower register, circling between the root and the flattened fourth with a sense of weight and gravity, rarely rising above the fifth.',
    relatedMakams: ['Saba Zemzeme', 'Hüzzam'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Saba Ilahi', composer: 'Various (folk tradition)' },
      { title: 'Saba Peşrev', composer: 'Tanburi Cemil Bey' },
    ],
    color: '#3A5068',
  },
  {
    id: 'segah',
    name: 'Segah',
    pronunciation: 'seh-GAH',
    family: 'Segah',
    seyir: 'ascending',
    durak: 'Mi Koma♭ (E♭+)',
    guclu: 'Si♭ koma+ (B♭+)',
    scale: [
      { degree: 1, name: 'Mi Koma♭', cents: 0, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 2, name: 'Fa#', cents: 204, westernNearest: 'F#' },
      { degree: 3, name: 'Sol#', cents: 386, westernNearest: 'G#' },
      { degree: 4, name: 'La', cents: 498, westernNearest: 'A' },
      { degree: 5, name: 'Si♭ koma+', cents: 702, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 6, name: 'Do', cents: 906, westernNearest: 'C' },
      { degree: 7, name: 'Re', cents: 1088, westernNearest: 'D' },
      { degree: 8, name: 'Mi Koma♭', cents: 1200, westernNearest: 'E♭' },
    ],
    mood: ['Mystical', 'Devotional', 'Elevated', 'Transcendent'],
    timeOfDay: 'Night',
    season: 'Winter',
    description:
      'Segah is one of the most spiritually charged makams in the repertoire. Its root sits on a microtone that exists nowhere on a Western piano — a quarter-tone between E♭ and E. This untethered quality gives it an otherworldly, floating feeling. It is deeply associated with Sufi music and religious ceremony.',
    characteristicPhrase:
      'Floats upward from its microtonal root, creating an immediate sense of displacement from Western tonality — the listener feels "between worlds."',
    relatedMakams: ['Hüzzam', 'Ferahnak', 'Irak'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Segah Mevlevi Ayin', composer: 'Hammamizade İsmail Dede Efendi' },
      { title: 'Segah Beste', composer: 'Mustafa Itri' },
    ],
    color: '#5C4A7A',
  },
  {
    id: 'kurd',
    name: 'Kurd',
    pronunciation: 'koord',
    family: 'Kurd',
    seyir: 'descending',
    durak: 'Re (D)',
    guclu: 'La (A)',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D' },
      { degree: 2, name: 'Mi♭', cents: 90, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 3, name: 'Fa', cents: 294, westernNearest: 'F' },
      { degree: 4, name: 'Sol', cents: 498, westernNearest: 'G' },
      { degree: 5, name: 'La', cents: 702, westernNearest: 'A' },
      { degree: 6, name: 'Si♭', cents: 792, westernNearest: 'B♭' },
      { degree: 7, name: 'Do', cents: 996, westernNearest: 'C' },
      { degree: 8, name: 'Re', cents: 1200, westernNearest: 'D' },
    ],
    mood: ['Dark', 'Solemn', 'Introspective', 'Rugged'],
    timeOfDay: 'Evening',
    season: 'Autumn / Winter',
    description:
      'Kurd is one of the most straightforward makams for Western ears to grasp — its scale closely resembles a Phrygian mode, with a characteristic lowered second degree. It descends naturally and has a dark, grounded quality. Despite its accessibility, it carries great emotional weight and is a staple of both folk and classical traditions.',
    characteristicPhrase:
      'Steps down from the fifth with a characteristic half-step drop to the lowered second, then resolves to the root — a falling, conclusive motion.',
    relatedMakams: ['Hicaz', 'Kürdilihicazkar'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Kürd Peşrev', composer: 'Hafız Post' },
      { title: 'Kurd Saz Semaisi', composer: 'Tanburi Cemil Bey' },
    ],
    color: '#6B5B45',
  },
  {
    id: 'neva',
    name: 'Neva',
    pronunciation: 'neh-VAH',
    family: 'Rast',
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Re (D)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si', cents: 204, westernNearest: 'B' },
      { degree: 3, name: 'Do koma+', cents: 294, westernNearest: 'C', isCharacteristic: true },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E' },
      { degree: 6, name: 'Fa# koma-', cents: 884, westernNearest: 'F#', isCharacteristic: true },
      { degree: 7, name: 'Sol#', cents: 1088, westernNearest: 'G#' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Calm', 'Balanced', 'Elegant', 'Bright'],
    timeOfDay: 'Morning to midday',
    season: 'Spring',
    description:
      'Neva is an elegant, well-balanced makam from the Rast family. It shares much of Rast\'s warmth but sits a fifth higher, giving it a slightly brighter, more open character. It is considered one of the most "complete" makams — its melodic movement covers the full range gracefully in both directions.',
    characteristicPhrase:
      'Moves through its range with a natural elegance, neither lingering too long below nor reaching too dramatically upward — a balanced, flowing melodic personality.',
    relatedMakams: ['Rast', 'Mahur', 'Hüseyni'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Neva Kâr', composer: 'Mustafa Itri' },
      { title: 'Neva Peşrev', composer: 'Hammamizade İsmail Dede Efendi' },
    ],
    color: '#5A8A7A',
  },
  {
    id: 'buselik',
    name: 'Buselik',
    pronunciation: 'boo-seh-LIK',
    family: 'Buselik',
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Mi (E)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si', cents: 204, westernNearest: 'B' },
      { degree: 3, name: 'Do', cents: 294, westernNearest: 'C', isCharacteristic: true },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E' },
      { degree: 6, name: 'Fa', cents: 792, westernNearest: 'F', isCharacteristic: true },
      { degree: 7, name: 'Sol', cents: 996, westernNearest: 'G' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Strong', 'Masculine', 'Direct', 'Earnest'],
    timeOfDay: 'Morning',
    season: 'Spring',
    description:
      'Buselik is the makam that feels most familiar to Western ears — it closely resembles a natural minor scale. This makes it a gentle entry point for musicians transitioning from Western theory. Yet within the Turkish tradition it carries its own distinct identity and movement rules. Its character is strong and direct, without the melancholy of Uşşak or the drama of Hicaz.',
    characteristicPhrase:
      'Climbs steadily and purposefully from root to dominant, with little ornamentation — Buselik states its intention directly, without ambiguity.',
    relatedMakams: ['Hüseyni', 'Uşşak', 'Acem Buselik'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Buselik Peşrev', composer: 'Kemani Hızır Ağa' },
      { title: 'Buselik Saz Semaisi', composer: 'Tanburi Cemil Bey' },
    ],
    color: '#7A8A6A',
  },
  {
    id: 'cargah',
    name: 'Çargah',
    pronunciation: 'char-GAH',
    family: 'Çargah',
    seyir: 'ascending',
    durak: 'Do (C)',
    guclu: 'Sol (G)',
    scale: [
      { degree: 1, name: 'Do', cents: 0, westernNearest: 'C' },
      { degree: 2, name: 'Re', cents: 204, westernNearest: 'D' },
      { degree: 3, name: 'Mi', cents: 408, westernNearest: 'E', isCharacteristic: true },
      { degree: 4, name: 'Fa', cents: 498, westernNearest: 'F' },
      { degree: 5, name: 'Sol', cents: 702, westernNearest: 'G' },
      { degree: 6, name: 'La', cents: 906, westernNearest: 'A' },
      { degree: 7, name: 'Si', cents: 1110, westernNearest: 'B', isCharacteristic: true },
      { degree: 8, name: 'Do', cents: 1200, westernNearest: 'C' },
    ],
    mood: ['Bright', 'Clear', 'Joyful', 'Uncomplicated'],
    timeOfDay: 'Morning',
    season: 'Spring / Summer',
    description:
      'Çargah is the Turkish makam that sits closest to the Western C major scale. Its intervals are nearly identical to equal temperament, making it the most accessible makam for beginners. Yet in the Turkish tradition it carries its own identity and is not treated as merely a major scale — its seyir, characteristic phrases, and emotional context are distinctly its own.',
    characteristicPhrase:
      'Opens brightly on the root and ascends with a natural lightness — this is the makam of clarity, the one that sounds most like sunlight.',
    relatedMakams: ['Rast', 'Mahur'],
    audio: {
      toneFile: null,
      sampleFile: null,
    },
    notablePieces: [
      { title: 'Çargah Peşrev', composer: 'Hammamizade İsmail Dede Efendi' },
      { title: 'Çargah Saz Semaisi', composer: 'Tanburi Cemil Bey' },
    ],
    color: '#C8A84B',
  },
];

export const getMakamById = (id: string): Makam | undefined =>
  MAKAMS.find((m) => m.id === id);

export const getMakamsByFamily = (family: string): Makam[] =>
  MAKAMS.filter((m) => m.family === family);

export const getMakamsBySeyir = (seyir: Seyir): Makam[] =>
  MAKAMS.filter((m) => m.seyir === seyir);

export const MAKAM_FAMILIES = [...new Set(MAKAMS.map((m) => m.family))];
export const SEYIR_TYPES: Seyir[] = ['ascending', 'descending', 'undulating'];

export type Seyir = 'ascending' | 'descending' | 'undulating';

export type ScaleDegree = {
  degree: number;
  name: string;
  cents: number;
  westernNearest: string;
  isCharacteristic?: boolean;
};

export type AudioExample = {
  youtubeId: string;
  title: string;
  composer: string;
  performer: string;
  year?: string;
  description: string;
};

export type Makam = {
  id: string;
  name: string;
  pronunciation: string;
  family: string;
  seyir: Seyir;
  durak: string;
  guclu: string;
  scale: ScaleDegree[];
  mood: string[];
  timeOfDay: string;
  season: string;
  description: string;
  characteristicPhrase: string;
  westernAnalogy?: string;
  relatedMakams: string[];
  audio: {
    toneFile: string | null;
    sampleFile: string | null;
  };
  listening: {
    sarki: AudioExample;
    taksim: AudioExample;
  };
  notablePieces: {
    title: string;
    composer: string;
    usul?: string;
  }[];
  commonUsuls: string[];
  characterNote?: string;
  color: string;
};

export const MAKAMS: Makam[] = [
  {
    id: 'rast',
    name: 'Rast',
    pronunciation: 'rahst',
    family: 'Rast',
    commonUsuls: ['Düyek', 'Sofyan', 'Yürük Semai'],
    seyir: 'ascending',
    durak: 'Sol (G)',
    guclu: 'Re (D)',
    scale: [
      { degree: 1, name: 'Sol', cents: 0, westernNearest: 'G', isCharacteristic: false },
      { degree: 2, name: 'La', cents: 204, westernNearest: 'A' },
      { degree: 3, name: 'Si Koma b', cents: 350, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 4, name: 'Do', cents: 498, westernNearest: 'C' },
      { degree: 5, name: 'Re', cents: 702, westernNearest: 'D' },
      { degree: 6, name: 'Mi Koma b', cents: 851, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 7, name: 'Fa#', cents: 1088, westernNearest: 'F#' },
      { degree: 8, name: 'Sol', cents: 1200, westernNearest: 'G' },
    ],
    mood: ['Joyful', 'Serene', 'Dignified', 'Hopeful'],
    timeOfDay: 'Morning',
    season: 'Spring',
    description: 'Rast is the most foundational of all makams — often called the "mother makam." It is the starting point for most students of Turkish classical music. Its character is bright, calm, and uplifting. The third and sixth degrees are tuned slightly lower than their Western equivalents, giving it a warmth that a major scale cannot replicate.',
    characteristicPhrase: 'Begins on the root, rises stepwise through the fifth, then reaches upward with a characteristic flutter on the sixth degree before resolving.',
    westernAnalogy: 'Think of Rast as a major scale with a warm, slightly flat third and sixth. Where C major feels bright and resolved, Rast feels sunny but tinged with longing — like a major scale that has lived too long in the East to forget what it felt like.',
    relatedMakams: ['Mahur', 'Neva', 'Rehavi'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'IjDQqGb2Rn0',
        title: 'Yine Bir Gulnihal',
        composer: 'Hammamizade Ismail Dede Efendi',
        performer: 'Zeki Muren',
        year: '1950s',
        description: 'One of the most beloved songs in all of Turkish classical music. Composed in the 19th century, it captures Rast\'s essential quality — bright and hopeful, yet touched with a warmth that pure joy never quite has. Zeki Muren\'s voice brings out the dignity the makam is known for.',
      },
      taksim: {
        youtubeId: 'a0uiKnOqCdk',
        title: 'Rast Taksim',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Tanburi Cemil Bey was the greatest tanbur player in Ottoman history. In this taksim — a free improvisation with no fixed rhythm or melody — he explores Rast the way a poet might explore a feeling: circling it, approaching it from different angles, letting it breathe. Listen for the characteristic third degree, slightly lower than Western ears expect, giving the scale its warm, almost aching quality.',
      },
    },
    notablePieces: [
      { title: 'Rast Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Devr-i Hindi' },
      { title: 'Yine Bir Gulnihal', composer: 'Haci Arif Bey', usul: 'Duyek' },
    ],
    color: '#C8975A',
  },
  {
    id: 'ussak',
    name: 'Uşşak',
    pronunciation: 'oosh-SHAHK',
    family: 'Uşşak',
    commonUsuls: ['Aksak', 'Duyek', 'Devr-i Hindi'],
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
    description: 'Ussak is one of the oldest and most beloved makams in Turkish music. Its defining feature is the neutral second — the second degree sits between a minor and major second, producing an ache that is impossible to achieve on a Western piano. It descends naturally, as if sighing. It is the makam of longing and unresolved emotion.',
    characteristicPhrase: 'Opens on the root and immediately droops to the characteristic neutral second before settling on the third — this falling gesture is the emotional signature of Ussak.',
    westernAnalogy: 'The neutral second of Ussak sits exactly between a minor 2nd and a major 2nd — a sound no piano key can produce. If you know Phrygian mode, Ussak is its more emotional, sighing Turkish cousin.',
    relatedMakams: ['Bayati', 'Huseyni', 'Muhayyer'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: '0DDM0jTfOY8',
        title: 'Gamzedeyim Deva Bulmam',
        composer: 'Tatyos Efendi',
        performer: 'Muzeyyen Senar',
        year: '1975',
        description: 'Composed by Kemani Tatyos Efendi — an Armenian master who defined the Istanbul sound — this is considered the definitive Ussak sarki. The lyrics speak of incurable longing, which is precisely what Ussak expresses. Muzeyyen Senar, the Republic\'s greatest voice, sings it with a restraint that makes it devastating.',
      },
      taksim: {
        youtubeId: 'vG9Mxykr0uk',
        title: 'Ussak Taksim (Lavta)',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Ussak is the makam of lovers — its name literally means those who are infatuated. Cemil Bey\'s taksim captures this without sentimentality. Notice how the melody keeps returning to the slightly flattened second degree — that single microtonal inflection is what separates Ussak\'s ache from ordinary sadness.',
      },
    },
    notablePieces: [
      { title: 'Ussak Pesrev', composer: 'Hammamizade Ismail Dede Efendi', usul: 'Devr-i Hindi' },
      { title: 'Gecti Bezm-i Safa', composer: 'Haci Arif Bey', usul: 'Aksak' },
    ],
    color: '#7A6E9E',
  },
  {
    id: 'hicaz',
    name: 'Hicaz',
    pronunciation: 'hee-JAHZ',
    family: 'Hicaz',
    commonUsuls: ['Aksak', 'Duyek', 'Curcuna'],
    seyir: 'ascending',
    durak: 'Re (D)',
    guclu: 'La (A)',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D' },
      { degree: 2, name: 'Mi♭', cents: 90, westernNearest: 'E♭', isCharacteristic: true },
      { degree: 3, name: 'Fa#', cents: 420, westernNearest: 'F#', isCharacteristic: true },
      { degree: 4, name: 'Sol', cents: 498, westernNearest: 'G' },
      { degree: 5, name: 'La', cents: 702, westernNearest: 'A' },
      { degree: 6, name: 'Si♭', cents: 792, westernNearest: 'B♭' },
      { degree: 7, name: 'Do', cents: 996, westernNearest: 'C' },
      { degree: 8, name: 'Re', cents: 1200, westernNearest: 'D' },
    ],
    mood: ['Exotic', 'Dramatic', 'Intense', 'Yearning'],
    timeOfDay: 'Midday',
    season: 'Summer',
    description: 'Hicaz is perhaps the most immediately recognizable makam to Western ears — its augmented second between the second and third degrees is striking and unmistakable. It carries a dramatic, almost cinematic intensity. Named after the Hejaz region of Arabia, it evokes desert landscapes and spiritual longing. Its ascending leaping motion is its defining gesture.',
    characteristicPhrase: 'The signature move is the leap from the lowered second to the raised third — a minor second followed immediately by an augmented second, creating a dramatic lurch upward.',
    westernAnalogy: 'Hicaz\'s augmented second is the same interval Western composers use to evoke the exotic Orient. But in Turkish music it is not a color — it\'s the grammar. Think of the Spanish Phrygian scale, but with more fire.',
    relatedMakams: ['Hicazkar', 'Uzzal', 'Zirguleli Hicaz'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'RN22jH97StA',
        title: 'Senede Bir Gun',
        composer: 'Sekip Ayhan Ozisik',
        performer: 'Zeki Muren',
        year: '1970',
        description: 'Hicaz is the makam most associated with Zeki Muren — Turkey\'s most celebrated singer — and this is among his signature recordings. The song\'s drama mirrors the makam\'s character perfectly: the augmented second interval that defines Hicaz gives it an intensity that feels both ancient and immediate. Every Turkish person knows this song.',
      },
      taksim: {
        youtubeId: 'qJYdxRSjCQY',
        title: 'Hicaz Taksim (Tanbur)',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Of all the makams, Hicaz travels the farthest emotionally. Named after the Hijaz region of Arabia, it carries within it centuries of longing, prayer, and passion. Cemil Bey\'s taksim on tanbur captures its dramatic leaps — particularly that striking augmented second that Western ears often describe as bluesy or Middle Eastern. It is neither. It is simply Hicaz.',
      },
    },
    notablePieces: [
      { title: 'Hicaz Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Aksak' },
      { title: 'Dil Bir Peri-ves Yare Dustu', composer: 'Hammamizade Ismail Dede Efendi', usul: 'Duyek' },
    ],
    color: '#B85C38',
  },
  {
    id: 'huseyni',
    name: 'Hüseyni',
    pronunciation: 'hoo-SAY-nee',
    family: 'Uşşak',
    commonUsuls: ['Duyek', 'Aksak', 'Devr-i Hindi'],
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Mi (E)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si♭ koma+', cents: 151, westernNearest: 'B♭', isCharacteristic: true },
      { degree: 3, name: 'Do', cents: 294, westernNearest: 'C' },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E', isCharacteristic: false },
      { degree: 6, name: 'Fa', cents: 853, westernNearest: 'F' },
      { degree: 7, name: 'Sol', cents: 1000, westernNearest: 'G' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Noble', 'Heroic', 'Deep', 'Resolved'],
    timeOfDay: 'Afternoon',
    season: 'Spring / Summer',
    description: 'Huseyni shares its lower tetrachord with Ussak but differs in its seyir — it climbs purposefully toward the fifth as its dominant, giving it a more resolved, noble character compared to Ussak\'s sighing descent. It is one of the most structurally important makams and serves as a gateway to understanding the Ussak family.',
    characteristicPhrase: 'Rises with intention from the root through the neutral second and third, landing with confidence on the dominant fifth — the opposite emotional arc from Ussak.',
    westernAnalogy: 'Huseyni shares its structure with the Dorian mode, but its neutral second gives it a weight and longing that Dorian never quite achieves. If Dorian is reflective, Huseyni is quietly heartbroken.',
    relatedMakams: ['Ussak', 'Muhayyer', 'Beyati'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: '90lQZUdRpdA',
        title: 'Aksam Oldu Huzunlendim Ben Yine',
        composer: 'Semahat Ozdenses',
        performer: 'Muzeyyen Senar',
        year: '1978',
        description: 'A song about the specific sadness of evening — when the day ends and longing returns. Huseyni is the makam of this feeling: not grief, not joy, but the complex ache of being alive and aware. Muzeyyen Senar\'s interpretation is considered definitive. The composer wrote it to match the makam\'s character precisely.',
      },
      taksim: {
        youtubeId: '0C9K8lMXYFQ',
        title: 'Huseyni Taksim',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Huseyni is one of the oldest and most important makams in the Ottoman tradition. It was believed to be most effective at dawn — when the night has ended but the day has not fully arrived. Cemil Bey\'s taksim inhabits that threshold feeling. Notice how the melody rises and falls with a searching quality, never quite settling, always moving toward something just out of reach.',
      },
    },
    notablePieces: [
      { title: 'Huseyni Pesrev', composer: 'Hafiz Post', usul: 'Devr-i Hindi' },
      { title: 'Mey Icmekten Men Etme', composer: 'Mustafa Itri', usul: 'Duyek' },
    ],
    color: '#4A7C59',
  },
  {
    id: 'saba',
    name: 'Saba',
    pronunciation: 'sah-BAH',
    family: 'Saba',
    commonUsuls: ['Aksak', 'Devr-i Hindi', 'Sofyan'],
    seyir: 'ascending',
    durak: 'Re (D)',
    guclu: 'Lab (Ab)',
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
    description: 'Saba is the makam of grief. Its compressed lower tetrachord — with two consecutive neutral intervals stacked closely together — creates a sound of almost unbearable sadness. It is traditionally associated with funerals, laments, and deep spiritual poetry. No other makam conveys raw sorrow as directly as Saba.',
    characteristicPhrase: 'Hovers in the lower register, circling between the root and the flattened fourth with a sense of weight and gravity, rarely rising above the fifth.',
    westernAnalogy: 'Saba has no direct Western equivalent. Its compressed lower tetrachord creates a claustrophobic, grief-laden sound that sits between minor and something darker. Think of a minor scale that has given up hope.',
    relatedMakams: ['Saba Zemzeme', 'Huzzam'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'aOSH09nuKiI',
        title: 'Ben Seni Unutmak Icin Sevmedim',
        composer: 'Amir Ates',
        performer: 'Nesrin Sipahi',
        year: '1972',
        description: 'Saba is the makam of grief — deep, unresolved, searching. This song\'s title translates as "I did not love you in order to forget you," which captures Saba\'s emotional core exactly. Nesrin Sipahi\'s voice has a plaintive quality that matches the makam\'s character. Once you hear Saba, you will recognize it immediately — it sounds like no other makam.',
      },
      taksim: {
        youtubeId: 'oIRjjtHGC2A',
        title: 'Saba Taksim',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Of all the makams, Saba is considered the most emotionally raw. Ottoman theorists said it evokes courage in the face of sorrow — the kind of strength that comes not from avoiding pain but from going through it completely. Cemil Bey\'s taksim is quietly devastating. Listen for the characteristic phrase that drops unexpectedly low — that descent is Saba\'s signature, its emotional center of gravity.',
      },
    },
    notablePieces: [
      { title: 'Saba Ilahi', composer: 'Various (folk tradition)', usul: 'Sofyan' },
      { title: 'Saba Pesrev', composer: 'Tanburi Cemil Bey', usul: 'Devr-i Hindi' },
    ],
    color: '#3A5068',
  },
  {
    id: 'segah',
    name: 'Segah',
    characterNote: 'Segah\'s microtonality lives in the tonic itself — the opening Eb sits between Eb and E, giving the whole scale its floating, otherworldly quality.',
    pronunciation: 'seh-GAH',
    family: 'Segah',
    commonUsuls: ['Aksak', 'Muhammes', 'Semai'],
    seyir: 'ascending',
    durak: 'Mi Koma b (Eb+)',
    guclu: 'Si♭ koma+ (Bb+)',
    scale: [
      { degree: 1, name: 'Mi Koma b', cents: 0, westernNearest: 'E♭', isCharacteristic: false },
      { degree: 2, name: 'Fa#', cents: 204, westernNearest: 'F#' },
      { degree: 3, name: 'Sol#', cents: 386, westernNearest: 'G#' },
      { degree: 4, name: 'La', cents: 498, westernNearest: 'A' },
      { degree: 5, name: 'Si♭ koma+', cents: 702, westernNearest: 'B♭', isCharacteristic: false },
      { degree: 6, name: 'Do', cents: 906, westernNearest: 'C' },
      { degree: 7, name: 'Re', cents: 1088, westernNearest: 'D' },
      { degree: 8, name: 'Mi Koma b', cents: 1200, westernNearest: 'E♭' },
    ],
    mood: ['Mystical', 'Devotional', 'Elevated', 'Transcendent'],
    timeOfDay: 'Night',
    season: 'Winter',
    description: 'Segah is one of the most spiritually charged makams in the repertoire. Its root sits on a microtone that exists nowhere on a Western piano — a quarter-tone between Eb and E. This untethered quality gives it an otherworldly, floating feeling. It is deeply associated with Sufi music and religious ceremony.',
    characteristicPhrase: 'Floats upward from its microtonal root, creating an immediate sense of displacement from Western tonality — the listener feels between worlds.',
    westernAnalogy: 'Segah\'s tonic sits between Eb and E on the equal-tempered scale — a note that literally does not exist on a piano. If you have ever felt that minor scales don\'t go deep enough, Segah goes deeper.',
    relatedMakams: ['Huzzam', 'Ferahnak', 'Irak'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'zLv3U6_WySU',
        title: 'Donulmez Aksamın Ufkundayiz',
        composer: 'Munir Nurettin Selcuk',
        performer: 'Bulent Ersoy',
        year: '2018',
        description: 'The lyrics are by Yahya Kemal Beyatli — one of Turkey\'s greatest poets — and the music by Munir Nurettin Selcuk. The opening line translates as "We stand at the horizon of an evening from which there is no return." Segah is the makam of mystical longing, and this song is its perfect expression.',
      },
      taksim: {
        youtubeId: 'hRNzmbucy08',
        title: 'Segah Taksim',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Segah was deeply associated with Sufi mysticism in the Ottoman tradition — it was believed to evoke a longing for the divine. Cemil Bey\'s taksim carries this spiritual weight without being religious. It moves like meditation: unhurried, inward, circling the same emotional territory with increasing depth. Listen for how it seems to reach upward without quite arriving — that suspended quality is Segah\'s defining character.',
      },
    },
    notablePieces: [
      { title: 'Segah Mevlevi Ayin', composer: 'Hammamizade Ismail Dede Efendi', usul: 'Aksak' },
      { title: 'Segah Beste', composer: 'Mustafa Itri', usul: 'Muhammes' },
    ],
    color: '#5C4A7A',
  },
  {
    id: 'kurd',
    name: 'Kurd',
    pronunciation: 'koord',
    family: 'Kurd',
    commonUsuls: ['Aksak', 'Duyek', 'Devr-i Hindi'],
    seyir: 'descending',
    durak: 'Re (D)',
    guclu: 'La (A)',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D' },
      { degree: 2, name: 'Mi♭', cents: 135, westernNearest: 'E♭', isCharacteristic: true },
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
    description: 'Kurd is one of the most straightforward makams for Western ears to grasp — its scale closely resembles a Phrygian mode, with a characteristic lowered second degree. It descends naturally and has a dark, grounded quality. Despite its accessibility, it carries great emotional weight and is a staple of both folk and classical traditions.',
    characteristicPhrase: 'Steps down from the fifth with a characteristic half-step drop to the lowered second, then resolves to the root — a falling, conclusive motion.',
    westernAnalogy: 'Kurd is essentially the Phrygian mode — the same scale guitarists use for flamenco and metal. Its characteristic Eb is slightly sharper than a true semitone, giving it a roughness that pure Phrygian lacks.',
    relatedMakams: ['Hicaz', 'Kurdilihicazkar'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'x8u4lsgdhKQ',
        title: 'Bulbulum Altin Kafeste',
        composer: 'Traditional',
        performer: 'Melihat Gulses',
        year: '2019',
        description: 'This folk song — whose title means "I am a nightingale in a golden cage" — is one of the most recognized melodies in Turkish musical culture. It was reportedly a favorite of Ataturk. Kurdi\'s character is dignified and restrained, and this song captures that quality perfectly. Most Turkish people know this melody from childhood.',
      },
      taksim: {
        youtubeId: 'VzppMKDVOn4',
        title: 'Kurdi Taksim',
        composer: 'Baha Yetkin',
        performer: 'Baha Yetkin',
        year: '2020',
        description: 'Kurdi is named after the Kurdish people and carries a folk sensibility within a classical form. It is one of the simplest makams structurally — no accidentals in its home position — yet emotionally it is anything but simple. This taksim draws out a quality that\'s hard to name: something between dignity and vulnerability, between strength and tenderness. It sounds ancient because it is.',
      },
    },
    notablePieces: [
      { title: 'Kurd Pesrev', composer: 'Hafiz Post', usul: 'Devr-i Hindi' },
      { title: 'Kurd Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Aksak' },
    ],
    color: '#6B5B45',
  },
  {
    id: 'neva',
    name: 'Neva',
    pronunciation: 'neh-VAH',
    family: 'Rast',
    commonUsuls: ['Duyek', 'Aksak', 'Semai'],
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Re (D)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si', cents: 204, westernNearest: 'B' },
      { degree: 3, name: 'Do koma+', cents: 294, westernNearest: 'C', isCharacteristic: false },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E' },
      { degree: 6, name: 'Fa# koma-', cents: 884, westernNearest: 'F#', isCharacteristic: true },
      { degree: 7, name: 'Sol#', cents: 1088, westernNearest: 'G#' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Calm', 'Balanced', 'Elegant', 'Bright'],
    timeOfDay: 'Morning to midday',
    season: 'Spring',
    description: 'Neva is an elegant, well-balanced makam from the Rast family. It shares much of Rast\'s warmth but sits a fifth higher, giving it a slightly brighter, more open character. It is considered one of the most complete makams — its melodic movement covers the full range gracefully in both directions.',
    characteristicPhrase: 'Moves through its range with a natural elegance, neither lingering too long below nor reaching too dramatically upward — a balanced, flowing melodic personality.',
    westernAnalogy: 'Neva is Rast transposed up a fifth, sharing its warmth and the same characteristic neutral intervals. For Western musicians, think of it as a major scale where the third and sixth are consistently a quarter-tone flat.',
    relatedMakams: ['Rast', 'Mahur', 'Huseyni'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'IX91Yk2Bn50',
        title: 'Nereden Sevdim O Zalim Kadini',
        composer: 'Selahattin Pinar',
        performer: 'Zeki Muren',
        year: '2005',
        description: 'Selahattin Pinar was one of the great composer-performers of the early Republic, and this song — whose title means "Why did I love that cruel woman" — became one of the most sung melodies in the Turkish repertoire. Neva gives pleasure and a sense of relief according to Ottoman theory, and the song\'s melancholy acceptance of love\'s pain embodies that bittersweet quality perfectly.',
      },
      taksim: {
        youtubeId: 'z_-Drl5J83Q',
        title: 'Neva Taksim',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Neva was considered the evening makam — most resonant at dusk when the energy of the day softens. Its name simply means melody in Persian, which tells you something about how central it was to the tradition. Cemil Bey\'s taksim has a flowing, unhurried quality — it does not push or insist. It simply moves, like water finding its level.',
      },
    },
    notablePieces: [
      { title: 'Neva Kar', composer: 'Mustafa Itri', usul: 'Muhammes' },
      { title: 'Neva Pesrev', composer: 'Hammamizade Ismail Dede Efendi', usul: 'Devr-i Hindi' },
    ],
    color: '#5A8A7A',
  },
  {
    id: 'buselik',
    name: 'Buselik',
    pronunciation: 'boo-seh-LIK',
    family: 'Buselik',
    commonUsuls: ['Duyek', 'Sofyan', 'Aksak'],
    seyir: 'ascending',
    durak: 'La (A)',
    guclu: 'Mi (E)',
    scale: [
      { degree: 1, name: 'La', cents: 0, westernNearest: 'A' },
      { degree: 2, name: 'Si', cents: 204, westernNearest: 'B' },
      { degree: 3, name: 'Do', cents: 250, westernNearest: 'C', isCharacteristic: true },
      { degree: 4, name: 'Re', cents: 498, westernNearest: 'D' },
      { degree: 5, name: 'Mi', cents: 702, westernNearest: 'E' },
      { degree: 6, name: 'Fa', cents: 792, westernNearest: 'F', isCharacteristic: false },
      { degree: 7, name: 'Sol', cents: 996, westernNearest: 'G' },
      { degree: 8, name: 'La', cents: 1200, westernNearest: 'A' },
    ],
    mood: ['Strong', 'Masculine', 'Direct', 'Earnest'],
    timeOfDay: 'Morning',
    season: 'Spring',
    description: 'Buselik is the makam that feels most familiar to Western ears — it closely resembles a natural minor scale. This makes it a gentle entry point for musicians transitioning from Western theory. Yet within the Turkish tradition it carries its own distinct identity and movement rules. Its character is strong and direct, without the melancholy of Ussak or the drama of Hicaz.',
    characteristicPhrase: 'Climbs steadily and purposefully from root to dominant, with little ornamentation — Buselik states its intention directly, without ambiguity.',
    westernAnalogy: 'Buselik is the closest makam to the natural minor scale. Its third is slightly flat of the Western minor third — giving it a darkness that natural minor almost reaches, but never quite does.',
    relatedMakams: ['Huseyni', 'Ussak', 'Acem Buselik'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: '8hjvehXggHw',
        title: 'Bana Bir Ask Masalindan Sarkilar Soyle',
        composer: 'Erol Sayan',
        performer: 'Zeki Muren',
        year: '1969',
        description: 'The title translates as "Tell me stories of love" — and Buselik\'s character is precisely this: warm, intimate, romantic without being sentimental. Erol Sayan composed both words and music, and Zeki Muren\'s 1969 recording became one of the most recognized songs of the era. Buselik has a quality that Western ears find immediately accessible — it sits closer to a natural minor scale than most Turkish makams.',
      },
      taksim: {
        youtubeId: 'BwW-faJFJc0',
        title: 'Buselik Taksim',
        composer: 'Baha Yetkin',
        performer: 'Baha Yetkin',
        year: '2024',
        description: 'Buselik is one of the oldest makams in the Turkish tradition, believed to give strength and vitality. Its structure is clear and direct — a quality you can hear in this contemporary oud taksim. There are no dramatic leaps or unexpected microtones here. Buselik speaks plainly, which is its own kind of power.',
      },
    },
    notablePieces: [
      { title: 'Buselik Pesrev', composer: 'Kemani Hizir Aga', usul: 'Duyek' },
      { title: 'Buselik Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Aksak' },
    ],
    color: '#7A8A6A',
  },
  {
    id: 'cargah',
    name: 'Çargah',
    characterNote: 'Cargah uses no microtones by design. Its brightness comes from pure, open intervals — the closest Turkish makam to the Western major scale.',
    pronunciation: 'char-GAH',
    family: 'Çargah',
    commonUsuls: ['Duyek', 'Aksak', 'Devr-i Hindi'],
    seyir: 'ascending',
    durak: 'Do (C)',
    guclu: 'Sol (G)',
    scale: [
      { degree: 1, name: 'Do', cents: 0, westernNearest: 'C' },
      { degree: 2, name: 'Re', cents: 204, westernNearest: 'D' },
      { degree: 3, name: 'Mi', cents: 408, westernNearest: 'E', isCharacteristic: false },
      { degree: 4, name: 'Fa', cents: 498, westernNearest: 'F' },
      { degree: 5, name: 'Sol', cents: 702, westernNearest: 'G' },
      { degree: 6, name: 'La', cents: 906, westernNearest: 'A' },
      { degree: 7, name: 'Si', cents: 1110, westernNearest: 'B', isCharacteristic: false },
      { degree: 8, name: 'Do', cents: 1200, westernNearest: 'C' },
    ],
    mood: ['Bright', 'Clear', 'Joyful', 'Uncomplicated'],
    timeOfDay: 'Morning',
    season: 'Spring / Summer',
    description: 'Cargah is the Turkish makam that sits closest to the Western C major scale. Its intervals are nearly identical to equal temperament, making it the most accessible makam for beginners. Yet in the Turkish tradition it carries its own identity and is not treated as merely a major scale — its seyir, characteristic phrases, and emotional context are distinctly its own.',
    characteristicPhrase: 'Opens brightly on the root and ascends with a natural lightness — this is the makam of clarity, the one that sounds most like sunlight.',
    westernAnalogy: 'Cargah is essentially C major — the same scale, nearly the same tuning. Its intervals match equal temperament more closely than any other makam. The difference is in how it moves, not in its notes.',
    relatedMakams: ['Rast', 'Mahur'],
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: '6sh4iRble1E',
        title: 'Cargah Sirto',
        composer: 'Traditional',
        performer: 'Baha Yetkin Trio',
        year: '2021',
        description: 'The Cargah Sirto is one of the most joyful pieces in the Turkish repertoire — a dance form that has been played at celebrations for centuries. Cargah is unique among Turkish makams for containing no microtonal inflections in its basic form. This recording by the Baha Yetkin Trio shows how that clarity becomes a vehicle for pure musical delight.',
      },
      taksim: {
        youtubeId: '6sh4iRble1E',
        title: 'Cargah Sirto',
        composer: 'Traditional',
        performer: 'Baha Yetkin Trio',
        year: '2021',
        description: 'Cargah occupies a fascinating position in Turkish music theory — it uses only natural notes, no microtones, yet it sounds distinctly Turkish in the hands of a master. What makes it Turkish is not the notes themselves but the way they are approached, ornamented, and resolved — the phrasing, the breathing, the sense of time. Western ears will find this makam immediately familiar and yet somehow different. That difference is everything.',
      },
    },
    notablePieces: [
      { title: 'Cargah Pesrev', composer: 'Hammamizade Ismail Dede Efendi', usul: 'Devr-i Hindi' },
      { title: 'Cargah Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Aksak' },
    ],
    color: '#C8A84B',
  },
  {
    id: 'nihavend',
    name: 'Nihavend',
    characterNote: 'Nihavend\'s character comes from its descending seyir and emotional weight, not microtonal deviation. It is the most Western-sounding of all makams.',
    pronunciation: 'nee-hah-VEND',
    characteristicPhrase: 'A farewell without bitterness',
    description: 'Nihavend is the closest Turkish makam to the Western minor scale, yet carries a distinctly Eastern character. Its descending seyir gives it a quality of resignation and longing.',
    scale: [
      { degree: 1, name: 'Re', cents: 0, westernNearest: 'D', isCharacteristic: false },
      { degree: 2, name: 'Mi', cents: 204, westernNearest: 'E', isCharacteristic: false },
      { degree: 3, name: 'Fa', cents: 294, westernNearest: 'F', isCharacteristic: false },
      { degree: 4, name: 'Sol', cents: 498, westernNearest: 'G', isCharacteristic: false },
      { degree: 5, name: 'La', cents: 702, westernNearest: 'A', isCharacteristic: false },
      { degree: 6, name: 'Si♭', cents: 792, westernNearest: 'B♭', isCharacteristic: false },
      { degree: 7, name: 'Do#', cents: 1088, westernNearest: 'C#', isCharacteristic: false },
      { degree: 8, name: 'Re', cents: 1200, westernNearest: 'D', isCharacteristic: false },
    ],
    durak: 'Re (D)',
    guclu: 'La (A)',
    timeOfDay: 'Evening',
    season: 'Autumn',
    mood: ['Melancholic', 'Resigned', 'Tender', 'Longing'],
    seyir: 'descending',
    family: 'Nihavend',
    relatedMakams: ['Ussak', 'Buselik', 'Huseyni'],
    commonUsuls: ['Duyek', 'Sofyan', 'Semai'],
    westernAnalogy: 'Nihavend is natural minor with a raised seventh in ascent — almost identical to the Western harmonic minor scale. Of all the makams, it will sound most immediately familiar to Western-trained ears.',
    audio: { toneFile: null, sampleFile: null },
    listening: {
      sarki: {
        youtubeId: 'QhURiU93b_U',
        title: 'Kalamis',
        composer: 'Munir Nurettin Selcuk',
        performer: 'Mustafa Sagyasar',
        year: '2018',
        description: 'Kalamis is named after a district on the Bosphorus, and the song carries the melancholy beauty of Istanbul\'s waterways. Munir Nurettin Selcuk — the man who single-handedly modernized Turkish classical singing — composed both words and music. Nihavend is often compared to a Western natural minor scale, and this song shows why that comparison is both accurate and insufficient.',
      },
      taksim: {
        youtubeId: 'AEi5pmYDdBs',
        title: 'Nihavend Taksim (Tanbur)',
        composer: 'Tanburi Cemil Bey',
        performer: 'Tanburi Cemil Bey',
        year: '1906',
        description: 'Nihavend is the makam that Western musicians find most familiar — its intervals sit close to a natural minor scale. Yet in Ottoman theory it was associated with love\'s joy, not its sorrow, which should give pause to anyone who thinks they already understand it. Cemil Bey\'s taksim reveals the complexity beneath the surface familiarity — a feeling that contains both longing and pleasure simultaneously.',
      },
    },
    notablePieces: [
      { title: 'Nihavend Longa', composer: 'Tanburi Cemil Bey', usul: 'Duyek' },
      { title: 'Nihavend Saz Semaisi', composer: 'Sevki Bey', usul: 'Aksak' },
    ],
    color: '#6B7FA3',
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
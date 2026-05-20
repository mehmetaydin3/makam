export type UsulBeat = 'strong' | 'medium' | 'weak' | 'rest';

export type Usul = {
  id: string;
  name: string;
  pronunciation: string;
  timeSignature: string;
  totalBeats: number;
  pattern: UsulBeat[];
  tempo: 'slow' | 'moderate' | 'fast' | 'variable';
  feel: string;
  description: string;
  commonMakams: string[];
  notablePieces: { title: string; composer: string; makam: string }[];
  color: string;
};

export const USULS: Usul[] = [
  {
    id: 'duyek',
    name: 'Düyek',
    pronunciation: 'doo-YEK',
    timeSignature: '8/8',
    totalBeats: 8,
    pattern: ['strong', 'weak', 'medium', 'weak', 'strong', 'weak', 'medium', 'weak'],
    tempo: 'moderate',
    feel: 'Grounded and flowing. The most common usul in Turkish classical music — the heartbeat of the fasıl.',
    description: 'Düyek is the backbone of Turkish classical music. Its 8/8 pattern (2+2+2+2) creates a steady, walking pulse that supports a wide range of emotional expressions. From joyful şarkıs to melancholic saz semais, Düyek carries them all.',
    commonMakams: ['rast', 'huseyni', 'neva', 'kurdilihicazkar'],
    notablePieces: [
      { title: 'Yine Bir Gülnihal', composer: 'Hacı Arif Bey', makam: 'Uşşak' },
      { title: 'Bir Devr-i Kadim Şarkısı', composer: 'Münir Nurettin Selçuk', makam: 'Rast' },
    ],
    color: '#C8975A',
  },
  {
    id: 'sofyan',
    name: 'Sofyan',
    pronunciation: 'sof-YAN',
    timeSignature: '4/4',
    totalBeats: 4,
    pattern: ['strong', 'weak', 'medium', 'weak'],
    tempo: 'moderate',
    feel: 'Simple and dignified. The Turkish equivalent of common time — steady, balanced, accessible.',
    description: 'Sofyan is the most straightforward of the usuls — a clean 4/4 that provides a stable, dignified framework. It is often used for hymns, marches, and pieces that require clarity and directness. Beginner-friendly but capable of great expressiveness.',
    commonMakams: ['rast', 'huseyni', 'hicaz', 'buselik'],
    notablePieces: [
      { title: 'Segah İlahi', composer: 'Traditional', makam: 'Segah' },
      { title: 'Rast Şarkı', composer: 'Dede Efendi', makam: 'Rast' },
    ],
    color: '#8B7355',
  },
  {
    id: 'aksak',
    name: 'Aksak',
    pronunciation: 'ak-SAK',
    timeSignature: '9/8',
    totalBeats: 9,
    pattern: ['strong', 'weak', 'medium', 'weak', 'strong', 'weak', 'strong', 'weak', 'weak'],
    tempo: 'moderate',
    feel: 'Limping, asymmetric, hypnotic. Aksak means "limping" in Turkish — its irregular pulse creates an irresistible forward momentum.',
    description: 'Aksak is one of the defining sounds of Turkish music — its 9/8 pattern (2+2+2+3) creates an asymmetric pulse that feels like walking with a beautiful limp. It is deeply associated with the melancholic makams and the longing that runs through Turkish musical culture.',
    commonMakams: ['ussak', 'huseyni', 'saba', 'kurd'],
    notablePieces: [
      { title: 'Uşşak Saz Semaisi', composer: 'Tanburi Cemil Bey', makam: 'Uşşak' },
      { title: 'Hüseyni Peşrev', composer: 'Hammamizade', makam: 'Hüseyni' },
    ],
    color: '#7B6B8D',
  },
  {
    id: 'semai',
    name: 'Semai',
    pronunciation: 'se-MA-ee',
    timeSignature: '3/4',
    totalBeats: 3,
    pattern: ['strong', 'weak', 'weak'],
    tempo: 'moderate',
    feel: 'Lilting and elegant. The waltz of Turkish music — graceful, circular, intimate.',
    description: 'Semai gives Turkish music its most dance-like quality. Its 3/4 pattern creates a gentle swaying motion that pairs beautifully with lyrical, expressive makams. The Saz Semaisi is an entire compositional form built around this usul — a journey through a makam in three or four hanes.',
    commonMakams: ['huseyni', 'ussak', 'rast', 'neva'],
    notablePieces: [
      { title: 'Hicaz Saz Semaisi', composer: 'Tanburi Cemil Bey', makam: 'Hicaz' },
      { title: 'Nihavend Saz Semaisi', composer: 'Şevki Bey', makam: 'Nihavend' },
    ],
    color: '#5B8A6D',
  },
  {
    id: 'curcuna',
    name: 'Curcuna',
    pronunciation: 'jur-JU-na',
    timeSignature: '10/8',
    totalBeats: 10,
    pattern: ['strong', 'weak', 'medium', 'weak', 'strong', 'weak', 'strong', 'weak', 'medium', 'weak'],
    tempo: 'fast',
    feel: 'Playful and tumbling. Curcuna races forward with an infectious, almost mischievous energy.',
    description: 'Curcuna is the most playful of the common usuls. Its 10/8 pattern (3+2+2+3 or variations) creates a rolling, tumbling feel that suits lively, celebratory pieces. Often used in dance music and lighter repertoire, Curcuna brings joy and movement to any makam it carries.',
    commonMakams: ['rast', 'hicaz', 'huseyni', 'neva'],
    notablePieces: [
      { title: 'Rast Curcuna Şarkı', composer: 'Hacı Arif Bey', makam: 'Rast' },
      { title: 'Hicaz Longa', composer: 'Tanburi Cemil Bey', makam: 'Hicaz' },
    ],
    color: '#C87B4A',
  },
  {
    id: 'muhammes',
    name: 'Muhammes',
    pronunciation: 'mu-HAM-mes',
    timeSignature: '5/4',
    totalBeats: 5,
    pattern: ['strong', 'weak', 'medium', 'weak', 'weak'],
    tempo: 'slow',
    feel: 'Stately and ceremonial. Five beats create a regal asymmetry — neither rushing nor dragging.',
    description: 'Muhammes carries a sense of ceremony and weight. Its 5/4 pattern creates a distinctive pause-and-resolve motion that suits contemplative, majestic pieces. Less common than Düyek or Aksak, it appears in some of the most revered pieces of the classical repertoire.',
    commonMakams: ['segah', 'huseyni', 'hicaz', 'rast'],
    notablePieces: [
      { title: 'Segah Beste', composer: 'Dede Efendi', makam: 'Segah' },
      { title: 'Hüseyni Muhammes', composer: 'Hammamizade', makam: 'Hüseyni' },
    ],
    color: '#6B8B9E',
  },
  {
    id: 'devr-i-hindi',
    name: 'Devr-i Hindi',
    pronunciation: 'dev-ri HIN-di',
    timeSignature: '7/8',
    totalBeats: 7,
    pattern: ['strong', 'weak', 'medium', 'weak', 'strong', 'weak', 'weak'],
    tempo: 'moderate',
    feel: 'Exotic and yearning. Seven beats create a sense of incompleteness — always reaching forward.',
    description: 'Devr-i Hindi — the Indian cycle — brings an exotic, searching quality to Turkish music. Its 7/8 pattern (2+2+3) creates a constant forward lean, as if the music is always about to arrive somewhere it never quite reaches. Deeply associated with makams of longing and spiritual searching.',
    commonMakams: ['saba', 'ussak', 'segah', 'kurd'],
    notablePieces: [
      { title: 'Saba Şarkı', composer: 'Hacı Arif Bey', makam: 'Saba' },
      { title: 'Karcığar Beste', composer: 'Dede Efendi', makam: 'Karcığar' },
    ],
    color: '#9B6B8B',
  },
  {
    id: 'yuruk-semai',
    name: 'Yürük Semai',
    pronunciation: 'yoo-ROOK se-MA-ee',
    timeSignature: '6/8',
    totalBeats: 6,
    pattern: ['strong', 'weak', 'weak', 'medium', 'weak', 'weak'],
    tempo: 'fast',
    feel: 'Running and joyful. Yürük means "walking fast" — this usul skips forward with irrepressible energy.',
    description: 'Yürük Semai is the fast cousin of the regular Semai. Its 6/8 pattern at quick tempo creates a skipping, dancing feel that is among the most beloved in Turkish music. The Yürük Semai is also a compositional form — pieces written in this form are some of the gems of the classical repertoire.',
    commonMakams: ['rast', 'huseyni', 'hicaz', 'neva'],
    notablePieces: [
      { title: 'Rast Yürük Semai', composer: 'Dede Efendi', makam: 'Rast' },
      { title: 'Hicaz Yürük Semai', composer: 'Hammamizade', makam: 'Hicaz' },
    ],
    color: '#8B9B5A',
  },
];

export function getUsulById(id: string): Usul | undefined {
  return USULS.find(u => u.id === id);
}

// ─── Artists ────────────────────────────────────────────────────────────────
// The people behind the recordings. Every musician credited on a detail screen
// (composer / performer / artist / notable player) resolves to an entry here so
// a tap on a name opens a layered profile: who they were, and everywhere else in
// the app you can hear them. Generic credits (Traditional / Anonymous / Various)
// deliberately resolve to nothing — they are not people.
//
// Adding a recording with a new musician? Add the person here once; the alias
// resolver and the appearance scanner do the rest.

import { MAKAMS } from './makams';
import { MODES } from './traditions/modal-jazz/modes';

export type ArtistTradition = 'turkish-makam' | 'modal-jazz';

export type Artist = {
  id: string;
  /** Canonical display name (diacritics intact). */
  name: string;
  tradition: ArtistTradition;
  /** Alternate spellings used in the data that should resolve to this artist. */
  aliases?: string[];
  born?: string;
  died?: string;
  /** e.g. "Tanbur · Kemençe", "Tenor saxophone", "Composer". */
  instrument: string;
  /** One-line framing of their place in the tradition. */
  role: string;
  /** A short era tag for the hero, e.g. "Ottoman classical", "Cool / modal". */
  era: string;
  /** 1–2 short paragraphs. */
  bio: string[];
};

export const ARTISTS: Artist[] = [
  // ─── Turkish Makam ──────────────────────────────────────────────────────────
  {
    id: 'tanburi-cemil-bey',
    name: 'Tanburi Cemil Bey',
    tradition: 'turkish-makam',
    born: '1873',
    died: '1916',
    instrument: 'Tanbur · Kemençe · Lavta',
    role: 'The defining instrumentalist of late-Ottoman music',
    era: 'Late Ottoman',
    bio: [
      'Tanburi Cemil Bey is widely regarded as the greatest tanbur player in Ottoman history — a virtuoso whose technique and imagination reshaped how the instrument was played. He was equally masterful on the kemençe and lavta, and his compositions remain core repertoire.',
      'Crucially, he was among the first Ottoman musicians to be recorded. His 78rpm taksims from around 1900–1910 are the earliest documents of this music played at the highest level, and almost every taksim you hear in this app is his — a direct line back to the source.',
    ],
  },
  {
    id: 'dede-efendi',
    name: 'Hammamizade İsmail Dede Efendi',
    tradition: 'turkish-makam',
    aliases: ['Dede Efendi', 'Hammamizade Ismail Dede Efendi'],
    born: '1778',
    died: '1846',
    instrument: 'Composer · Mevlevi dervish',
    role: 'The towering composer of the classical Ottoman court',
    era: 'Ottoman classical',
    bio: [
      'Dede Efendi is the central figure of Ottoman classical composition — a Mevlevi dervish whose works span sacred Mevlevi ayins, monumental beste forms, and intimate şarkıs. He served under three sultans and trained a generation of composers.',
      'His genius was range: he could write music of profound spiritual weight and music of disarming charm. Pieces like "Yine Bir Gülnihal" are still sung today, two centuries on.',
    ],
  },
  {
    id: 'itri',
    name: 'Buhurizade Mustafa Itri',
    tradition: 'turkish-makam',
    aliases: ['Itri', 'Mustafa Itri'],
    born: 'c. 1640',
    died: '1712',
    instrument: 'Composer · Poet',
    role: 'The supreme composer of the Ottoman golden age',
    era: 'Ottoman classical',
    bio: [
      'Itri stands at the summit of classical-era Ottoman music. A poet as well as a composer, he worked in the orbit of the Mevlevi order and the imperial court, and his Segâh Tekbir and Nât-ı Mevlânâ are sung across the Islamic world to this day.',
      'His surviving works are studied as models of how a makam should be unfolded — the standard against which later composition was measured.',
    ],
  },
  {
    id: 'hafiz-post',
    name: 'Hafız Post',
    tradition: 'turkish-makam',
    born: 'c. 1630',
    died: '1694',
    instrument: 'Composer · Tanbur',
    role: 'A master of the early classical repertoire',
    era: 'Ottoman classical',
    bio: [
      'Hafız Post was a leading composer of the 17th century and a teacher whose pupils — Itri among the generation around him — carried Ottoman music into its golden age. He compiled an important güfte (song-text) collection that preserved repertoire of his era.',
    ],
  },
  {
    id: 'kemani-hizir-aga',
    name: 'Kemani Hızır Ağa',
    tradition: 'turkish-makam',
    instrument: 'Kemançe · Composer · Theorist',
    role: '18th-century court musician and music theorist',
    era: 'Ottoman classical',
    bio: [
      'Kemani Hızır Ağa was an 18th-century court violinist and theorist whose treatise on music is an important source for how makam and usul were understood in the period. His instrumental works survive in the peşrev and saz semaisi repertoire.',
    ],
  },
  {
    id: 'haci-arif-bey',
    name: 'Hacı Arif Bey',
    tradition: 'turkish-makam',
    born: '1831',
    died: '1885',
    instrument: 'Composer · Singer',
    role: 'The composer who made the şarkı the heart of the repertoire',
    era: 'Late Ottoman',
    bio: [
      'Hacı Arif Bey transformed the şarkı — the shorter, lyrical song form — into the emotional center of Turkish classical music. Prolific and intensely melodic, he wrote hundreds of songs that remain among the most beloved in the tradition.',
    ],
  },
  {
    id: 'sevki-bey',
    name: 'Şevki Bey',
    tradition: 'turkish-makam',
    born: '1860',
    died: '1891',
    instrument: 'Composer',
    role: 'The short-lived master of the melancholy şarkı',
    era: 'Late Ottoman',
    bio: [
      'Şevki Bey died at just 31, yet left behind a body of şarkıs whose direct, aching melodies made him one of the most-loved composers of the late Ottoman era. His songs are studies in restrained sorrow — much in the spirit of the Uşşak and Hicaz he favored.',
    ],
  },
  {
    id: 'tatyos-efendi',
    name: 'Kemani Tatyos Efendi',
    tradition: 'turkish-makam',
    aliases: ['Tatyos Efendi'],
    born: '1858',
    died: '1913',
    instrument: 'Violin · Kanun · Composer',
    role: 'An Armenian-Ottoman master who defined the Istanbul sound',
    era: 'Late Ottoman',
    bio: [
      'Tatyos Efendi was an Armenian composer and violinist whose instrumental works and şarkıs are pillars of the late-Ottoman repertoire. His "Gamzedeyim Deva Bulmam" is considered a definitive expression of Uşşak.',
      'He embodies the cosmopolitan Istanbul of his time, where Armenian, Greek, Jewish and Turkish musicians together shaped a single tradition.',
    ],
  },
  {
    id: 'selahattin-pinar',
    name: 'Selahattin Pınar',
    tradition: 'turkish-makam',
    born: '1902',
    died: '1960',
    instrument: 'Tanbur · Composer',
    role: 'A great composer-performer of the early Republic',
    era: 'Early Republic',
    bio: [
      'Selahattin Pınar was a tanbur virtuoso and one of the most popular composers of the early Republican era. His songs — bittersweet, urbane, deeply singable — bridged Ottoman classical refinement and the popular taste of 20th-century Istanbul.',
    ],
  },
  {
    id: 'sadettin-kaynak',
    name: 'Sadettin Kaynak',
    tradition: 'turkish-makam',
    born: '1895',
    died: '1961',
    instrument: 'Composer · Hafız',
    role: 'A prolific composer who broadened the makam tradition',
    era: 'Early Republic',
    bio: [
      'A trained hafız with a powerful voice, Sadettin Kaynak became one of the most prolific composers of the 20th century, writing for film and radio as well as the classical repertoire. He expanded the expressive vocabulary of the makams while keeping them rooted in their character.',
    ],
  },
  {
    id: 'munir-nurettin-selcuk',
    name: 'Münir Nurettin Selçuk',
    tradition: 'turkish-makam',
    aliases: ['Munir Nurettin Selcuk'],
    born: '1900',
    died: '1981',
    instrument: 'Voice · Composer',
    role: 'The man who modernized Turkish classical singing',
    era: 'Early Republic',
    bio: [
      'Münir Nurettin Selçuk single-handedly reinvented the role of the classical singer. He gave the first formal solo recital of Turkish music — a soloist before an audience, concert-style — and brought a trained, disciplined vocal technique to the tradition.',
      'As a composer he set the poetry of Yahya Kemal and others to music, producing songs like "Kalamış" and "Dönülmez Akşamın Ufkundayız" that became permanent fixtures of the canon.',
    ],
  },
  {
    id: 'muzeyyen-senar',
    name: 'Müzeyyen Senar',
    tradition: 'turkish-makam',
    born: '1918',
    died: '2015',
    instrument: 'Voice',
    role: 'The Diva of the Republic',
    era: 'Republican era',
    bio: [
      'Müzeyyen Senar was the defining female voice of Republican-era Turkish classical music — a singer of such authority and restraint that her interpretations became the reference recordings for songs like "Gamzedeyim Deva Bulmam." Atatürk admired her; generations grew up on her records.',
    ],
  },
  {
    id: 'zeki-muren',
    name: 'Zeki Müren',
    tradition: 'turkish-makam',
    aliases: ['Zeki Muren'],
    born: '1931',
    died: '1996',
    instrument: 'Voice · Composer',
    role: '“The Sun of Art” — Turkey’s most celebrated singer',
    era: 'Republican era',
    bio: [
      'Known as Sanat Güneşi — "the Sun of Art" — Zeki Müren was the most beloved singer in modern Turkey. His diction was so precise it was used as a model of spoken Turkish, and his recordings of Hicaz and Buselik songs are touchstones every Turkish listener knows.',
      'A flamboyant, boundary-breaking stage presence, he was also a composer and poet, and remains a towering cultural icon decades after his death.',
    ],
  },
  {
    id: 'hafiz-burhan',
    name: 'Hafız Burhan',
    tradition: 'turkish-makam',
    born: '1897',
    died: '1943',
    instrument: 'Voice · Hafız',
    role: 'A celebrated tenor of the early gramophone era',
    era: 'Early Republic',
    bio: [
      'Hafız Burhan was one of the great male voices of the early recording era, prized for the power and clarity of his delivery. A trained hafız, he carried the ornamental sensibility of Qur\'anic recitation into the classical and popular song of his day.',
    ],
  },
  {
    id: 'nesrin-sipahi',
    name: 'Nesrin Sipahi',
    tradition: 'turkish-makam',
    born: '1932',
    died: '2022',
    instrument: 'Voice',
    role: 'A leading classical vocalist of the radio era',
    era: 'Republican era',
    bio: [
      'Nesrin Sipahi was a prominent voice of Turkish Radio and Television and the classical concert stage, admired for the plaintive, expressive quality she brought to the saddest makams — Saba above all.',
    ],
  },
  {
    id: 'mustafa-sagyasar',
    name: 'Mustafa Sağyaşar',
    tradition: 'turkish-makam',
    born: '1928',
    died: '2021',
    instrument: 'Voice',
    role: 'A classical singer who carried the tradition forward',
    era: 'Republican era',
    bio: [
      'Mustafa Sağyaşar was a respected interpreter of the classical and şarkı repertoire across a long career, known for a warm, unforced style that kept the music\'s intimacy intact.',
    ],
  },
  {
    id: 'bulent-ersoy',
    name: 'Bülent Ersoy',
    tradition: 'turkish-makam',
    born: '1952',
    instrument: 'Voice',
    role: 'A virtuoso classical singer and cultural lightning rod',
    era: 'Contemporary',
    bio: [
      'Bülent Ersoy is one of the most technically gifted classical singers of her generation, with a command of the repertoire — Segâh especially — that few can match. A fearless, iconic public figure, she has remained at the center of Turkish musical life for decades.',
    ],
  },
  {
    id: 'melihat-gulses',
    name: 'Melihat Gülses',
    tradition: 'turkish-makam',
    born: '1957',
    instrument: 'Voice',
    role: 'A contemporary master of the classical and folk repertoire',
    era: 'Contemporary',
    bio: [
      'Melihat Gülses is a leading contemporary vocalist who moves fluently between Turkish classical music and the folk tradition, valued for the dignity and precision of her interpretations.',
    ],
  },
  {
    id: 'erol-sayan',
    name: 'Erol Sayan',
    tradition: 'turkish-makam',
    born: '1936',
    instrument: 'Composer',
    role: 'A leading modern composer of the makam song',
    era: 'Contemporary',
    bio: [
      'Erol Sayan is one of the most important composers of the modern era, author of songs — words and music both — that entered the standard repertoire, including pieces made famous by Zeki Müren. His writing honors classical form while speaking in a contemporary voice.',
    ],
  },
  {
    id: 'sekip-ayhan-ozisik',
    name: 'Şekip Ayhan Özışık',
    tradition: 'turkish-makam',
    born: '1932',
    died: '1994',
    instrument: 'Composer',
    role: 'A popular composer of mid-century Turkish song',
    era: 'Republican era',
    bio: [
      'Şekip Ayhan Özışık was a prolific composer whose songs — many made famous by Zeki Müren — bridged the classical makam idiom and the popular music of mid-century Turkey.',
    ],
  },
  {
    id: 'semahat-ozdenses',
    name: 'Semahat Özdenses',
    tradition: 'turkish-makam',
    born: '1925',
    died: '1996',
    instrument: 'Composer · Voice',
    role: 'A composer-singer of the classical song',
    era: 'Republican era',
    bio: [
      'Semahat Özdenses was both a singer and a composer, writing songs that matched their makams with care — including pieces that became signatures for the great voices of her time.',
    ],
  },
  {
    id: 'amir-ates',
    name: 'Amir Ateş',
    tradition: 'turkish-makam',
    born: '1940',
    instrument: 'Composer · Hafız',
    role: 'A contemporary composer rooted in the classical tradition',
    era: 'Contemporary',
    bio: [
      'Amir Ateş is a contemporary composer and trained hafız whose songs continue the classical line into the present day, written with a deep feeling for the character of each makam.',
    ],
  },
  {
    id: 'baha-yetkin',
    name: 'Baha Yetkin',
    tradition: 'turkish-makam',
    aliases: ['Baha Yetkin Trio'],
    instrument: 'Instrumental ensemble',
    role: 'A contemporary performer of the instrumental repertoire',
    era: 'Contemporary',
    bio: [
      'Baha Yetkin leads contemporary instrumental performances of the classical repertoire — taksims and saz works that let you hear the makams voiced on traditional instruments, recorded with modern clarity.',
    ],
  },

  // ─── Modal Jazz ─────────────────────────────────────────────────────────────
  {
    id: 'miles-davis',
    name: 'Miles Davis',
    tradition: 'modal-jazz',
    born: '1926',
    died: '1991',
    instrument: 'Trumpet',
    role: 'The architect of modal jazz',
    era: 'Cool / modal',
    bio: [
      'Miles Davis changed the direction of jazz more than once, but modal jazz is the change that matters here. With "Kind of Blue" (1959) he stripped away dense chord changes and let players improvise inside scales — modes — held for long stretches. It became the best-selling jazz album ever made.',
      'His spare, lyrical trumpet and his gift for assembling great bands — Coltrane, Evans, Adderley among them — make him the center of gravity for this whole tradition.',
    ],
  },
  {
    id: 'john-coltrane',
    name: 'John Coltrane',
    tradition: 'modal-jazz',
    born: '1926',
    died: '1967',
    instrument: 'Tenor & soprano saxophone',
    role: 'Modal jazz’s searching spiritual force',
    era: 'Modal / spiritual',
    bio: [
      'John Coltrane took the modal opening of "Kind of Blue" — where he was a sideman — and drove it to its limits. Tunes like "Impressions" and the album "A Love Supreme" turned a single mode held for minutes into a vehicle for ecstatic, searching improvisation.',
      'His classic quartet, with McCoy Tyner and Elvin Jones, defined the sound of modal jazz at its most intense and devotional.',
    ],
  },
  {
    id: 'bill-evans',
    name: 'Bill Evans',
    tradition: 'modal-jazz',
    born: '1929',
    died: '1980',
    instrument: 'Piano',
    role: 'The harmonic colorist of modal jazz',
    era: 'Impressionist',
    bio: [
      'Bill Evans brought an impressionist\'s ear — Debussy and Ravel in his bloodstream — to jazz piano. His voicings on "Kind of Blue," which he helped shape, gave modal jazz its hushed, floating color.',
      'His own trios redefined group interplay, treating bass and drums as equal melodic voices rather than accompaniment.',
    ],
  },
  {
    id: 'cannonball-adderley',
    name: 'Cannonball Adderley',
    tradition: 'modal-jazz',
    born: '1928',
    died: '1975',
    instrument: 'Alto saxophone',
    role: 'The joyful, blues-rooted voice of the Miles band',
    era: 'Hard bop / modal',
    bio: [
      'Julian "Cannonball" Adderley brought an exuberant, blues-soaked alto sound to the modal sessions of the late 1950s, including "Kind of Blue." His own groups carried that earthy, soulful energy into the 1960s with enormous popular success.',
    ],
  },
  {
    id: 'herbie-hancock',
    name: 'Herbie Hancock',
    tradition: 'modal-jazz',
    born: '1940',
    instrument: 'Piano · Keyboards',
    role: 'A modal innovator across half a century',
    era: 'Post-bop / fusion',
    bio: [
      'Herbie Hancock came up in Miles Davis\'s celebrated 1960s quintet, where modal and free elements met inside tight ensemble playing. A restlessly curious harmonist, he carried the modal language forward through post-bop, jazz-funk and electric fusion.',
    ],
  },
  {
    id: 'wayne-shorter',
    name: 'Wayne Shorter',
    tradition: 'modal-jazz',
    born: '1933',
    died: '2023',
    instrument: 'Tenor & soprano saxophone',
    role: 'The great modal composer of his generation',
    era: 'Post-bop',
    bio: [
      'Wayne Shorter was both a singular saxophonist and perhaps the most important jazz composer after the modal turn. His tunes — elusive, modal, harmonically open — became standards, and his playing anchored both the Miles Davis quintet and the band Weather Report.',
    ],
  },
  {
    id: 'mccoy-tyner',
    name: 'McCoy Tyner',
    tradition: 'modal-jazz',
    born: '1938',
    died: '2020',
    instrument: 'Piano',
    role: 'The pianist who built the modal jazz sound',
    era: 'Modal',
    bio: [
      'As pianist in John Coltrane\'s classic quartet, McCoy Tyner forged the defining modal piano vocabulary: thunderous left-hand fourths and pentatonic runs that gave the music its open, ringing power. His influence on jazz pianists since is hard to overstate.',
    ],
  },
  {
    id: 'chick-corea',
    name: 'Chick Corea',
    tradition: 'modal-jazz',
    born: '1941',
    died: '2021',
    instrument: 'Piano · Keyboards',
    role: 'A boundlessly inventive modal and fusion pianist',
    era: 'Post-bop / fusion',
    bio: [
      'Chick Corea played in Miles Davis\'s electric bands before leading his own groups across acoustic post-bop, Latin jazz and fusion. His crisp, percussive touch and modal-meets-Spanish harmonic sense made him one of the most influential pianists of his era.',
    ],
  },
  {
    id: 'keith-jarrett',
    name: 'Keith Jarrett',
    tradition: 'modal-jazz',
    born: '1945',
    instrument: 'Piano',
    role: 'The improviser who made whole concerts from a mode',
    era: 'Modal / free',
    bio: [
      'Keith Jarrett is celebrated for spontaneous solo concerts — "The Köln Concert" the most famous — that grow vast, hymn-like improvisations out of simple modal vamps. With his "standards" trio he also became one of the supreme interpreters of the jazz songbook.',
    ],
  },
  {
    id: 'joe-henderson',
    name: 'Joe Henderson',
    tradition: 'modal-jazz',
    born: '1937',
    died: '2001',
    instrument: 'Tenor saxophone',
    role: 'A tenor of endless rhythmic and modal invention',
    era: 'Post-bop / modal',
    bio: [
      'Joe Henderson combined a hard-bop foundation with a modal and at times free sensibility, prized for his rhythmic flexibility and tone. A fixture of Blue Note in the 1960s, he found wide acclaim again late in life.',
    ],
  },
  {
    id: 'eric-dolphy',
    name: 'Eric Dolphy',
    tradition: 'modal-jazz',
    born: '1928',
    died: '1964',
    instrument: 'Alto sax · Bass clarinet · Flute',
    role: 'A visionary who stretched modal jazz toward the free',
    era: 'Modal / free',
    bio: [
      'Eric Dolphy pushed at the edges of tonality, bringing a vocal, leaping, almost speech-like phrasing to alto saxophone, bass clarinet and flute. He worked with Coltrane and Mingus before his death at 36, and his music still sounds startlingly modern.',
    ],
  },
  {
    id: 'chet-baker',
    name: 'Chet Baker',
    tradition: 'modal-jazz',
    born: '1929',
    died: '1988',
    instrument: 'Trumpet · Voice',
    role: 'The lyrical voice of cool jazz',
    era: 'Cool',
    bio: [
      'Chet Baker played and sang with a fragile, intimate lyricism that became the sound of West Coast cool jazz. His melodic restraint — saying much with few notes — is close in spirit to the modal idea of letting a single color breathe.',
    ],
  },
  {
    id: 'wes-montgomery',
    name: 'Wes Montgomery',
    tradition: 'modal-jazz',
    born: '1923',
    died: '1968',
    instrument: 'Guitar',
    role: 'The most influential jazz guitarist of his era',
    era: 'Hard bop / soul jazz',
    bio: [
      'Wes Montgomery played with his thumb instead of a pick, producing a warm, round tone, and built solos in his signature octaves. His relaxed, blues-rich melodic sense made him the most influential jazz guitarist after Charlie Christian.',
    ],
  },
  {
    id: 'oscar-peterson',
    name: 'Oscar Peterson',
    tradition: 'modal-jazz',
    born: '1925',
    died: '2007',
    instrument: 'Piano',
    role: 'A virtuoso of dazzling swing and technique',
    era: 'Swing / bop',
    bio: [
      'Oscar Peterson combined formidable technique with a deep blues and swing feeling, recording prolifically across five decades. Though rooted in the bop and swing traditions, his harmonic command and touch influenced pianists across every style that followed.',
    ],
  },
  {
    id: 'erroll-garner',
    name: 'Erroll Garner',
    tradition: 'modal-jazz',
    born: '1921',
    died: '1977',
    instrument: 'Piano',
    role: 'The self-taught melodist who wrote “Misty”',
    era: 'Swing',
    bio: [
      'Erroll Garner was a self-taught pianist with an instantly recognizable style — orchestral, behind-the-beat, joyously melodic. He composed the standard "Misty," and his album "Concert by the Sea" remains one of the best-loved live jazz records.',
    ],
  },
];

// ─── Resolver ────────────────────────────────────────────────────────────────
// Normalize so diacritics and punctuation never block a match:
// "Münir Nurettin Selçuk" and "Munir Nurettin Selcuk" both → "munir nurettin selcuk".
function normalize(name: string): string {
  return name
    .toLowerCase()
    // Turkish dotless ı (U+0131) has no NFD decomposition, so it would be
    // stripped below — fold it to "i" so "Hacı" and "Haci" match.
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const BY_ID: Record<string, Artist> = {};
const BY_NAME: Record<string, Artist> = {};
for (const artist of ARTISTS) {
  BY_ID[artist.id] = artist;
  BY_NAME[normalize(artist.name)] = artist;
  for (const alias of artist.aliases ?? []) BY_NAME[normalize(alias)] = artist;
}

export function getArtistById(id: string): Artist | undefined {
  return BY_ID[id];
}

/**
 * Resolve a credit string to an artist, or undefined for generic credits
 * (Traditional / Anonymous / Various) and anyone not yet in the registry.
 */
export function getArtistByName(name: string | null | undefined): Artist | undefined {
  if (!name) return undefined;
  return BY_NAME[normalize(name)];
}

/** True when a credit string points at a real, tappable artist profile. */
export function isKnownArtist(name: string | null | undefined): boolean {
  return !!getArtistByName(name);
}

// ─── Appearances ─────────────────────────────────────────────────────────────
// Everywhere in the app you can hear (or read about) this artist. This is what
// makes the profile a hub: artist → recording → back into another makam / mode.

export type ArtistAppearance = {
  tradition: ArtistTradition;
  refId: string;
  refName: string;
  title: string;
  roleLabel: string;
  year?: string;
  youtubeId?: string | null;
  hasVideo: boolean;
  /** Representative color for the card (makam color / jazz brightness). */
  color: string;
  route: string;
};

const JAZZ_BRIGHTNESS_COLOR: Record<string, string> = {
  bright: '#FFD166',
  neutral: '#7B8FFF',
  dark: '#A855C8',
};

export function getArtistAppearances(artistId: string): ArtistAppearance[] {
  const artist = BY_ID[artistId];
  if (!artist) return [];
  const out: ArtistAppearance[] = [];

  if (artist.tradition === 'turkish-makam') {
    for (const makam of MAKAMS) {
      const route = '/turkish-makam/makam/' + makam.id;

      // Recordings (sarki + taksim): a person can be composer, performer, or both.
      for (const rec of [makam.listening.sarki, makam.listening.taksim]) {
        const isComposer = getArtistByName(rec.composer)?.id === artistId;
        const isPerformer = getArtistByName(rec.performer)?.id === artistId;
        if (!isComposer && !isPerformer) continue;
        const roleLabel =
          isComposer && isPerformer ? 'Composer & performer' : isComposer ? 'Composer' : 'Performer';
        out.push({
          tradition: 'turkish-makam',
          refId: makam.id,
          refName: makam.name,
          title: rec.title,
          roleLabel,
          year: rec.year,
          youtubeId: rec.youtubeId,
          hasVideo: !!rec.youtubeId,
          color: makam.color,
          route,
        });
      }

      // Notable compositions (no recording in-app, but still their work).
      for (const piece of makam.notablePieces ?? []) {
        if (getArtistByName(piece.composer)?.id !== artistId) continue;
        // Skip if we already listed a recording with the same title under this makam.
        if (out.some((a) => a.refId === makam.id && a.title === piece.title)) continue;
        out.push({
          tradition: 'turkish-makam',
          refId: makam.id,
          refName: makam.name,
          title: piece.title,
          roleLabel: 'Composer',
          hasVideo: false,
          color: makam.color,
          route,
        });
      }
    }
  } else {
    for (const mode of MODES) {
      const route = '/modal-jazz/mode/' + mode.id;
      const color = JAZZ_BRIGHTNESS_COLOR[mode.brightness] ?? '#7B8FFF';

      for (const tune of mode.classicTunes) {
        if (getArtistByName(tune.artist)?.id !== artistId) continue;
        out.push({
          tradition: 'modal-jazz',
          refId: mode.id,
          refName: mode.name,
          title: tune.title,
          roleLabel: 'Recording',
          year: String(tune.year),
          youtubeId: tune.youtubeId ?? null,
          hasVideo: !!tune.youtubeId,
          color,
          route,
        });
      }

      // Listed among the mode's notable players.
      const isNotable = (mode.notablePlayers ?? []).some((p) => getArtistByName(p)?.id === artistId);
      if (isNotable) {
        out.push({
          tradition: 'modal-jazz',
          refId: mode.id,
          refName: mode.name,
          title: mode.name + ' — notable player',
          roleLabel: 'Notable player',
          hasVideo: false,
          color,
          route,
        });
      }
    }
  }

  return out;
}

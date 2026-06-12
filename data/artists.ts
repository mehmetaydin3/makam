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

  {
    id: 'safiye-ayla', name: 'Safiye Ayla', tradition: 'turkish-makam', born: '1907', died: '1998',
    instrument: 'Voice', role: 'A legendary voice of the early Republic — Atatürk\'s favorite singer', era: 'Early Republic',
    bio: ['Safiye Ayla was among the most celebrated voices of 20th-century Turkey, famed for performing for Atatürk and for definitive readings of the classical and şarkı repertoire across a six-decade career.'],
  },
  {
    id: 'hamiyet-yuceses', name: 'Hamiyet Yüceses', tradition: 'turkish-makam', born: '1915', died: '1996',
    instrument: 'Voice', role: 'One of the great dramatic voices of Turkish classical song', era: 'Republican era',
    bio: ['Hamiyet Yüceses was renowned for the power and emotional intensity of her gazel and şarkı interpretations — a voice that defined the sound of mid-century Istanbul radio.'],
  },
  {
    id: 'kani-karaca', name: 'Kâni Karaca', tradition: 'turkish-makam', born: '1930', died: '2004',
    instrument: 'Voice · Hafız', role: 'The greatest religious-music voice of modern Turkey', era: 'Republican era',
    bio: ['Blind from birth, Kâni Karaca was the supreme master of Mevlevi and mosque music in the 20th century — his recitation and his renditions of the great ayins set a standard no one has matched since.'],
  },
  {
    id: 'niyazi-sayin', name: 'Niyazi Sayın', tradition: 'turkish-makam', born: '1927', died: '2024',
    instrument: 'Ney', role: 'The patriarch of the modern ney school', era: 'Contemporary',
    bio: ['Niyazi Sayın shaped how the ney is played today — tone, breath, and philosophy. Generations of neyzens descend from his teaching at the heart of the Istanbul tradition.'],
  },
  {
    id: 'necdet-yasar', name: 'Necdet Yaşar', tradition: 'turkish-makam', born: '1930', died: '2017',
    instrument: 'Tanbur', role: 'The leading tanbur voice after Cemil Bey', era: 'Contemporary',
    bio: ['Necdet Yaşar carried the tanbur lineage of Tanburi Cemil Bey into the modern era, prized for his harmonically adventurous taksims and his partnership with neyzen Niyazi Sayın.'],
  },
  {
    id: 'udi-hrant', name: 'Udi Hrant Kenkulian', tradition: 'turkish-makam', aliases: ['Udi Hrant'], born: '1901', died: '1978',
    instrument: 'Ud', role: 'The blind Armenian master who modernized the ud', era: 'Republican era',
    bio: ['Udi Hrant was an Armenian-Turkish ud virtuoso whose expressive taksims and recordings carried the Istanbul style across the world — a bridge between the Ottoman past and the diaspora.'],
  },
  {
    id: 'sukru-tunar', name: 'Şükrü Tunar', tradition: 'turkish-makam', born: '1907', died: '1962',
    instrument: 'Clarinet', role: 'The defining clarinet of Turkish classical music', era: 'Republican era',
    bio: ['Şükrü Tunar made the clarinet a Turkish classical instrument, his fluid, vocal phrasing setting the standard for everyone who followed. He died on stage, clarinet in hand.'],
  },
  {
    id: 'yorgo-bacanos', name: 'Yorgo Bacanos', tradition: 'turkish-makam', born: '1900', died: '1977',
    instrument: 'Ud', role: 'The Greek-Istanbulite virtuoso of the ud', era: 'Republican era',
    bio: ['Yorgo Bacanos, from a celebrated Greek musical family of Istanbul, was one of the most dazzling ud players ever recorded — astonishing technique in service of the classical style.'],
  },
  {
    id: 'refik-fersan', name: 'Refik Fersan', tradition: 'turkish-makam', born: '1893', died: '1965',
    instrument: 'Tanbur · Composer', role: 'Composer-tanburist of the late Ottoman and Republican eras', era: 'Early Republic',
    bio: ['Refik Fersan composed saz semaisis and şarkıs that remain repertoire staples, and his tanbur connected the Ottoman court tradition to the radio age.'],
  },
  {
    id: 'cinucen-tanrikorur', name: 'Cinuçen Tanrıkorur', tradition: 'turkish-makam', born: '1938', died: '2000',
    instrument: 'Ud · Composer', role: 'The most important makam composer of the late 20th century', era: 'Contemporary',
    bio: ['Cinuçen Tanrıkorur composed hundreds of works including full Mevlevi ayins, and his essays argued fiercely for the integrity of the makam tradition in a modernizing Turkey.'],
  },
  {
    id: 'bekir-sidki-sezgin', name: 'Bekir Sıdkı Sezgin', tradition: 'turkish-makam', born: '1936', died: '1996',
    instrument: 'Voice', role: 'The most refined classical vocalist of his generation', era: 'Contemporary',
    bio: ['Bekir Sıdkı Sezgin combined deep religious training with classical mastery; his restrained, ornament-perfect interpretations are studied as models of vocal style.'],
  },
  {
    id: 'alaeddin-yavasca', name: 'Alâeddin Yavaşca', tradition: 'turkish-makam', born: '1926', died: '2021',
    instrument: 'Voice · Composer', role: 'Physician-composer who became a pillar of the tradition', era: 'Contemporary',
    bio: ['A professor of medicine and a state artist, Alâeddin Yavaşca composed hundreds of şarkıs and taught generations of singers — the model of the scholar-musician.'],
  },
  {
    id: 'zekai-dede', name: 'Zekâi Dede', tradition: 'turkish-makam', aliases: ['Zekai Dede'], born: '1825', died: '1897',
    instrument: 'Composer · Mevlevi', role: 'Dede Efendi\'s great pupil and successor', era: 'Late Ottoman',
    bio: ['Zekâi Dede studied with Dede Efendi and became the leading composer of the late 19th century, prolific in both sacred and secular forms and a key teacher in the chain of transmission.'],
  },
  {
    id: 'sakir-aga', name: 'Şakir Ağa', tradition: 'turkish-makam', born: '1779', died: '1840',
    instrument: 'Composer · Voice', role: 'Court composer who created makam Ferahnak', era: 'Ottoman classical',
    bio: ['Şakir Ağa served the court of Selim III and Mahmud II alongside Dede Efendi, and invented the makam Ferahnak — his rivalry-friendship with Dede Efendi is the stuff of musical legend.'],
  },
  {
    id: 'selim-iii', name: 'Sultan Selim III', tradition: 'turkish-makam', aliases: ['Selim III'], born: '1761', died: '1808',
    instrument: 'Composer · Ney', role: 'The composer-sultan — patron and inventor of makams', era: 'Ottoman classical',
    bio: ['Selim III was both reformer-sultan and serious composer: a neyzen, patron of Dede Efendi, and inventor of makams including Suzidilara. His court was the golden hour of Ottoman classical music.'],
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
    id: 'michel-petrucciani',
    name: 'Michel Petrucciani',
    tradition: 'modal-jazz',
    born: '1962',
    died: '1999',
    instrument: 'Piano',
    role: 'A lyrical virtuoso who played with overwhelming joy',
    era: 'Post-bop',
    bio: [
      'Born with a brittle-bone condition that left him small in stature, Michel Petrucciani became one of the most expressive pianists in jazz — a player of dazzling technique and singing lyricism. His live recordings from Montreux are landmarks of solo and trio jazz, full of swing, tenderness, and an almost overflowing joy.',
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
  {
    id: 'george-russell', name: 'George Russell', tradition: 'modal-jazz', born: '1923', died: '2009',
    instrument: 'Composer · Theorist · Piano', role: 'The theorist who gave modal jazz its blueprint', era: 'Modal theory',
    bio: ['George Russell\'s "Lydian Chromatic Concept of Tonal Organization" (1953) was the theoretical spark for modal jazz — Miles and Evans absorbed its ideas before Kind of Blue. The rare case of a theory book changing the sound of music.'],
  },
  {
    id: 'elvin-jones', name: 'Elvin Jones', tradition: 'modal-jazz', born: '1927', died: '2004',
    instrument: 'Drums', role: 'The polyrhythmic engine of the Coltrane quartet', era: 'Modal',
    bio: ['Elvin Jones redefined jazz drumming with rolling, layered polyrhythms that gave the Coltrane quartet its oceanic power — the rhythmic counterpart to modal freedom.'],
  },
  {
    id: 'jimmy-cobb', name: 'Jimmy Cobb', tradition: 'modal-jazz', born: '1929', died: '2020',
    instrument: 'Drums', role: 'The pulse of Kind of Blue', era: 'Cool / modal',
    bio: ['Jimmy Cobb played drums on Kind of Blue — his ride-cymbal glide is the time-feel under "So What." He outlived every other musician on the session, carrying its memory for decades.'],
  },
  {
    id: 'paul-chambers', name: 'Paul Chambers', tradition: 'modal-jazz', born: '1935', died: '1969',
    instrument: 'Bass', role: 'The bassist who walks the opening of "So What"', era: 'Hard bop / modal',
    bio: ['Paul Chambers anchored the Miles Davis rhythm section through its greatest years; the call-and-response bass figure that opens "So What" is among the most recognizable phrases in jazz.'],
  },
  {
    id: 'ron-carter', name: 'Ron Carter', tradition: 'modal-jazz', born: '1937',
    instrument: 'Bass', role: 'The most recorded bassist in jazz history', era: 'Post-bop',
    bio: ['Ron Carter anchored Miles Davis\'s 1960s quintet, where modal openness met elastic, conversational time — a foundation for everything post-bop became.'],
  },
  {
    id: 'tony-williams', name: 'Tony Williams', tradition: 'modal-jazz', born: '1945', died: '1997',
    instrument: 'Drums', role: 'The teenage prodigy who reinvented jazz time', era: 'Post-bop',
    bio: ['Tony Williams joined Miles Davis at seventeen and shattered the rules of jazz drumming — metric ambiguity, explosive color, time as a living thing. Later he helped invent fusion with Lifetime.'],
  },
  {
    id: 'freddie-hubbard', name: 'Freddie Hubbard', tradition: 'modal-jazz', born: '1938', died: '2008',
    instrument: 'Trumpet', role: 'The virtuoso trumpet of the post-bop era', era: 'Post-bop',
    bio: ['Freddie Hubbard\'s brilliant tone and fearless lines lit up the classic Blue Note years — including Maiden Voyage, where his solos ride Herbie Hancock\'s open modal harmony.'],
  },
  {
    id: 'pharoah-sanders', name: 'Pharoah Sanders', tradition: 'modal-jazz', born: '1940', died: '2022',
    instrument: 'Tenor saxophone', role: 'The spiritual heir of late Coltrane', era: 'Spiritual jazz',
    bio: ['Pharoah Sanders carried modal jazz into its spiritual deep end — "The Creator Has a Master Plan" stretches one mode across half an hour of ecstatic sound.'],
  },
  {
    id: 'yusef-lateef', name: 'Yusef Lateef', tradition: 'modal-jazz', born: '1920', died: '2013',
    instrument: 'Tenor sax · Flute · Oboe', role: 'The explorer who brought Eastern modes into jazz', era: 'Modal / world',
    bio: ['Decades before "world music," Yusef Lateef was studying Middle Eastern scales and instruments and folding them into jazz — the closest spiritual cousin to this app\'s two-tradition idea.'],
  },
  {
    id: 'gil-evans', name: 'Gil Evans', tradition: 'modal-jazz', born: '1912', died: '1988',
    instrument: 'Arranger · Composer · Piano', role: 'Miles Davis\'s orchestral co-conspirator', era: 'Cool / modal',
    bio: ['Gil Evans arranged Sketches of Spain and Porgy and Bess — the orchestral canvases around Miles\'s trumpet. His voicings taught jazz how to breathe slowly, a deeply modal instinct.'],
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


// ─── Portraits ───────────────────────────────────────────────────────────────
// Portrait thumbnails from Wikipedia / Wikimedia Commons (freely licensed).
// Artists without a portrait (mostly pre-photography Ottoman figures) fall back
// to the letter avatar in the UI.
export const ARTIST_IMAGES: Record<string, string> = {
  'bekir-sidki-sezgin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Grave_of_Bekir_S%C4%B1dk%C4%B1_Sezgin1.jpg/330px-Grave_of_Bekir_S%C4%B1dk%C4%B1_Sezgin1.jpg',
  'bill-evans': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg/330px-Bill_Evans_%281961_publicity_photo_by_Steve_Schapiro%29.jpg',
  'bulent-ersoy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Bulent_Ersoy.jpg/330px-Bulent_Ersoy.jpg',
  'cannonball-adderley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cannonball_Adderley_press_photo_1966.jpg/330px-Cannonball_Adderley_press_photo_1966.jpg',
  'chet-baker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Chet_Baker_%281955_portrait%29.jpg/330px-Chet_Baker_%281955_portrait%29.jpg',
  'chick-corea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Chick_Corea_1976.JPG/330px-Chick_Corea_1976.JPG',
  'cinucen-tanrikorur': 'https://upload.wikimedia.org/wikipedia/en/b/b5/Cinu%C3%A7en_Tanr%C4%B1korur.jpg',
  'dede-efendi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Hamm%C3%A2miz%C3%A2de_%C4%B0sm%C3%A2%C3%AEl_Dede_Efendi_.jpg/330px-Hamm%C3%A2miz%C3%A2de_%C4%B0sm%C3%A2%C3%AEl_Dede_Efendi_.jpg',
  'elvin-jones': 'https://upload.wikimedia.org/wikipedia/commons/6/62/Elvin_Jones_1979_1.jpg',
  'eric-dolphy': 'https://upload.wikimedia.org/wikipedia/en/8/86/Eric_Dolphy.jpg',
  'erroll-garner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Erroll_Garner_1947.jpg/330px-Erroll_Garner_1947.jpg',
  'freddie-hubbard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Freddie_Hubbard_1976.jpg/330px-Freddie_Hubbard_1976.jpg',
  'george-russell': 'https://upload.wikimedia.org/wikipedia/en/7/7b/George_Allen_Russell.jpg',
  'gil-evans': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Gil_Evans_%281978%29.jpg',
  'haci-arif-bey': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Bestekar_Hac%C4%B1_Arif_Bey.jpg',
  'hafiz-burhan': 'https://upload.wikimedia.org/wikipedia/tr/thumb/b/b8/H%C3%A2f%C4%B1z_Burhan.jpg/330px-H%C3%A2f%C4%B1z_Burhan.jpg',
  'hamiyet-yuceses': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/1950_01_06_Aksam_Hamiyet_Yuceses.jpg/330px-1950_01_06_Aksam_Hamiyet_Yuceses.jpg',
  'herbie-hancock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Herbie_Hancock_2023.jpg/330px-Herbie_Hancock_2023.jpg',
  'itri': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Buhurizade_Mustafa_Itr%C3%AE.jpg',
  'jimmy-cobb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Jimmy_Cobb.jpg/330px-Jimmy_Cobb.jpg',
  'joe-henderson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Joe_Henderson_2.jpg/330px-Joe_Henderson_2.jpg',
  'john-coltrane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
  'keith-jarrett': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Keith_Jarrett.jpg/330px-Keith_Jarrett.jpg',
  'mccoy-tyner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Mccoy_Tyner_1973_gh_%28cropped%29.jpg/330px-Mccoy_Tyner_1973_gh_%28cropped%29.jpg',
  'melihat-gulses': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MEL-50.JPG/330px-MEL-50.JPG',
  'michel-petrucciani': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Michel_Petrucciani.jpg/330px-Michel_Petrucciani.jpg',
  'miles-davis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Miles_Davis_1987.png/330px-Miles_Davis_1987.png',
  'munir-nurettin-selcuk': 'https://upload.wikimedia.org/wikipedia/tr/a/a7/M%C3%BCnir_Nurettin_Sel%C3%A7uk.jpg',
  'muzeyyen-senar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/1950_01_06_Aksam_Zehra_Bilir_ve_Muzeyyen_Senar.jpg/330px-1950_01_06_Aksam_Zehra_Bilir_ve_Muzeyyen_Senar.jpg',
  'necdet-yasar': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Yasar_playing_tanbur.jpg',
  'niyazi-sayin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sayin_serneyzen.jpg/330px-Sayin_serneyzen.jpg',
  'oscar-peterson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Oscar_Peterson.jpg/330px-Oscar_Peterson.jpg',
  'paul-chambers': 'https://upload.wikimedia.org/wikipedia/en/7/72/Paul_Laurence_Dunbar_Chambers%2C_Jr..jpg',
  'pharoah-sanders': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Pharoah_Sanders_photo.jpg/330px-Pharoah_Sanders_photo.jpg',
  'ron-carter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Ron_Carter_Berkeley1.jpg/330px-Ron_Carter_Berkeley1.jpg',
  'sadettin-kaynak': 'https://upload.wikimedia.org/wikipedia/tr/a/a2/Saadettin_kaynak.jpg',
  'safiye-ayla': 'https://upload.wikimedia.org/wikipedia/tr/thumb/c/c8/Safiye_Ayla.jpeg/330px-Safiye_Ayla.jpeg',
  'selahattin-pinar': 'https://upload.wikimedia.org/wikipedia/tr/9/93/Selahattinpinar.jpg',
  'selim-iii': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Konstantin_Kapidagli_002.jpg/330px-Konstantin_Kapidagli_002.jpg',
  'semahat-ozdenses': 'https://upload.wikimedia.org/wikipedia/tr/4/4b/Semahatozdenses.jpg',
  'sukru-tunar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Grave_of_%C5%9E%C3%BCkr%C3%BC_Tunar.jpg/330px-Grave_of_%C5%9E%C3%BCkr%C3%BC_Tunar.jpg',
  'tanburi-cemil-bey': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Cemil.jpg',
  'tatyos-efendi': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Tatyos-1.2.jpg',
  'tony-williams': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Tony_Williams_DownBeat.jpg/330px-Tony_Williams_DownBeat.jpg',
  'udi-hrant': 'https://upload.wikimedia.org/wikipedia/en/f/f6/Udi_Hrant_CD_jacket.jpg',
  'wayne-shorter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Wayne-Shorter_in_Amsterdam%2C_1980.jpg/330px-Wayne-Shorter_in_Amsterdam%2C_1980.jpg',
  'wes-montgomery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Wes_Montgomery_%281967_Gibson_portrait%29.jpg/330px-Wes_Montgomery_%281967_Gibson_portrait%29.jpg',
  'yorgo-bacanos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/1950_06_07_Aksam_Yorgo_Bacanos.jpg/330px-1950_06_07_Aksam_Yorgo_Bacanos.jpg',
  'yusef-lateef': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Yusef_Lateef.jpg/330px-Yusef_Lateef.jpg',
  'zeki-muren': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Zeki_M%C3%BCren_cropped.jpg/330px-Zeki_M%C3%BCren_cropped.jpg',
};

export function getArtistImage(id: string): string | undefined {
  return ARTIST_IMAGES[id];
}

// Crossroads — comparative pieces that live between the two traditions.
// Each piece is shaped like a Lesson so it renders in the shared LessonReader.
// Content is expert-grounded (ethnomusicology + modal-jazz history).

import { Lesson } from './education';

export type CrossroadsPiece = Lesson & {
  kind: 'pairing' | 'essay';
  // Optional links to the mode/makam a pairing compares (for future cross-linking)
  modeId?: string;
  makamId?: string;
  // When a piece links a concrete modeId + a playable makamId, it can drive the
  // interactive A/B comparison screen (app/journey/comparison). Optional fields
  // below let a pairing be both audible and accurate even when the linked
  // `modeId` is a gentler cousin of the sound the essay actually describes.
  comparison?: {
    /** One-line label for the jazz side (defaults to the mode's name). */
    jazzLabel?: string;
    /** One-line label for the makam side (defaults to the makam's name). */
    makamLabel?: string;
    /**
     * Semitone intervals to sound on the Rhodes side, root-relative (0 = root).
     * Overrides the linked mode's own intervals when the essay describes a
     * close relative — e.g. Phrygian dominant for the Hicaz pairing, which the
     * plain Phrygian mode cannot voice.
     */
    jazzIntervals?: number[];
    /** A short "what to listen for" line shown between the two panels. */
    listenFor: string;
  };
};

export const CROSSROADS: CrossroadsPiece[] = [
  {
    id: 'cx-frame',
    kind: 'essay',
    category: 'crossroads',
    number: 0,
    title: 'A palette and a path',
    subtitle: 'Why a mode and a makam are not the same kind of thing',
    pages: [
      {
        id: 'cx-frame-1',
        type: 'concept',
        heading: 'A palette and a path',
        body:
          'It is tempting to say a jazz mode and a Turkish makam are two names for the same thing — "a scale with a flavor." They are not, and the difference is the most illuminating thing you can carry between these two worlds.',
      },
      {
        id: 'cx-frame-2',
        type: 'concept',
        heading: 'A mode is a palette',
        body:
          'Modal jazz was born around 1959, when Miles Davis handed his musicians scales instead of chord changes on Kind of Blue. A mode gives you a set of pitches and sets you free: improvise however you like within the color. Here are your paints — go.',
      },
      {
        id: 'cx-frame-3',
        type: 'concept',
        heading: 'A makam is a path',
        body:
          'A makam prescribes more than notes. It carries a direction of travel — the seyir — which tones to lean on, where to pause, how to descend. Where a mode says "here are your colors," a makam says "here is the journey, half-written; now finish it." One tradition hands you paint. The other hands you a road.',
        callout: 'A jazz mode is a palette. A makam is a path. Keep this in your ear as you cross between them.',
      },
    ],
  },
  {
    id: 'cx-hicaz-phrygian',
    kind: 'pairing',
    category: 'crossroads',
    number: 1,
    title: 'The augmented second',
    subtitle: 'Hicaz ↔ Phrygian dominant',
    makamId: 'hicaz',
    modeId: 'phrygian',
    comparison: {
      jazzLabel: 'Phrygian dominant — the augmented-second leap',
      makamLabel: 'Hicaz — the same leap, as grammar',
      // Phrygian dominant (5th mode of harmonic minor): the true twin of Hicaz,
      // which plain Phrygian can't voice. Root-relative semitones.
      jazzIntervals: [0, 1, 4, 5, 7, 8, 10, 12],
      listenFor:
        'Both climb through the same dramatic leap between the 2nd and 3rd degrees. Hear how the makam leans into that gap as its home grammar, where jazz treats it as a colour.',
    },
    pages: [
      {
        id: 'cx-hp-1',
        type: 'concept',
        heading: 'The widest doorway',
        body:
          'Of all the bridges between East and West, this is the widest. Makam Hicaz is built on an augmented second — the dramatic, leaping interval between its second and third degrees that no plain Western mode contains.',
      },
      {
        id: 'cx-hp-2',
        type: 'concept',
        heading: 'Jazz reaches the same sound',
        body:
          'Jazz arrives at this leap through the Phrygian dominant scale — the fifth mode of the harmonic minor, nicknamed "Freygish" in klezmer. It sits so close to Hicaz that scholars literally call it "the hijaz scale." (Note: plain Phrygian is the gentler one — its true twin is makam Kürdî. Hicaz needs that augmented second.)',
      },
      {
        id: 'cx-hp-3',
        type: 'concept',
        heading: 'Older than either tradition',
        body:
          'This interval is not exotic decoration — it is one of the oldest sounds in music. Musicologists call modes built on it "hemiolic," and trace them to the chromatic and enharmonic genera of Ancient Greece. You hear the same leap in Byzantine chant, in flamenco, in klezmer, in Balkan brass — across the whole Mediterranean and Central Asia.',
        callout: 'Hicaz and Phrygian dominant are two dialects of a language older than either tradition — the sound of "somewhere far, and long ago."',
      },
    ],
  },
  {
    id: 'cx-aeolian-nihavend',
    kind: 'pairing',
    category: 'crossroads',
    number: 2,
    title: 'The plainest minor',
    subtitle: 'Aeolian ↔ Nihavend',
    makamId: 'nihavend',
    modeId: 'aeolian',
    comparison: {
      jazzLabel: 'Aeolian — the plain natural minor',
      makamLabel: 'Nihavend — minor with a path',
      listenFor:
        'Nearly the same notes, the same gravity. Listen for what the makam adds: a leaning, a shape of descent that the bare mode leaves open.',
    },
    pages: [
      {
        id: 'cx-an-1',
        type: 'concept',
        heading: 'The cleanest bridge',
        body:
          'If you want the simplest crossing between the two systems, start here. Aeolian is the natural minor — the plain, unsentimental sadness of the flat 6th. No drama, just gravity.',
      },
      {
        id: 'cx-an-2',
        type: 'concept',
        heading: 'A Turkish near-twin',
        body:
          'Nihavend is a makam with an essentially minor character, conveying sadness, longing, and romanticism. A listener who knows Aeolian recognizes Nihavend in a heartbeat — which is exactly why it makes the perfect first crossing.',
      },
      {
        id: 'cx-an-3',
        type: 'concept',
        heading: 'But notice what the makam adds',
        body:
          'Aeolian is content to be a set of minor pitches. Nihavend comes with a path — a characteristic descent, leaning tones, an expected shape of melody. Same grief; one is a color you are handed, the other a route you are asked to walk.',
        callout: 'The difference between Aeolian and Nihavend is the difference between the two traditions, in miniature.',
      },
    ],
  },
  {
    id: 'cx-dorian-ussak',
    kind: 'pairing',
    category: 'crossroads',
    number: 3,
    title: 'Minor, facing up',
    subtitle: 'Dorian ↔ the Uşşak family',
    makamId: 'huseyni',
    modeId: 'dorian',
    comparison: {
      jazzLabel: 'Dorian — minor that faces up',
      makamLabel: 'Hüseyni — the neutral second',
      listenFor:
        'Both are a minor that refuses to droop. Listen to Hüseyni\'s second degree sit in the crack between the piano keys — the neutral second Dorian cannot reach.',
    },
    pages: [
      {
        id: 'cx-du-1',
        type: 'concept',
        heading: 'A blue that is not beaten',
        body:
          'Most minor scales pull downward. Dorian refuses — its natural 6th lifts the minor third, giving it forward motion, a blue that is not defeated. It was the sound Miles Davis chose to open Kind of Blue: "So What" is essentially a study in Dorian, two chords and all the room in the world.',
      },
      {
        id: 'cx-du-2',
        type: 'concept',
        heading: 'The same country, a different road',
        body:
          'The Uşşak family of makams lives in a related emotional country, but reaches it through an interval Dorian cannot touch: the neutral second — a pitch sitting precisely between the Western minor and major second, in the crack between the piano keys.',
      },
      {
        id: 'cx-du-3',
        type: 'concept',
        heading: 'Hüseyni, waiting on the other shore',
        body:
          'Hüseyni, an Uşşak-family makam, ascends — noble and yearning — where its relative Uşşak descends into longing. If you love how Dorian feels wistful without despair, Hüseyni is the makam waiting on the other shore: the same hope, voiced in a tuning your piano cannot play.',
      },
    ],
  },
  {
    id: 'cx-piano',
    kind: 'essay',
    category: 'crossroads',
    number: 4,
    title: 'What a piano cannot play',
    subtitle: 'Two answers to one limit',
    pages: [
      {
        id: 'cx-pi-1',
        type: 'concept',
        heading: 'One question, two answers',
        body:
          'Both traditions are answers to a single problem: twelve notes are not enough to hold everything we feel. So what do you do?',
      },
      {
        id: 'cx-pi-2',
        type: 'concept',
        heading: 'Keep the twelve, get clever',
        body:
          'Western music kept the twelve and got clever. Modal jazz found seven feeling-worlds hiding inside one scale, simply by starting it from each different degree — and by handing improvisers scales instead of chord changes, freed them to chase melody over harmony. "You can feel the changes," went the modal manifesto.',
      },
      {
        id: 'cx-pi-3',
        type: 'concept',
        heading: 'Or reach past them',
        body:
          'Turkish music took the harder road. It divided the octave into 53 commas and carved out intervals that live between the keys — the neutral second, the microtonal inflections that give Rast its "bright but not cheerful" glow and Saba its grief. And it is the one place jazz reaches a color makam does not chase: Lydian, with its floating raised 4th, suspension for its own sake — the sound of never wanting to land.',
        callout: 'One tradition rearranges the twelve; the other reaches past them. Neither is more advanced — they are two civilizations refusing the same limit.',
      },
    ],
  },
  {
    id: 'cx-grief',
    kind: 'essay',
    category: 'crossroads',
    number: 5,
    title: 'Two roads to grief',
    subtitle: 'Saba ↔ Locrian — resolution denied',
    makamId: 'saba',
    modeId: 'locrian',
    comparison: {
      jazzLabel: 'Locrian — the home that never arrives',
      makamLabel: 'Saba — resolution withheld',
      listenFor:
        'Two roads to grief by the same trick: a resolution denied. Hear how neither scale lets the ear settle — Locrian through its flat 5th, Saba by refusing its own octave.',
    },
    pages: [
      {
        id: 'cx-gr-1',
        type: 'concept',
        heading: 'Every culture finds its way to sorrow',
        body:
          'And the deepest sadness in each of these traditions comes from the same trick: a resolution withheld.',
      },
      {
        id: 'cx-gr-2',
        type: 'concept',
        heading: 'Saba — the maqam of grief',
        body:
          'In Turkish music, the maqam of grief is Saba — traditionally played at funerals and mourning, the one you would never play at a wedding unless something had gone irreversibly wrong. Its sorrow is structural and precise: Saba refuses to resolve to its own octave on the way up, reaching instead for a flattened note that leaves the ear suspended — "a mystical, endless feel" — and only finds the true octave coming back down.',
        callout: 'Since the 9th century, theorists like Al-Farabi paired Rast with happiness and Saba with sadness. This grief is a thousand years codified.',
      },
      {
        id: 'cx-gr-3',
        type: 'concept',
        heading: 'Locrian — the home that never arrives',
        body:
          'Jazz reaches its own unrest through Locrian — the seventh mode, built on a flat 5th, a tritone where the ear wants stability, so the scale never feels at home. Different notes, identical wisdom: grief, in both traditions, is not darkness added but resolution denied — the held breath that never releases.',
      },
    ],
  },
];

export function getCrossroadsPiece(id: string): CrossroadsPiece | undefined {
  return CROSSROADS.find((p) => p.id === id);
}

// Reverse lookups so a makam/mode detail screen can surface its bridge to the
// other tradition. A piece "belongs" to a makam/mode if it links that id; we
// prefer pairings (which carry the interactive A/B comparison) over essays.
function byPairingFirst(pieces: CrossroadsPiece[]): CrossroadsPiece[] {
  return [...pieces].sort((a, b) => (a.kind === 'pairing' ? 0 : 1) - (b.kind === 'pairing' ? 0 : 1));
}

export function getCrossroadsForMakam(makamId: string): CrossroadsPiece | undefined {
  return byPairingFirst(CROSSROADS.filter((p) => p.makamId === makamId))[0];
}

export function getCrossroadsForMode(modeId: string): CrossroadsPiece | undefined {
  return byPairingFirst(CROSSROADS.filter((p) => p.modeId === modeId))[0];
}

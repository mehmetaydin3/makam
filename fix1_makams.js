const fs = require('fs');
let m = fs.readFileSync('data/makams.ts', 'utf8');

m = m.replace("characterNote: 'Segah's microtonality", "characterNote: 'Segah\u2019s microtonality");
m = m.replace("characterNote: 'Nihavend's character", "characterNote: 'Nihavend\u2019s character");
m = m.replace("relatedMakams: ['ussak', 'buselik', 'huseyni']", "relatedMakams: ['U\u015f\u015fak', 'Buselik', 'H\u00fcseyn\u00ed']");
m = m.replace("{ degree: 2, name: 'Mi\u266d', cents: 90, westernNearest: 'E\u266d' }", "{ degree: 2, name: 'Mi\u266d', cents: 90, westernNearest: 'E\u266d', isCharacteristic: true }");
m = m.replace(
  "    id: 'kurd',\n    name: 'Kurd',\n    pronunciation: 'koord',\n    family: 'Kurd',\n    seyir: 'descending',",
  "    id: 'kurd',\n    name: 'Kurd',\n    pronunciation: 'koord',\n    family: 'Kurd',\n    commonUsuls: ['Aksak', 'D\u00fcyek', 'Devr-i Hindi'],\n    seyir: 'descending',"
);
m = m.replace(
  "    id: 'neva',\n    name: 'Neva',\n    pronunciation: 'neh-VAH',\n    family: 'Rast',\n    seyir: 'ascending',",
  "    id: 'neva',\n    name: 'Neva',\n    pronunciation: 'neh-VAH',\n    family: 'Rast',\n    commonUsuls: ['D\u00fcyek', 'Aksak', 'Semai'],\n    seyir: 'ascending',"
);
m = m.replace(
  "{ title: 'Rast Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Aksak' }",
  "{ title: 'Rast Saz Semaisi', composer: 'Tanburi Cemil Bey', usul: 'Devr-i Hindi' }"
);

const analogies = [
  ['rast',     "Think of Rast as a major scale with a warm, slightly flat third and sixth. Where C major feels bright and resolved, Rast feels sunny but tinged with longing \u2014 like a major scale that has lived too long in the East to forget what it felt like."],
  ['ussak',    "The neutral second of U\u015f\u015fak sits exactly between a minor 2nd and a major 2nd \u2014 a sound no piano key can produce. If you know Phrygian mode, U\u015f\u015fak is its more emotional, sighing Turkish cousin."],
  ['hicaz',    "Hicaz\u2019s augmented second (E\u266d to F\u266f) is the same interval Western composers use to evoke \u2018the exotic Orient.\u2019 But in Turkish music it isn\u2019t a color \u2014 it\u2019s the grammar. Think of the Spanish Phrygian scale, but with more fire."],
  ['huseyni',  "H\u00fcseyn\u00ed shares its structure with the Dorian mode, but its neutral second gives it a weight and longing that Dorian never quite achieves. If Dorian is reflective, H\u00fcseyn\u00ed is quietly heartbroken."],
  ['saba',     "Saba has no direct Western equivalent. Its compressed lower tetrachord \u2014 two consecutive neutral intervals \u2014 creates a claustrophobic, grief-laden sound that sits between minor and something darker. Think of a minor scale that has given up hope."],
  ['segah',    "Segah\u2019s tonic sits between E\u266d and E on the equal-tempered scale \u2014 a note that literally does not exist on a piano. If you have ever felt that minor scales don\u2019t go deep enough, Segah goes deeper."],
  ['kurd',     "Kurd is essentially the Phrygian mode \u2014 the same scale guitarists use for flamenco and metal. Its characteristic E\u266d is slightly sharper than a true semitone, giving it a roughness that pure Phrygian lacks."],
  ['neva',     "Neva is Rast transposed up a fifth, sharing its warmth and the same characteristic neutral intervals. For Western musicians, think of it as a major scale where the third and sixth are consistently a quarter-tone flat."],
  ['buselik',  "Buselik is the closest makam to the natural minor (Aeolian) scale. Its third is slightly flat of the Western minor third \u2014 giving it a darkness that natural minor almost reaches, but never quite does."],
  ['cargah',   "\u00c7argah is essentially C major \u2014 the same scale, nearly the same tuning. Its intervals match equal temperament more closely than any other makam. The difference is in how it moves, not in its notes."],
  ['nihavend', "Nihavend is natural minor with a raised seventh in ascent \u2014 almost identical to the Western harmonic minor scale. Of all the makams, it will sound most immediately familiar to Western-trained ears."],
];

for (const [id, analogy] of analogies) {
  const idPos = m.indexOf(`id: '${id}'`);
  if (idPos === -1) { console.log('NOT FOUND:', id); continue; }
  const colorMatch = m.indexOf("\n    color: '", idPos);
  if (colorMatch === -1) { console.log('NO COLOR:', id); continue; }
  const nextId = m.indexOf("  {\n    id:", idPos + 1);
  if (nextId !== -1 && colorMatch > nextId) { console.log('COLOR IN WRONG BLOCK:', id); continue; }
  const blockBefore = m.slice(idPos, colorMatch);
  if (blockBefore.includes('westernAnalogy')) { console.log('already has westernAnalogy:', id); continue; }
  m = m.slice(0, colorMatch) + `\n    westernAnalogy: '${analogy}',` + m.slice(colorMatch);
  console.log('inserted westernAnalogy:', id);
}

fs.writeFileSync('data/makams.ts', m);

// Verify
const ids = ['rast','ussak','hicaz','huseyni','saba','segah','kurd','neva','buselik','cargah','nihavend'];
const missing = ids.filter(id => !m.slice(m.indexOf(`id: '${id}'`), m.indexOf(`id: '${id}'`) + 2000).includes('westernAnalogy'));
console.log('westernAnalogy missing:', missing.length === 0 ? 'NONE ✓' : missing.join(', '));
console.log('Segah apostrophe:', m.includes("Segah\u2019s") ? '\u2713' : '\u2717');
console.log('Nihavend apostrophe:', m.includes("Nihavend\u2019s") ? '\u2713' : '\u2717');
console.log('Nihavend relatedMakams:', m.includes("'U\u015f\u015fak', 'Buselik'") ? '\u2713' : '\u2717');
console.log('Hicaz Eb:', m.includes("E\u266d', isCharacteristic: true") ? '\u2713' : '\u2717');
console.log('Kurd commonUsuls:', m.slice(m.indexOf("id: 'kurd'"), m.indexOf("id: 'kurd'")+250).includes('commonUsuls') ? '\u2713' : '\u2717');
console.log('Neva commonUsuls:', m.slice(m.indexOf("id: 'neva'"), m.indexOf("id: 'neva'")+250).includes('commonUsuls') ? '\u2713' : '\u2717');

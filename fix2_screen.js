const fs = require('fs');
let d = fs.readFileSync('app/makam/[id].tsx', 'utf8');

d = d.replace(
  `          <Text style={styles.scaleHint}>Highlighted notes are where this makam lives`,
  `          {makam.characterNote ? <Text style={styles.characterNote}>{makam.characterNote}</Text> : null}\n          <Text style={styles.scaleHint}>Highlighted notes are where this makam lives`
);
d = d.replace(
  `  scaleHint: { fontSize: 12, color: COLORS.textTertiary, marginTop: SPACING.md, lineHeight: 18, fontStyle: 'italic' },`,
  `  scaleHint: { fontSize: 12, color: COLORS.textTertiary, marginTop: SPACING.md, lineHeight: 18, fontStyle: 'italic' },\n  characterNote: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic', marginTop: SPACING.sm, marginBottom: SPACING.sm },`
);

fs.writeFileSync('app/makam/[id].tsx', d);
console.log('characterNote inserted:', d.includes('characterNote') ? '\u2713' : '\u2717');

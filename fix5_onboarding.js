const fs = require('fs');
let ob = fs.readFileSync('components/Onboarding.tsx', 'utf8');

ob = ob.replace(
  `'Three paths await you.\\n\\n\u{1F4A1}  DISCOVER \u2014 Browse all makams, feel their moods, understand their character.\\n\\n\u{1F4D6}  MAKAMS \u2014 The full library. Every makam with its scale, seyir, and notable pieces.\\n\\n\u{1F3DB}  LEARN \u2014 Lessons on Turkish music theory, tuning, and musical families.'`,
  `'Three paths await you.\\n\\n\u266a  MAKAM \u2014 Browse all 11 makams, their scales, moods, and microtones.\\n\\n\u29D6  USUL \u2014 The rhythmic cycles. Pattern, feel, and pulse.\\n\\n\u{1F4D6}  LEARN \u2014 Lessons on Turkish music theory, tuning, and musical families.'`
);

fs.writeFileSync('components/Onboarding.tsx', ob);
console.log('onboarding updated:', ob.includes('MAKAM \u2014 Browse') ? '\u2713' : '\u2717');

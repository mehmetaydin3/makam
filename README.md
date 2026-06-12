# The Modality

**Hear music between the notes.**

The Modality is a mobile app for listening to and learning two modal music traditions side by side — **Turkish makam** and **modal jazz** — and discovering the ancient connections between them. Western scales divide sound into 12 equal parts; Turkish makam uses 53, creating intervals that exist nowhere on a piano. Modal jazz found seven feeling-worlds hiding inside one scale. The app teaches you to hear both.

Built with Expo / React Native. iOS + Android.

---

## What's inside

| | |
|---|---|
| **29** makams | Rast to Ferahfeza, each with its microtonal scale, seyir, mood, and ney playback |
| **14** jazz modes | The 7 modes of the major scale + the 7 modes of melodic minor |
| **64** musicians | Composers & performers across both traditions, most with portraits |
| **105** songs | Real repertoire mapped to its makam — classical, folk, arabesk, rock, sufi |
| **6** crossroads | Interactive A/B pairings where the two traditions touch |

## Features

- **Scale diagrams** that draw each makam/mode degree by degree, with microtonal commas marked, playable from any root on the ney or a Rhodes synth.
- **The Crossroads** — the signature feature: makams and modes that share an ancient interval point to each other and play side by side (e.g. Hicaz ↔ Phrygian dominant, ney vs Rhodes).
- **Musicians directory** — tap any credit on any recording to meet the person behind it, then jump to everywhere else they appear.
- **Guided lessons, quizzes, and a glossary** for each tradition.
- **Listening** — iconic recordings, taksim improvisations, and canonical tunes via embedded video.

## Tech stack

- **Expo SDK 56** / React Native 0.85 / React 19
- **expo-router** (typed routes, file-based)
- **expo-audio** for the ney/usul sample engine; a Rhodes synth for the jazz side
- **expo-secure-store** for local-only progress (no accounts, no backend, no analytics)
- TypeScript throughout

## Project structure

```
app/                      # expo-router screens (file-based routing)
  turkish-makam/          # makam tradition: tabs, makam/[id], usul/[id]
  modal-jazz/             # jazz tradition: tabs, mode/[id]
  journey/                # cross-tradition hub, crossroads, comparison
  artist/                 # musician directory + profiles
  glossary.tsx
data/                     # the content + domain logic (single source of truth)
  makams.ts               # 29 makams
  traditions/modal-jazz/  # modes, lessons, ear training, Rhodes engine
  artists.ts              # 64 musicians + portrait map
  songs.ts, glossary.ts, usuls.ts, crossroads.ts
  familyColors.ts         # derived color systems
components/               # reusable UI (scale diagrams, accordions, bridge card…)
audio/                    # the sample-based audio engine
context/ hooks/ lib/      # theme, language, progress
store/                    # App Store / Play Store launch kit (see below)
```

## Getting started

```bash
npm install
npm run ios       # or: npm run android
```

For a quick layout check in the browser (audio engines are native-only):

```bash
npm run web
```

`npx tsc --noEmit` type-checks the whole project.

## Build & release (EAS)

Versioning lives in `app.json` (`version`) with build numbers managed remotely (`appVersionSource: remote`).

```bash
# iOS — App Store / TestFlight
npx expo prebuild -p ios --clean
eas build --platform ios --profile production --non-interactive

# Android — installable APK for direct testing (shareable link, no Play Console)
eas build --platform android --profile preview

# Android — .aab for the Play Store
eas build --platform android --profile production
```

Submit to the stores with `eas submit`. The Android submit config (internal track) and a Google Play service-account path are wired in `eas.json` — the key file is gitignored and never committed.

App identity: bundle id / package = `com.mehmetaydin.makam` on both platforms.

## Conventions worth knowing

- **Single source of truth.** All content lives in `data/`; screens are thin renderers over it. Adding a makam, mode, song, or musician is a data edit — the appearance scanner, color systems, and cross-links pick it up automatically.
- **Honesty bar.** No invented recordings, video IDs, or credits. A missing recording is `null` and the UI hides gracefully; only documented attributions appear.
- **Feature flags** (`data/constants.ts` → `FEATURES`). Features that exist but aren't ready for users (ear training, drone play-along) are gated off; flip a flag to restore the UI.
- **Crossroads scaling.** `data/crossroads.ts` carries a documented migration plan for generalizing the bridge to a third tradition (`BridgeSide[]`, per-side engine) — deferred until that work begins.

## Launch kit

`store/` is the source of truth for store listings:

- `app-store-copy.md` — Apple fields (name, subtitle, promo, description, keywords, What's New)
- `play-store-copy.md` — Google Play fields
- `privacy-policy.md` — published at https://themodality.app/privacy
- `check-limits.py` — verifies every field against each platform's character limits (`python3 store/check-limits.py`)

## License

Private. © Mehmet Aydın.

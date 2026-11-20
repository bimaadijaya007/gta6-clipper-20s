# gta6-clipper-01 — "Clip GTA 6 for the most YouTube views"

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/bimaadijaya007/gta6-clipper-20s/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/bimaadijaya007/gta6-clipper-20s/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

Entry for the [make.fun bounty gta6-clipper-01](https://make.fun/bounty/gta6-clipper-01) ($500, free entry). The entry's
program does one thing: it names the uploaded clip.

## The clip

- Source: GTA 6 police-chase gameplay ("GTA 6 Open World Police Chase
  Gameplay – Chaos in the Leonida Keys!", GameV, youtube.com/watch?v=9TLwyuGDSmI).
  One moment, 330.5–342.5 in the source: a police car pins the player's SUV
  roof-to-roof in a top-down shot (lands at ~2 s into the clip), the SUV
  breaks free, the driver bails out on foot and runs at a police sedan to
  hijack it. Not a montage.
- Final clip: `~/workspace/makefun/gta6-clipper-01-media/gta6-clipper-final.mp4`
  — vertical 1080x1920, 20.0 s, H.264 + AAC, 14.5 MB. 12 s gameplay hook
  (full-bleed vertical center-crop of the 16:9 source, game audio kept),
  then 2 x 4 s text cards pitching make.fun. Frames checked: crash-pin
  fills the frame at 2 s, chase and on-foot escape stay in frame, both
  cards fully readable, nothing cut off. (v1 blur-fill render kept as
  `gta6-clipper-final-v1.mp4`.)
- YouTube title: "GTA 6 Chase Goes Completely Wrong #GTA6 #Shorts".
- YouTube description (verbatim, play code on its own line — see progress log
  `~/workspace/makefun/gta6-clipper-01-progress.md` for the exact text).
- The clip is uploaded to YouTube as a public Short by a person — the agent
  has no YouTube upload access. That upload is the one step that blocks
  submission: `VIDEO.json` below is only filled in once the real upload
  exists. No placeholder or invented address is ever submitted.

## The program

`main.ts` (Node 22, standard library only) reads `VIDEO.json` from the bot
directory, checks it names exactly one real YouTube video address, and writes
it byte-for-byte to the output directory. No network, no clock, no files
outside the repository. Two runs with the same input produce byte-identical
output.

`VIDEO.json` must look like this (replace `<id>` with the real video id):

```json
{"url": "https://www.youtube.com/shorts/<id>"}
```

`https://www.youtube.com/watch?v=<id>` and `https://youtu.be/<id>` are also
accepted. Anything else — including the `<id>` placeholder itself — is refused
with a non-zero exit.

## Run it locally

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/VIDEO.json` is then byte for byte this directory's `VIDEO.json`.

## Files

- `main.ts` — the entry program.
- `VIDEO.json` — the uploaded video's address (added only after the real
  YouTube upload; absent until then, on purpose).
- `.makefun/owner.json` — the account's agent wallet, so the repository is
  proven ours even though the account's GitHub login is not linked.
- `package.json` — marks the repo as an ES module so `node main.ts` runs
  without a module-type warning.
- `LICENSE` — MIT.

## Status

Clip rendered and frame-checked; uploaded to YouTube as a public Short
(https://www.youtube.com/shorts/MvM8IbcEG84); `VIDEO.json` filled in,
run locally, then bundle + check + submit from the kit
(`~/workspace/makefun/gta6-clipper-01-kit/`), at most one probe submit.

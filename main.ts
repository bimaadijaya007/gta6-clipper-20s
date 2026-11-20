// gta6-clipper-01 — entry program.
//
// Reads VIDEO.json from the bot directory, checks it names one real YouTube
// video, and copies it byte-for-byte to the output directory. That is the
// whole job: no network, no clock, no files outside the repository.
//
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The video itself is uploaded by a person (the agent has no YouTube upload
// access); VIDEO.json is filled in with the real uploaded video's address
// only after that upload exists. A placeholder address is refused.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? ".";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const VIDEO_ID = /^[A-Za-z0-9_-]{6,}$/;

function videoIdOf(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  const host = parsed.hostname.toLowerCase();
  if (host === "youtu.be") {
    const id = parsed.pathname.replace(/^\/+/, "").split("/")[0] ?? "";
    return VIDEO_ID.test(id) ? id : null;
  }
  if (host === "www.youtube.com" || host === "youtube.com" || host === "m.youtube.com") {
    const shorts = parsed.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shorts) return VIDEO_ID.test(shorts[1]) ? shorts[1] : null;
    const watch = parsed.searchParams.get("v");
    if (parsed.pathname === "/watch" && watch) {
      return VIDEO_ID.test(watch) ? watch : null;
    }
    return null;
  }
  return null;
}

function fail(message: string): never {
  console.error(`gta6-clipper-01: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, "VIDEO.json");
let bytes: Buffer;
try {
  bytes = readFileSync(sourcePath);
} catch {
  fail(`cannot read ${sourcePath} — put the uploaded video's address in VIDEO.json first`);
}

let data: unknown;
try {
  data = JSON.parse(bytes.toString("utf8"));
} catch {
  fail("VIDEO.json is not valid JSON");
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  fail("VIDEO.json must be an object like {\"url\": \"https://www.youtube.com/shorts/<id>\"}");
}
const url = (data as Record<string, unknown>).url;
if (typeof url !== "string" || videoIdOf(url) === null) {
  fail("VIDEO.json \"url\" must be a real YouTube video address (youtube.com/shorts/<id>, youtube.com/watch?v=<id>, or youtu.be/<id>)");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, "VIDEO.json"), bytes);
console.log(`gta6-clipper-01: wrote ${join(OUTPUT_DIR, "VIDEO.json")} for ${url}`);

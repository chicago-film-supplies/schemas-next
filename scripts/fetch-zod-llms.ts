/**
 * Fetches zod.dev/llms.txt and caches it locally for Claude Code context.
 * Skips fetch if the cached file is less than 24 hours old.
 * Run: deno task fetch-zod-docs
 */

const CACHE_PATH = new URL("../.claude/zod-llms.txt", import.meta.url);
const SOURCE_URL = "https://zod.dev/llms.txt";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function isFresh(): Promise<boolean> {
  try {
    const stat = await Deno.stat(CACHE_PATH);
    if (!stat.mtime) return false;
    return Date.now() - stat.mtime.getTime() < MAX_AGE_MS;
  } catch {
    return false;
  }
}

if (await isFresh()) {
  console.log("zod-llms.txt is fresh (< 24h old), skipping fetch.");
  Deno.exit(0);
}

console.log(`Fetching ${SOURCE_URL}...`);
const res = await fetch(SOURCE_URL);
if (!res.ok) {
  console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
  Deno.exit(1);
}

const text = await res.text();
await Deno.writeTextFile(CACHE_PATH, text);
console.log(`Saved to .claude/zod-llms.txt (${(text.length / 1024).toFixed(1)} KB)`);

import path from "node:path";

import {
  getCacheBaseDir,
  readFileIfExists,
  sha256Hex,
  writeFileAtomic,
} from "@/lib/server/cacheUtils";

export interface CachedTtsAudioResult {
  cacheKey: string;
  cacheHit: boolean;
  buffer: Buffer;
}

const TTS_CACHE_VERSION = "v1";
const TTS_CACHE_DIR = path.join(getCacheBaseDir(), `tts-${TTS_CACHE_VERSION}`);

const inFlight = new Map<string, Promise<Buffer>>();

const maxMemoryEntries = Number(process.env.PHONICS_TTS_MEM_CACHE_ENTRIES ?? 128);
const memoryCache = new Map<string, Buffer>();

function touchMemoryCache(key: string, value: Buffer) {
  if (!Number.isFinite(maxMemoryEntries) || maxMemoryEntries <= 0) return;

  memoryCache.delete(key);
  memoryCache.set(key, value);

  if (memoryCache.size <= maxMemoryEntries) return;
  const oldestKey = memoryCache.keys().next().value;
  if (typeof oldestKey === "string") memoryCache.delete(oldestKey);
}

export async function getOrCreateTtsAudio(params: {
  ssml: string;
  voice: unknown;
  audioConfig: unknown;
  fileExt: string;
  synthesize: () => Promise<Buffer>;
}): Promise<CachedTtsAudioResult> {
  const { ssml, voice, audioConfig, fileExt, synthesize } = params;

  const cacheKey = sha256Hex(
    JSON.stringify({
      v: TTS_CACHE_VERSION,
      ssml,
      voice,
      audioConfig,
    })
  );

  const memHit = memoryCache.get(cacheKey);
  if (memHit) {
    touchMemoryCache(cacheKey, memHit);
    return { cacheKey, cacheHit: true, buffer: memHit };
  }

  const cachePath = path.join(TTS_CACHE_DIR, `${cacheKey}.${fileExt}`);
  const diskHit = await readFileIfExists(cachePath);
  if (diskHit) {
    touchMemoryCache(cacheKey, diskHit);
    return { cacheKey, cacheHit: true, buffer: diskHit };
  }

  const running = inFlight.get(cacheKey);
  if (running) {
    const buffer = await running;
    touchMemoryCache(cacheKey, buffer);
    return { cacheKey, cacheHit: true, buffer };
  }

  const promise = (async () => {
    const buffer = await synthesize();
    await writeFileAtomic(cachePath, buffer);
    return buffer;
  })();

  inFlight.set(cacheKey, promise);

  try {
    const buffer = await promise;
    touchMemoryCache(cacheKey, buffer);
    return { cacheKey, cacheHit: false, buffer };
  } finally {
    inFlight.delete(cacheKey);
  }
}


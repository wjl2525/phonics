import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import path from 'node:path';
import {
  getSyllables,
  getSyllablesNLP,
  getIPA,
  getSyllablePhonemes,
  phonemesToIPA,
} from '@/lib/linguisticProcessor';
import { getCacheBaseDir, readJsonIfExists, sha256Hex, writeJsonAtomic } from '@/lib/server/cacheUtils';
import { getOrCreateTtsAudio } from '@/lib/server/ttsCache';

/**
 * Next.js API Route for Syllable Breakdown
 * Replaces the Python FastAPI backend
 */

export const runtime = 'nodejs';

/**
 * Initialize Google TTS client.
 * Supports two methods:
 * 1. GOOGLE_CREDENTIALS_JSON - JSON string of credentials (for Railway/cloud deployment)
 * 2. GOOGLE_APPLICATION_CREDENTIALS - path to JSON file (for local development)
 */
function createTtsClient(): TextToSpeechClient {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      return new TextToSpeechClient({ credentials });
    } catch (error) {
      console.error('Failed to parse GOOGLE_CREDENTIALS_JSON:', error);
      throw new Error('Invalid GOOGLE_CREDENTIALS_JSON format');
    }
  }
  
  // Fall back to default (GOOGLE_APPLICATION_CREDENTIALS file path)
  return new TextToSpeechClient();
}

const ttsClient = createTtsClient();

const TTS_VOICE = {
  languageCode: 'en-US',
  name: 'en-US-Studio-O', // Studio quality voice
} as const;

const TTS_AUDIO_CONFIG = {
  audioEncoding: 'MP3' as const,
  speakingRate: 1.0,
  pitch: 0.0,
} as const;

const BREAKDOWN_CACHE_VERSION = 'v1';
const BREAKDOWN_CACHE_NAMESPACE = sha256Hex(JSON.stringify({
  v: BREAKDOWN_CACHE_VERSION,
  voice: TTS_VOICE,
  audioConfig: TTS_AUDIO_CONFIG,
}));
const BREAKDOWN_CACHE_DIR = path.join(
  getCacheBaseDir(),
  `breakdown-${BREAKDOWN_CACHE_VERSION}`,
  BREAKDOWN_CACHE_NAMESPACE
);

const breakdownInFlight = new Map<string, Promise<BreakdownResponse>>();

async function readBreakdownCache(word: string): Promise<BreakdownResponse | null> {
  const normalizedWord = word.toLowerCase();
  const cachePath = path.join(BREAKDOWN_CACHE_DIR, `${normalizedWord}.json`);
  return await readJsonIfExists<BreakdownResponse>(cachePath);
}

async function writeBreakdownCache(word: string, response: BreakdownResponse): Promise<void> {
  const normalizedWord = word.toLowerCase();
  const cachePath = path.join(BREAKDOWN_CACHE_DIR, `${normalizedWord}.json`);
  await writeJsonAtomic(cachePath, response);
}

interface SyllableAudio {
  syllable: string;
  ipa?: string;
  audioBase64: string;
}

interface BreakdownResponse {
  word: string;
  ipa: string;
  syllables: string[];
  syllablesNLP: string[];  // Alternative syllabification from nlp-syllables
  syllableAudios: SyllableAudio[];
  wholeWordAudio: string;
}

/**
 * Generate SSML for a syllable with phoneme pronunciation
 */
function generateSSMLForSyllable(
  syllable: string,
  phonemes: string[],
  slow: boolean = true
): string {
  let ssml = '<speak>';

  if (slow) {
    ssml += '<prosody rate="slow">';
  }

  // Use phoneme tag if we have phonemes
  if (phonemes.length > 0) {
    const ipa = phonemesToIPA(phonemes);
    ssml += `<phoneme alphabet="ipa" ph="${ipa}">${syllable}</phoneme>`;
  } else {
    ssml += syllable;
  }

  if (slow) {
    ssml += '</prosody>';
  }

  ssml += '</speak>';
  return ssml;
}

/**
 * Generate SSML for whole word
 */
function generateSSMLForWholeWord(word: string, ipa: string): string {
  const ipaClean = ipa.replace(/\//g, '');

  let ssml = '<speak>';

  if (ipaClean && ipaClean !== word) {
    ssml += `<phoneme alphabet="ipa" ph="${ipaClean}">${word}</phoneme>`;
  } else {
    ssml += word;
  }

  ssml += '</speak>';
  return ssml;
}

/**
 * Synthesize speech using Google Cloud TTS
 */
async function synthesizeSpeech(ssml: string): Promise<Buffer> {
  const request = {
    input: { ssml },
    voice: TTS_VOICE,
    audioConfig: TTS_AUDIO_CONFIG,
  };

  const { buffer, cacheHit } = await getOrCreateTtsAudio({
    ssml,
    voice: request.voice,
    audioConfig: request.audioConfig,
    fileExt: 'mp3',
    synthesize: async () => {
      const [response] = await ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        throw new Error('No audio content received from Google TTS');
      }

      return Buffer.from(response.audioContent);
    },
  });

  if (cacheHit) {
    console.log(`  ✓ TTS cache hit`);
  }

  return buffer;
}

async function computeBreakdown(word: string): Promise<BreakdownResponse> {
  // Step 1: Get syllables (both methods)
  const syllables = getSyllables(word);
  console.log(`✓ Syllables (CMUdict): ${JSON.stringify(syllables)}`);

  const syllablesNLP = getSyllablesNLP(word);
  console.log(`✓ Syllables (NLP): ${JSON.stringify(syllablesNLP)}`);

  // Step 2: Get IPA
  const ipa = getIPA(word);
  console.log(`✓ IPA: ${ipa}`);

  // Step 3: Get phonemes for each syllable
  const syllablePhonemes = getSyllablePhonemes(word, syllables);
  console.log(`✓ Syllable phonemes: ${JSON.stringify(syllablePhonemes)}`);

  // Step 4: Generate audio for each syllable
  const syllableAudios: SyllableAudio[] = [];

  for (let i = 0; i < syllables.length; i++) {
    const syllable = syllables[i];
    const phonemes = syllablePhonemes[i] || [];

    console.log(`\nGenerating audio for syllable ${i + 1}/${syllables.length}: "${syllable}"`);

    const ssml = generateSSMLForSyllable(syllable, phonemes, true);
    console.log(`  SSML: ${ssml}`);

    const audioBuffer = await synthesizeSpeech(ssml);
    const audioBase64 = audioBuffer.toString('base64');

    const syllableIPA = phonemes.length > 0 ? `/${phonemesToIPA(phonemes)}/` : undefined;

    syllableAudios.push({
      syllable,
      ipa: syllableIPA,
      audioBase64,
    });

    console.log(`  ✓ Audio generated (${audioBuffer.length} bytes)`);
  }

  // Step 5: Generate audio for whole word
  console.log(`\nGenerating audio for whole word: "${word}"`);
  const wholeWordSSML = generateSSMLForWholeWord(word, ipa);
  console.log(`  SSML: ${wholeWordSSML}`);

  const wholeWordAudioBuffer = await synthesizeSpeech(wholeWordSSML);
  const wholeWordAudioBase64 = wholeWordAudioBuffer.toString('base64');

  console.log(`  ✓ Audio generated (${wholeWordAudioBuffer.length} bytes)`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✓ Complete! Returning ${syllables.length} syllables + whole word audio`);
  console.log(`${'='.repeat(60)}\n`);

  return {
    word,
    ipa,
    syllables,
    syllablesNLP,
    syllableAudios,
    wholeWordAudio: wholeWordAudioBase64,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'Word is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedWord = word.trim();

    if (!trimmedWord) {
      return NextResponse.json(
        { error: 'Word cannot be empty' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z]+$/.test(trimmedWord)) {
      return NextResponse.json(
        { error: 'Word must contain only letters' },
        { status: 400 }
      );
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing word: "${trimmedWord}"`);
    console.log('='.repeat(60));

    const cached = await readBreakdownCache(trimmedWord);
    if (cached) {
      console.log(`✓ Breakdown cache hit`);
      return NextResponse.json({ ...cached, word: trimmedWord });
    }

    const normalizedWord = trimmedWord.toLowerCase();
    const running = breakdownInFlight.get(normalizedWord);
    if (running) {
      console.log(`✓ Breakdown in-flight hit`);
      const response = await running;
      return NextResponse.json({ ...response, word: trimmedWord });
    }

    const promise = (async () => {
      const response = await computeBreakdown(trimmedWord);
      await writeBreakdownCache(trimmedWord, response);
      return response;
    })();

    breakdownInFlight.set(normalizedWord, promise);

    try {
      const response = await promise;
      return NextResponse.json(response);
    } finally {
      breakdownInFlight.delete(normalizedWord);
    }
  } catch (error: any) {
    console.error('❌ Error processing word:', error);

    // Check for Google Cloud auth errors
    if (error.message?.includes('credentials') || error.message?.includes('authentication')) {
      return NextResponse.json(
        {
          error: 'Google Cloud credentials not configured',
          details: 'Please set GOOGLE_APPLICATION_CREDENTIALS environment variable',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process word',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

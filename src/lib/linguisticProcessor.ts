/**
 * Linguistic Processor for Phonics Breakdown
 * TypeScript implementation using CMU Pronouncing Dictionary
 */

import { dictionary as cmudict } from 'cmu-pronouncing-dictionary';

// @ts-ignore - nlp packages don't have type definitions
import nlp from 'compromise';
// @ts-ignore
import compromiseSyllables from 'compromise-syllables';

// Initialize syllables plugin
// compromise v14 expects plugin objects; compromise-syllables exports an `api(View)` function.
nlp.plugin({ api: compromiseSyllables });

function getCmuPhonemeArray(word: string): string[] | null {
  const lowerWord = word.toLowerCase();
  const arpabet = cmudict[lowerWord];

  if (!arpabet) return null;

  const cleaned = arpabet.split('#')[0].trim();
  const phonemes = cleaned.split(/\s+/).filter(Boolean);

  // Prefer /deɪ/ for "-day" words (e.g. Saturday, Monday) instead of the reduced /di/ forms.
  if (lowerWord.endsWith('day') || lowerWord.endsWith('days')) {
    for (let i = phonemes.length - 1; i >= 0; i--) {
      if (!/\d$/.test(phonemes[i])) continue;
      if (/^IY[012]$/.test(phonemes[i])) {
        phonemes[i] = 'EY0';
      }
      break;
    }
  }

  return phonemes;
}

function arpabetPhonemeToIPA(phoneme: string): string {
  if (ARPABET_TO_IPA[phoneme]) return ARPABET_TO_IPA[phoneme];
  const base = phoneme.replace(/[012]$/, '');
  return ARPABET_TO_IPA[base] || '';
}

// ARPAbet to IPA conversion table
const ARPABET_TO_IPA: Record<string, string> = {
  // Vowels
  'AA': 'ɑ', 'AA0': 'ɑ', 'AA1': 'ɑ', 'AA2': 'ɑ',
  'AE': 'æ', 'AE0': 'æ', 'AE1': 'æ', 'AE2': 'æ',
  'AH': 'ʌ', 'AH0': 'ə', 'AH1': 'ʌ', 'AH2': 'ʌ',
  'AO': 'ɔ', 'AO0': 'ɔ', 'AO1': 'ɔ', 'AO2': 'ɔ',
  'AW': 'aʊ', 'AW0': 'aʊ', 'AW1': 'aʊ', 'AW2': 'aʊ',
  'AY': 'aɪ', 'AY0': 'aɪ', 'AY1': 'aɪ', 'AY2': 'aɪ',
  'EH': 'ɛ', 'EH0': 'ɛ', 'EH1': 'ɛ', 'EH2': 'ɛ',
  'ER': 'ɝ', 'ER0': 'ɚ', 'ER1': 'ɝ', 'ER2': 'ɝ',
  'EY': 'eɪ', 'EY0': 'eɪ', 'EY1': 'eɪ', 'EY2': 'eɪ',
  'IH': 'ɪ', 'IH0': 'ɪ', 'IH1': 'ɪ', 'IH2': 'ɪ',
  'IY': 'i', 'IY0': 'i', 'IY1': 'i', 'IY2': 'i',
  'OW': 'oʊ', 'OW0': 'oʊ', 'OW1': 'oʊ', 'OW2': 'oʊ',
  'OY': 'ɔɪ', 'OY0': 'ɔɪ', 'OY1': 'ɔɪ', 'OY2': 'ɔɪ',
  'UH': 'ʊ', 'UH0': 'ʊ', 'UH1': 'ʊ', 'UH2': 'ʊ',
  'UW': 'u', 'UW0': 'u', 'UW1': 'u', 'UW2': 'u',

  // Consonants
  'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð',
  'F': 'f', 'G': 'ɡ', 'HH': 'h', 'JH': 'dʒ',
  'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n',
  'NG': 'ŋ', 'P': 'p', 'R': 'ɹ', 'S': 's',
  'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'V': 'v',
  'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ',
};

/**
 * Simple syllable hyphenation fallback
 * Based on basic phonics rules
 */
function simpleSyllabify(word: string): string[] {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
  const lowerWord = word.toLowerCase();

  // Find vowel positions
  const vowelPositions: number[] = [];
  for (let i = 0; i < lowerWord.length; i++) {
    if (vowels.has(lowerWord[i])) {
      vowelPositions.push(i);
    }
  }

  if (vowelPositions.length <= 1) {
    return [word];
  }

  // Split between vowel groups
  const syllables: string[] = [];
  let start = 0;

  for (let i = 0; i < vowelPositions.length - 1; i++) {
    const v1 = vowelPositions[i];
    const v2 = vowelPositions[i + 1];

    // Find consonant cluster between vowels
    let splitPoint = v1 + 1;

    // Look for consonant cluster
    while (splitPoint < v2 && !vowels.has(lowerWord[splitPoint])) {
      splitPoint++;
    }

    // Split in middle of consonant cluster
    const consonantStart = v1 + 1;
    const consonantEnd = splitPoint;
    const consonantCount = consonantEnd - consonantStart;

    if (consonantCount > 1) {
      splitPoint = consonantStart + Math.floor(consonantCount / 2);
    } else {
      splitPoint = consonantEnd;
    }

    syllables.push(word.substring(start, splitPoint));
    start = splitPoint;
  }

  syllables.push(word.substring(start));
  return syllables;
}

/**
 * Get syllables from CMUdict or fallback to simple syllabification
 */
export function getSyllables(word: string): string[] {
  const lowerWord = word.toLowerCase();
  const phonemeArray = getCmuPhonemeArray(word);

  if (!phonemeArray) {
    console.log(`[Syllabify] Word "${word}" not in CMUdict, using fallback`);
    return simpleSyllabify(word);
  }

  // Count syllables (vowels with stress markers)
  const syllableCount = phonemeArray.filter(p => /\d$/.test(p)).length;

  if (syllableCount === 1) {
    return [word];
  }

  // Find vowel positions in the word
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
  const vowelPositions: number[] = [];
  for (let i = 0; i < lowerWord.length; i++) {
    if (vowels.has(lowerWord[i])) {
      vowelPositions.push(i);
    }
  }

  if (vowelPositions.length < syllableCount) {
    // Fallback if not enough vowels detected
    console.log(`[Syllabify] Not enough vowels, using simple fallback`);
    return simpleSyllabify(word);
  }

  // Split word into exactly syllableCount syllables
  const syllables: string[] = [];
  let start = 0;

  for (let i = 0; i < syllableCount - 1; i++) {
    // Find which vowel ends this syllable
    // Distribute vowels evenly across syllables
    const vowelIndex = Math.floor(((i + 1) * vowelPositions.length) / syllableCount) - 1;
    const vowelPos = vowelPositions[vowelIndex];

    // Find consonants after this vowel
    let splitPoint = vowelPos + 1;
    while (splitPoint < lowerWord.length && !vowels.has(lowerWord[splitPoint])) {
      splitPoint++;
    }

    // Split in middle of consonant cluster
    const consonantStart = vowelPos + 1;
    const consonantCount = splitPoint - consonantStart;

    if (consonantCount > 1) {
      // Split consonant cluster
      splitPoint = consonantStart + Math.floor(consonantCount / 2);
    } else if (consonantCount === 1) {
      // Single consonant goes with next syllable
      splitPoint = consonantStart;
    }
    // If no consonants, split right after vowel

    syllables.push(word.substring(start, splitPoint));
    start = splitPoint;
  }

  // Add remaining as last syllable
  syllables.push(word.substring(start));

  console.log(`[Syllabify] "${word}" -> ${JSON.stringify(syllables)} (${syllableCount} syllables from CMUdict)`);
  return syllables;
}

/**
 * Get syllables using compromise-syllables library (alternative approach)
 */
export function getSyllablesNLP(word: string): string[] {
  try {
    // Use compromise-syllables API
    // .syllables() returns array of objects: [{text, normal, syllables: [...]}]
    const doc = nlp(word);
    const result = (doc.terms() as any).syllables();

    // Get the syllables array from the first term's object
    const syllables = result[0]?.syllables || [word];
    console.log(`[Syllabify NLP] "${word}" -> ${JSON.stringify(syllables)}`);
    return syllables;
  } catch (error) {
    console.log(`[Syllabify NLP] Error for "${word}":`, error);
    return [word];
  }
}

/**
 * Get IPA transcription from CMUdict
 */
export function getIPA(word: string): string {
  const phonemeArray = getCmuPhonemeArray(word);

  if (!phonemeArray) {
    console.log(`[IPA] Word "${word}" not in CMUdict, returning as-is`);
    return `/${word}/`;
  }

  const ipa = `/${phonemeArray.map(arpabetPhonemeToIPA).join('')}/`;
  console.log(`[IPA] "${word}" -> ${ipa}`);
  return ipa;
}

/**
 * Get phonemes for each syllable
 */
export function getSyllablePhonemes(word: string, syllables: string[]): string[][] {
  const phonemeArray = getCmuPhonemeArray(word);

  if (!phonemeArray) {
    return syllables.map(() => []);
  }

  // Count vowels (syllable nuclei)
  const vowelPhonemes = phonemeArray.filter(p => /\d$/.test(p));

  if (vowelPhonemes.length !== syllables.length) {
    console.log(`[Syllable Phonemes] Mismatch, returning empty arrays`);
    return syllables.map(() => []);
  }

  // Split phonemes by syllable
  const syllablePhonemes: string[][] = [];
  let currentSyllable: string[] = [];
  let vowelCount = 0;

  for (const phoneme of phonemeArray) {
    currentSyllable.push(phoneme);

    if (/\d$/.test(phoneme)) {
      // Vowel found, end of syllable (except last)
      vowelCount++;
      if (vowelCount < syllables.length) {
        syllablePhonemes.push(currentSyllable);
        currentSyllable = [];
      }
    }
  }

  // Add last syllable
  if (currentSyllable.length > 0) {
    syllablePhonemes.push(currentSyllable);
  }

  console.log(`[Syllable Phonemes] "${word}" -> ${JSON.stringify(syllablePhonemes)}`);
  return syllablePhonemes;
}

/**
 * Convert ARPAbet phonemes to IPA
 */
export function phonemesToIPA(phonemes: string[]): string {
  return phonemes.map(arpabetPhonemeToIPA).join('');
}

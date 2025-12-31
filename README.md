# Phonics - Syllable Breakdown & Pronunciation Tool

A Next.js application that breaks down English words into syllables, provides IPA (International Phonetic Alphabet) transcriptions, and generates audio pronunciations using Google Cloud Text-to-Speech.

## Overview

This application provides detailed phonetic analysis of English words:
- Syllable breakdown (e.g., "dictionary" → "dic-tion-ar-y")
- IPA phonetic transcription (e.g., /dˈɪkʃənˌɛɹi/)
- Individual syllable audio generation
- Whole word audio pronunciation

## Getting Started

### Prerequisites

- Node.js 12+ (ESM support required)
- Google Cloud account with Text-to-Speech API enabled
- Google Cloud service account credentials

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## System Architecture

### End-to-End Flow

```
User Input (word)
    ↓
API Route Handler (/api/syllable-breakdown)
    ↓
Linguistic Processor (linguisticProcessor.ts)
    ↓
┌─────────────────────────────────────────┐
│ 1. CMU Dictionary Lookup                │
│    - Retrieve phonemes for word         │
│    - Count syllables from stress markers│
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. Syllabification                      │
│    - Find vowel positions in word       │
│    - Split into N syllables (from CMU)  │
│    - Apply consonant clustering rules   │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. IPA Conversion                       │
│    - Convert ARPAbet → IPA              │
│    - Add stress markers (ˈ primary, ˌ   │
│      secondary)                         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 4. Audio Generation (Google TTS)        │
│    - Generate SSML for each syllable    │
│    - Synthesize audio buffers           │
│    - Convert to base64                  │
└─────────────────────────────────────────┘
    ↓
JSON Response
```

## Core Components

### 1. Linguistic Processor (`src/lib/linguisticProcessor.ts`)

The linguistic processor is the brain of the application, handling all phonetic analysis.

#### CMU Pronouncing Dictionary Integration

The application uses the [CMU Pronouncing Dictionary](https://github.com/words/cmu-pronouncing-dictionary), a dataset of 134,000+ English words with their North American pronunciations.

**Dictionary Structure:**
```javascript
{
  "water": "W AO1 T ER0",
  "dictionary": "D IH1 K SH AH0 N EH2 R IY0",
  // ... 134,000+ entries
}
```

**Key Points:**
- Keys are lowercase words
- Values are space-separated ARPAbet phonemes
- Numbers (0, 1, 2) indicate stress levels:
  - `0` = unstressed
  - `1` = primary stress
  - `2` = secondary stress

#### Syllabification Algorithm

When a word is found in CMUdict:

1. **Count syllables**: Count phonemes with stress markers (0, 1, or 2)
   ```typescript
   const syllableCount = phonemeArray.filter(p => /\d$/.test(p)).length;
   ```

2. **Find vowel positions**: Locate all vowels (a, e, i, o, u, y) in the word

3. **Distribute vowels across syllables**: Evenly distribute vowels to match CMUdict's syllable count
   ```typescript
   const vowelIndex = Math.floor(((i + 1) * vowelPositions.length) / syllableCount) - 1;
   ```

4. **Apply splitting rules**:
   - **Single consonant**: Goes with the next syllable (e.g., "wa-ter")
   - **Consonant cluster**: Split in the middle (e.g., "pump-kin")
   - **No consonants**: Split after vowel

**Example: "water"**
```
Input: "water"
CMUdict: "W AO1 T ER0" (2 syllables)
Vowel positions: [1 (a), 3 (e)]

Split calculation:
- First syllable ends at vowel position 0 (the 'a')
- Consonant 't' goes with next syllable
- Result: ["wa", "ter"]
```

**Example: "dictionary"**
```
Input: "dictionary"
CMUdict: "D IH1 K SH AH0 N EH2 R IY0" (4 syllables)
Vowel positions: [1, 4, 5, 7, 9] (i, i, o, a, y)

Result: ["dic", "tion", "ar", "y"]
```

#### Fallback Syllabification

When a word is **not** in CMUdict, the system uses a simple vowel-counting fallback:

```typescript
function simpleSyllabify(word: string): string[] {
  // Find vowel clusters
  // Split between consonant clusters
  // Return syllable array
}
```

This is less accurate but ensures the app works for all inputs.

### 2. IPA Conversion

ARPAbet phonemes from CMUdict are converted to International Phonetic Alphabet (IPA) symbols.

**Conversion Table:**
```typescript
const ARPABET_TO_IPA = {
  // Vowels
  'AA': 'ɑ',  'AE': 'æ',  'AH': 'ʌ',  'AH0': 'ə',
  'AO': 'ɔ',  'AW': 'aʊ', 'AY': 'aɪ', 'EH': 'ɛ',
  'ER': 'ɝ',  'ER0': 'ɚ', 'EY': 'eɪ', 'IH': 'ɪ',
  'IY': 'i',  'OW': 'oʊ', 'OY': 'ɔɪ', 'UH': 'ʊ',
  'UW': 'u',

  // Consonants
  'B': 'b',   'CH': 'tʃ', 'D': 'd',   'DH': 'ð',
  'F': 'f',   'G': 'ɡ',   'HH': 'h',  'JH': 'dʒ',
  'K': 'k',   'L': 'l',   'M': 'm',   'N': 'n',
  'NG': 'ŋ',  'P': 'p',   'R': 'ɹ',   'S': 's',
  'SH': 'ʃ',  'T': 't',   'TH': 'θ',  'V': 'v',
  'W': 'w',   'Y': 'j',   'Z': 'z',   'ZH': 'ʒ',
};
```

**Stress Markers:**
- `ˈ` (U+02C8) = Primary stress (before stressed syllable)
- `ˌ` (U+02CC) = Secondary stress (before stressed syllable)

**Example:**
```
ARPAbet: D IH1 K SH AH0 N EH2 R IY0
IPA: /dˈɪkʃənˌɛɹi/
     ^      ^
     |      |__ Secondary stress
     |_________ Primary stress
```

### 3. Audio Generation

Audio is generated using Google Cloud Text-to-Speech API with SSML (Speech Synthesis Markup Language).

#### SSML Generation

```typescript
function generateSSML(text: string, rate: string = 'slow'): string {
  return `<speak>
    <prosody rate="${rate}" pitch="default">
      ${text}
    </prosody>
  </speak>`;
}
```

**Parameters:**
- `rate`: Speech speed (`x-slow`, `slow`, `medium`, `fast`)
- `pitch`: Voice pitch (default for natural pronunciation)

#### Synthesis

```typescript
const [response] = await textToSpeechClient.synthesizeSpeech({
  input: { ssml },
  voice: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-F',
  },
  audioConfig: {
    audioEncoding: 'MP3',
    speakingRate: 0.85,
  },
});
```

**Voice Selection:**
- `en-US-Neural2-F`: Female neural voice
- High-quality, natural-sounding pronunciation

**Output:**
- Format: MP3
- Encoding: Base64 (for JSON transport)
- Speaking rate: 0.85x (slightly slower for clarity)

## API Reference

### POST `/api/syllable-breakdown`

Break down a word into syllables with phonetic information and audio.

#### Request

```typescript
{
  word: string
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/syllable-breakdown \
  -H "Content-Type: application/json" \
  -d '{"word": "dictionary"}'
```

#### Response

```typescript
{
  word: string;                    // Original word
  ipa: string;                     // IPA transcription (e.g., "/dˈɪkʃənˌɛɹi/")
  syllables: string[];             // Syllable breakdown (e.g., ["dic", "tion", "ar", "y"])
  syllableAudios: string[];        // Base64-encoded MP3 audio for each syllable
  wholeWordAudio: string;          // Base64-encoded MP3 audio for complete word
}
```

**Example Response:**
```json
{
  "word": "water",
  "ipa": "/wˈɔtɚ/",
  "syllables": ["wa", "ter"],
  "syllableAudios": [
    "//uQx...[base64]...==",
    "//uQx...[base64]...=="
  ],
  "wholeWordAudio": "//uQx...[base64]...=="
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Word is required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process word"
}
```

## Data Flow Example

### Processing "dictionary"

```
1. Input
   word: "dictionary"

2. CMU Dictionary Lookup
   phonemes: "D IH1 K SH AH0 N EH2 R IY0"
   syllableCount: 4 (count of phonemes ending in 0, 1, or 2)

3. Syllabification
   vowelPositions: [1, 4, 5, 7, 9] (i, i, o, a, y)
   syllables: ["dic", "tion", "ar", "y"]

4. IPA Conversion
   D → d
   IH1 → ˈɪ (primary stress + ɪ)
   K → k
   SH → ʃ
   AH0 → ə
   N → n
   EH2 → ˌɛ (secondary stress + ɛ)
   R → ɹ
   IY0 → i

   Result: /dˈɪkʃənˌɛɹi/

5. Syllable Phoneme Mapping
   [
     ["D", "IH1", "K"],           // "dic"
     ["SH", "AH0", "N"],          // "tion"
     ["EH2", "R"],                // "ar"
     ["IY0"]                      // "y"
   ]

6. Audio Generation
   For each syllable:
   - Generate SSML: <speak><prosody rate="slow">dic</prosody></speak>
   - Call Google TTS API
   - Convert to base64

   For whole word:
   - Generate SSML: <speak><prosody rate="medium">dictionary</prosody></speak>
   - Call Google TTS API
   - Convert to base64

7. Response
   {
     word: "dictionary",
     ipa: "/dˈɪkʃənˌɛɹi/",
     syllables: ["dic", "tion", "ar", "y"],
     syllableAudios: [base64_1, base64_2, base64_3, base64_4],
     wholeWordAudio: base64_full
   }
```

## Key Dependencies

- **Next.js 15+**: React framework with App Router
- **cmu-pronouncing-dictionary**: 134,000+ word pronunciation database
- **@google-cloud/text-to-speech**: Audio generation API
- **React**: UI framework

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── syllable-breakdown/
│   │   │       └── route.ts          # API endpoint
│   │   └── page.tsx                  # Main UI
│   └── lib/
│       └── linguisticProcessor.ts    # Core phonetic logic
├── package.json
└── README.md
```

## Performance Considerations

- **CMU Dictionary**: Loaded once at startup, kept in memory
- **Caching**: Consider implementing Redis cache for common words
- **Rate Limiting**: Google TTS API has quotas (check your plan)
- **Audio Size**: MP3 files are small (~5-20KB per syllable)

## Limitations

1. **CMU Dictionary Coverage**: Only 134,000 words; rare words use fallback
2. **Syllable Accuracy**: Text-to-phoneme mapping is approximate for non-CMU words
3. **Pronunciation Variants**: Only uses first pronunciation in CMU dict
4. **Language**: English (US) only
5. **API Costs**: Google TTS API charges per character synthesized

## Future Enhancements

- [ ] Multiple pronunciation variants
- [ ] British English support
- [ ] Caching layer for common words
- [ ] Client-side audio player component
- [ ] Phoneme-to-text highlighting
- [ ] Export to Anki/flashcard formats

## Resources

- [CMU Pronouncing Dictionary](https://github.com/words/cmu-pronouncing-dictionary)
- [ARPAbet Specification](https://en.wikipedia.org/wiki/ARPABET)
- [IPA Chart](https://www.internationalphoneticassociation.org/content/ipa-chart)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)

## License

MIT

# Qihang Phonics Lab — Web App Specification (v2, Updated for OpenAI Speech API + Google Nano Banana)

## 1. Product Overview

**Product Name:** Qihang Phonics Lab  
**Target Users:** Children aged 4–7 (primary user: Qihang)  
**Goal:** Help kids build strong phonics foundations by connecting **letters → sounds → words → images**, with built‑in pronunciation practice using **OpenAI Speech-to-Text** and **Google Nano Banana image generation**.

**Key Technologies (Updated):**
- **OpenAI Speech-to-Text API** → for pronunciation recognition & scoring
- **OpenAI Text-to-Speech API** → for standard word/sound pronunciation
- **Google Nano Banana** → for generating child‑friendly, consistent images

**Key Features:**
- Visual, image‑driven learning (images auto-generated via Nano Banana)
- Standard pronunciation via OpenAI TTS
- Child speaks → OpenAI Speech-to-Text evaluates pronunciation
- Natural phonics breakdown animations (e.g., *sh - ip*)
- No login, no parent mode, no multi‑child profiles
- Simple, distraction‑free interface suitable for iPad/desktop

---

## 2. Functional Specification (Updated for OpenAI + Nano Banana)

### 2.1 User & Permissions
- No accounts
- No parent mode
- LocalStorage used to store simple progress

### 2.2 Content Structure (60 Phonics Sounds)
- Uses pre‑defined JSON containing:
  - `sound`
  - `type` (consonant / short-vowel / long-vowel / digraph / r-controlled / vowel-team)
  - `example_words`
  - `rule`
  - Extended fields for app:
    - `words: [{ word, breakdown, cn, imageUrl, audioUrl }]`
- **imageUrl** generated via **Google Nano Banana API**
- **audioUrl** generated via **OpenAI TTS**

### 2.3 Application Modules

#### **1. Home Page (Sound Map)**
- Grid of 60 sounds
- Each sound shows:
  - Sound label (e.g., **sh**, **ai**, **a**)
  - Progress indicator (unseen / seen / practiced)
- Buttons:
  - **Start Learning** (auto‑recommend next sound)
  - **Sound Map** (full list)

#### **2. Sound Detail Page**
- Title: e.g., `SH sound`
- Short rule: `sh says /sh/ as in ship`
- Play sound button (OpenAI TTS)
- List of example words (cards):
  - Nano Banana image
  - English word (target sound highlighted)
  - Chinese
  - Buttons:
    - ▶ Play pronunciation (OpenAI TTS)
    - 🎧 Break it down
- Bottom: **Practice Speaking**

#### **3. Pronunciation Practice (Core Module)**

**Layout:**
- Large image (Nano Banana)
- Word (large font, target sound highlighted)
- Chinese meaning
- Buttons:
  - ▶ Play word (OpenAI TTS)
  - 🎧 Break it down → shows segmentation like `sh - ip`
  - 🎙 Start Recording → trigger mic input

**Practice Flow (Updated for OpenAI Speech API):**
1. User taps **Start Recording**
2. Browser captures audio via MediaRecorder
3. Audio sent to backend (`POST /api/evaluate`)
4. Backend forwards audio to **OpenAI Speech-to-Text API**
5. Backend calculates score based on recognized result
6. UI shows friendly feedback (star system)

Example Response:
```json
{
  "recognized_text": "sip",
  "target_word": "ship",
  "score": 72,
  "match": false,
  "details": {
    "first_sound_match": false,
    "vowel_match": true,
    "ending_sound_match": true
  }
}
```

#### **4. Quiz Module (Optional Later Phase)**
- Multiple choice
- Listen & match picture
- Drag letters to build CVC words

#### **5. Progress Tracking**
LocalStorage schema:
```json
{
  "seenSounds": ["sh", "ai"],
  "masteredSounds": ["sh"]
}
```

---

## 3. Non-Functional Requirements
- Kid-friendly UI (big buttons, large text)
- Low latency audio upload
- Privacy-safe (audio used only for scoring)
- Optimized for iPad/desktop

---

## 4. Technical Architecture (Updated)

### 4.1 Frontend
- **React + Next.js** (recommended)
- UI: TailwindCSS
- Audio Recording: `MediaDevices.getUserMedia` + `MediaRecorder`
- State management: Zustand or Context
- Images: Nano Banana generated → cached in CDN
- Audio: OpenAI TTS → cached on server/CDN

### 4.2 Backend (FastAPI + OpenAI APIs)
- **FastAPI backend**
- Uses **OpenAI Speech-to-Text API** for pronunciation recognition
- Uses **OpenAI Text-to-Speech** for generating standard audio files
- Generates images using **Google Nano Banana API**
- Deployed via Uvicorn/Gunicorn
- Optional: S3/MinIO for asset storage

### API Endpoints
1. `GET /api/sounds` → list all sounds
2. `GET /api/sounds/{id}` → get sound details
3. `POST /api/evaluate` → handle pronunciation scoring
4. `POST /api/generate-image` → (optional) generate image via Nano Banana
5. `POST /api/generate-audio` → generate TTS audio via OpenAI

### Scoring Logic (Same as v1)
- First sound match → +30
- Vowel similarity → +30
- Ending sound match → +30
- Edit-distance similarity → +10
- Perfect match = 100

---

## 5. Data Structure Specification

### Type Definitions
```ts
type WordItem = {
  word: string;
  breakdown: string;
  cn: string;
  imageUrl: string; // Generated via Google Nano Banana
  audioUrl: string; // Generated via OpenAI TTS
};

type SoundItem = {
  id: string;
  sound: string;
  type: "consonant" | "short-vowel" | "long-vowel" | "digraph" | "r-controlled" | "vowel-team";
  rule: string;
  words: WordItem[];
};
```

---

## 6. Implementation Plan (Updated for OpenAI + Nano Banana)

### Phase 1 — MVP (Weeks 1–3)
- Setup frontend & FastAPI backend
- Integrate Nano Banana for image generation
- Integrate OpenAI TTS for standard word audio
- Implement Home → Sound List → Sound Detail
- Basic UI + breakdown animation
- Use static JSON for content

### Phase 2 — Speech Evaluation (Weeks 3–6)
- Add recording UI
- Create `/api/evaluate` using OpenAI Speech API
- Implement scoring logic
- Friendly UI feedback

### Phase 3 — Polish & Enhancements (Weeks 6–8)
- Save progress in LocalStorage
- Sound map mastery visualization
- Add quizzes
- Improve breakdown animations
- Caching for Nano Banana images & OpenAI TTS audio

---

## 7. Future Extensions
- PWA support for offline learning
- Levelled reading stories with phonics tagging
- Adaptive learning based on scoring history
- Progress reports for parents
- Custom word/image packs

---

**End of Specification (v2)**


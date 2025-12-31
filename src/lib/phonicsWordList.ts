export type PhonicsCategoryId =
  | 'consonant'
  | 'short-vowel'
  | 'long-vowel'
  | 'digraph'
  | 'r-controlled'
  | 'vowel-team';

export interface PhonicsSoundGroup {
  sound: string;
  label: string;
  words: string[];
}

export interface PhonicsCategory {
  id: PhonicsCategoryId;
  label: string;
  groups: PhonicsSoundGroup[];
}

export const PHONICS_WORD_CATEGORIES: PhonicsCategory[] = [
  {
    id: 'consonant',
    label: 'Consonants',
    groups: [
      { sound: 'b', label: 'B', words: ['bat', 'ball', 'bubble'] },
      { sound: 'c', label: 'C (hard)', words: ['cat', 'cup', 'candy'] },
      { sound: 'd', label: 'D', words: ['dog', 'duck', 'ladder'] },
      { sound: 'f', label: 'F', words: ['fish', 'fun', 'family'] },
      { sound: 'g', label: 'G (hard)', words: ['go', 'game', 'garden'] },
      { sound: 'h', label: 'H', words: ['hat', 'house', 'happy'] },
      { sound: 'j', label: 'J', words: ['jam', 'jump', 'jungle'] },
      { sound: 'k', label: 'K', words: ['kid', 'kite', 'kitten'] },
      { sound: 'l', label: 'L', words: ['log', 'leaf', 'lemon'] },
      { sound: 'm', label: 'M', words: ['man', 'milk', 'monkey'] },
      { sound: 'n', label: 'N', words: ['nose', 'net', 'noodle'] },
      { sound: 'p', label: 'P', words: ['pig', 'pen', 'pumpkin'] },
      { sound: 'r', label: 'R', words: ['run', 'rabbit', 'robot'] },
      { sound: 's', label: 'S', words: ['sun', 'sand', 'spider'] },
      { sound: 't', label: 'T', words: ['top', 'turtle', 'tiger'] },
      { sound: 'v', label: 'V', words: ['van', 'vet', 'visit'] },
      { sound: 'w', label: 'W', words: ['wet', 'water', 'window'] },
      { sound: 'y', label: 'Y', words: ['yes', 'yawn', 'yellow'] },
      { sound: 'z', label: 'Z', words: ['zoo', 'zero', 'zipper'] },
      { sound: 'x', label: 'X', words: ['box', 'fox', 'six'] },
      { sound: 'qu', label: 'QU', words: ['queen', 'quick', 'question'] },
    ],
  },
  {
    id: 'short-vowel',
    label: 'Short Vowels',
    groups: [
      { sound: 'ă (a)', label: 'Short A', words: ['cat', 'hat', 'map', 'bag', 'fan', 'apple'] },
      { sound: 'ĕ (e)', label: 'Short E', words: ['bed', 'pen', 'leg', 'red', 'ten', 'nest'] },
      { sound: 'ĭ (i)', label: 'Short I', words: ['pig', 'fish', 'sit', 'zip', 'kit', 'milk'] },
      { sound: 'ŏ (o)', label: 'Short O', words: ['dog', 'hot', 'top', 'box', 'frog', 'sock'] },
      { sound: 'ŭ (u)', label: 'Short U', words: ['sun', 'bus', 'cup', 'bug', 'jump', 'duck'] },
    ],
  },
  {
    id: 'long-vowel',
    label: 'Long Vowels',
    groups: [
      { sound: 'a_e', label: 'Long A (magic e)', words: ['cake', 'game', 'lake', 'name', 'plane'] },
      { sound: 'e (me)', label: 'Long E', words: ['me', 'we', 'he', 'she', 'be'] },
      { sound: 'i_e', label: 'Long I (magic e)', words: ['bike', 'time', 'kite', 'five', 'smile'] },
      { sound: 'o_e', label: 'Long O (magic e)', words: ['home', 'hope', 'nose', 'rope', 'stone'] },
      { sound: 'u_e', label: 'Long U (magic e)', words: ['cube', 'cute', 'mule', 'tune', 'use'] },
    ],
  },
  {
    id: 'digraph',
    label: 'Digraphs',
    groups: [
      { sound: 'sh', label: 'SH', words: ['ship', 'shop', 'fish', 'dish', 'shell'] },
      { sound: 'ch', label: 'CH', words: ['chip', 'chin', 'chop', 'lunch', 'chicken'] },
      { sound: 'th', label: 'TH', words: ['thin', 'this', 'that', 'thumb', 'bath'] },
      { sound: 'wh', label: 'WH', words: ['when', 'whale', 'which', 'where', 'whip'] },
      { sound: 'ph', label: 'PH', words: ['phone', 'photo', 'graph', 'dolphin', 'elephant'] },
      { sound: 'ck', label: 'CK', words: ['duck', 'sock', 'back', 'rock', 'pocket'] },
      { sound: 'ng', label: 'NG', words: ['ring', 'song', 'king', 'long', 'wing'] },
    ],
  },
  {
    id: 'r-controlled',
    label: 'R-Controlled',
    groups: [
      { sound: 'ar', label: 'AR', words: ['car', 'star', 'park', 'farm', 'shark'] },
      { sound: 'er', label: 'ER', words: ['her', 'fern', 'teacher', 'summer', 'winter'] },
      { sound: 'ir', label: 'IR', words: ['bird', 'girl', 'shirt', 'first', 'birthday'] },
      { sound: 'or', label: 'OR', words: ['fork', 'corn', 'horse', 'storm', 'short'] },
      { sound: 'ur', label: 'UR', words: ['fur', 'turn', 'nurse', 'purple', 'turtle'] },
    ],
  },
  {
    id: 'vowel-team',
    label: 'Vowel Teams',
    groups: [
      { sound: 'ai / ay', label: 'AI / AY', words: ['rain', 'train', 'paint', 'play', 'day'] },
      { sound: 'ee / ea', label: 'EE / EA', words: ['see', 'tree', 'green', 'seat', 'beach'] },
      { sound: 'oa / oe', label: 'OA / OE', words: ['boat', 'goat', 'road', 'toe', 'soap'] },
      { sound: 'igh', label: 'IGH', words: ['night', 'light', 'right', 'high', 'sight'] },
      { sound: 'oo', label: 'OO', words: ['moon', 'food', 'book', 'look', 'cook'] },
      { sound: 'ou / ow', label: 'OU / OW', words: ['out', 'cloud', 'house', 'cow', 'down'] },
      { sound: 'oi / oy', label: 'OI / OY', words: ['coin', 'boil', 'toy', 'boy', 'point'] },
      { sound: 'au / aw', label: 'AU / AW', words: ['saw', 'draw', 'claw', 'haul', 'pause'] },
      { sound: 'ew / ue', label: 'EW / UE', words: ['new', 'blue', 'glue', 'true', 'cue'] },
    ],
  },
];

export function getAllPresetWords(): string[] {
  const words = new Set<string>();
  for (const category of PHONICS_WORD_CATEGORIES) {
    for (const group of category.groups) {
      for (const word of group.words) words.add(word);
    }
  }
  return Array.from(words);
}


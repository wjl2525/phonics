/**
 * Phonics Core Rules (1-9)
 * Based on rules.md - organized for learning progression
 */

export interface PhonicsRule {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  patterns?: string[];
  subRules?: {
    label: string;
    sound: string;
    examples: string[];
  }[];
  examples: string[];
}

export const PHONICS_RULES: PhonicsRule[] = [
  {
    id: 1,
    title: "Short Vowels",
    shortTitle: "Short Vowels",
    description: "The five vowels a, e, i, o, u usually make short vowel sounds in closed syllables (CVC pattern).",
    patterns: ["CVC (consonant-vowel-consonant)"],
    examples: [
      "cat", "bat", "rat", "hat", "mat", "sat", "tap", "map", "cap", "nap",
      "bed", "red", "pet", "wet", "set", "leg", "beg", "peg", "men", "pen",
      "sit", "bit", "hit", "fit", "kit", "pit", "win", "pin", "fin", "tin",
      "hot", "pot", "cot", "dot", "lot", "not", "top", "mop", "hop", "pop",
      "cup", "pup", "cut", "but", "hut", "nut", "bug", "hug", "mug", "rug"
    ],
  },
  {
    id: 2,
    title: "Hard and Soft Consonants",
    shortTitle: "Hard/Soft C & G",
    description: "Some consonants change their sound depending on the following vowel.",
    subRules: [
      {
        label: "Hard C (/k/)",
        sound: "/k/",
        examples: ["cat", "cup", "car", "coat", "come", "cake", "camp", "card", "call", "cold"]
      },
      {
        label: "Soft C (/s/)",
        sound: "/s/",
        examples: ["city", "cent", "cell", "center", "circle", "cinema", "cycle", "civil", "celery", "ceiling"]
      },
      {
        label: "Hard G (/g/)",
        sound: "/g/",
        examples: ["go", "game", "get", "gift", "girl", "good", "gold", "gate", "goal", "grow"]
      },
      {
        label: "Soft G (/dʒ/)",
        sound: "/dʒ/",
        examples: ["giant", "gem", "germ", "gentle", "giraffe", "gym", "magic", "page", "cage", "stage"]
      }
    ],
    examples: ["cat", "city", "go", "giant", "cup", "cent", "game", "gem", "car", "circle"]
  },
  {
    id: 3,
    title: "Digraphs",
    shortTitle: "Digraphs",
    description: "A digraph is two letters that work together to make one single sound.",
    subRules: [
      {
        label: "SH",
        sound: "/ʃ/",
        examples: ["ship", "shop", "shoe", "shell", "sheep", "shark", "share", "shine", "shut", "wish"]
      },
      {
        label: "CH",
        sound: "/tʃ/",
        examples: ["chair", "chip", "chat", "check", "chin", "chest", "chop", "much", "such", "rich"]
      },
      {
        label: "TH (voiced)",
        sound: "/ð/",
        examples: ["this", "that", "them", "they", "the", "there", "then", "these", "those", "with"]
      },
      {
        label: "TH (unvoiced)",
        sound: "/θ/",
        examples: ["think", "thank", "thick", "thin", "thing", "three", "throw", "bath", "math", "path"]
      },
      {
        label: "WH",
        sound: "/w/",
        examples: ["what", "when", "where", "which", "while", "white", "wheel", "wheat", "whale", "why"]
      },
      {
        label: "PH",
        sound: "/f/",
        examples: ["phone", "photo", "phrase", "phantom", "phonics", "graph", "dolphin", "elephant", "alphabet", "trophy"]
      }
    ],
    examples: ["ship", "chair", "this", "think", "what", "phone", "shop", "chat", "them", "wheel"]
  },
  {
    id: 4,
    title: "Consonant Blends",
    shortTitle: "Blends",
    description: "A blend is two or more consonants together where each sound is heard.",
    subRules: [
      {
        label: "BL blend",
        sound: "/bl/",
        examples: ["black", "blue", "block", "blend", "blank", "blaze", "blink", "bloom", "blow", "blade"]
      },
      {
        label: "ST blend",
        sound: "/st/",
        examples: ["stop", "step", "star", "stick", "stone", "store", "stand", "start", "still", "stamp"]
      },
      {
        label: "TR blend",
        sound: "/tr/",
        examples: ["tree", "trip", "truck", "track", "train", "trap", "trick", "trail", "trash", "treat"]
      },
      {
        label: "SM blend",
        sound: "/sm/",
        examples: ["smile", "small", "smart", "smell", "smoke", "smooth", "smash", "smog", "smack", "smith"]
      },
      {
        label: "SP blend",
        sound: "/sp/",
        examples: ["spot", "spin", "spell", "speak", "speed", "spoon", "space", "spark", "spend", "sport"]
      },
      {
        label: "GR blend",
        sound: "/gr/",
        examples: ["green", "grow", "grass", "grape", "gray", "great", "group", "ground", "grab", "grade"]
      }
    ],
    examples: ["black", "stop", "tree", "smile", "spot", "green", "blue", "star", "trip", "small"]
  },
  {
    id: 5,
    title: "Magic E (Silent E)",
    shortTitle: "Magic E",
    description: "A final e at the end of a word is silent but makes the vowel say its long sound (CVCe pattern).",
    patterns: ["CVCe (consonant-vowel-consonant-e)"],
    subRules: [
      {
        label: "a_e (long A)",
        sound: "/eɪ/",
        examples: ["cake", "make", "bake", "take", "lake", "name", "game", "same", "came", "cave"]
      },
      {
        label: "i_e (long I)",
        sound: "/aɪ/",
        examples: ["kite", "bike", "like", "time", "line", "mine", "fine", "nine", "hide", "ride"]
      },
      {
        label: "o_e (long O)",
        sound: "/oʊ/",
        examples: ["hope", "home", "bone", "cone", "nose", "rose", "note", "vote", "rope", "pole"]
      },
      {
        label: "u_e (long U)",
        sound: "/uː/",
        examples: ["cute", "huge", "cube", "tube", "mule", "rule", "tune", "June", "dune", "fuse"]
      },
      {
        label: "e_e (long E)",
        sound: "/iː/",
        examples: ["Pete", "Steve", "these", "theme", "scene", "gene", "eve", "complete", "compete", "extreme"]
      }
    ],
    examples: ["cake", "kite", "hope", "cute", "make", "bike", "home", "tube", "lake", "time"]
  },
  {
    id: 6,
    title: "Vowel Teams",
    shortTitle: "Vowel Teams",
    description: "A vowel team is two vowels together that work as a team to make a sound. Often, the first vowel is long and the second is silent.",
    subRules: [
      {
        label: "AI",
        sound: "/eɪ/",
        examples: ["rain", "train", "wait", "pain", "main", "tail", "sail", "mail", "nail", "fail"]
      },
      {
        label: "EE",
        sound: "/iː/",
        examples: ["see", "bee", "tree", "feet", "sleep", "green", "keep", "week", "need", "seed"]
      },
      {
        label: "EA",
        sound: "/iː/",
        examples: ["eat", "sea", "tea", "read", "bean", "team", "leaf", "meat", "heat", "bead"]
      },
      {
        label: "OA",
        sound: "/oʊ/",
        examples: ["boat", "coat", "goat", "road", "load", "soap", "foam", "toast", "roast", "float"]
      },
      {
        label: "AY",
        sound: "/eɪ/",
        examples: ["play", "day", "say", "way", "may", "stay", "tray", "gray", "spray", "today"]
      },
      {
        label: "OO (long)",
        sound: "/uː/",
        examples: ["moon", "soon", "food", "cool", "pool", "tool", "room", "zoom", "broom", "spoon"]
      }
    ],
    examples: ["rain", "see", "eat", "boat", "play", "moon", "train", "tree", "sea", "coat"]
  },
  {
    id: 7,
    title: "R-Controlled Vowels",
    shortTitle: "R-Controlled",
    description: "When a vowel is followed by r, the vowel sound changes. Standard short and long vowel rules do not apply.",
    subRules: [
      {
        label: "AR",
        sound: "/ɑr/",
        examples: ["car", "star", "far", "bar", "jar", "card", "hard", "yard", "park", "dark"]
      },
      {
        label: "ER",
        sound: "/ɜr/",
        examples: ["her", "fern", "term", "verb", "herd", "water", "butter", "letter", "sister", "better"]
      },
      {
        label: "IR",
        sound: "/ɜr/",
        examples: ["bird", "girl", "sir", "fir", "stir", "first", "third", "dirt", "shirt", "skirt"]
      },
      {
        label: "OR",
        sound: "/ɔr/",
        examples: ["fork", "corn", "horn", "born", "torn", "storm", "short", "sport", "north", "order"]
      },
      {
        label: "UR",
        sound: "/ɜr/",
        examples: ["turn", "burn", "hurt", "surf", "turf", "curb", "curl", "nurse", "purse", "church"]
      }
    ],
    examples: ["car", "her", "bird", "fork", "turn", "star", "girl", "corn", "burn", "park"]
  },
  {
    id: 8,
    title: "Open and Closed Syllables",
    shortTitle: "Syllable Types",
    description: "Syllable type affects vowel sounds. Closed syllables end with a consonant (short vowel). Open syllables end with a vowel (long vowel).",
    subRules: [
      {
        label: "Closed Syllables",
        sound: "short vowel",
        examples: ["cat", "bed", "sit", "hot", "cup", "nap", "pen", "fin", "mop", "nut"]
      },
      {
        label: "Open Syllables",
        sound: "long vowel",
        examples: ["me", "he", "she", "we", "go", "no", "so", "hi", "by", "my"]
      }
    ],
    examples: ["cat", "me", "bed", "he", "sit", "go", "hot", "no", "cup", "we"]
  },
  {
    id: 9,
    title: "Double Consonants and Spelling Patterns",
    shortTitle: "Spelling Patterns",
    description: "Some spelling patterns help signal pronunciation or spelling rules.",
    subRules: [
      {
        label: "CK (after short vowel)",
        sound: "/k/",
        examples: ["back", "neck", "pick", "rock", "duck", "black", "check", "stick", "clock", "truck"]
      },
      {
        label: "FF ending",
        sound: "/f/",
        examples: ["off", "cliff", "stuff", "staff", "bluff", "sniff", "stiff", "fluff", "scoff", "cuff"]
      },
      {
        label: "LL ending",
        sound: "/l/",
        examples: ["bell", "well", "tell", "sell", "fell", "ball", "call", "tall", "wall", "mall"]
      },
      {
        label: "SS ending",
        sound: "/s/",
        examples: ["miss", "boss", "less", "mess", "pass", "class", "grass", "cross", "dress", "press"]
      },
      {
        label: "TCH (after short vowel)",
        sound: "/tʃ/",
        examples: ["match", "catch", "watch", "patch", "batch", "fetch", "sketch", "witch", "switch", "pitch"]
      }
    ],
    examples: ["back", "bell", "miss", "match", "off", "neck", "well", "boss", "catch", "duck"]
  }
];

export function getRuleById(id: number): PhonicsRule | undefined {
  return PHONICS_RULES.find(rule => rule.id === id);
}

export function getAllExamplesForRule(rule: PhonicsRule): string[] {
  if (rule.subRules) {
    return rule.subRules.flatMap(sub => sub.examples);
  }
  return rule.examples;
}

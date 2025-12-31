"use client";

import { useMemo, useState } from "react";
import {
  PHONICS_WORD_CATEGORIES,
  PhonicsCategoryId,
} from "@/lib/phonicsWordList";

interface WordPickerProps {
  isLoading: boolean;
  selectedWord?: string;
  onSelectWord: (word: string) => void;
}

const CATEGORY_ORDER: PhonicsCategoryId[] = [
  "short-vowel",
  "long-vowel",
  "digraph",
  "r-controlled",
  "vowel-team",
  "consonant",
];

export default function WordPicker({
  isLoading,
  selectedWord,
  onSelectWord,
}: WordPickerProps) {
  const categories = useMemo(() => {
    const byId = new Map(PHONICS_WORD_CATEGORIES.map((c) => [c.id, c] as const));
    return CATEGORY_ORDER.map((id) => byId.get(id)).filter(Boolean);
  }, []);

  const [activeCategoryId, setActiveCategoryId] =
    useState<PhonicsCategoryId>("short-vowel");

  const activeCategory = useMemo(
    () =>
      PHONICS_WORD_CATEGORIES.find((c) => c.id === activeCategoryId) ??
      PHONICS_WORD_CATEGORIES[0],
    [activeCategoryId]
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
        Choose a word
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          if (!category) return null;
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              disabled={isLoading}
              className={[
                "px-6 py-3 text-xl font-bold rounded-full border-2 transition-all",
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                isLoading ? "opacity-50 cursor-not-allowed" : "active:scale-95",
              ].join(" ")}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {activeCategory.groups.map((group) => (
          <div
            key={`${activeCategory.id}-${group.sound}`}
            className="rounded-2xl border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-800">
                {group.label}
              </h3>
              <div className="text-xl text-gray-500 font-mono">
                {group.sound}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {group.words.map((word) => {
                const isSelected =
                  selectedWord?.toLowerCase() === word.toLowerCase();

                return (
                  <button
                    key={`${group.sound}-${word}`}
                    type="button"
                    onClick={() => onSelectWord(word)}
                    disabled={isLoading}
                    className={[
                      "px-6 py-4 text-2xl font-bold rounded-2xl transition-all shadow-sm",
                      isSelected
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95",
                    ].join(" ")}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-500 mt-6 text-lg">
        Tap a word to see syllables, IPA, and audio.
      </p>
    </div>
  );
}


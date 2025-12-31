"use client";

import { useMemo, useState } from "react";
import {
  PHONICS_WORD_CATEGORIES,
  PhonicsCategoryId,
} from "@/lib/phonicsWordList";

interface WordSidebarProps {
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

export default function WordSidebar({
  isLoading,
  selectedWord,
  onSelectWord,
}: WordSidebarProps) {
  const categories = useMemo(() => {
    const byId = new Map(PHONICS_WORD_CATEGORIES.map((c) => [c.id, c] as const));
    return CATEGORY_ORDER.map((id) => byId.get(id)).filter(Boolean);
  }, []);

  const [expandedCategory, setExpandedCategory] = useState<PhonicsCategoryId | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [customWord, setCustomWord] = useState("");

  const handleCategoryClick = (categoryId: PhonicsCategoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setExpandedGroup(null);
    } else {
      setExpandedCategory(categoryId);
      setExpandedGroup(null);
    }
  };

  const handleGroupClick = (groupKey: string) => {
    setExpandedGroup(expandedGroup === groupKey ? null : groupKey);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWord.trim()) {
      onSelectWord(customWord.trim());
      setCustomWord("");
    }
  };

  const activeCategory = categories.find((c) => c?.id === expandedCategory);

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Pick a Word</h2>
      </div>

      {/* Custom word input - at top */}
      <div className="p-3 border-b bg-gray-50">
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="Type any word..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !customWord.trim()}
            className="px-4 py-2 text-sm font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Go
          </button>
        </form>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-2">
          {categories.map((category) => {
            if (!category) return null;
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id} className="mb-1">
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-left font-bold rounded-xl transition-all flex items-center justify-between ${
                    isExpanded
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  } ${isLoading ? "opacity-50" : ""}`}
                >
                  <span>{category.label}</span>
                  <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded groups */}
                {isExpanded && activeCategory && (
                  <div className="mt-1 ml-2 space-y-1">
                    {activeCategory.groups.map((group) => {
                      const groupKey = `${category.id}-${group.sound}`;
                      const isGroupExpanded = expandedGroup === groupKey;

                      return (
                        <div key={groupKey}>
                          {/* Group header */}
                          <button
                            type="button"
                            onClick={() => handleGroupClick(groupKey)}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 text-left rounded-lg transition-all flex items-center justify-between text-sm ${
                              isGroupExpanded
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <span className="font-semibold">{group.label}</span>
                            <span className="text-xs font-mono text-gray-500">
                              {group.sound}
                            </span>
                          </button>

                          {/* Words in group */}
                          {isGroupExpanded && (
                            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg mt-1">
                              {group.words.map((word) => {
                                const isSelected =
                                  selectedWord?.toLowerCase() === word.toLowerCase();

                                return (
                                  <button
                                    key={word}
                                    type="button"
                                    onClick={() => onSelectWord(word)}
                                    disabled={isLoading}
                                    className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-orange-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-orange-100 border border-gray-200"
                                    } ${isLoading ? "opacity-50" : "active:scale-95"}`}
                                  >
                                    {word}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

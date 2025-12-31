"use client";

import { useState, FormEvent } from "react";

interface WordInputProps {
  onSubmit: (word: string) => void;
  isLoading: boolean;
}

/**
 * Component 1: Word Input
 * Clean, large search bar for word input
 */
export default function WordInput({ onSubmit, isLoading }: WordInputProps) {
  const [word, setWord] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedWord = word.trim();
    if (trimmedWord && !isLoading) {
      onSubmit(trimmedWord);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <label htmlFor="word-input" className="block text-2xl font-bold text-gray-700 mb-4">
          Enter a word:
        </label>

        <div className="flex gap-4">
          <input
            id="word-input"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g., fantastic"
            disabled={isLoading}
            className="flex-1 px-6 py-5 text-3xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
          />

          <button
            type="submit"
            disabled={!word.trim() || isLoading}
            className="px-10 py-5 text-3xl font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none transition-all shadow-lg"
          >
            {isLoading ? "..." : "Go"}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Try words like: fantastic, education, beautiful, butterfly
        </p>
      </div>
    </form>
  );
}

"use client";

interface WordDisplayProps {
  word: string;
  ipa: string;
}

/**
 * Component 2: Whole Word Display
 * Shows the complete word with IPA transcription
 */
export default function WordDisplay({ word, ipa }: WordDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-2">
        <h2 className="text-7xl font-black text-gray-800">
          {word}
        </h2>
      </div>

      <div className="text-3xl text-gray-500 font-mono">
        {ipa}
      </div>
    </div>
  );
}

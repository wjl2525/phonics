"use client";

interface SyllableBlocksProps {
  syllables: string[];
  currentPlaying: number;
  onSyllableClick: (index: number) => void;
  highlightAll: boolean;
}

/**
 * Visual Syllable Breakdown
 * Clickable blocks that highlight during playback
 */
export default function SyllableBlocks({
  syllables,
  currentPlaying,
  onSyllableClick,
  highlightAll,
}: SyllableBlocksProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {syllables.map((syllable, index) => {
        const isPlaying = currentPlaying === index;
        const isHighlighted = highlightAll || isPlaying;

        return (
          <button
            key={index}
            onClick={() => onSyllableClick(index)}
            disabled={currentPlaying !== -1}
            className={`
              px-6 py-4 text-4xl font-bold rounded-xl
              transition-all duration-300
              ${isHighlighted
                ? "bg-orange-500 text-white scale-110 shadow-xl"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }
              ${currentPlaying !== -1 && !isPlaying
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer active:scale-95"
              }
              ${isPlaying ? "animate-pulse" : ""}
            `}
          >
            {syllable}
          </button>
        );
      })}
    </div>
  );
}

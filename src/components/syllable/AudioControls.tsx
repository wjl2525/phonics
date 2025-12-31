"use client";

interface AudioControlsProps {
  onPlaySequence: () => void;
  isPlaying: boolean;
}

/**
 * Component 4: Interactive Audio Controls
 * "Read to Me" button that plays the phonics sequence
 */
export default function AudioControls({
  onPlaySequence,
  isPlaying,
}: AudioControlsProps) {
  return (
    <div className="text-center">
      <button
        onClick={onPlaySequence}
        disabled={isPlaying}
        className={`
          px-8 py-4 text-2xl font-bold rounded-xl
          transition-all duration-300 shadow-lg
          ${isPlaying
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
          }
        `}
      >
        {isPlaying ? "Playing..." : "Read to Me"}
      </button>
    </div>
  );
}

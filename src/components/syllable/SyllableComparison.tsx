"use client";

interface SyllableComparisonProps {
  syllablesCMU: string[];
  syllablesNLP: string[];
}

/**
 * Component to compare syllable breakdowns from two different methods
 */
export default function SyllableComparison({
  syllablesCMU,
  syllablesNLP,
}: SyllableComparisonProps) {
  const renderSyllables = (syllables: string[], label: string, color: string) => (
    <div className="flex-1">
      <div className={`text-sm font-semibold mb-3 ${color}`}>
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {syllables.map((syllable, index) => (
          <div
            key={index}
            className="px-4 py-3 text-3xl font-bold rounded-xl bg-gray-50 border-2 border-gray-200"
          >
            {syllable}
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {syllables.length} syllable{syllables.length !== 1 ? 's' : ''}
      </div>
    </div>
  );

  const isMatch =
    syllablesCMU.length === syllablesNLP.length &&
    syllablesCMU.every((syl, i) => syl === syllablesNLP[i]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Syllable Breakdown Comparison
      </h3>

      {isMatch && (
        <div className="mb-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg text-center">
          <span className="text-green-700 font-semibold">✓ Both methods agree!</span>
        </div>
      )}

      {!isMatch && (
        <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
          <span className="text-yellow-700 font-semibold">⚠️ Methods differ - compare results</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {renderSyllables(syllablesCMU, "CMUdict Algorithm (used for audio)", "text-blue-600")}
        {renderSyllables(syllablesNLP, "NLP-Syllables Library", "text-purple-600")}
      </div>
    </div>
  );
}

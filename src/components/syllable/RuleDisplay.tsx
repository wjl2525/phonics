"use client";

import { PhonicsRule } from "@/lib/phonicsRules";

interface RuleDisplayProps {
  rule: PhonicsRule;
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
  isLoading: boolean;
}

export default function RuleDisplay({
  rule,
  selectedWord,
  onSelectWord,
  isLoading,
}: RuleDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Rule Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
            {rule.id}
          </span>
          <h2 className="text-2xl font-bold text-gray-800">{rule.title}</h2>
        </div>
        <p className="text-gray-600">{rule.description}</p>
        {rule.patterns && (
          <div className="mt-2 flex gap-2">
            {rule.patterns.map((pattern, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono">
                {pattern}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sub-rules or Examples */}
      <div className="p-6">
        {rule.subRules ? (
          <div className="space-y-6">
            {rule.subRules.map((subRule, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-gray-700">{subRule.label}</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-sm font-mono">
                    {subRule.sound}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subRule.examples.map((word) => {
                    const isSelected = selectedWord?.toLowerCase() === word.toLowerCase();
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() => onSelectWord(word)}
                        disabled={isLoading}
                        className={`
                          px-4 py-2 text-lg font-bold rounded-xl transition-all
                          ${isSelected
                            ? "bg-orange-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                          }
                          ${isLoading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                        `}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">Examples</h3>
            <div className="flex flex-wrap gap-2">
              {rule.examples.map((word) => {
                const isSelected = selectedWord?.toLowerCase() === word.toLowerCase();
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => onSelectWord(word)}
                    disabled={isLoading}
                    className={`
                      px-4 py-2 text-lg font-bold rounded-xl transition-all
                      ${isSelected
                        ? "bg-orange-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                      }
                      ${isLoading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                    `}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import RuleSidebar from "@/components/syllable/RuleSidebar";
import RuleDisplay from "@/components/syllable/RuleDisplay";
import SyllableBlocks from "@/components/syllable/SyllableBlocks";
import SyllableComparison from "@/components/syllable/SyllableComparison";
import AudioControls from "@/components/syllable/AudioControls";
import { PhonicsRule, PHONICS_RULES } from "@/lib/phonicsRules";

/**
 * Syllable-Based Phonics Breakdown Demo
 * Left sidebar: Rules list
 * Right side: Rule display with examples, word breakdown
 */

interface SyllableAudio {
  syllable: string;
  ipa?: string;
  audioBase64: string;
}

interface BreakdownData {
  word: string;
  ipa: string;
  syllables: string[];
  syllablesNLP: string[];
  syllableAudios: SyllableAudio[];
  wholeWordAudio: string;
}

const MAX_CLIENT_CACHE_ENTRIES = 40;

export default function SyllableDemoPage() {
  const [selectedRule, setSelectedRule] = useState<PhonicsRule | null>(PHONICS_RULES[0]);
  const [breakdownData, setBreakdownData] = useState<BreakdownData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<number>(-1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customWord, setCustomWord] = useState("");

  const isBusy = isLoading || currentPlaying !== -1;

  const breakdownCacheRef = useRef<Map<string, BreakdownData>>(new Map());

  const getCachedBreakdown = (normalizedWord: string) => {
    const cache = breakdownCacheRef.current;
    const cached = cache.get(normalizedWord);
    if (!cached) return null;
    cache.delete(normalizedWord);
    cache.set(normalizedWord, cached);
    return cached;
  };

  const setCachedBreakdown = (normalizedWord: string, value: BreakdownData) => {
    const cache = breakdownCacheRef.current;
    cache.delete(normalizedWord);
    cache.set(normalizedWord, value);
    if (cache.size <= MAX_CLIENT_CACHE_ENTRIES) return;
    const oldestKey = cache.keys().next().value;
    if (typeof oldestKey === "string") cache.delete(oldestKey);
  };

  const handleWordSubmit = async (word: string) => {
    const normalizedWord = word.trim().toLowerCase();
    const cached = getCachedBreakdown(normalizedWord);
    if (cached) {
      setError(null);
      setBreakdownData(cached);
      setCurrentPlaying(-1);
      return;
    }

    setIsLoading(true);
    setError(null);
    setBreakdownData(null);
    setCurrentPlaying(-1);

    try {
      const response = await fetch("/api/syllable-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process word");
      }

      const data: BreakdownData = await response.json();
      setCachedBreakdown(normalizedWord, data);
      setBreakdownData(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomWordSubmit = () => {
    if (customWord.trim()) {
      handleWordSubmit(customWord.trim());
      setCustomWord("");
    }
  };

  const handlePlaySequence = async () => {
    if (!breakdownData) return;

    setCurrentPlaying(-1);

    for (let i = 0; i < breakdownData.syllableAudios.length; i++) {
      setCurrentPlaying(i);

      const audioData = breakdownData.syllableAudios[i];
      const audioBlob = base64ToBlob(audioData.audioBase64, "audio/mpeg");
      const audioUrl = URL.createObjectURL(audioBlob);

      await playAudio(audioUrl);
      URL.revokeObjectURL(audioUrl);

      await sleep(300);
    }

    await sleep(500);
    setCurrentPlaying(breakdownData.syllables.length);

    const wholeWordBlob = base64ToBlob(breakdownData.wholeWordAudio, "audio/mpeg");
    const wholeWordUrl = URL.createObjectURL(wholeWordBlob);

    await playAudio(wholeWordUrl);
    URL.revokeObjectURL(wholeWordUrl);

    setCurrentPlaying(-1);
  };

  const handlePlaySyllable = async (index: number) => {
    if (!breakdownData) return;

    setCurrentPlaying(index);

    const audioData = breakdownData.syllableAudios[index];
    const audioBlob = base64ToBlob(audioData.audioBase64, "audio/mpeg");
    const audioUrl = URL.createObjectURL(audioBlob);

    await playAudio(audioUrl);
    URL.revokeObjectURL(audioUrl);

    setCurrentPlaying(-1);
  };

  const handleSelectRule = (rule: PhonicsRule) => {
    setSelectedRule(rule);
    setBreakdownData(null);
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-black text-gray-800">
            Phonics Lab
          </h1>
        </div>
      </header>

      {/* Main content area - Three column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Rules Sidebar (10%) */}
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed lg:relative lg:translate-x-0
            z-20 w-64 lg:w-[10%] lg:min-w-[180px] h-[calc(100vh-60px)]
            transition-transform duration-300 ease-in-out
            bg-white lg:bg-transparent
            shadow-xl lg:shadow-none
          `}
        >
          <div className="h-full p-2">
            <RuleSidebar
              selectedRuleId={selectedRule?.id ?? null}
              onSelectRule={handleSelectRule}
              isLoading={isBusy}
              customWord={customWord}
              onCustomWordChange={setCustomWord}
              onCustomWordSubmit={handleCustomWordSubmit}
            />
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Column 2: Rule Display & Examples (60%) */}
        <main className="flex-1 lg:w-[60%] overflow-y-auto p-4">
          {/* Error State */}
          {error && (
            <div className="mb-4">
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl">
                <p className="font-bold mb-1">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Rule Display with Examples - stays visible during loading */}
          {selectedRule && (
            <RuleDisplay
              rule={selectedRule}
              selectedWord={breakdownData?.word ?? null}
              onSelectWord={handleWordSubmit}
              isLoading={isBusy}
            />
          )}

          {/* Mobile: Word Breakdown (shown below rule display) */}
          {(isLoading || breakdownData) && (
            <div className="lg:hidden mt-6 space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
                      <p className="text-gray-600 mt-3">Loading...</p>
                    </div>
                  </div>
                </div>
              ) : breakdownData && (
                <>
                  {/* Word and IPA */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-center">
                      <h2 className="text-4xl font-black text-gray-800 mb-2">
                        {breakdownData.word}
                      </h2>
                      <div className="text-lg text-gray-500 font-mono">
                        {breakdownData.ipa}
                      </div>
                    </div>
                  </div>

                  {/* Syllable Breakdown */}
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Syllable Breakdown
                    </h3>
                    <SyllableBlocks
                      syllables={breakdownData.syllables}
                      currentPlaying={currentPlaying}
                      onSyllableClick={handlePlaySyllable}
                      highlightAll={currentPlaying === breakdownData.syllables.length}
                    />
                  </div>

                  {/* Audio Control */}
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <AudioControls
                      onPlaySequence={handlePlaySequence}
                      isPlaying={currentPlaying !== -1}
                    />
                  </div>

                  {/* Syllable Comparison */}
                  <SyllableComparison
                    syllablesCMU={breakdownData.syllables}
                    syllablesNLP={breakdownData.syllablesNLP}
                  />
                </>
              )}
            </div>
          )}

          {/* Empty State - no rule selected */}
          {!selectedRule && !isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Select a rule to start
                </h3>
                <p className="text-gray-500">
                  Choose a phonics rule from the sidebar
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Column 3: Word Breakdown Panel (30%) */}
        <aside className="hidden lg:block lg:w-[30%] h-[calc(100vh-60px)] overflow-y-auto p-4 border-l border-gray-200 bg-gray-50">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
                <p className="text-gray-600 mt-3">Loading...</p>
              </div>
            </div>
          ) : breakdownData ? (
            <div className="space-y-4">
              {/* Word and IPA */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-gray-800 mb-2">
                    {breakdownData.word}
                  </h2>
                  <div className="text-lg text-gray-500 font-mono">
                    {breakdownData.ipa}
                  </div>
                </div>
              </div>

              {/* Syllable Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Syllable Breakdown
                </h3>
                <SyllableBlocks
                  syllables={breakdownData.syllables}
                  currentPlaying={currentPlaying}
                  onSyllableClick={handlePlaySyllable}
                  highlightAll={currentPlaying === breakdownData.syllables.length}
                />
              </div>

              {/* Audio Control */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <AudioControls
                  onPlaySequence={handlePlaySequence}
                  isPlaying={currentPlaying !== -1}
                />
              </div>

              {/* Syllable Comparison */}
              <SyllableComparison
                syllablesCMU={breakdownData.syllables}
                syllablesNLP={breakdownData.syllablesNLP}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-3">🔤</div>
                <p className="text-sm">Select a word to see its breakdown</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// Utility functions
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  return new Blob([new Uint8Array(byteArrays)], { type: contentType });
}

function playAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play();
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

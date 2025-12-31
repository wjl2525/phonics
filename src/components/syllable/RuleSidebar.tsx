"use client";

import { useState } from "react";
import { PHONICS_RULES, PhonicsRule } from "@/lib/phonicsRules";

interface RuleSidebarProps {
  selectedRuleId: number | null;
  onSelectRule: (rule: PhonicsRule) => void;
  isLoading: boolean;
  customWord: string;
  onCustomWordChange: (word: string) => void;
  onCustomWordSubmit: () => void;
}

export default function RuleSidebar({
  selectedRuleId,
  onSelectRule,
  isLoading,
  customWord,
  onCustomWordChange,
  onCustomWordSubmit,
}: RuleSidebarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomWordSubmit();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-sm font-bold text-center">Rules</h2>
      </div>

      {/* Custom word input */}
      <div className="p-2 border-b bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-1">
          <input
            type="text"
            value={customWord}
            onChange={(e) => onCustomWordChange(e.target.value)}
            placeholder="Any word..."
            disabled={isLoading}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:border-purple-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !customWord.trim()}
            className="w-full px-2 py-1 text-xs font-bold bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Go
          </button>
        </form>
      </div>

      {/* Rules list */}
      <div className="flex-1 overflow-y-auto p-1">
        {PHONICS_RULES.map((rule) => {
          const isSelected = selectedRuleId === rule.id;

          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => onSelectRule(rule)}
              disabled={isLoading}
              className={`
                w-full px-2 py-2 mb-0.5 text-left rounded-lg transition-all
                flex items-center gap-2
                ${isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span className={`
                w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold
                ${isSelected ? "bg-white/20" : "bg-blue-100 text-blue-600"}
              `}>
                {rule.id}
              </span>
              <span className="font-medium text-xs leading-tight">{rule.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

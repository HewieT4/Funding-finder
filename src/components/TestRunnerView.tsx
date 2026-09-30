/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Play, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';
import { runMatchingEngineTests, TestCaseResult } from '../services/matchingEngine.test';

export const TestRunnerView: React.FC = () => {
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);

  const executeTests = () => {
    setIsRunning(true);
    const start = performance.now();
    const testResults = runMatchingEngineTests();
    const duration = performance.now() - start;
    setResults(testResults);
    setExecutionTimeMs(Math.round(duration * 100) / 100);
    setIsRunning(false);
  };

  useEffect(() => {
    executeTests();
  }, []);

  const passedCount = results.filter(r => r.passed).length;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sage)] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Matching Engine Verification Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)]">
            Algorithmic Fit & Unit Tests
          </h1>
          <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
            Automated verification verifying NSFAS caps, Missing Middle thresholds, SA citizenship hard blocks, close match detection, and deadline urgency.
          </p>
        </div>

        <button
          onClick={executeTests}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>Rerun 10 Unit Tests</span>
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--line)]">
          <span className="text-xs text-[var(--mute)] block">Test Suite Status</span>
          <span className="text-xl font-bold font-display text-[var(--sage)]">
            {passedCount} / {results.length} Passed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--line)]">
          <span className="text-xs text-[var(--mute)] block">Execution Time</span>
          <span className="text-xl font-bold font-display text-[var(--ink)] tabular-nums">
            {executionTimeMs} ms
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--line)]">
          <span className="text-xs text-[var(--mute)] block">Algorithm Invariants</span>
          <span className="text-xl font-bold font-display text-[var(--blue)]">
            100% Deterministic
          </span>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {results.map((t, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              t.passed
                ? 'bg-[var(--panel)] border-[var(--line)]'
                : 'bg-red-50 dark:bg-red-950/20 border-red-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--sage)] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--ink)]">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[var(--mute)] mt-1 font-mono">
                    {t.details}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${t.passed ? 'text-[var(--sage)]' : 'text-red-500'}`}>
                {t.passed ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

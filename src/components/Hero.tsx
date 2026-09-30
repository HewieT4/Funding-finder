/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { FIELDS_OF_STUDY } from '../data/funds';
import { Fund, LearnerProfile, StudyLevel } from '../types';
import { rankFunds } from '../services/matchingEngine';

interface HeroProps {
  funds: Fund[];
  initialProfile: LearnerProfile;
  onStartFullFinder: (profileOverrides?: Partial<LearnerProfile>) => void;
  onQuickViewResults: (profile: LearnerProfile) => void;
  lowDataMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  funds,
  initialProfile,
  onStartFullFinder,
  onQuickViewResults,
  lowDataMode,
}) => {
  // Live teaser state for the 3 quick questions
  const [fieldOfStudy, setFieldOfStudy] = useState(initialProfile.fieldOfStudy);
  const [level, setLevel] = useState<StudyLevel>(initialProfile.level);
  const [average, setAverage] = useState(initialProfile.academicAverage);

  // Live match calculation right in the hero
  const teaserProfile = useMemo<LearnerProfile>(() => {
    return {
      ...initialProfile,
      fieldOfStudy,
      level,
      academicAverage: average,
    };
  }, [initialProfile, fieldOfStudy, level, average]);

  const rankedResults = useMemo(() => {
    return rankFunds(teaserProfile, funds);
  }, [teaserProfile, funds]);

  const eligibleCount = rankedResults.filter(r => r.status === 'likely_eligible').length;
  const topEligibleFund = rankedResults.find(r => r.status === 'likely_eligible');

  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--bg)] py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--mute)]">
              <span className="w-2 h-2 rounded-full bg-[var(--sage)] animate-pulse" />
              <span>Verified 2026/2027 South African Bursary Cycle</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-[var(--ink)] leading-[1.1] text-balance">
              Find student funding you <span className="underline decoration-[var(--gold)] decoration-wavy decoration-2">actually qualify</span> for.
            </h1>

            <p className="text-base sm:text-lg text-[var(--mute)] max-w-xl leading-relaxed">
              No generic lists. No expired links. Bursary Finder matches your province, marks, and household income against NSFAS, SETAs, and corporate bursaries with plain-language eligibility reasons.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onStartFullFinder({ fieldOfStudy, level, academicAverage: average })}
                className="px-6 py-3.5 rounded-xl bg-[var(--brown)] text-white hover:bg-[var(--brown-hover)] active:scale-98 transition-all font-semibold text-base shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Take the 3-Minute Match Finder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onQuickViewResults(teaserProfile)}
                className="px-5 py-3.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--panel-hover)] transition-colors font-medium text-sm cursor-pointer"
              >
                Browse All {funds.length} Verified Funds
              </button>
            </div>

            {/* Proof indicators without pills */}
            <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[var(--mute)]">
              <span className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--sage)]" />
                <span>100% Free & Open Source</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--blue)]" />
                <span>POPIA Safe (Data stays on your phone)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[var(--gold)]" />
                <span>Low-Data Mode Ready</span>
              </span>
            </div>
          </div>

          {/* Right Column: Live 3-Question Interactive Teaser */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7 shadow-[var(--card-shadow)]">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brown)]" />
                  <span className="text-sm font-bold font-display uppercase tracking-wider text-[var(--ink)]">
                    Live Quick-Match Calculator
                  </span>
                </div>
                <span className="text-xs text-[var(--mute)]">Instant preview</span>
              </div>

              <div className="space-y-4">
                {/* Question 1: Field of Study */}
                <div>
                  <label htmlFor="hero-field" className="block text-xs font-semibold text-[var(--mute)] mb-1.5">
                    1. What are you studying or intend to study?
                  </label>
                  <select
                    id="hero-field"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--ink)] font-medium cursor-pointer"
                  >
                    {FIELDS_OF_STUDY.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question 2: Level */}
                <div>
                  <label htmlFor="hero-level" className="block text-xs font-semibold text-[var(--mute)] mb-1.5">
                    2. Current study level or grade
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'grade11', label: 'Grade 11' },
                        { id: 'grade12', label: 'Grade 12 (Matric)' },
                        { id: 'tvet', label: 'TVET College' },
                        { id: 'undergrad_1st', label: '1st Year Uni' },
                        { id: 'undergrad_senior', label: 'Senior Undergrad' },
                        { id: 'postgrad', label: 'Postgraduate' },
                      ] as const
                    ).map((lvl) => (
                      <button
                        type="button"
                        key={lvl.id}
                        onClick={() => setLevel(lvl.id)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer truncate ${
                          level === lvl.id
                            ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                            : 'bg-[var(--bg)] text-[var(--mute)] border-[var(--line)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Average Marks */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--mute)] mb-1.5">
                    <label htmlFor="hero-average">3. Estimated academic average</label>
                    <span className="text-[var(--ink)] font-bold text-sm tabular-nums">{average}%</span>
                  </div>
                  <input
                    id="hero-average"
                    type="range"
                    min="50"
                    max="95"
                    step="1"
                    value={average}
                    onChange={(e) => setAverage(Number(e.target.value))}
                    className="w-full accent-[var(--brown)] cursor-pointer h-2 bg-[var(--line)] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--mute)] mt-1 font-mono">
                    <span>50% (Pass)</span>
                    <span>65% (Bursary baseline)</span>
                    <span>75%+ (High Merit)</span>
                  </div>
                </div>
              </div>

              {/* Live Result Teaser Banner */}
              <div className="mt-6 pt-5 border-t border-[var(--line)]">
                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold font-display text-[var(--brown)] tabular-nums">
                        {eligibleCount}
                      </span>
                      <span className="text-sm font-semibold text-[var(--ink)]">
                        likely eligible funds found
                      </span>
                    </div>
                    {topEligibleFund && (
                      <p className="text-xs text-[var(--mute)] mt-0.5 truncate max-w-xs">
                        Top match: <span className="font-medium text-[var(--ink)]">{topEligibleFund.fund.name}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onQuickViewResults(teaserProfile)}
                    className="px-4 py-2.5 rounded-lg bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] active:scale-95 transition-all text-center whitespace-nowrap cursor-pointer"
                  >
                    View Matched Funds
                  </button>
                </div>
              </div>

              {/* Resilient Editorial Image Banner with CSS Fallback */}
              {!lowDataMode && (
                <div className="mt-4 rounded-xl overflow-hidden border border-[var(--line)] aspect-video relative max-h-40 bg-[var(--bg)]">
                  <img
                    src="/src/assets/images/sa_students_campus_1790785461054.jpg"
                    alt="South African university undergraduate students in Johannesburg collaborating outdoors in a sunny campus courtyard with notebooks and laptop"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Hide broken image frame if file cannot be read
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 pointer-events-none">
                    <span className="text-xs font-medium text-white/95 leading-snug">
                      Verified bursaries and scholarships for South African youth across all 9 provinces
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { FIELDS_OF_STUDY, SA_PROVINCES } from '../data/funds';
import { Fund, HouseholdIncomeBand, LearnerProfile, SouthAfricanProvince, StudyLevel } from '../types';
import { rankFunds } from '../services/matchingEngine';

interface ConversationalFinderProps {
  initialProfile: LearnerProfile;
  funds: Fund[];
  onComplete: (profile: LearnerProfile) => void;
  onCancel: () => void;
}

export const ConversationalFinder: React.FC<ConversationalFinderProps> = ({
  initialProfile,
  funds,
  onComplete,
  onCancel,
}) => {
  const [profile, setProfile] = useState<LearnerProfile>(initialProfile);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Consent & Age Check (POPIA Section 35 - Protection of Children & Minors)
  const [hasAgeConsent, setHasAgeConsent] = useState<boolean>(true);
  const [hasAccuracyConsent, setHasAccuracyConsent] = useState<boolean>(true);

  // Live match results count as answers change
  const liveResults = useMemo(() => {
    return rankFunds(profile, funds);
  }, [profile, funds]);

  const liveEligibleCount = liveResults.filter(r => r.status === 'likely_eligible').length;

  const totalSteps = 8; // Province, Level, Field, Marks, Income, Citizenship, Disability, Consent

  // Keyboard navigation support: Enter to go to next step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
        } else if (hasAgeConsent && hasAccuracyConsent) {
          onComplete(profile);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, profile, hasAgeConsent, hasAccuracyConsent, onComplete, totalSteps]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (!hasAgeConsent || !hasAccuracyConsent) {
        alert('Please confirm the parental awareness and accuracy checkboxes to proceed.');
        return;
      }
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-between max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label={currentStep === 0 ? 'Exit finder' : 'Go back to previous step'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 0 ? 'Exit Finder' : 'Back'}</span>
          </button>

          {/* Signature profile-progress motif */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--mute)] tabular-nums">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <div className="w-24 sm:w-32 h-2 bg-[var(--line)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--brown)] transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Matching Teaser Counter */}
        <div className="mb-6 p-2.5 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[var(--mute)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brown)]" />
            <span>Current live matches based on your answers:</span>
          </span>
          <span className="font-bold text-[var(--brown)] tabular-nums">
            {liveEligibleCount} bursaries likely eligible
          </span>
        </div>
      </div>

      {/* Main Conversational Screen (1 Question Per Screen) */}
      <div className="my-auto py-4">
        {/* Step 0: Province */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              Which South African province do you currently reside in?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Some funding schemes give regional priority to rural or under-resourced provinces.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4">
              {SA_PROVINCES.map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => {
                    setProfile({ ...profile, province: prov });
                  }}
                  className={`p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                    profile.province === prov
                      ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--brown)]'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{prov}</span>
                  {profile.province === prov && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Study Level */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Academic Stage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              What is your current study level or grade?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Whether you are preparing for matric, at a TVET college, or in university.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {(
                [
                  { id: 'grade11', title: 'Grade 11', desc: 'Applying for early pipeline and bursary talent pools' },
                  { id: 'grade12', title: 'Grade 12 (Matric)', desc: 'Final year of high school entering tertiary study next year' },
                  { id: 'tvet', title: 'TVET College Student', desc: 'National Certificate Vocational (NCV) or N1-N6 trades' },
                  { id: 'undergrad_1st', title: 'First-Year University', desc: 'Currently in 1st year of bachelor degree or diploma' },
                  { id: 'undergrad_senior', title: 'Senior Undergrad (2nd-4th Year)', desc: 'Continuing undergraduate student needing fees assistance' },
                  { id: 'postgrad', title: 'Postgraduate / Honours', desc: 'Honours, Masters, or Doctoral research studies' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, level: lvl.id as StudyLevel })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    profile.level === lvl.id
                      ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--brown)]'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm sm:text-base text-[var(--ink)]">{lvl.title}</span>
                    {profile.level === lvl.id && <Check className="w-4 h-4 text-[var(--brown)]" />}
                  </div>
                  <span className="text-xs text-[var(--mute)]">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Field of Study */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Discipline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              What field of study are you enrolled in or targeting?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Many corporate bursaries support scarce and critical skills like STEM and CA(SA).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 max-h-[360px] overflow-y-auto pr-1">
              {FIELDS_OF_STUDY.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setProfile({ ...profile, fieldOfStudy: field })}
                  className={`p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                    profile.fieldOfStudy === field
                      ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--brown)]'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{field}</span>
                  {profile.fieldOfStudy === field && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Academic Marks */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Academic Marks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              What is your estimated overall academic average?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Based on your latest Grade 11/12 report or university transcripts (excluding Life Orientation).
            </p>

            <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="academic-average-slider" className="text-xs font-semibold text-[var(--ink)]">
                    Overall Academic Average
                  </label>
                  <span className="text-xl font-bold font-display text-[var(--brown)] tabular-nums">
                    {profile.academicAverage}%
                  </span>
                </div>
                <input
                  id="academic-average-slider"
                  type="range"
                  min="45"
                  max="95"
                  step="1"
                  value={profile.academicAverage}
                  onChange={(e) => setProfile({ ...profile, academicAverage: Number(e.target.value) })}
                  className="w-full accent-[var(--brown)] cursor-pointer h-2 bg-[var(--line)] rounded-lg"
                />
              </div>

              {/* Specific Maths and Science inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--line)]">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="maths-slider" className="text-xs font-medium text-[var(--mute)]">
                      Mathematics Mark
                    </label>
                    <span className="text-xs font-bold text-[var(--ink)] tabular-nums">
                      {profile.mathAverage ?? 60}%
                    </span>
                  </div>
                  <input
                    id="maths-slider"
                    type="range"
                    min="40"
                    max="95"
                    step="1"
                    value={profile.mathAverage ?? 60}
                    onChange={(e) => setProfile({ ...profile, mathAverage: Number(e.target.value) })}
                    className="w-full accent-[var(--brown)] cursor-pointer h-1.5 bg-[var(--line)] rounded-lg"
                  />
                  <span className="text-[10px] text-[var(--mute)]">Pure Mathematics (Level 5+)</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="science-slider" className="text-xs font-medium text-[var(--mute)]">
                      Physical Science Mark
                    </label>
                    <span className="text-xs font-bold text-[var(--ink)] tabular-nums">
                      {profile.scienceAverage ?? 60}%
                    </span>
                  </div>
                  <input
                    id="science-slider"
                    type="range"
                    min="40"
                    max="95"
                    step="1"
                    value={profile.scienceAverage ?? 60}
                    onChange={(e) => setProfile({ ...profile, scienceAverage: Number(e.target.value) })}
                    className="w-full accent-[var(--brown)] cursor-pointer h-1.5 bg-[var(--line)] rounded-lg"
                  />
                  <span className="text-[10px] text-[var(--mute)]">Required for Engineering & Science</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Household Income Band */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Financial Need
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              What is your combined household income band?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              This determines whether you qualify for government free education (NSFAS) or "Missing Middle" support.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-3">
              {(
                [
                  {
                    id: 'under_350k',
                    title: 'Under R350,000 per year (≤ R29,166/month)',
                    desc: 'Qualifies for full government NSFAS bursaries and low-income corporate schemes. SASSA grant recipients qualify automatically.',
                    badge: 'NSFAS Eligible',
                  },
                  {
                    id: '350k_to_600k',
                    title: 'R350,001 to R600,000 per year ("Missing Middle")',
                    desc: 'Families earning above NSFAS cap but who cannot afford university fees. Qualifies for ISFAP and comprehensive corporate funds.',
                    badge: 'Missing Middle / ISFAP',
                  },
                  {
                    id: 'above_600k',
                    title: 'Above R600,000 per year',
                    desc: 'Eligible for open merit-based scholarships, corporate talent bursaries (Sasol, Shoprite, Vodacom), and academic excellence awards.',
                    badge: 'Merit Bursaries',
                  },
                ] as const
              ).map((band) => (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, incomeBand: band.id as HouseholdIncomeBand })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    profile.incomeBand === band.id
                      ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--brown)]'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm sm:text-base text-[var(--ink)]">{band.title}</span>
                    {profile.incomeBand === band.id && <Check className="w-4 h-4 text-[var(--brown)]" />}
                  </div>
                  <p className="text-xs text-[var(--mute)] mb-2 leading-relaxed">{band.desc}</p>
                  <span className="text-[11px] font-medium text-[var(--brown)]">{band.badge}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Citizenship */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Nationality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              Are you a South African citizen or permanent resident?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              NSFAS and most public and SETA bursaries legally mandate a valid South African ID document.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, isSACitizen: true })}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  profile.isSACitizen
                    ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] ring-1 ring-[var(--brown)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base text-[var(--ink)]">Yes, SA Citizen / Permanent Resident</span>
                  {profile.isSACitizen && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </div>
                <span className="text-xs text-[var(--mute)]">Possess 13-digit green barcoded ID or Smart ID card</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, isSACitizen: false })}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  !profile.isSACitizen
                    ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] ring-1 ring-[var(--brown)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base text-[var(--ink)]">No, International Student</span>
                  {!profile.isSACitizen && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </div>
                <span className="text-xs text-[var(--mute)]">Will filter out funds with statutory SA citizenship rules</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Disability Affirmation */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Inclusion
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              Do you live with a disability or chronic condition?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              South African funding programs (including NSFAS) increase income thresholds to R600,000 and provide assistive device funding (wheelchairs, screen readers, human support) for students living with disabilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, hasDisability: true })}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  profile.hasDisability
                    ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] ring-1 ring-[var(--brown)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base text-[var(--ink)]">Yes, I have a disability</span>
                  {profile.hasDisability && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </div>
                <span className="text-xs text-[var(--mute)]">Apply disability concessions and assistive support benefits</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, hasDisability: false })}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  !profile.hasDisability
                    ? 'border-[var(--brown)] bg-[var(--panel)] text-[var(--ink)] ring-1 ring-[var(--brown)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--brown)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base text-[var(--ink)]">No disability</span>
                  {!profile.hasDisability && <Check className="w-4 h-4 text-[var(--brown)]" />}
                </div>
                <span className="text-xs text-[var(--mute)]">Standard criteria and thresholds apply</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Age & Accuracy Consent (POPIA Section 35 Compliance) */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--sage)] font-display">
              Consent &amp; Privacy Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] text-balance">
              Age Verification &amp; Match Consent
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Before viewing your results, please verify your age and consent to our on-device processing.
            </p>

            <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAgeConsent}
                  onChange={(e) => setHasAgeConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line)] accent-[var(--brown)] mt-0.5"
                />
                <span className="text-xs text-[var(--ink)]">
                  <strong>Age Verification (POPIA Section 35):</strong> I confirm that I am 18 years of age or older, OR if I am under 18 (e.g. in Grade 11 or 12), I have my parent or guardian&apos;s awareness to search for bursaries.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAccuracyConsent}
                  onChange={(e) => setHasAccuracyConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line)] accent-[var(--brown)] mt-0.5"
                />
                <span className="text-xs text-[var(--ink)]">
                  <strong>Educational Matching Acknowledgment:</strong> I understand that &ldquo;Likely eligible&rdquo; indicates alignment with published criteria and is NOT a guarantee of a bursary award. All applications must be officially lodged on provider portals.
                </span>
              </label>

              <div className="pt-2 border-t border-[var(--line)] text-[11px] text-[var(--mute)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--sage)]" />
                <span>Your answers remain strictly on this device in your browser. Nothing is sent to advertising servers.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Action buttons & Keyboard note */}
      <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[var(--mute)] hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] font-mono text-[11px]">Enter ↵</kbd> to continue
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] text-xs font-semibold hover:bg-[var(--panel-hover)] transition-colors cursor-pointer"
            >
              Previous
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[var(--brown)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--brown-hover)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{currentStep === totalSteps - 1 ? 'Show My Matched Funding' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

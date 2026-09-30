/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertCircle, Check, Send, ShieldCheck, X } from 'lucide-react';
import { Fund } from '../types';

interface SubmitFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFund: (fund: Fund) => void;
}

export const SubmitFundModal: React.FC<SubmitFundModalProps> = ({
  isOpen,
  onClose,
  onAddFund,
}) => {
  const [bursaryName, setBursaryName] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState<'bursary' | 'scholarship' | 'nsfas_grant'>('bursary');
  const [fields, setFields] = useState('Engineering');
  const [minAvg, setMinAvg] = useState(65);
  const [closeDate, setCloseDate] = useState('2026-11-30');
  const [applyUrl, setApplyUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [freeConfirmation, setFreeConfirmation] = useState(false);
  const [accuracyConfirmation, setAccuracyConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bursaryName || !provider || !applyUrl) return;

    if (!freeConfirmation || !accuracyConfirmation) {
      alert('Please check both verification confirmations to ensure legitimate listing.');
      return;
    }

    const newFund: Fund = {
      id: `community-${Date.now()}`,
      slug: bursaryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: bursaryName,
      provider,
      providerType: 'corporate',
      category,
      summary: summary || `Funding provided by ${provider} for South African students studying ${fields}.`,
      description: summary || `Verified community-submitted funding opportunity for ${fields}.`,
      coverage: {
        tuition: true,
        accommodation: true,
        allowance: true,
        books: true,
        laptop: false,
        travel: false,
      },
      eligibility: {
        minAverage: Number(minAvg),
        allowedLevels: ['grade12', 'undergrad_1st', 'undergrad_senior'],
        fieldsOfStudy: [fields],
        allowedProvinces: ['All'],
        saCitizenshipRequired: true,
      },
      requiredDocuments: [
        'Certified ID copy',
        'Academic transcripts / Grade 12 results',
        'Proof of university acceptance/registration',
      ],
      openDate: '2026-09-01',
      closeDate,
      isOpen: true,
      applyUrl,
      sourceUrl: applyUrl,
      lastVerifiedAt: '2026-09-30',
      verifiedBy: 'Community Contributor',
      serviceObligation: 'Standard service or merit review',
      applicationTips: ['Apply early before portal closing time.'],
    };

    onAddFund(newFund);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sage)] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Community &amp; Admin Verification</span>
            </div>
            <h2 id="submit-modal-title" className="text-xl font-bold font-display text-[var(--ink)]">
              Submit or Update a Bursary
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--sage)] text-white flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[var(--ink)]">
              Bursary Added Successfully!
            </h3>
            <p className="text-xs text-[var(--mute)]">
              This bursary is now loaded into the local engine and available for matching.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
            <div>
              <label htmlFor="submit-fund-name" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                Bursary Name *
              </label>
              <input
                id="submit-fund-name"
                required
                type="text"
                placeholder="e.g. Barloworld Education Trust Bursary"
                value={bursaryName}
                onChange={(e) => setBursaryName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="submit-fund-provider" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Provider Organization *
                </label>
                <input
                  id="submit-fund-provider"
                  required
                  type="text"
                  placeholder="e.g. Barloworld Foundation"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label htmlFor="submit-fund-category" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Category
                </label>
                <select
                  id="submit-fund-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                >
                  <option value="bursary">Corporate / Trust Bursary</option>
                  <option value="scholarship">Academic Scholarship</option>
                  <option value="nsfas_grant">Government Grant</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="submit-fund-field" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Priority Field of Study
                </label>
                <input
                  id="submit-fund-field"
                  type="text"
                  placeholder="e.g. Engineering, Commerce, IT"
                  value={fields}
                  onChange={(e) => setFields(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label htmlFor="submit-fund-avg" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Minimum Average Required (%)
                </label>
                <input
                  id="submit-fund-avg"
                  type="number"
                  min="50"
                  max="95"
                  value={minAvg}
                  onChange={(e) => setMinAvg(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="submit-fund-date" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Closing Date (YYYY-MM-DD) *
                </label>
                <input
                  id="submit-fund-date"
                  required
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label htmlFor="submit-fund-url" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                  Official Application Link *
                </label>
                <input
                  id="submit-fund-url"
                  required
                  type="url"
                  placeholder="https://..."
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="submit-fund-summary" className="block text-xs font-semibold text-[var(--mute)] mb-1">
                Summary / Coverage Notes
              </label>
              <textarea
                id="submit-fund-summary"
                rows={2}
                placeholder="What does it cover (tuition, accommodation, book allowance)?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>

            {/* Explicit Form Consents */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={freeConfirmation}
                  onChange={(e) => setFreeConfirmation(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line)] accent-[var(--brown)] mt-0.5"
                />
                <span className="text-[11px] text-[var(--ink)]">
                  <strong>Anti-Scam &amp; Zero Fees:</strong> I certify that this bursary is 100% free for students to apply for, with zero application or processing fees.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={accuracyConfirmation}
                  onChange={(e) => setAccuracyConfirmation(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line)] accent-[var(--brown)] mt-0.5"
                />
                <span className="text-[11px] text-[var(--ink)]">
                  <strong>Public Origin:</strong> I confirm that this opportunity links directly to the official sponsor or verified public bursary portal.
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-[var(--line)] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save to Local Engine</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

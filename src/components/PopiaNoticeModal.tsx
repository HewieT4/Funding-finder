/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, ShieldCheck, Trash2, X } from 'lucide-react';

interface PopiaNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllData: () => void;
}

export const PopiaNoticeModal: React.FC<PopiaNoticeModalProps> = ({
  isOpen,
  onClose,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popia-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[var(--sage)]" />
            </div>
            <div>
              <h2 id="popia-modal-title" className="text-xl font-bold font-display text-[var(--ink)]">
                POPIA Privacy & Data Commitment
              </h2>
              <p className="text-xs text-[var(--mute)]">
                Protection of Personal Information Act (Act 4 of 2013)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-xs sm:text-sm text-[var(--mute)] leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <p>
            Bursary Finder SA is built with a <strong>privacy-first, local-only architecture</strong>. We believe young South Africans should be able to explore student funding without being tracked, exploited, or having their academic and financial records commercialized.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
              <strong className="text-[var(--ink)] block text-xs">1. 100% On-Device Processing</strong>
              <p className="text-xs">
                Your academic marks, estimated household income band, disability status, and shortlisted bursaries are calculated and stored strictly within your browser&apos;s local storage. None of this data is transmitted or retained on remote advertising servers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
              <strong className="text-[var(--ink)] block text-xs">2. No Third-Party Data Brokers</strong>
              <p className="text-xs">
                We do not sell, rent, or lease your contact information or academic records to private lenders, student loan sharks, or marketing aggregators.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
              <strong className="text-[var(--ink)] block text-xs">3. Direct Official Applications</strong>
              <p className="text-xs">
                When you are ready to apply, you apply directly on the verified official portal of the provider (e.g. NSFAS, Sasol, Allan Gray). We never ask for your banking passwords or National ID numbers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
              <strong className="text-[var(--ink)] block text-xs">4. Right to Deletion (POPIA Section 24)</strong>
              <p className="text-xs">
                You hold absolute control over your profile. You can wipe all stored marks, saved funds, and checklists with a single click at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all your saved profile data and shortlisted bursaries from this browser?')) {
                onClearAllData();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 cursor-pointer p-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All My Data (Reset Device)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

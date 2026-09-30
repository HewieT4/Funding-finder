/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  FileText,
  Laptop,
  GraduationCap,
  Home,
  Receipt,
  Share2,
  ShieldCheck,
  Utensils,
  X,
} from 'lucide-react';
import { Fund, LearnerProfile, MatchResult } from '../types';
import { matchFund } from '../services/matchingEngine';
import { downloadCalendarReminder, getWhatsAppShareUrl } from '../services/storage';

interface FundDetailModalProps {
  fund: Fund | null;
  profile: LearnerProfile;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (fund: Fund) => void;
  preparedDocuments: string[];
  onToggleDocumentPrepared: (fundId: string, doc: string) => void;
}

export const FundDetailModal: React.FC<FundDetailModalProps> = ({
  fund,
  profile,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  preparedDocuments,
  onToggleDocumentPrepared,
}) => {
  if (!isOpen || !fund) return null;

  const match: MatchResult = matchFund(profile, fund);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fund-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--mute)] mb-1.5 flex-wrap">
              <span className="font-semibold text-[var(--ink)]">{fund.provider}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{fund.providerType} Provider</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--sage)] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified {fund.lastVerifiedAt}</span>
              </span>
            </div>
            <h2 id="fund-modal-title" className="text-xl sm:text-2xl font-bold font-display text-[var(--ink)]">
              {fund.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pt-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Match Fit Assessment Banner */}
          <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--mute)] font-display">
                  Profile Fit Evaluation
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-bold text-[var(--brown)] tabular-nums">
                  {match.score}% match score
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink)]">
                Status: <strong className="capitalize">{match.status.replace('_', ' ')}</strong> for your current profile.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleSave(fund)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                    : 'border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:border-[var(--brown)]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Shortlisted' : 'Save to Shortlist'}</span>
              </button>

              <button
                onClick={() => downloadCalendarReminder(fund)}
                title="Add deadline to calendar"
                className="p-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppShareUrl(fund)}
                target="_blank"
                rel="noopener noreferrer"
                title="Share via WhatsApp"
                className="p-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--sage)] hover:text-[var(--ink)] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--ink)] mb-2">
              About This Funding Opportunity
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
              {fund.description}
            </p>
          </div>

          {/* Full Coverage Breakdown */}
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--ink)] mb-3">
              What This Bursary Covers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className={`p-3 rounded-xl border ${fund.coverage.tuition ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]' : 'opacity-40 border-dashed border-[var(--line)] text-[var(--mute)]'}`}>
                <GraduationCap className="w-4 h-4 text-[var(--brown)] mb-1" />
                <span className="font-semibold block">Full Tuition Fees</span>
                <span className="text-[11px] text-[var(--mute)]">{fund.coverage.tuition ? 'Direct to institution' : 'Not included'}</span>
              </div>

              <div className={`p-3 rounded-xl border ${fund.coverage.accommodation ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]' : 'opacity-40 border-dashed border-[var(--line)] text-[var(--mute)]'}`}>
                <Home className="w-4 h-4 text-[var(--brown)] mb-1" />
                <span className="font-semibold block">Accommodation</span>
                <span className="text-[11px] text-[var(--mute)]">{fund.coverage.accommodation ? 'Campus / approved res' : 'Not included'}</span>
              </div>

              <div className={`p-3 rounded-xl border ${fund.coverage.allowance ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]' : 'opacity-40 border-dashed border-[var(--line)] text-[var(--mute)]'}`}>
                <Utensils className="w-4 h-4 text-[var(--brown)] mb-1" />
                <span className="font-semibold block">Meals & Living Stipend</span>
                <span className="text-[11px] text-[var(--mute)]">{fund.coverage.allowance ? 'Monthly bank allowance' : 'Not included'}</span>
              </div>

              <div className={`p-3 rounded-xl border ${fund.coverage.books ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]' : 'opacity-40 border-dashed border-[var(--line)] text-[var(--mute)]'}`}>
                <Receipt className="w-4 h-4 text-[var(--brown)] mb-1" />
                <span className="font-semibold block">Book Allowance</span>
                <span className="text-[11px] text-[var(--mute)]">{fund.coverage.books ? 'Prescribed study material' : 'Not included'}</span>
              </div>

              <div className={`p-3 rounded-xl border ${fund.coverage.laptop ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]' : 'opacity-40 border-dashed border-[var(--line)] text-[var(--mute)]'}`}>
                <Laptop className="w-4 h-4 text-[var(--brown)] mb-1" />
                <span className="font-semibold block">Laptop Provision</span>
                <span className="text-[11px] text-[var(--mute)]">{fund.coverage.laptop ? 'Once-off device issue' : 'Self-provided'}</span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]">
                <ShieldCheck className="w-4 h-4 text-[var(--blue)] mb-1" />
                <span className="font-semibold block">Service Obligation</span>
                <span className="text-[11px] text-[var(--mute)] line-clamp-2">{fund.serviceObligation}</span>
              </div>
            </div>
            {fund.coverage.notes && (
              <p className="text-xs text-[var(--mute)] mt-2 italic">
                Note: {fund.coverage.notes}
              </p>
            )}
          </div>

          {/* Interactive Document Checklist Tracker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[var(--sage)]" />
                <span>Required Documents Checklist</span>
              </h3>
              <span className="text-xs text-[var(--mute)]">
                {preparedDocuments.length} of {fund.requiredDocuments.length} ready
              </span>
            </div>

            <div className="space-y-2">
              {fund.requiredDocuments.map((doc, idx) => {
                const isReady = preparedDocuments.includes(doc);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onToggleDocumentPrepared(fund.id, doc)}
                    className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isReady
                        ? 'border-[var(--sage)] bg-[var(--bg)] text-[var(--ink)]'
                        : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isReady
                            ? 'bg-[var(--sage)] border-[var(--sage)] text-white'
                            : 'border-[var(--mute)] bg-transparent'
                        }`}
                      >
                        {isReady && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={isReady ? 'line-through opacity-80' : 'font-medium'}>{doc}</span>
                    </div>
                    <span className="text-[10px] text-[var(--mute)] hidden sm:inline">
                      {isReady ? 'Ready' : 'Click to tick off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Application Tips */}
          {fund.applicationTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display mb-2">
                Tips for South African Learners
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--mute)]">
                {fund.applicationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--brown)] font-bold">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scam & Safety Warning */}
          <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--mute)] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
            <p>
              <strong>Safety Reminder:</strong> Bursary and NSFAS applications are <em>always 100% free</em>. Never pay any fee or airtime voucher to anyone claiming to secure a bursary on your behalf.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[var(--mute)]">
            <span>Deadline: </span>
            <strong className="text-[var(--ink)]">{fund.closeDate}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={fund.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Apply on Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

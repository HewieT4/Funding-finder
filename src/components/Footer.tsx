/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Scale, ShieldCheck, Terminal, Trash2 } from 'lucide-react';
import { LegalTab } from './LegalCenterModal';

interface FooterProps {
  onOpenLegalTab: (tab: LegalTab) => void;
  onOpenSubmit: () => void;
  onOpenTests: () => void;
  onNavigate: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalTab,
  onOpenSubmit,
  onOpenTests,
  onNavigate,
}) => {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--panel)] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[var(--line)]">
          {/* Brand & Purpose */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xl font-bold font-display text-[var(--ink)] block">
              Bursary Finder SA
            </span>
            <p className="text-xs sm:text-sm text-[var(--mute)] max-w-sm leading-relaxed">
              An open, public-benefit student funding matcher for South African high school learners, TVET students, and university undergraduates.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--sage)] font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free · Zero Hidden Fees · POPIA Protected</span>
              </span>
              <span className="text-[var(--mute)] text-[11px]">
                Sandton, Johannesburg, Gauteng, South Africa
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-2 text-xs sm:text-sm">
            <span className="font-bold font-display uppercase tracking-wider text-[var(--ink)] block mb-3 text-xs">
              Portal Tools
            </span>
            <ul className="space-y-2 text-[var(--mute)]">
              <li>
                <button onClick={() => onNavigate('find')} className="hover:text-[var(--ink)] cursor-pointer">
                  Conversational Funding Finder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('all')} className="hover:text-[var(--ink)] cursor-pointer">
                  Directory of 15+ Verified Bursaries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checklist')} className="hover:text-[var(--ink)] cursor-pointer">
                  Documents &amp; SAPS Certification Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('saved')} className="hover:text-[var(--ink)] cursor-pointer">
                  Shortlist &amp; Application Pipeline
                </button>
              </li>
              <li>
                <button onClick={onOpenSubmit} className="hover:text-[var(--ink)] cursor-pointer">
                  Submit or Update a Bursary
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Privacy & Compliance */}
          <div className="md:col-span-5 space-y-2 text-xs sm:text-sm">
            <span className="font-bold font-display uppercase tracking-wider text-[var(--ink)] block mb-3 text-xs flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[var(--brown)]" />
              <span>Legal, Privacy &amp; Compliance Center</span>
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[var(--mute)]">
              <div>
                <button onClick={() => onOpenLegalTab('privacy')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Privacy Policy (POPIA)
                </button>
                <button onClick={() => onOpenLegalTab('terms')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Terms of Service
                </button>
                <button onClick={() => onOpenLegalTab('refunds')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  No Fees &amp; Refund Policy
                </button>
                <button onClick={() => onOpenLegalTab('cookies')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Cookie &amp; Storage Policy
                </button>
              </div>

              <div>
                <button onClick={() => onOpenLegalTab('age_consent')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Minors &amp; Age Consent
                </button>
                <button onClick={() => onOpenLegalTab('business_details')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Entity &amp; Business Details
                </button>
                <button onClick={() => onOpenLegalTab('licenses')} className="hover:text-[var(--ink)] cursor-pointer text-left block py-0.5">
                  Font &amp; Asset Licenses
                </button>
                <button onClick={() => onOpenLegalTab('data_deletion')} className="hover:text-red-600 font-semibold cursor-pointer text-left block py-0.5 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" />
                  <span>Erase All Device Data</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTests}
                className="text-[11px] text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer flex items-center gap-1.5"
              >
                <Terminal className="w-3 h-3 text-[var(--brown)]" />
                <span>Matching Engine Test Suite (10 Automated Tests)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--mute)]">
          <p className="max-w-3xl leading-relaxed">
            Legal Disclaimer: Bursary Finder SA is an independent educational tool. &ldquo;Likely eligible&rdquo; indicates alignment with published public rules and does not guarantee an award. Bursary decisions rest exclusively with the respective funding providers and DHET.
          </p>
          <div className="flex items-center gap-1 text-[var(--mute)] shrink-0">
            <span>Built for South African youth</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-current inline mx-0.5" />
            <span>2026/2027</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

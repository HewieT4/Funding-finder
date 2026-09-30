/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPolicy: () => void;
}

const COOKIE_CONSENT_KEY = 'bursary_finder_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential_accepted');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and local storage consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-[var(--panel)] border-t border-[var(--line)] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--brown)] shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold font-display text-[var(--ink)] flex items-center gap-1.5">
              <span>Zero-Tracker & Local Storage Notice</span>
              <span className="text-[10px] font-semibold text-[var(--sage)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--line)]">
                POPIA Compliant
              </span>
            </h4>
            <p className="text-xs text-[var(--mute)] max-w-3xl leading-relaxed">
              We respect your privacy. Bursary Finder SA uses <strong>zero third-party advertising cookies, zero trackers, and zero marketing pixels</strong>. We use only strictly essential browser local storage to save your marks, chosen filters, and saved shortlist directly on your own device.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenPolicy}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer whitespace-nowrap"
          >
            Cookie Policy
          </button>

          <button
            onClick={handleAcceptEssential}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--brown)] text-white hover:bg-[var(--brown-hover)] transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            Accept Essential Storage
          </button>

          <button
            onClick={handleAcceptEssential}
            className="p-2 text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

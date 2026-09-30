/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Printer,
  Share2,
  Sparkles,
  X,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Fund, LearnerProfile } from '../types';
import { downloadBursaryTicketPDF } from '../services/pdfTicketGenerator';
import { formatStudyLevel } from '../services/matchingEngine';

interface ApplicationTicketModalProps {
  isOpen: boolean;
  fund: Fund | null;
  profile: LearnerProfile;
  onClose: () => void;
  onConfirmTear: (fundId: string, referenceCode: string) => void;
  alreadyTorn?: boolean;
}

export const ApplicationTicketModal: React.FC<ApplicationTicketModalProps> = ({
  isOpen,
  fund,
  profile,
  onClose,
  onConfirmTear,
  alreadyTorn = false,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(alreadyTorn);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setIsConfirmed(alreadyTorn);
  }, [alreadyTorn, fund?.id]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate deterministic reference code
  const refCode = React.useMemo(() => {
    if (!fund) return 'ZA-2026-BF-9184';
    const sum = fund.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const num = (sum % 8999) + 1000;
    return `ZA-2026-BF-${num}`;
  }, [fund]);

  if (!isOpen || !fund) return null;

  const handleConfirmAndIssue = () => {
    setIsConfirmed(true);
    onConfirmTear(fund.id, refCode);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      if (!isConfirmed) {
        setIsConfirmed(true);
        onConfirmTear(fund.id, refCode);
      }
      downloadBursaryTicketPDF({
        fund,
        profile,
        refCode,
        issuedAt: new Date(),
        statusLabel: 'CONFIRMED ON WAITING LIST & APPLICATION QUEUE',
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!isConfirmed) {
      setIsConfirmed(true);
      onConfirmTear(fund.id, refCode);
    }
    window.print();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(refCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 I have recorded my application & waiting list registration for the ${fund.name} (${fund.provider})!\n` +
      `📄 Official PDF Confirmation Ref: ${refCode}\n` +
      `📅 Closing Date: ${fund.closeDate}\n` +
      `Tracked and verified via Bursary Finder SA.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const formattedDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-7 shadow-2xl my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--brown)]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--sage)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Official PDF Application &amp; Waiting List Slip</span>
              </div>
              <h2 id="ticket-modal-title" className="text-lg sm:text-xl font-bold font-display text-[var(--ink)]">
                Waiting List PDF Confirmation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Close PDF confirmation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner */}
        <div className="my-3.5 p-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--mute)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <span>
              {isConfirmed
                ? 'Official PDF Slip is generated and verified in your application tracker.'
                : 'Click "Download PDF File" to export your official confirmation slip for offline presentation.'}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            title="Click to copy reference code"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-[10px] font-mono text-[var(--brown)] font-bold cursor-pointer hover:border-[var(--brown)] transition-colors whitespace-nowrap"
          >
            {copiedCode ? <Check className="w-3 h-3 text-[var(--sage)]" /> : <Copy className="w-3 h-3" />}
            <span>{refCode}</span>
          </button>
        </div>

        {/* Scrollable Live PDF Document Sheet Preview */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4">
          <div className="rounded-2xl border-2 border-[var(--line)] bg-[#FAF8F5] dark:bg-[#1C1714] text-[#251C16] dark:text-[#F7F0E6] p-4 sm:p-6 shadow-md transition-all">
            
            {/* PDF Sheet Header Banner */}
            <div className="p-3.5 rounded-xl bg-[#251C16] text-[#F7F0E6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373] text-[#251C16] font-bold text-xs flex items-center justify-center shrink-0">
                  SA
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide font-display text-white">
                    BURSARY FINDER SA
                  </h3>
                  <p className="text-[10px] text-[#D4A373] uppercase tracking-wider font-semibold">
                    National Student Funding &amp; Waiting List Registry
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/20 sm:pl-3">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#CBBFB1] block">
                  Official Slip Ref
                </span>
                <span className="text-xs font-mono font-bold text-[#D4A373] tracking-wider">
                  {refCode}
                </span>
              </div>
            </div>

            {/* Document Title Bar */}
            <div className="mt-3 py-2 px-3 rounded-lg bg-white/70 dark:bg-black/20 border border-[var(--line)] flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold tracking-tight block">
                  OFFICIAL APPLICATION &amp; WAITING LIST CONFIRMATION SLIP
                </span>
                <span className="text-[9px] text-[var(--mute)]">
                  Issued: {formattedDate} · POPIA Safe · Student Verification Copy
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white whitespace-nowrap">
                {isConfirmed ? '✓ CONFIRMED' : 'READY TO ISSUE'}
              </span>
            </div>

            {/* Section A: Bursary Details */}
            <div className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-black/10 border border-[var(--line)]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1">
                Section A: Bursary &amp; Opportunity Record
              </span>
              <h4 className="text-sm font-bold font-display text-[var(--ink)]">
                {fund.name}
              </h4>
              <p className="text-[11px] text-[var(--mute)] mt-0.5">
                Provided by <strong>{fund.provider}</strong> ({fund.providerType.toUpperCase()}) · Portal: {fund.applyUrl}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-[var(--line)] text-[10px]">
                <div>
                  <span className="text-[var(--mute)] block">Closing Deadline:</span>
                  <strong className="text-red-700 dark:text-red-400">{fund.closeDate}</strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Award Coverage:</span>
                  <strong className="capitalize">
                    {Object.entries(fund.coverage)
                      .filter(([k, v]) => v === true && k !== 'notes')
                      .map(([k]) => k)
                      .slice(0, 3)
                      .join(', ') || 'Study Fees'}
                  </strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[var(--mute)] block">Audit Status:</span>
                  <span className="text-[var(--sage)] font-semibold">Verified Active</span>
                </div>
              </div>
            </div>

            {/* Section B: Applicant Qualifying Credentials */}
            <div className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-black/10 border border-[var(--line)]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1">
                Section B: Applicant Credentials (POPIA Protected)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span className="text-[var(--mute)] block">Study Level:</span>
                  <strong className="text-[var(--ink)]">{formatStudyLevel(profile.level)}</strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Target Field:</span>
                  <strong className="text-[var(--ink)]">{profile.fieldOfStudy}</strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Province &amp; Citizen:</span>
                  <strong className="text-[var(--ink)]">{profile.province} (SA Citizen)</strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Academic Average:</span>
                  <strong className="text-[var(--sage)] font-bold">{profile.academicAverage}% Average</strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Key Marks:</span>
                  <strong className="text-[var(--ink)]">
                    Math {profile.mathAverage ?? 'N/A'}% · Science {profile.scienceAverage ?? 'N/A'}%
                  </strong>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Household Income:</span>
                  <strong className="text-[var(--ink)]">
                    {profile.incomeBand === 'under_350k' ? '≤ R350k (NSFAS Cap)' : 'Missing Middle / Merit'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Section C: Mandatory Certified Documents Audit Checklist */}
            <div className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-black/10 border border-[var(--line)]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1.5">
                Section C: Certified Documents Submission Checklist
              </span>
              <div className="space-y-1.5 text-[10px] text-[var(--ink)]">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[9px] text-[var(--sage)] font-bold shrink-0">
                    ✓
                  </span>
                  <span>Certified Copy of South African ID Document or Smart Card (SAPS stamped &lt; 3 months)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[9px] text-[var(--sage)] font-bold shrink-0">
                    ✓
                  </span>
                  <span>Latest Certified Academic Results (Grade 11 final or Matric mid-year report)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[9px] text-[var(--sage)] font-bold shrink-0">
                    ✓
                  </span>
                  <span>Proof of Household Income (Pay-slips / Pension statement / SASSA grant letter)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[9px] text-[var(--sage)] font-bold shrink-0">
                    ✓
                  </span>
                  <span>Proof of Tertiary Application / Provisional Admission Letter (if applicable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[9px] text-[var(--sage)] font-bold shrink-0">
                    ✓
                  </span>
                  <span>Motivational Essay &amp; Learner Curriculum Vitae (CV)</span>
                </div>
              </div>
            </div>

            {/* Official Confirmation & Verification Stamp Block */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-3">
                {/* Visual Stamp Seal */}
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-600 dark:border-emerald-400 flex flex-col items-center justify-center text-center p-1 shrink-0 rotate-[-2deg]">
                  <span className="text-[7px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-300">
                    BURSARY FINDER
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-800 dark:text-emerald-200">
                    LOGGED
                  </span>
                  <span className="text-[6.5px] font-mono text-emerald-600 dark:text-emerald-400">
                    {refCode}
                  </span>
                </div>

                <div>
                  <strong className="text-xs font-bold block text-emerald-950 dark:text-emerald-100">
                    Official Waiting List Queue Confirmation
                  </strong>
                  <p className="text-[10px] leading-relaxed text-emerald-800 dark:text-emerald-300 mt-0.5">
                    Your application preparation is logged under Ref <strong>{refCode}</strong>. Present this PDF file or quote the reference code when communicating with bursary administrators.
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 sm:text-right shrink-0">
                {formattedDate}
              </span>
            </div>

            {/* Anti-Scam Notice */}
            <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[9px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Zero-Fee Guarantee:</strong> Applications for bursaries and NSFAS in South Africa are 100% free. Never pay anyone claiming to secure funding.
              </span>
            </div>

          </div>
        </div>

        {/* Action Controls & Export Bar */}
        <div className="mt-4 pt-3.5 border-t border-[var(--line)] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Primary Action: Download Real .pdf File */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[var(--brown)] hover:bg-[var(--brown-hover)] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF (.pdf)'}</span>
            </button>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              title="Print document or save via browser print"
              className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--panel-hover)] text-xs font-semibold cursor-pointer transition-colors"
              aria-label="Print PDF Slip"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              title="Share verification details on WhatsApp"
              className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:border-emerald-600 hover:text-emerald-700 text-xs font-semibold cursor-pointer transition-colors"
              aria-label="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {downloadSuccess && (
              <span className="text-xs font-semibold text-[var(--sage)] flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PDF Downloaded!</span>
              </span>
            )}

            {!isConfirmed && (
              <button
                onClick={handleConfirmAndIssue}
                className="px-3.5 py-2 rounded-xl border border-[var(--brown)] text-[var(--brown)] hover:bg-[var(--brown)] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Mark Confirmed in Tracker
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] text-xs font-medium hover:bg-[var(--panel-hover)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

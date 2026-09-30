/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Printer,
  Share2,
  Sparkles,
  X,
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
  const [isShortlisted, setIsShortlisted] = useState(alreadyTorn);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setIsShortlisted(alreadyTorn);
  }, [alreadyTorn, fund?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const refCode = React.useMemo(() => {
    if (!fund) return 'ZA-2026-BF-9184';
    const sum = fund.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const num = (sum % 8999) + 1000;
    return `ZA-2026-BF-${num}`;
  }, [fund]);

  if (!isOpen || !fund) return null;

  const handleMarkShortlisted = () => {
    setIsShortlisted(true);
    onConfirmTear(fund.id, refCode);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      if (!isShortlisted) {
        setIsShortlisted(true);
        onConfirmTear(fund.id, refCode);
      }
      downloadBursaryTicketPDF({
        fund,
        profile,
        refCode,
        issuedAt: new Date(),
        statusLabel: 'SHORTLISTED',
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
    if (!isShortlisted) {
      setIsShortlisted(true);
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
      `Funding Application Summary for ${fund.name} (${fund.provider})\n` +
      `Personal Reference: ${refCode}\n` +
      `Closing Date: ${fund.closeDate}\n` +
      `Next step: apply on the provider's official portal before the closing date.\n` +
      `Official portal: ${fund.applyUrl}\n` +
      `Saved via Bursary Finder SA.`
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
      aria-labelledby="summary-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:fixed print:inset-0"
    >
      <div className="printable-modal-inner relative w-full max-w-2xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6 shadow-2xl my-4 max-h-[94vh] flex flex-col box-border">
        
        {/* Modal Top Header (Hidden on print) */}
        <div className="no-print flex items-start justify-between gap-4 pb-3.5 border-b border-[var(--line)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--brown)] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--sage)]">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Your Funding Application Summary</span>
              </div>
              <h2 id="summary-modal-title" className="text-lg sm:text-xl font-bold font-display text-[var(--ink)]">
                Funding Application Summary Slip
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Close summary slip modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner (Hidden on print) */}
        <div className="no-print my-3 p-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--mute)] flex items-center justify-between gap-3 shrink-0 box-border">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <span className="truncate">
              {isShortlisted
                ? 'Saved to your personal shortlist. Download as PDF or print to keep offline.'
                : 'Click "Download PDF File" to export your A4 summary slip for offline preparation.'}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            title="Click to copy personal reference code"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-[10px] font-mono text-[var(--brown)] font-bold cursor-pointer hover:border-[var(--brown)] transition-colors whitespace-nowrap shrink-0"
          >
            {copiedCode ? <Check className="w-3 h-3 text-[var(--sage)]" /> : <Copy className="w-3 h-3" />}
            <span>{refCode}</span>
          </button>
        </div>

        {/* Scrollable Document Container & Printable Slip */}
        <div className="flex-1 overflow-y-auto pr-0.5 py-1 space-y-3 box-border">
          <div
            id="printable-slip-content"
            className="printable-slip-sheet rounded-2xl border-2 border-[var(--line)] bg-[#FAF8F5] dark:bg-[#1C1714] text-[#251C16] dark:text-[#F7F0E6] p-4 sm:p-5 shadow-sm max-w-[186mm] w-full mx-auto box-border transition-all"
            style={{ boxSizing: 'border-box' }}
          >
            
            {/* Sheet Header Banner: Earth Ink */}
            <div className="printable-card p-3 rounded-xl bg-[#251C16] text-[#F7F0E6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 box-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373] text-[#251C16] font-bold text-xs flex items-center justify-center shrink-0">
                  BF
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm tracking-wide font-display text-white truncate">
                    BURSARY FINDER SA
                  </h3>
                  <p className="text-[10px] text-[#D4A373] tracking-normal font-semibold truncate">
                    Student Bursary &amp; Financial Aid Application Helper
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right sm:border-l sm:border-white/20 sm:pl-3 shrink-0">
                <span className="text-[9px] font-mono tracking-normal text-[#CBBFB1] block">
                  Personal Tracking Reference
                </span>
                <span className="text-xs font-mono font-bold text-[#D4A373] tracking-normal">
                  {refCode}
                </span>
              </div>
            </div>

            {/* Document Title Bar with SHORTLISTED Status Pill */}
            <div className="printable-card mt-2.5 py-2 px-3 rounded-lg bg-white/80 dark:bg-black/20 border border-[var(--line)] flex items-center justify-between gap-3 min-w-0 box-border">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold tracking-tight block text-[var(--ink)] truncate">
                  Your Funding Application Summary
                </span>
                <span className="text-[10px] text-[var(--mute)] block truncate">
                  Saved to your shortlist on {formattedDate} · Personal tracking record
                </span>
              </div>
              
              {/* Fix 1: STATUS pill properly sized to content, small letter-spacing, zero clipping */}
              <div className="shrink-0 w-fit">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-normal text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 w-fit max-w-full overflow-hidden whitespace-nowrap">
                  <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="shrink-0">SHORTLISTED</span>
                </span>
              </div>
            </div>

            {/* Next Step Banner */}
            <div className="printable-card mt-2.5 p-2.5 rounded-lg bg-[#EFE8DE]/60 dark:bg-black/30 border border-[#D0C3B2] flex items-center gap-2.5 text-xs text-[var(--ink)] box-border">
              <div className="p-1 rounded-md bg-[var(--brown)] text-white shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block text-[11px] text-[var(--brown)] font-bold [overflow-wrap:break-word] break-words">
                  Next step: apply on the provider's official portal before the closing date.
                </strong>
                <span className="text-[10px] text-[var(--mute)] block [overflow-wrap:break-word] break-words">
                  Submit all required forms and certified documents directly to the funding organization.
                </span>
              </div>
            </div>

            {/* Section A: Bursary Opportunity Details */}
            <div className="printable-card mt-2.5 p-3 rounded-lg bg-white/70 dark:bg-black/10 border border-[var(--line)] [break-inside:avoid] box-border">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1">
                Section A: Bursary Opportunity Details
              </span>
              <h4 className="text-sm font-bold font-display text-[var(--ink)] [overflow-wrap:break-word] break-words">
                {fund.name}
              </h4>
              <p className="text-[11px] text-[var(--mute)] mt-0.5 [overflow-wrap:break-word] break-words">
                Provided by <strong>{fund.provider}</strong> ({fund.providerType.toUpperCase()})
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-[var(--line)] text-[10px] box-border">
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Closing Deadline:</span>
                  <strong className="text-red-700 dark:text-red-400 font-bold block">{fund.closeDate}</strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Award Coverage:</span>
                  <strong className="capitalize block truncate">
                    {Object.entries(fund.coverage)
                      .filter(([k, v]) => v === true && k !== 'notes')
                      .map(([k]) => k)
                      .slice(0, 3)
                      .join(', ') || 'Study Fees'}
                  </strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Verification Status:</span>
                  <span className="text-[var(--sage)] font-semibold block">Verified {fund.lastVerifiedAt}</span>
                </div>
                
                {/* Fix 5: Portal URL wraps cleanly with overflow-wrap:anywhere without truncating */}
                <div className="min-w-0 col-span-1 sm:col-span-3 pt-1 border-t border-[var(--line)]">
                  <span className="text-[var(--mute)] block text-[9.5px]">Official Application Portal:</span>
                  <a
                    href={fund.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 dark:text-blue-400 hover:underline text-[10.5px] font-medium [overflow-wrap:anywhere] break-all inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>{fund.applyUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Section B: Applicant Profile Summary */}
            <div className="printable-card mt-2.5 p-3 rounded-lg bg-white/70 dark:bg-black/10 border border-[var(--line)] [break-inside:avoid] box-border">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1">
                Section B: Applicant Profile Summary (POPIA Protected)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] box-border">
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Study Level:</span>
                  <strong className="text-[var(--ink)] block truncate">{formatStudyLevel(profile.level)}</strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Target Field:</span>
                  <strong className="text-[var(--ink)] block truncate">{profile.fieldOfStudy}</strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Province &amp; Citizen:</span>
                  <strong className="text-[var(--ink)] block [overflow-wrap:break-word] break-words">
                    {profile.province} ({profile.isSACitizen ? 'SA Citizen' : 'International'})
                  </strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Academic Average:</span>
                  <strong className="text-[var(--sage)] font-bold block">{profile.academicAverage}% Average</strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Key Marks:</span>
                  <strong className="text-[var(--ink)] block truncate">
                    Math {profile.mathAverage ?? 'N/A'}% · Science {profile.scienceAverage ?? 'N/A'}%
                  </strong>
                </div>
                <div className="min-w-0">
                  <span className="text-[var(--mute)] block text-[9.5px]">Household Income:</span>
                  <strong className="text-[var(--ink)] block truncate">
                    {profile.incomeBand === 'under_350k' ? '≤ R350k (NSFAS Cap)' : 'Missing Middle / Merit'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Section C: Mandatory Certified Documents Checklist */}
            <div className="printable-card mt-2.5 p-3 rounded-lg bg-white/70 dark:bg-black/10 border border-[var(--line)] [break-inside:avoid] box-border">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown)] block mb-1.5">
                Section C: Application Preparation &amp; Certified Documents Checklist
              </span>
              <div className="space-y-1.5 text-[10px] text-[var(--ink)] box-border">
                <div className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[var(--sage)] shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="flex-1 min-w-0 [overflow-wrap:break-word] break-words">
                    Certified copy of South African ID Document or Smart Card (stamped by SAPS or Post Office within 3 months).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[var(--sage)] shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="flex-1 min-w-0 [overflow-wrap:break-word] break-words">
                    Latest certified academic results (Grade 11 final report or Matric trial certificate with school seal).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[var(--sage)] shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="flex-1 min-w-0 [overflow-wrap:break-word] break-words">
                    Proof of household income (pay-slips, pension statement, SASSA letter, or unemployment police affidavit).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[var(--sage)] shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="flex-1 min-w-0 [overflow-wrap:break-word] break-words">
                    Proof of tertiary application or provisional university/TVET admission letter (if applicable).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center text-[var(--sage)] shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="flex-1 min-w-0 [overflow-wrap:break-word] break-words">
                    Motivational essay &amp; learner curriculum vitae (CV) highlighting leadership, career goals, and community service.
                  </span>
                </div>
              </div>
            </div>

            {/* Fix 2: Green Box: Paragraph text properly contained and wraps cleanly inside its box */}
            <div className="printable-card mt-2.5 p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 dark:text-emerald-100 [break-inside:avoid] box-border w-full min-w-0 overflow-hidden">
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                {/* Stamp Seal Graphic */}
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-600 dark:border-emerald-400 flex flex-col items-center justify-center text-center p-1 shrink-0">
                  <span className="text-[6.5px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-300">
                    BURSARY FINDER
                  </span>
                  <span className="text-[8.5px] font-extrabold text-emerald-900 dark:text-emerald-100">
                    SHORTLISTED
                  </span>
                  <span className="text-[6.5px] font-mono text-emerald-700 dark:text-emerald-300">
                    {refCode}
                  </span>
                </div>

                {/* Wrapped paragraph text inside green box */}
                <div className="min-w-0 flex-1">
                  <strong className="text-xs font-bold block text-emerald-950 dark:text-emerald-100 [overflow-wrap:break-word] break-words">
                    Application Notes &amp; Personal Tracking
                  </strong>
                  <p className="text-[10px] leading-relaxed text-emerald-800 dark:text-emerald-300 mt-0.5 [overflow-wrap:break-word] break-words">
                    Next step: apply on the provider\'s official portal before the closing date. This summary is generated for your personal application planning and document preparation. Bursary Finder SA is an independent free discovery tool and is not affiliated with {fund.provider}. This slip does not constitute an official submission or waiting list placement with the bursary provider.
                  </p>
                </div>
              </div>

              <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 shrink-0 self-end sm:self-auto sm:text-right">
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Fix 3 & 4: Anti-Scam Notice & Small-print: Normal flow, no absolute positioning, inline SVG icon */}
            <div className="printable-card mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 [break-inside:avoid] box-border">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <strong className="text-[10.5px] font-bold text-amber-900 dark:text-amber-200 block mb-0.5 [overflow-wrap:break-word] break-words">
                    Critical Safety Notice for South African Learners &amp; Parents:
                  </strong>
                  <p className="text-[9.5px] text-amber-800 dark:text-amber-300 leading-relaxed [overflow-wrap:break-word] break-words">
                    All legitimate bursaries, corporate funding schemes, ISFAP, and NSFAS applications are 100% FREE. Never pay any recruitment fee, application fee, or buy airtime vouchers to anyone offering funding. If anyone asks for money to guarantee an award, report them immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Microprint (Stacked in normal flow below safety notice, zero overlap!) */}
            <div className="printable-card mt-2.5 pt-2 border-t border-[var(--line)] text-center text-[9px] text-[var(--mute)] leading-relaxed [overflow-wrap:break-word] break-words [break-inside:avoid] box-border">
              Bursary Finder SA · Student Application Preparation Summary · Personal Reference: {refCode} · Saved on device for offline reference
            </div>

          </div>
        </div>

        {/* Action Controls & Export Bar (Hidden on print) */}
        <div className="no-print mt-3.5 pt-3 border-t border-[var(--line)] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 box-border">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Download Official .pdf Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[var(--brown)] hover:bg-[var(--brown-hover)] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Summary PDF (.pdf)'}</span>
            </button>

            {/* Browser Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              title="Print document or save via browser print dialog"
              className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--panel-hover)] text-xs font-semibold cursor-pointer transition-colors"
              aria-label="Print summary slip"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              title="Share application summary on WhatsApp"
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

            {!isShortlisted && (
              <button
                onClick={handleMarkShortlisted}
                className="px-3.5 py-2 rounded-xl border border-[var(--brown)] text-[var(--brown)] hover:bg-[var(--brown)] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Mark as Shortlisted
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

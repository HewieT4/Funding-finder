/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Calendar, Check, ExternalLink, FileText, Info, AlertTriangle } from 'lucide-react';
import { Fund, MatchResult } from '../types';

interface FundCardProps {
  result: MatchResult;
  isSaved: boolean;
  isApplied?: boolean;
  onToggleSave: (fund: Fund) => void;
  onViewDetails: (fund: Fund) => void;
  onAddToCalendar: (fund: Fund) => void;
  onOpenWaitingListTicket?: (fund: Fund) => void;
  lowDataMode: boolean;
}

export const FundCard: React.FC<FundCardProps> = ({
  result,
  isSaved,
  isApplied = false,
  onToggleSave,
  onViewDetails,
  onAddToCalendar,
  onOpenWaitingListTicket,
  lowDataMode,
}) => {
  const { fund, score, status, reasons, missing, daysUntilClose, urgency } = result;

  // Status visual attributes (strictly zero-pill text styling)
  const getStatusDisplay = () => {
    switch (status) {
      case 'likely_eligible':
        return {
          label: 'Likely Eligible',
          color: 'text-[var(--sage)]',
          dotBg: 'bg-[var(--sage)]',
          scoreColor: '#7C9A85',
        };
      case 'close_match':
        return {
          label: 'Close Match',
          color: 'text-[var(--gold)]',
          dotBg: 'bg-[var(--gold)]',
          scoreColor: '#D4A24A',
        };
      case 'not_eligible':
      default:
        return {
          label: 'Review Requirements',
          color: 'text-[var(--mute)]',
          dotBg: 'bg-[var(--mute)]',
          scoreColor: '#A67C52',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  // Deadline display
  const getDeadlineDisplay = () => {
    if (urgency === 'closed') {
      return <span className="text-[var(--mute)]">Closed for this cycle</span>;
    }
    if (urgency === 'urgent') {
      return (
        <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Closes in {daysUntilClose} days ({fund.closeDate})</span>
        </span>
      );
    }
    if (urgency === 'closing_soon') {
      return (
        <span className="text-[var(--gold)] font-medium">
          Closes in {daysUntilClose} days ({fund.closeDate})
        </span>
      );
    }
    return (
      <span className="text-[var(--mute)]">
        Open · Closes {fund.closeDate}
      </span>
    );
  };

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 transition-all hover:border-[var(--brown)] shadow-[var(--card-shadow)] flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between text-xs text-[var(--mute)] mb-2 flex-wrap gap-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[var(--ink)]">{fund.provider}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{fund.category.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Verified {fund.lastVerifiedAt}</span>
          </div>

          {/* Save / Shortlist Button */}
          <button
            onClick={() => onToggleSave(fund)}
            title={isSaved ? `Remove ${fund.name} from shortlist` : `Save ${fund.name} to shortlist`}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-xs ${
              isSaved
                ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--ink)]'
            }`}
            aria-label={isSaved ? `Remove ${fund.name} from shortlist` : `Save ${fund.name} to shortlist`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Shortlist'}</span>
          </button>
        </div>

        {/* Primary Title and Match Score Visual Gauge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--ink)] leading-snug">
              {fund.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mute)] mt-1 line-clamp-2 leading-relaxed">
              {fund.summary}
            </p>
          </div>

          {/* Signature Detail: Circular Match Fit Gauge */}
          <div className="shrink-0 flex flex-col items-center" aria-label={`Match score: ${score} percent, ${statusDisplay.label}`}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                <path
                  className="text-[var(--line)]"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeWidth="3.2"
                  strokeDasharray={`${score}, 100`}
                  stroke={statusDisplay.scoreColor}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold font-display tabular-nums text-[var(--ink)]">
                {score}%
              </span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 text-center whitespace-nowrap ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>
        </div>

        {/* Plain Language Match Reasons & What's Missing */}
        <div className="my-4 pt-3 border-t border-[var(--line)] space-y-2 text-xs">
          {/* Positive fit reasons */}
          {reasons.slice(0, 2).map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[var(--ink)]">
              <Check className="w-3.5 h-3.5 text-[var(--sage)] shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}

          {/* Missing or gap reasons */}
          {missing.slice(0, 2).map((miss, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[var(--mute)]">
              <Info className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
              <span className="text-[var(--mute)]">{miss}</span>
            </div>
          ))}
        </div>

        {/* Coverage Overview */}
        <div className="pt-3 border-t border-[var(--line)] flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--mute)]">
          <span className="font-semibold text-[var(--ink)]">Covers:</span>
          {fund.coverage.tuition && <span>Tuition</span>}
          {fund.coverage.accommodation && <span>· Residence</span>}
          {fund.coverage.allowance && <span>· Meal allowance</span>}
          {fund.coverage.books && <span>· Books</span>}
          {fund.coverage.laptop && <span>· Laptop</span>}
        </div>
      </div>

      {/* Card Footer: Deadline countdown & Action buttons */}
      <div className="mt-5 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--mute)] shrink-0" />
          {getDeadlineDisplay()}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenWaitingListTicket && (
            <button
              onClick={() => onOpenWaitingListTicket(fund)}
              title="View or download your funding application summary PDF"
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isApplied
                  ? 'border-[var(--sage)] bg-[var(--sage)] text-white'
                  : 'border-[var(--brown)] text-[var(--brown)] hover:bg-[var(--brown)] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isApplied ? 'Summary Saved' : 'Summary PDF'}</span>
              <span className="sm:hidden">Summary</span>
            </button>
          )}

          <button
            onClick={() => onAddToCalendar(fund)}
            title="Download calendar deadline reminder (.ics)"
            className="p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label="Add deadline to calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onViewDetails(fund)}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-semibold hover:border-[var(--brown)] hover:text-[var(--brown)] transition-colors cursor-pointer whitespace-nowrap"
          >
            View Checklist & Rules
          </button>

          <a
            href={fund.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[var(--brown)] text-white font-semibold hover:bg-[var(--brown-hover)] active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>Apply Official</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};

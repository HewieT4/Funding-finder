/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  FileText,
  Printer,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { ApplicationTrackingStatus, Fund, SavedFundItem } from '../types';
import { downloadCalendarReminder } from '../services/storage';

interface SavedShortlistProps {
  savedItems: SavedFundItem[];
  funds: Fund[];
  onUpdateStatus: (fundId: string, status: ApplicationTrackingStatus) => void;
  onUpdateNotes: (fundId: string, notes: string) => void;
  onRemove: (fundId: string) => void;
  onViewDetails: (fund: Fund) => void;
  onNavigateToFinder: () => void;
  onOpenWaitingListTicket: (fund: Fund) => void;
}

export const SavedShortlist: React.FC<SavedShortlistProps> = ({
  savedItems,
  funds,
  onUpdateStatus,
  onUpdateNotes,
  onRemove,
  onViewDetails,
  onNavigateToFinder,
  onOpenWaitingListTicket,
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const savedFundsWithMeta = savedItems.map(item => {
    const fund = funds.find(f => f.id === item.fundId);
    return { item, fund };
  }).filter((x): x is { item: SavedFundItem; fund: Fund } => x.fund !== undefined);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: ApplicationTrackingStatus) => {
    switch (status) {
      case 'accepted':
        return { label: 'Awarded / Accepted', color: 'text-[var(--sage)] font-bold' };
      case 'applied':
        return { label: 'Application Submitted', color: 'text-[var(--blue)] font-bold' };
      case 'interview':
        return { label: 'Interview / Assessment', color: 'text-[var(--gold)] font-bold' };
      case 'docs_ready':
        return { label: 'Documents Certified & Ready', color: 'text-[var(--brown)] font-medium' };
      case 'saved':
      default:
        return { label: 'Saved (Not Started)', color: 'text-[var(--mute)]' };
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)] mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brown)] uppercase tracking-wider font-display mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Application Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)]">
            Saved Bursary Shortlist
          </h1>
          <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
            Track your document preparation, submission dates, and application status in one private place.
          </p>
        </div>

        {savedFundsWithMeta.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--panel-hover)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedFundsWithMeta.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--panel)]">
          <Bookmark className="w-10 h-10 text-[var(--mute)] mx-auto mb-3 opacity-60" />
          <h2 className="text-lg font-bold font-display text-[var(--ink)] mb-2">
            Your funding shortlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mute)] max-w-md mx-auto mb-6">
            Bookmark bursaries and scholarships you qualify for to track closing dates and document checklists before deadlines pass.
          </p>
          <button
            onClick={onNavigateToFinder}
            className="px-5 py-2.5 rounded-xl bg-[var(--brown)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--brown-hover)] transition-colors cursor-pointer"
          >
            Find Bursaries to Save
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {savedFundsWithMeta.map(({ item, fund }) => {
            const statusInfo = getStatusBadge(item.status);
            const closeDate = new Date(fund.closeDate);
            const diffDays = Math.ceil((closeDate.getTime() - new Date('2026-10-01').getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={fund.id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 transition-all shadow-[var(--card-shadow)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--mute)] mb-1 flex-wrap">
                      <span className="font-semibold text-[var(--ink)]">{fund.provider}</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified {fund.lastVerifiedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className={statusInfo.color}>{statusInfo.label}</span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-[var(--ink)]">
                      {fund.name}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => downloadCalendarReminder(fund)}
                      title="Download deadline (.ics)"
                      className="p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemove(fund.id)}
                      title="Remove from shortlist"
                      className="p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-red-600 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Pipeline & Document Prep */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6">
                    <label htmlFor={`status-${fund.id}`} className="block text-xs font-semibold text-[var(--mute)] mb-1.5">
                      Application Stage
                    </label>
                    <select
                      id={`status-${fund.id}`}
                      value={item.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ApplicationTrackingStatus;
                        onUpdateStatus(fund.id, newStatus);
                        if (newStatus === 'applied') {
                          onOpenWaitingListTicket(fund);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs font-medium text-[var(--ink)] cursor-pointer"
                    >
                      <option value="saved">1. Saved (Not yet started)</option>
                      <option value="docs_ready">2. Documents Certified & Ready</option>
                      <option value="applied">3. Application Submitted on Portal (Waiting List)</option>
                      <option value="interview">4. Under Review / Interview Stage</option>
                      <option value="accepted">5. Awarded / Accepted</option>
                      <option value="declined">6. Declined / Not successful</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6 flex flex-col sm:items-end justify-center gap-1.5">
                    <div className="text-xs text-[var(--mute)]">
                      <span>Deadline: </span>
                      <strong className="text-[var(--ink)]">{fund.closeDate}</strong>
                      <span className="ml-2 font-semibold text-[var(--brown)] tabular-nums">
                        ({diffDays > 0 ? `${diffDays} days left` : 'Closed'})
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenWaitingListTicket(fund)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        item.status === 'applied'
                          ? 'bg-[var(--sage)] text-white border-[var(--sage)] shadow-xs'
                          : 'border-[var(--brown)] text-[var(--brown)] hover:bg-[var(--brown)] hover:text-white'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{item.status === 'applied' ? 'View Confirmed PDF' : 'Download Waiting List PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="pt-3 border-t border-[var(--line)]">
                  {editingNotesId === fund.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add application reference number, postal tracking, or submission notes..."
                        className="w-full p-2.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none"
                        rows={2}
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1 text-xs text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onUpdateNotes(fund.id, noteText);
                            setEditingNotesId(null);
                          }}
                          className="px-3.5 py-1.5 bg-[var(--brown)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--brown-hover)] cursor-pointer"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[var(--mute)]">
                      <p className="italic">
                        {item.notes ? `Note: "${item.notes}"` : 'No personal notes added yet.'}
                      </p>
                      <button
                        onClick={() => {
                          setEditingNotesId(fund.id);
                          setNoteText(item.notes || '');
                        }}
                        className="text-[var(--brown)] font-semibold hover:underline cursor-pointer ml-2 whitespace-nowrap"
                      >
                        {item.notes ? 'Edit Note' : '+ Add Note'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewDetails(fund)}
                    className="text-xs font-semibold text-[var(--ink)] hover:text-[var(--brown)] transition-colors cursor-pointer"
                  >
                    View Document Checklist & Criteria
                  </button>

                  <a
                    href={fund.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Go to Application Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

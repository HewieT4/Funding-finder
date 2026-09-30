/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Filter, Search, SlidersHorizontal, User, RotateCcw } from 'lucide-react';
import { Fund, LearnerProfile, MatchResult, MatchStatus, ProviderType } from '../types';
import { rankFunds, formatStudyLevel } from '../services/matchingEngine';
import { FundCard } from './FundCard';

interface ResultsListProps {
  funds: Fund[];
  profile: LearnerProfile;
  savedFundIds: string[];
  onToggleSave: (fund: Fund) => void;
  onViewDetails: (fund: Fund) => void;
  onAddToCalendar: (fund: Fund) => void;
  onEditProfile: () => void;
  lowDataMode: boolean;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  funds,
  profile,
  savedFundIds,
  onToggleSave,
  onViewDetails,
  onAddToCalendar,
  onEditProfile,
  lowDataMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const [providerTypeFilter, setProviderTypeFilter] = useState<'all' | ProviderType>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'urgent_or_soon'>('all');

  // Pure deterministic ranking
  const allRanked = useMemo(() => {
    return rankFunds(profile, funds);
  }, [profile, funds]);

  // Apply filters
  const filteredResults = useMemo(() => {
    return allRanked.filter((res) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = res.fund.name.toLowerCase().includes(q);
        const matchesProvider = res.fund.provider.toLowerCase().includes(q);
        const matchesSummary = res.fund.summary.toLowerCase().includes(q);
        const matchesFields = res.fund.eligibility.fieldsOfStudy.some(f => f.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesSummary && !matchesFields) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && res.status !== statusFilter) {
        return false;
      }

      // 3. Provider Type
      if (providerTypeFilter !== 'all' && res.fund.providerType !== providerTypeFilter) {
        return false;
      }

      // 4. Urgency
      if (urgencyFilter === 'urgent_or_soon') {
        if (res.urgency !== 'urgent' && res.urgency !== 'closing_soon') {
          return false;
        }
      }

      return true;
    });
  }, [allRanked, searchQuery, statusFilter, providerTypeFilter, urgencyFilter]);

  const likelyCount = allRanked.filter(r => r.status === 'likely_eligible').length;
  const closeCount = allRanked.filter(r => r.status === 'close_match').length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Overview Bar */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-[var(--brown)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                Current Learner Profile
              </span>
              <span aria-hidden="true" className="text-xs text-[var(--mute)]">·</span>
              <span className="text-xs font-semibold text-[var(--ink)] tabular-nums">
                {profile.academicAverage}% Average
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--mute)] mt-0.5">
              {formatStudyLevel(profile.level)} · {profile.fieldOfStudy} · {profile.province} · {profile.incomeBand === 'under_350k' ? '<R350k (NSFAS)' : profile.incomeBand === '350k_to_600k' ? 'R350k-R600k (Missing Middle)' : '>R600k (Merit)'}
            </p>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--brown)] transition-colors cursor-pointer self-start md:self-auto flex items-center gap-1.5 whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brown)]" />
          <span>Edit Profile / Marks</span>
        </button>
      </div>

      {/* Header and Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)]">
            Matched Funding Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
            Ranked by strict fit. Showing <span className="font-semibold text-[var(--ink)] tabular-nums">{filteredResults.length}</span> results ({likelyCount} likely eligible, {closeCount} close matches).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--mute)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bursary name, company, or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--mute)] focus:bg-[var(--bg)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--mute)] hover:text-[var(--ink)]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Provider type dropdown */}
          <select
            value={providerTypeFilter}
            onChange={(e) => setProviderTypeFilter(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs sm:text-sm text-[var(--ink)] font-medium cursor-pointer"
          >
            <option value="all">All Providers</option>
            <option value="government">Government & NSFAS</option>
            <option value="corporate">Corporate</option>
            <option value="foundation">Foundations</option>
            <option value="seta">SETAs</option>
          </select>

          {/* Urgency toggle */}
          <button
            onClick={() => setUrgencyFilter(prev => prev === 'all' ? 'urgent_or_soon' : 'all')}
            className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              urgencyFilter === 'urgent_or_soon'
                ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                : 'border-[var(--line)] bg-[var(--panel)] text-[var(--mute)] hover:text-[var(--ink)]'
            }`}
          >
            Closing Soon (≤ 28 days)
          </button>
        </div>

        {/* Status segmented tabs (permitted interactive control per design constitution) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--panel)] border border-[var(--line)] w-fit overflow-x-auto max-w-full">
          {(
            [
              { id: 'all', label: `All Funds (${allRanked.length})` },
              { id: 'likely_eligible', label: `Likely Eligible (${likelyCount})` },
              { id: 'close_match', label: `Close Matches (${closeCount})` },
              { id: 'not_eligible', label: `Other / Strict Rules (${allRanked.length - likelyCount - closeCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[var(--brown)] text-white font-semibold'
                  : 'text-[var(--mute)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--panel)]">
          <p className="text-lg font-bold font-display text-[var(--ink)] mb-2">
            No funding matches with your current filter criteria
          </p>
          <p className="text-xs sm:text-sm text-[var(--mute)] max-w-md mx-auto mb-6">
            Try resetting your filters or adjusting your average marks and province in your learner profile.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setProviderTypeFilter('all');
              setUrgencyFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResults.map((res) => (
            <FundCard
              key={res.fund.id}
              result={res}
              isSaved={savedFundIds.includes(res.fund.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
              onAddToCalendar={onAddToCalendar}
              lowDataMode={lowDataMode}
            />
          ))}
        </div>
      )}
    </section>
  );
};

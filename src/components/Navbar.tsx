/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Moon, Sun, Zap } from 'lucide-react';
import { GooeyNav } from './GooeyNav';

interface NavbarProps {
  currentView: 'home' | 'find' | 'results' | 'all' | 'checklist' | 'saved' | 'tests';
  onNavigate: (view: 'home' | 'find' | 'results' | 'all' | 'checklist' | 'saved' | 'tests') => void;
  savedCount: number;
  lowDataMode: boolean;
  onToggleLowData: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedCount,
  lowDataMode,
  onToggleLowData,
  darkMode,
  onToggleDarkMode,
}) => {
  // Determine active index for GooeyNav
  const getActiveIndex = (): number => {
    switch (currentView) {
      case 'find':
        return 0;
      case 'all':
      case 'results':
        return 1;
      case 'checklist':
        return 2;
      case 'saved':
        return 3;
      default:
        return 0;
    }
  };

  const navItems = [
    { label: 'Find Funding', onClick: () => onNavigate('find') },
    { label: 'All Bursaries', onClick: () => onNavigate('all') },
    { label: 'Documents Guide', onClick: () => onNavigate('checklist') },
    {
      label: savedCount > 0 ? `Shortlist (${savedCount})` : 'Shortlist',
      onClick: () => onNavigate('saved'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl sm:text-2xl font-bold tracking-tight font-display text-[var(--ink)] hover:opacity-90 transition-opacity text-left cursor-pointer whitespace-nowrap"
        >
          Bursary Finder
        </button>

        {/* Zone 2: GooeyNav on desktop/tablet, clean text links on lowDataMode */}
        {!lowDataMode ? (
          <div className="hidden lg:flex items-center bg-[#1F1813] text-white p-1 rounded-full shadow-inner border border-[#3E332A]">
            <GooeyNav
              items={navItems}
              initialActiveIndex={getActiveIndex()}
              animationTime={500}
              particleCount={14}
              particleDistances={[75, 10]}
              particleR={95}
              timeVariance={250}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[var(--mute)]">
            <button
              onClick={() => onNavigate('find')}
              className={`cursor-pointer transition-colors whitespace-nowrap ${
                currentView === 'find' ? 'text-[var(--ink)] font-semibold underline underline-offset-8 decoration-[var(--brown)] decoration-2' : 'hover:text-[var(--ink)]'
              }`}
            >
              Find Funding
            </button>
            <button
              onClick={() => onNavigate('all')}
              className={`cursor-pointer transition-colors whitespace-nowrap ${
                currentView === 'all' || currentView === 'results' ? 'text-[var(--ink)] font-semibold underline underline-offset-8 decoration-[var(--brown)] decoration-2' : 'hover:text-[var(--ink)]'
              }`}
            >
              All Bursaries
            </button>
            <button
              onClick={() => onNavigate('checklist')}
              className={`cursor-pointer transition-colors whitespace-nowrap ${
                currentView === 'checklist' ? 'text-[var(--ink)] font-semibold underline underline-offset-8 decoration-[var(--brown)] decoration-2' : 'hover:text-[var(--ink)]'
              }`}
            >
              Documents Guide
            </button>
            <button
              onClick={() => onNavigate('saved')}
              className={`cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'saved' ? 'text-[var(--ink)] font-semibold underline underline-offset-8 decoration-[var(--brown)] decoration-2' : 'hover:text-[var(--ink)]'
              }`}
            >
              <span>Shortlist</span>
              {savedCount > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded bg-[var(--panel)] text-[var(--ink)] border border-[var(--line)] tabular-nums font-semibold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Low-Data Mode Toggle */}
          <button
            onClick={onToggleLowData}
            title={lowDataMode ? 'Disable low-data mode' : 'Enable low-data mode (saves mobile bandwidth)'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors whitespace-nowrap ${
              lowDataMode
                ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                : 'bg-[var(--panel)] text-[var(--mute)] border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lowDataMode ? 'Low Data: ON' : 'Data Saver'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle theme"
            className="p-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--mute)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('find')}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[var(--brown)] text-white hover:bg-[var(--brown-hover)] active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Find My Match
          </button>
        </div>
      </div>

      {/* Mobile sub-bar for direct navigation */}
      <div className="lg:hidden flex items-center justify-around border-t border-[var(--line)] px-2 py-2 text-xs font-medium bg-[var(--panel)] text-[var(--mute)]">
        <button
          onClick={() => onNavigate('find')}
          className={`px-2 py-1 rounded cursor-pointer ${currentView === 'find' ? 'text-[var(--ink)] font-bold' : ''}`}
        >
          Finder
        </button>
        <button
          onClick={() => onNavigate('all')}
          className={`px-2 py-1 rounded cursor-pointer ${currentView === 'all' || currentView === 'results' ? 'text-[var(--ink)] font-bold' : ''}`}
        >
          Bursaries
        </button>
        <button
          onClick={() => onNavigate('checklist')}
          className={`px-2 py-1 rounded cursor-pointer ${currentView === 'checklist' ? 'text-[var(--ink)] font-bold' : ''}`}
        >
          Docs Guide
        </button>
        <button
          onClick={() => onNavigate('saved')}
          className={`px-2 py-1 rounded cursor-pointer flex items-center gap-1 ${currentView === 'saved' ? 'text-[var(--ink)] font-bold' : ''}`}
        >
          <Bookmark className="w-3 h-3" />
          <span>Shortlist {savedCount > 0 ? `(${savedCount})` : ''}</span>
        </button>
      </div>
    </header>
  );
};

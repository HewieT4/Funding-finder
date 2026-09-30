/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bookmark,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Ticket,
  X,
  Zap,
} from 'lucide-react';
import { GooeyNav } from './GooeyNav';

interface NavbarProps {
  currentView: 'home' | 'find' | 'results' | 'all' | 'checklist' | 'saved' | 'tests';
  onNavigate: (view: 'home' | 'find' | 'results' | 'all' | 'checklist' | 'saved' | 'tests') => void;
  savedCount: number;
  appliedCount: number;
  lowDataMode: boolean;
  onToggleLowData: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTicketsModal: () => void;
  onOpenLegalTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedCount,
  appliedCount,
  lowDataMode,
  onToggleLowData,
  darkMode,
  onToggleDarkMode,
  onOpenTicketsModal,
  onOpenLegalTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileNav = (view: any) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Bar - Clean oat/sand styling, NO black shading under menu */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-md transition-colors shadow-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-lg sm:text-2xl font-bold tracking-tight font-display text-[var(--ink)] hover:opacity-90 transition-opacity text-left cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-[var(--brown)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                SA
              </div>
              <span>Bursary Finder</span>
            </button>
          </div>

          {/* Desktop/Tablet Nav: Clean warm panel border, ZERO black box or dark shading */}
          <div className="hidden lg:flex items-center bg-[var(--panel)] p-1 rounded-full border border-[var(--line)] shadow-none">
            <GooeyNav
              items={navItems}
              initialActiveIndex={getActiveIndex()}
              animationTime={450}
              particleCount={10}
              particleDistances={[65, 8]}
              particleR={80}
              timeVariance={200}
              colors={[1, 2, 3, 4]}
            />
          </div>

          {/* Quick Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Waiting list PDF confirmation slips trigger button */}
            <button
              onClick={onOpenTicketsModal}
              title="View your Waiting List PDF Confirmation Slips"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:border-[var(--brown)] text-xs font-semibold cursor-pointer transition-colors"
              aria-label="View Waiting List PDF Slips"
            >
              <FileCheck className="w-3.5 h-3.5 text-[var(--brown)]" />
              <span className="hidden md:inline">PDF Slips</span>
              {appliedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[var(--brown)] text-white text-[10px] tabular-nums font-bold">
                  {appliedCount}
                </span>
              )}
            </button>

            {/* Low-Data Mode Toggle */}
            <button
              onClick={onToggleLowData}
              title={lowDataMode ? 'Disable low-data mode' : 'Enable low-data mode (saves mobile data)'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-colors whitespace-nowrap ${
                lowDataMode
                  ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                  : 'bg-[var(--panel)] text-[var(--mute)] border-[var(--line)] hover:text-[var(--ink)]'
              }`}
              aria-pressed={lowDataMode}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lowDataMode ? 'Low Data: ON' : 'Data Saver'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title="Toggle theme"
              className="p-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--mute)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button (Desktop) */}
            <button
              onClick={() => onNavigate('find')}
              className="hidden sm:block px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[var(--brown)] text-white hover:bg-[var(--brown-hover)] active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Find My Match
            </button>

            {/* Mobile Hamburger Drawer Toggle (Mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Slide-Out Drawer (Mobile Phones) - No harsh black shading */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 z-50 bg-[var(--ink)]/35 backdrop-blur-xs flex flex-col justify-end sm:justify-start"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-[var(--panel)] border-b border-[var(--line)] p-5 sm:p-6 space-y-4 rounded-t-3xl sm:rounded-none max-h-[90vh] overflow-y-auto shadow-none">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="text-sm font-bold font-display text-[var(--ink)] block">
                  Bursary Finder SA
                </span>
                <span className="text-xs text-[var(--mute)]">
                  Mobile Menu &amp; Quick Access
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--ink)] cursor-pointer"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Touch Navigation List (minimum 44px touch targets) */}
            <nav className="space-y-1.5 text-sm font-medium">
              <button
                onClick={() => handleMobileNav('home')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-[var(--brown)] text-white font-semibold'
                    : 'text-[var(--ink)] bg-[var(--bg)]/70 hover:bg-[var(--bg)] border border-[var(--line)]'
                }`}
              >
                <span>Home &amp; Quick Matcher</span>
                <Compass className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileNav('find')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  currentView === 'find'
                    ? 'bg-[var(--brown)] text-white font-semibold'
                    : 'text-[var(--ink)] bg-[var(--bg)]/70 hover:bg-[var(--bg)] border border-[var(--line)]'
                }`}
              >
                <span>Conversational Funding Finder (3 min)</span>
                <GraduationCap className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileNav('all')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  currentView === 'all' || currentView === 'results'
                    ? 'bg-[var(--brown)] text-white font-semibold'
                    : 'text-[var(--ink)] bg-[var(--bg)]/70 hover:bg-[var(--bg)] border border-[var(--line)]'
                }`}
              >
                <span>Directory of 15+ Verified Bursaries</span>
                <FileText className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileNav('checklist')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  currentView === 'checklist'
                    ? 'bg-[var(--brown)] text-white font-semibold'
                    : 'text-[var(--ink)] bg-[var(--bg)]/70 hover:bg-[var(--bg)] border border-[var(--line)]'
                }`}
              >
                <span>Documents &amp; SAPS Certification Guide</span>
                <FileText className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileNav('saved')}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  currentView === 'saved'
                    ? 'bg-[var(--brown)] text-white font-semibold'
                    : 'text-[var(--ink)] bg-[var(--bg)]/70 hover:bg-[var(--bg)] border border-[var(--line)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Saved Shortlist</span>
                  {savedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] text-xs font-bold">
                      {savedCount}
                    </span>
                  )}
                </div>
                <Bookmark className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTicketsModal();
                }}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-[var(--brown)] font-bold bg-[var(--bg)] border border-[var(--brown)] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span>Waiting List Confirmation Tickets</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)]">
                  {appliedCount} Active
                </span>
              </button>
            </nav>

            {/* Quick Controls on Mobile */}
            <div className="pt-3 border-t border-[var(--line)] grid grid-cols-2 gap-2">
              <button
                onClick={onToggleLowData}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  lowDataMode
                    ? 'bg-[var(--brown)] text-white border-[var(--brown)]'
                    : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{lowDataMode ? 'Low Data: ON' : 'Data Saver'}</span>
              </button>

              <button
                onClick={onToggleDarkMode}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

            {/* Legal & Data Minimization Links */}
            <div className="pt-3 border-t border-[var(--line)] text-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--mute)]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLegalTab('privacy');
                  }}
                  className="hover:underline cursor-pointer py-1"
                >
                  POPIA Privacy Policy
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLegalTab('data_deletion');
                  }}
                  className="text-red-600 hover:underline cursor-pointer py-1"
                >
                  Erase My Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Ergonomic Bottom Navigation Bar for Mobile Phones (Touch Target >= 44px) - Clean, Zero Black Shading */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--panel)]/98 backdrop-blur-md border-t border-[var(--line)] px-2 py-1.5 flex items-center justify-around shadow-none"
      >
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[var(--brown)] font-bold' : 'text-[var(--mute)]'
          }`}
          aria-label="Home"
          aria-current={currentView === 'home' ? 'page' : undefined}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('find')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentView === 'find' ? 'text-[var(--brown)] font-bold' : 'text-[var(--mute)]'
          }`}
          aria-label="Finder flow"
          aria-current={currentView === 'find' ? 'page' : undefined}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Finder</span>
        </button>

        <button
          onClick={() => onNavigate('all')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentView === 'all' || currentView === 'results' ? 'text-[var(--brown)] font-bold' : 'text-[var(--mute)]'
          }`}
          aria-label="All bursaries"
          aria-current={currentView === 'all' || currentView === 'results' ? 'page' : undefined}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Bursaries</span>
        </button>

        <button
          onClick={() => onNavigate('saved')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentView === 'saved' ? 'text-[var(--brown)] font-bold' : 'text-[var(--mute)]'
          }`}
          aria-label={`Saved shortlist, ${savedCount} items`}
          aria-current={currentView === 'saved' ? 'page' : undefined}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[var(--brown)] text-white text-[9px] flex items-center justify-center font-bold">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenTicketsModal}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors cursor-pointer text-[var(--mute)] hover:text-[var(--ink)]"
          aria-label="Waiting list confirmation PDF slips"
        >
          <FileCheck className="w-5 h-5 mb-0.5 text-[var(--brown)]" />
          <span className="text-[10px] font-medium">PDF Slips</span>
        </button>
      </nav>
    </>
  );
};

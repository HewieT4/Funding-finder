/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_FUNDS } from './data/funds';
import { Fund, LearnerProfile, SavedFundItem, ApplicationTrackingStatus } from './types';
import {
  DEFAULT_PROFILE,
  loadDarkMode,
  loadLowDataMode,
  loadSavedFunds,
  loadSavedProfile,
  saveFundsToStorage,
  saveProfile,
  setDarkModeStorage,
  setLowDataModeStorage,
  downloadCalendarReminder,
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ConversationalFinder } from './components/ConversationalFinder';
import { ResultsList } from './components/ResultsList';
import { FundDetailModal } from './components/FundDetailModal';
import { SavedShortlist } from './components/SavedShortlist';
import { DocumentGuide } from './components/DocumentGuide';
import { LegalCenterModal, LegalTab } from './components/LegalCenterModal';
import { SubmitFundModal } from './components/SubmitFundModal';
import { TestRunnerView } from './components/TestRunnerView';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Footer } from './components/Footer';

export default function App() {
  const [funds, setFunds] = useState<Fund[]>(INITIAL_FUNDS);
  const [profile, setProfile] = useState<LearnerProfile>(loadSavedProfile);
  const [savedItems, setSavedItems] = useState<SavedFundItem[]>(loadSavedFunds);
  const [currentView, setCurrentView] = useState<'home' | 'find' | 'results' | 'all' | 'checklist' | 'saved' | 'tests'>('home');

  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>('privacy');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [lowDataMode, setLowDataMode] = useState<boolean>(loadLowDataMode);
  const [darkMode, setDarkMode] = useState<boolean>(loadDarkMode);

  // Apply dark mode & low data mode classes to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setDarkModeStorage(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (lowDataMode) {
      root.classList.add('low-data');
    } else {
      root.classList.remove('low-data');
    }
    setLowDataModeStorage(lowDataMode);
  }, [lowDataMode]);

  // Persist profile
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Persist saved funds
  useEffect(() => {
    saveFundsToStorage(savedItems);
  }, [savedItems]);

  const handleToggleSave = (fund: Fund) => {
    setSavedItems((prev) => {
      const exists = prev.some((item) => item.fundId === fund.id);
      if (exists) {
        return prev.filter((item) => item.fundId !== fund.id);
      } else {
        return [
          ...prev,
          {
            fundId: fund.id,
            savedAt: new Date().toISOString().split('T')[0],
            status: 'saved',
            notes: '',
            preparedDocuments: [],
          },
        ];
      }
    });
  };

  const handleUpdateSavedStatus = (fundId: string, status: ApplicationTrackingStatus) => {
    setSavedItems((prev) =>
      prev.map((item) => (item.fundId === fundId ? { ...item, status } : item))
    );
  };

  const handleUpdateSavedNotes = (fundId: string, notes: string) => {
    setSavedItems((prev) =>
      prev.map((item) => (item.fundId === fundId ? { ...item, notes } : item))
    );
  };

  const handleRemoveSaved = (fundId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.fundId !== fundId));
  };

  const handleToggleDocumentPrepared = (fundId: string, doc: string) => {
    setSavedItems((prev) => {
      const existing = prev.find((item) => item.fundId === fundId);
      if (!existing) {
        // Auto-save item with this doc prepared
        return [
          ...prev,
          {
            fundId,
            savedAt: new Date().toISOString().split('T')[0],
            status: 'docs_ready',
            notes: '',
            preparedDocuments: [doc],
          },
        ];
      }

      const hasDoc = existing.preparedDocuments.includes(doc);
      const nextDocs = hasDoc
        ? existing.preparedDocuments.filter((d) => d !== doc)
        : [...existing.preparedDocuments, doc];

      return prev.map((item) =>
        item.fundId === fundId ? { ...item, preparedDocuments: nextDocs } : item
      );
    });
  };

  const handleViewDetails = (fund: Fund) => {
    setSelectedFund(fund);
    setIsDetailModalOpen(true);
  };

  const handleAddToCalendar = (fund: Fund) => {
    downloadCalendarReminder(fund);
  };

  const handleAddCommunityFund = (newFund: Fund) => {
    setFunds((prev) => [newFund, ...prev]);
  };

  const handleOpenLegalTab = (tab: LegalTab) => {
    setActiveLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleClearAllData = () => {
    try {
      localStorage.clear();
    } catch {}
    setProfile(DEFAULT_PROFILE);
    setSavedItems([]);
  };

  // Find saved item for modal
  const selectedSavedItem = selectedFund
    ? savedItems.find((item) => item.fundId === selectedFund.id)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-3 focus:bg-[var(--panel)] focus:z-50 focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Top Bar Contract Compliant Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        savedCount={savedItems.length}
        lowDataMode={lowDataMode}
        onToggleLowData={() => setLowDataMode((prev) => !prev)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              funds={funds}
              initialProfile={profile}
              onStartFullFinder={(overrides) => {
                if (overrides) {
                  setProfile((prev) => ({ ...prev, ...overrides }));
                }
                setCurrentView('find');
              }}
              onQuickViewResults={(updatedProfile) => {
                setProfile(updatedProfile);
                setCurrentView('results');
              }}
              lowDataMode={lowDataMode}
            />

            {/* Quick Preview of Ranked Matches */}
            <ResultsList
              funds={funds}
              profile={profile}
              savedFundIds={savedItems.map((i) => i.fundId)}
              onToggleSave={handleToggleSave}
              onViewDetails={handleViewDetails}
              onAddToCalendar={handleAddToCalendar}
              onEditProfile={() => setCurrentView('find')}
              lowDataMode={lowDataMode}
            />
          </>
        )}

        {currentView === 'find' && (
          <ConversationalFinder
            initialProfile={profile}
            funds={funds}
            onComplete={(updatedProfile) => {
              setProfile(updatedProfile);
              setCurrentView('results');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {(currentView === 'results' || currentView === 'all') && (
          <ResultsList
            funds={funds}
            profile={profile}
            savedFundIds={savedItems.map((i) => i.fundId)}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onAddToCalendar={handleAddToCalendar}
            onEditProfile={() => setCurrentView('find')}
            lowDataMode={lowDataMode}
          />
        )}

        {currentView === 'checklist' && <DocumentGuide />}

        {currentView === 'saved' && (
          <SavedShortlist
            savedItems={savedItems}
            funds={funds}
            onUpdateStatus={handleUpdateSavedStatus}
            onUpdateNotes={handleUpdateSavedNotes}
            onRemove={handleRemoveSaved}
            onViewDetails={handleViewDetails}
            onNavigateToFinder={() => setCurrentView('find')}
          />
        )}

        {currentView === 'tests' && <TestRunnerView />}
      </main>

      {/* Fund Detail Modal */}
      <FundDetailModal
        fund={selectedFund}
        profile={profile}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFund(null);
        }}
        isSaved={selectedFund ? savedItems.some((i) => i.fundId === selectedFund.id) : false}
        onToggleSave={handleToggleSave}
        preparedDocuments={selectedSavedItem ? selectedSavedItem.preparedDocuments : []}
        onToggleDocumentPrepared={handleToggleDocumentPrepared}
      />

      {/* Comprehensive Legal & Compliance Center Modal */}
      <LegalCenterModal
        isOpen={isLegalModalOpen}
        initialTab={activeLegalTab}
        onClose={() => setIsLegalModalOpen(false)}
        onClearAllData={handleClearAllData}
      />

      {/* Bursary Contribution & Verification Modal */}
      <SubmitFundModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onAddFund={handleAddCommunityFund}
      />

      {/* Non-intrusive Cookie & Local Storage Consent Banner */}
      <CookieConsentBanner
        onOpenPolicy={() => handleOpenLegalTab('cookies')}
      />

      {/* Footer */}
      <Footer
        onOpenLegalTab={handleOpenLegalTab}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenTests={() => setCurrentView('tests')}
        onNavigate={setCurrentView}
      />
    </div>
  );
}

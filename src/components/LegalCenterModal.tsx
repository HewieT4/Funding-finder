/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Cookie,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';

export type LegalTab =
  | 'privacy'
  | 'terms'
  | 'refunds'
  | 'cookies'
  | 'age_consent'
  | 'licenses'
  | 'business_details'
  | 'data_deletion';

interface LegalCenterModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  onClearAllData: () => void;
}

export const LegalCenterModal: React.FC<LegalCenterModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleEraseData = () => {
    if (window.confirm('Confirm Data Erasure: This will immediately delete all stored marks, saved bursaries, application notes, and preferences from this device. Proceed?')) {
      onClearAllData();
      setDeletionConfirmed(true);
      setTimeout(() => {
        setDeletionConfirmed(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-center-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl rounded-3xl border border-[var(--line)] bg-[var(--panel)] shadow-2xl my-6 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--line)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--brown)]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-center-title" className="text-xl sm:text-2xl font-bold font-display text-[var(--ink)]">
                Legal, Privacy & Compliance Center
              </h2>
              <p className="text-xs text-[var(--mute)]">
                Republic of South Africa · POPIA, PAIA & CPA Aligned
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            aria-label="Close legal center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Single-line controls per design constitution) */}
        <div className="flex items-center gap-1.5 p-2 px-5 border-b border-[var(--line)] bg-[var(--bg)] overflow-x-auto text-xs shrink-0">
          {(
            [
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'terms', label: 'Terms of Service' },
              { id: 'refunds', label: 'No Fees / Refund Policy' },
              { id: 'cookies', label: 'Cookie & Storage' },
              { id: 'age_consent', label: 'Minors & Age Consent' },
              { id: 'data_deletion', label: 'Data Deletion' },
              { id: 'business_details', label: 'Business Details' },
              { id: 'licenses', label: 'Licenses & Fonts' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LegalTab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--brown)] text-white font-semibold'
                  : 'text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--panel)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  POPIA Compliance Notice
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Protection of Personal Information Act (POPIA) Privacy Policy
                </h3>
                <p className="text-xs text-[var(--mute)] mt-1">Last updated & verified: 30 September 2026</p>
              </div>

              <p>
                Bursary Finder SA operates as a non-commercial, public-benefit civic technology service. We are committed to safeguarding the privacy and constitutional rights to personal privacy of young South African students under the Protection of Personal Information Act, 2013 (Act No. 4 of 2013) (&ldquo;POPIA&rdquo;) and general international privacy standards (GDPR).
              </p>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  1. Data Minimization &amp; What We Process
                </strong>
                <p>
                  We adhere strictly to the principle of <strong>Zero Unnecessary Data</strong>. We do NOT ask for, require, or record:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Your 13-digit South African National ID Number.</li>
                  <li>Your home street address or physical geolocation.</li>
                  <li>Your phone number, banking accounts, or credit card details.</li>
                  <li>Official passwords or identity documents.</li>
                </ul>
                <p className="pt-1">
                  The only data inputs entered during the Bursary Finder matching questionnaire (province, academic average marks, study field, broad income bracket, and disability status) are processed <strong>entirely inside your own device browser (&ldquo;Client-Side Only&rdquo;)</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  2. Third-Party Trackers &amp; SDK Audit
                </strong>
                <p>
                  Bursary Finder SA has been audited to contain <strong>zero third-party behavioral analytics SDKs, zero Facebook/Meta tracking pixels, zero Google Ads pixels, and zero data-broker scripts</strong>. Your academic and financial eligibility queries are never monetized, brokered, or used to build commercial marketing profiles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  3. Email &amp; Marketing Policy
                </strong>
                <p>
                  We do not operate unsolicited marketing email lists or newsletters. You will never receive spam marketing or commercial loan offers from using this website. All exported calendar reminders (.ics files) are saved directly onto your device without server transmission.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  4. Data Subject Rights (Section 23 &amp; 24 of POPIA)
                </strong>
                <p>
                  As a data subject, you hold statutory rights under POPIA to confirm whether we hold your information, request correction of inaccurate records, and demand complete destruction or deletion of your personal data. Because our application is client-side only, you can exercise your Right to Erasure instantly using the <em>Data Deletion</em> tab in this modal.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Usage Agreement
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Terms of Service &amp; Educational Disclaimer
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  1. Public Benefit Informational Tool
                </strong>
                <p>
                  Bursary Finder SA is an independent, non-governmental directory and matching engine built to assist South African learners in identifying potential funding avenues. We do NOT represent, speak for, or act as an agent of the Department of Higher Education and Training (DHET), the National Student Financial Aid Scheme (NSFAS), or any corporate bursary sponsor.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  2. Removal of Unsupported Claims / No Funding Guarantee
                </strong>
                <p>
                  We make <strong>no claim or guarantee</strong> that using this website will result in a bursary, scholarship, or loan award. The term &ldquo;Likely eligible&rdquo; signifies solely that your self-reported profile aligns with the publicly advertised criteria published by the funding provider. All bursary allocations, shortlisting, and final awards remain at the sole and unfettered discretion of the respective provider.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  3. Verification of Deadlines &amp; Criteria
                </strong>
                <p>
                  While our editorial team conducts regular verification against official portals, bursary providers may modify closing dates, quotas, or subject requirements without prior notice. Learners must always verify final closing deadlines directly on the verified official link provided.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND POLICY & HIDDEN FEES */}
          {activeTab === 'refunds' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Zero Fees &amp; Consumer Protection
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Zero Hidden Fees, No Billing &amp; Refund Policy
                </h3>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--sage)]/40 bg-[var(--bg)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--sage)] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Free Public Benefit Initiative</span>
                </div>
                <p>
                  Bursary Finder SA is <strong>completely free of charge</strong> for all South African learners, teachers, and parents.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>There are NO registration fees.</li>
                  <li>There are NO monthly subscriptions or &ldquo;premium match&rdquo; paywalls.</li>
                  <li>There are NO hidden credit card authorizations or SMS billing deductions.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  Refund Policy Statement
                </strong>
                <p>
                  Because Bursary Finder SA does not charge, collect, or accept any money or payments whatsoever, <strong>no refunds are requested or applicable</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 space-y-2 text-red-900 dark:text-red-200">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Critical Warning Against Bursary Scammers</span>
                </div>
                <p className="text-xs">
                  Legitimate bursaries in South Africa (including NSFAS, Sasol, Allan Gray, ISFAP, and SETAs) <strong>NEVER charge an application fee</strong>. Anyone who asks you to pay money via e-Wallet, CashSend, or airtime vouchers to &ldquo;secure a bursary&rdquo; or &ldquo;jump the queue&rdquo; is committing fraud. Report bursary scams immediately to the SAPS Crime Stop hotline on <strong>08600 10111</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: COOKIE & STORAGE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Technical Storage Disclosure
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Cookie &amp; Local Storage Technical Policy
                </h3>
              </div>

              <p>
                Unlike standard commercial websites that deposit cross-site advertising cookies to track you across the internet, Bursary Finder SA uses <strong>zero third-party tracking cookies</strong>. We use the browser&apos;s standard <code>localStorage</code> API solely to preserve your session state on your device.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border border-[var(--line)] rounded-xl overflow-hidden text-xs">
                  <thead className="bg-[var(--bg)] text-[var(--ink)] font-semibold border-b border-[var(--line)]">
                    <tr>
                      <th className="p-3">Storage Key</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Lifespan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    <tr>
                      <td className="p-3 font-mono">bursary_finder_profile_v1</td>
                      <td className="p-3">Stores your selected province, marks, and field of study so you do not have to re-enter them on reload.</td>
                      <td className="p-3">Essential / Functional</td>
                      <td className="p-3">Persistent on device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">bursary_finder_saved_funds_v1</td>
                      <td className="p-3">Stores your bookmarked bursaries, application status, and document checklist checkmarks.</td>
                      <td className="p-3">Essential / Functional</td>
                      <td className="p-3">Persistent on device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">bursary_finder_low_data_v1</td>
                      <td className="p-3">Remembers if you enabled Low-Data Saver mode to preserve mobile bandwidth.</td>
                      <td className="p-3">Preference</td>
                      <td className="p-3">Persistent on device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">bursary_finder_dark_mode_v1</td>
                      <td className="p-3">Remembers your dark or light theme interface preference.</td>
                      <td className="p-3">Preference</td>
                      <td className="p-3">Persistent on device</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">bursary_finder_cookie_consent_v1</td>
                      <td className="p-3">Records that you acknowledged the local storage and zero-tracker disclosure.</td>
                      <td className="p-3">Consent</td>
                      <td className="p-3">Persistent on device</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AGE CONSENT & MINORS DATA */}
          {activeTab === 'age_consent' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Protection of Children
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Age Consent &amp; Minors Data Policy (POPIA Section 35)
                </h3>
              </div>

              <p>
                Section 35 of the Protection of Personal Information Act provides special protection for the personal information of children (persons under the age of 18 years).
              </p>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  Learners in Grade 11 and Grade 12 (Under 18 Years)
                </strong>
                <p>
                  Many prospective bursary seekers in South Africa are 16 or 17 years old. We protect minors by:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Requiring zero registration, zero accounts, and zero passwords.</li>
                  <li>Collecting zero contact information or personal identifiers.</li>
                  <li>Providing an explicit parental/guardian awareness checkpoint during the questionnaire.</li>
                  <li>Never serving commercial advertisements or targeted promotional material to minors.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  Parent &amp; Educator Advisory
                </strong>
                <p>
                  We encourage parents, guardians, and life orientation teachers to assist learners during the bursary research process, particularly when preparing certified legal affidavits and compiling parent financial records.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: DATA DELETION REQUEST */}
          {activeTab === 'data_deletion' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Self-Service Erasure
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Data Deletion &amp; Right to Erasure Request
                </h3>
              </div>

              <p>
                Under Section 24 of POPIA, you have the right to request the deletion or destruction of your personal information. Because Bursary Finder SA stores all information locally in your own browser cache, you do not need to wait 30 days for a database administrator to execute your request.
              </p>

              <div className="p-5 rounded-2xl bg-[var(--bg)] border border-red-300 dark:border-red-900/50 space-y-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                  <Trash2 className="w-4 h-4" />
                  <span>Immediate Self-Service Data Deletion</span>
                </div>
                <p className="text-xs">
                  Clicking the button below will immediately wipe all stored learner marks, shortlisted funds, document checkmarks, and preferences from this device.
                </p>

                <button
                  onClick={handleEraseData}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Erase All Stored Data From This Device Now</span>
                </button>

                {deletionConfirmed && (
                  <p className="text-xs text-[var(--sage)] font-semibold mt-2">
                    ✓ All local storage data has been successfully wiped.
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <strong className="text-[var(--ink)] block text-xs uppercase tracking-wider">
                  Formal POPIA Form 1 Erasure Request
                </strong>
                <p>
                  If you have communicated with our editorial support team via email and wish to request the deletion of any email correspondence under POPIA Regulation 3, submit a formal request to:
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink)]">
                  <Mail className="w-3.5 h-3.5 text-[var(--brown)]" />
                  <span>privacy@bursaryfindersa.org.za</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BUSINESS & ENTITY DETAILS */}
          {activeTab === 'business_details' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Statutory Identification
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Official Entity &amp; Business Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brown)] block">
                    Operating Initiative
                  </span>
                  <strong className="text-sm text-[var(--ink)] block">Bursary Finder SA</strong>
                  <span className="text-xs text-[var(--mute)]">A South African Civic Tech &amp; Youth Access Initiative</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brown)] block">
                    Jurisdiction &amp; Applicable Law
                  </span>
                  <strong className="text-sm text-[var(--ink)] block">Republic of South Africa</strong>
                  <span className="text-xs text-[var(--mute)]">High Court of South Africa (Gauteng Division)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brown)] block">
                    Physical Operating Location
                  </span>
                  <strong className="text-sm text-[var(--ink)] block">Sandton, Johannesburg</strong>
                  <span className="text-xs text-[var(--mute)]">Gauteng Province, 2196, South Africa</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brown)] block">
                    Designated Information Officer
                  </span>
                  <strong className="text-sm text-[var(--ink)] block">POPIA Regulatory Desk</strong>
                  <span className="text-xs text-[var(--mute)] font-mono">privacy@bursaryfindersa.org.za</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LICENSES & ATTRIBUTIONS */}
          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
                  Open Source &amp; Font Licensing
                </span>
                <h3 className="text-xl font-bold font-display text-[var(--ink)] mt-1">
                  Software Licenses, Fonts &amp; Asset Attributions
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1.5">
                  <strong className="text-xs font-bold text-[var(--ink)] block">
                    1. Typography: Bricolage Grotesque &amp; Figtree
                  </strong>
                  <p className="text-xs">
                    Licensed under the <strong>SIL Open Font License, Version 1.1 (OFL)</strong>. Available via Google Fonts. Designed by Mathieu Triay (Bricolage Grotesque) and Erik Kennedy (Figtree).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1.5">
                  <strong className="text-xs font-bold text-[var(--ink)] block">
                    2. User Interface Icons: Lucide Icons
                  </strong>
                  <p className="text-xs">
                    Licensed under the <strong>ISC License</strong>. Copyright &copy; Lucide Contributors.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1.5">
                  <strong className="text-xs font-bold text-[var(--ink)] block">
                    3. Application Codebase
                  </strong>
                  <p className="text-xs">
                    Licensed under the <strong>Apache License, Version 2.0</strong>. Open-source public benefit software.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-1.5">
                  <strong className="text-xs font-bold text-[var(--ink)] block">
                    4. Visual Media &amp; Campus Photography
                  </strong>
                  <p className="text-xs">
                    Visual assets depict authentic South African university campus educational collaboration, generated for educational illustration with zero exploitation of real student likenesses.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--line)] bg-[var(--bg)] flex items-center justify-between gap-4 shrink-0 text-xs">
          <span className="text-[var(--mute)]">
            Bursary Finder SA · Protecting South African learners online
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--brown)] text-white font-semibold hover:bg-[var(--brown-hover)] cursor-pointer transition-colors"
          >
            Close Legal Center
          </button>
        </div>

      </div>
    </div>
  );
};

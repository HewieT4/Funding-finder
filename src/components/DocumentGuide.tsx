/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  FileCheck,
  FileText,
  HelpCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const DocumentGuide: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const sampleMotivationLetter = `[Your Full Name]
[Your ID Number]
[Your Residential Address & Province]
[Your Contact Number & Email]
[Date]

The Bursary Selection Committee
[Name of Bursary / Provider]

RE: APPLICATION FOR BURSARY FUNDING - [YOUR DEGREE PROGRAMME, e.g. BENG MECHANICAL ENGINEERING]

Dear Members of the Selection Committee,

I am writing to formally submit my application for the [Name of Bursary] for the upcoming academic year. I have completed my Grade 12 studies at [School Name] in [Town/Province] with an overall academic average of [X%], achieving [X%] in Mathematics and [X%] in Physical Science.

I have been provisionally accepted to study [Degree Name] at [University/College Name]. My passion for this field stems from [describe a concrete challenge in your community or country you want to solve, e.g. expanding renewable energy or strengthening local health systems].

Due to our household financial circumstances, where our combined family income is [Income Description / e.g. supported by a single parent earning R180,000 annually / supported by SASSA grants], paying university tuition and accommodation without financial aid is impossible for my family.

Despite these socioeconomic challenges, I have maintained strong discipline, serving as [mention any leadership, peer tutoring, or community role, e.g. mathematics tutor for Grade 10s].

Receiving this bursary would relieve the financial pressure on my family and enable me to focus entirely on academic excellence. I am fully committed to fulfilling all academic requirements and contributing meaningfully to South Africa upon graduation.

Thank you for reviewing my application and considering my potential.

Yours sincerely,

[Your Name]
[Your Cell Number]`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleMotivationLetter);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brown)] uppercase tracking-wider font-display mb-1">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Learner Survival Toolkit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)]">
          South African Bursary Document Guide
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
          Over 40% of bursary applicants are disqualified before review due to incomplete or uncertified paperwork. Follow these guidelines to ensure your application is valid.
        </p>
      </div>

      {/* Core Documents Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Document 1: South African ID */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--card-shadow)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-display text-[var(--ink)]">
              1. Certified ID Document / Smart Card
            </h3>
            <span className="text-xs text-[var(--sage)] font-semibold">Mandatory</span>
          </div>
          <p className="text-xs text-[var(--mute)] leading-relaxed">
            Must be a clear photocopy of your green barcoded South African ID book or both sides of your Smart ID Card, stamped by a Commissioner of Oaths.
          </p>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] space-y-1">
            <span className="font-semibold block text-[var(--brown)]">Important Rule:</span>
            <span>Certification stamps must be less than <strong>3 months old</strong> on the closing date. Get copies certified at your nearest SAPS station or Post Office for free.</span>
          </div>
        </div>

        {/* Document 2: Proof of Income */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--card-shadow)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-display text-[var(--ink)]">
              2. Proof of Household Income
            </h3>
            <span className="text-xs text-[var(--sage)] font-semibold">Mandatory</span>
          </div>
          <p className="text-xs text-[var(--mute)] leading-relaxed">
            Required by NSFAS, ISFAP, and need-based funds to verify your income band:
          </p>
          <ul className="text-xs text-[var(--mute)] space-y-1 list-disc list-inside">
            <li><strong>Employed parents/guardians:</strong> Latest 3 months payslips.</li>
            <li><strong>SASSA grant beneficiaries:</strong> Official SASSA letter / statement.</li>
            <li><strong>Unemployed or informal workers:</strong> Police affidavit signed at SAPS stating monthly income or unemployment status.</li>
            <li><strong>Deceased parent:</strong> Official certified death certificate.</li>
          </ul>
        </div>

        {/* Document 3: Academic Records */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--card-shadow)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-display text-[var(--ink)]">
              3. Academic Transcripts & Reports
            </h3>
            <span className="text-xs text-[var(--sage)] font-semibold">Mandatory</span>
          </div>
          <p className="text-xs text-[var(--mute)] leading-relaxed">
            High school applicants must submit certified copies of their Grade 11 final December report AND latest Grade 12 mid-year / preliminary trial results.
          </p>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] space-y-1">
            <span className="font-semibold block text-[var(--brown)]">University & TVET Students:</span>
            <span>Must provide full official university academic transcript printed on university letterhead, not unofficial student portal screenshots.</span>
          </div>
        </div>

        {/* Document 4: Proof of Acceptance */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--card-shadow)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-display text-[var(--ink)]">
              4. Proof of University / TVET Acceptance
            </h3>
            <span className="text-xs text-[var(--blue)] font-semibold">Required</span>
          </div>
          <p className="text-xs text-[var(--mute)] leading-relaxed">
            Provisional acceptance letter or firm offer letter from an accredited South African public tertiary institution showing student number and qualification code.
          </p>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--mute)]">
            If you have not received your offer yet, attach your university application confirmation receipt or acknowledgment letter.
          </div>
        </div>
      </div>

      {/* Free Motivation Letter Template */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--card-shadow)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brown)] font-display">
              Template
            </span>
            <h2 className="text-xl font-bold font-display text-[var(--ink)]">
              South African Bursary Motivation Letter Outline
            </h2>
            <p className="text-xs text-[var(--mute)] mt-0.5">
              Copy and adapt this formal letter for corporate and foundation bursary applications.
            </p>
          </div>

          <button
            onClick={handleCopyTemplate}
            className="px-4 py-2 rounded-xl bg-[var(--brown)] text-white text-xs font-semibold hover:bg-[var(--brown-hover)] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Letter Template'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-80">
          {sampleMotivationLetter}
        </pre>
      </div>

      {/* Police Station / SAPS Certification Tips */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] space-y-3">
        <h3 className="font-bold text-base font-display text-[var(--ink)] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--brown)]" />
          <span>How to Get Documents Certified for Free</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[var(--mute)] pt-1">
          <div>
            <strong className="block text-[var(--ink)] mb-1">1. Take originals & copies</strong>
            <span>Bring the original ID book / certificates AND clean clear photocopies. The police officer must inspect the original document.</span>
          </div>
          <div>
            <strong className="block text-[var(--ink)] mb-1">2. 100% Free at SAPS</strong>
            <span>Certification is free of charge at any South African Police Station, public post office, or magistrate court. Never pay for certification.</span>
          </div>
          <div>
            <strong className="block text-[var(--ink)] mb-1">3. Check the date stamp</strong>
            <span>Ensure the officer stamps and signs with the current date and writes "certified true copy of original".</span>
          </div>
        </div>
      </div>
    </section>
  );
};

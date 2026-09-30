/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Fund, LearnerProfile } from '../types';
import { formatStudyLevel } from './matchingEngine';

export interface TicketPDFOptions {
  fund: Fund;
  profile: LearnerProfile;
  refCode: string;
  issuedAt?: Date;
  statusLabel?: string;
}

/**
 * Creates a professional, official South African Bursary Application & Waiting List Confirmation PDF document.
 * Formatted as standard A4 with crisp typography, security borders, verification barcode representation,
 * applicant credentials, bursary criteria, certified document checklist, and POPIA compliance notice.
 */
export function createBursaryTicketPDF({
  fund,
  profile,
  refCode,
  issuedAt = new Date(),
  statusLabel = 'CONFIRMED ON WAITING LIST & APPLICATION QUEUE',
}: TicketPDFOptions): jsPDF {
  // A4 size: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Page Background & Border Frame
  doc.setFillColor(252, 250, 246); // Warm subtle oat
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer security border
  doc.setDrawColor(210, 195, 180);
  doc.setLineWidth(0.6);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

  // Inner hairline border
  doc.setDrawColor(228, 218, 206);
  doc.setLineWidth(0.2);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2) + 4);

  // 2. Header Banner
  doc.setFillColor(37, 28, 22); // #251C16 Deep African Earth Ink
  doc.roundedRect(margin, margin, contentWidth, 34, 3, 3, 'F');

  // Republic / System Badge
  doc.setFillColor(212, 163, 115); // Warm bronze/gold accent
  doc.roundedRect(margin + 4, margin + 4, 16, 16, 2, 2, 'F');
  doc.setTextColor(37, 28, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SA', margin + 12, margin + 14.5, { align: 'center' });

  // Organization Header
  doc.setTextColor(247, 240, 230);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('BURSARY FINDER SA', margin + 24, margin + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(212, 163, 115);
  doc.text('NATIONAL STUDENT FUNDING & BURSARY CONFIRMATION REGISTRY', margin + 24, margin + 16);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 191, 177);
  doc.text('Republic of South Africa · Free Education & Financial Aid Support', margin + 24, margin + 21);

  // Top Right Reference Number & Barcode lines
  const refBoxX = pageWidth - margin - 56;
  doc.setFillColor(52, 40, 32);
  doc.roundedRect(refBoxX, margin + 4, 52, 26, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(212, 163, 115);
  doc.text('OFFICIAL REFERENCE SLIP', refBoxX + 26, margin + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(refCode, refBoxX + 26, margin + 16, { align: 'center' });

  // Stylized Barcode lines
  doc.setDrawColor(212, 163, 115);
  const barY = margin + 19;
  const barHeight = 8;
  const barPattern = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1];
  let curBarX = refBoxX + 6;
  barPattern.forEach((w, i) => {
    doc.setLineWidth(w * 0.4);
    if (i % 2 === 0) {
      doc.line(curBarX, barY, curBarX, barY + barHeight);
    }
    curBarX += w * 0.7 + 0.6;
  });

  // 3. Document Title & Sub-header
  let y = margin + 41;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 210, 198);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(37, 28, 22);
  doc.text('OFFICIAL APPLICATION & WAITING LIST CONFIRMATION SLIP', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(115, 100, 85);
  const formattedDate = issuedAt.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Issued Date: ${formattedDate}  |  POPIA Registered  |  Single Applicant Record`, margin + 5, y + 10.5);

  // Status Badge on Right of Title
  doc.setFillColor(39, 103, 73); // Deep emerald / sage
  doc.roundedRect(pageWidth - margin - 48, y + 2.5, 44, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('✓ STATUS CONFIRMED', pageWidth - margin - 26, y + 7.5, { align: 'center' });

  // 4. Section: Bursary Opportunity Details
  y += 18;
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION A: BURSARY & SPONSOR OPPORTUNITY RECORD', margin + 3, y + 4.5);

  y += 9;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  // Bursary Name & Provider
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(37, 28, 22);
  doc.text(fund.name, margin + 4, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(150, 90, 40);
  doc.text(`Provider: ${fund.provider} (${fund.providerType.toUpperCase()})`, margin + 4, y + 13);

  // Summary
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 60, 50);
  const summaryLines = doc.splitTextToSize(fund.summary, contentWidth - 8);
  doc.text(summaryLines, margin + 4, y + 18);

  // Details grid in Section A
  const gridY = y + 27;
  doc.setDrawColor(235, 225, 215);
  doc.line(margin + 4, gridY - 2, pageWidth - margin - 4, gridY - 2);

  // Col 1: Closing Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('CLOSING DATE:', margin + 4, gridY + 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 40, 40);
  doc.text(fund.closeDate, margin + 4, gridY + 7);

  // Col 2: Funding Coverage
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('AWARD COVERAGE:', margin + 45, gridY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(37, 28, 22);
  const coverageList = Object.entries(fund.coverage)
    .filter(([k, v]) => v === true && k !== 'notes')
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
  const coverageText = coverageList.length > 0 ? coverageList.slice(0, 3).join(', ') : 'Tuition & Study Costs';
  doc.text(coverageText, margin + 45, gridY + 7);

  // Col 3: Portal Link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('OFFICIAL PORTAL:', margin + 95, gridY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 80, 160);
  const urlSnippet = fund.applyUrl.length > 45 ? fund.applyUrl.substring(0, 42) + '...' : fund.applyUrl;
  doc.text(urlSnippet, margin + 95, gridY + 7);

  // Col 4: Verified Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('RECORD AUDIT:', margin + 150, gridY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 50, 40);
  doc.text(`Verified ${fund.lastVerifiedAt}`, margin + 150, gridY + 7);

  // 5. Section: Applicant Information
  y += 46;
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION B: APPLICANT QUALIFYING CREDENTIALS (POPIA PROTECTED)', margin + 3, y + 4.5);

  y += 9;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  const incomeMap: Record<string, string> = {
    under_350k: 'Under R350,000 / year (NSFAS & SASSA Threshold)',
    '350k_to_600k': 'R350,001 to R600,000 / year (Missing Middle / ISFAP)',
    above_600k: 'Above R600,000 / year (Merit & Academic Awards)',
  };

  const appCol1 = margin + 4;
  const appCol2 = margin + 64;
  const appCol3 = margin + 124;

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('STUDY LEVEL / GRADE:', appCol1, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 28, 22);
  doc.text(formatStudyLevel(profile.level), appCol1, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('FIELD OF STUDY:', appCol2, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 28, 22);
  doc.text(profile.fieldOfStudy, appCol2, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('PROVINCE & CITIZENSHIP:', appCol3, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 28, 22);
  doc.text(`${profile.province} · ${profile.isSACitizen ? 'SA Citizen' : 'International'}`, appCol3, y + 11);

  // Divider
  doc.setDrawColor(240, 232, 224);
  doc.line(appCol1, y + 16, pageWidth - margin - 4, y + 16);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('ACADEMIC AVERAGE RECORD:', appCol1, y + 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(39, 103, 73);
  doc.text(`${profile.academicAverage}% Overall Average`, appCol1, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('KEY SUBJECT SCORES:', appCol2, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 28, 22);
  doc.text(`Maths: ${profile.mathAverage ?? 'N/A'}%  |  Science: ${profile.scienceAverage ?? 'N/A'}%`, appCol2, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 105, 90);
  doc.text('HOUSEHOLD INCOME BAND:', appCol3, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 28, 22);
  const incText = incomeMap[profile.incomeBand] || profile.incomeBand;
  doc.text(doc.splitTextToSize(incText, 52), appCol3, y + 26);

  // 6. Section: Certified Documents Checklist
  y += 38;
  doc.setFillColor(242, 236, 228);
  doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION C: MANDATORY CERTIFIED DOCUMENTS AUDIT & SUBMISSION CHECKLIST', margin + 3, y + 4.5);

  y += 9;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 54, 2, 2, 'FD');

  const checklistItems = [
    { title: 'Certified copy of South African ID Document or Smart Card', tip: 'Stamped by SAPS or Post Office within the last 3 months.' },
    { title: 'Latest Academic Results / Grade 11 final report or Matric Trial Certificate', tip: 'Certified stamp visible with official school seal.' },
    { title: 'Proof of Household Income (Pay-slips / Pension statement / SASSA grant letter)', tip: 'Affidavit from police station if guardian is unemployed or self-employed.' },
    { title: 'Proof of Tertiary Application or Provisional Admission Letter', tip: 'Required for university & TVET college students before fund disbursement.' },
    { title: 'Motivational Essay & Curriculum Vitae (CV)', tip: 'Highlighting community leadership, field interest, and financial background.' },
  ];

  let checkY = y + 5;
  checklistItems.forEach((item, index) => {
    // Checkbox square
    doc.setDrawColor(180, 160, 140);
    doc.setLineWidth(0.4);
    doc.rect(margin + 4, checkY, 3.8, 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 28, 22);
    doc.text(`${index + 1}. ${item.title}`, margin + 11, checkY + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 105, 90);
    doc.text(item.tip, margin + 11, checkY + 7);

    checkY += 10;
  });

  // 7. Section: Waiting List Queue Confirmation & Official Stamp
  y += 58;
  doc.setFillColor(240, 246, 242); // Soft emerald tint
  doc.setDrawColor(170, 205, 185);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  // Left side: Confirmation stamp graphic
  const stampX = margin + 6;
  const stampY = y + 4;
  doc.setDrawColor(39, 103, 73);
  doc.setLineWidth(0.8);
  doc.roundedRect(stampX, stampY, 46, 24, 2, 2);
  doc.setLineWidth(0.2);
  doc.roundedRect(stampX + 1, stampY + 1, 44, 22, 1, 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(39, 103, 73);
  doc.text('BURSARY FINDER SA', stampX + 23, stampY + 5.5, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text('OFFICIALLY LOGGED', stampX + 23, stampY + 11, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('WAITING LIST VERIFIED', stampX + 23, stampY + 15, { align: 'center' });
  doc.text(formattedDate, stampX + 23, stampY + 19, { align: 'center' });
  doc.text(refCode, stampX + 23, stampY + 22.5, { align: 'center' });

  // Right side text in confirmation box
  const confirmTextX = stampX + 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(25, 75, 50);
  doc.text(statusLabel, confirmTextX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 70, 60);
  const queueMsg = [
    `This official PDF confirmation slip records that the applicant has verified eligibility and completed preparations for ${fund.name}.`,
    `Keep this reference code (${refCode}) safe when following up with the bursary administrator or bursary committee.`,
    `This verification was generated by Bursary Finder SA on ${formattedDate} at ${issuedAt.toLocaleTimeString('en-ZA')}.`,
  ];
  let msgY = y + 13;
  queueMsg.forEach((line) => {
    doc.text(line, confirmTextX, msgY);
    msgY += 4.5;
  });

  // 8. Legal Disclaimer & Anti-Scam Notice (Footer of A4)
  y += 36;
  doc.setFillColor(255, 249, 235); // Warning pale gold
  doc.setDrawColor(230, 205, 150);
  doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 80, 10);
  doc.text('⚠️ CRITICAL SAFETY NOTICE FOR SOUTH AFRICAN LEARNERS & PARENTS:', margin + 4, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(110, 70, 20);
  const antiScamText =
    'All legitimate bursaries, corporate funding schemes, ISFAP, and NSFAS applications are 100% FREE. Never pay any recruitment fee, application fee, or buy airtime vouchers to anyone offering funding. If anyone asks for money to guarantee an award, report them immediately.';
  doc.text(doc.splitTextToSize(antiScamText, contentWidth - 8), margin + 4, y + 8.5);

  // Bottom Footer Microprint
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(150, 135, 120);
  doc.text(
    `Bursary Finder SA · POPIA Compliant · Personal data retained strictly in client browser cache · Ref: ${refCode} · Generated for offline verification`,
    pageWidth / 2,
    pageHeight - margin + 1,
    { align: 'center' }
  );

  return doc;
}

/**
 * Downloads the bursary ticket as an official PDF file directly to user device.
 */
export function downloadBursaryTicketPDF(options: TicketPDFOptions): void {
  const doc = createBursaryTicketPDF(options);
  const safeSlug = options.fund.slug.replace(/[^a-z0-9_-]/gi, '-');
  const filename = `waiting-list-confirmation-${safeSlug}-${options.refCode}.pdf`;
  doc.save(filename);
}

/**
 * Returns a data URI string for embedding or previewing inside an iframe or viewer.
 */
export function getBursaryTicketPDFDataUri(options: TicketPDFOptions): string {
  const doc = createBursaryTicketPDF(options);
  return doc.output('datauristring');
}

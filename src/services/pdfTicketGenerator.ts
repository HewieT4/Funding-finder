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
 * Draws a clean, crisp vector warning triangle icon directly with jsPDF geometry.
 * Completely eliminates emoji rendering bugs where '⚠️' turns into garbage characters like '&þ'.
 */
function drawVectorWarningIcon(doc: jsPDF, x: number, y: number, size = 4.2): void {
  // Amber triangle background
  doc.setFillColor(217, 119, 6); // amber-600
  doc.triangle(x + size / 2, y, x + size, y + size, x, y + size, 'F');

  // White exclamation mark (vertical line + dot)
  doc.setFillColor(255, 255, 255);
  doc.rect(x + size / 2 - 0.25, y + 1.2, 0.5, size * 0.42, 'F');
  doc.circle(x + size / 2, y + size - 0.8, 0.35, 'F');
}

/**
 * Draws a clean vector checkmark icon using jsPDF line paths.
 * Prevents unicode '✓' character corruption in standard PDF viewer font encodings.
 */
function drawVectorCheckIcon(doc: jsPDF, x: number, y: number, size = 3.5): void {
  doc.setDrawColor(44, 102, 65); // sage-green #2C6641
  doc.setLineWidth(0.5);
  doc.line(x, y + size * 0.55, x + size * 0.38, y + size * 0.9);
  doc.line(x + size * 0.38, y + size * 0.9, x + size, y + size * 0.2);
}

/**
 * Generates an A4 Funding Application Summary PDF document.
 * Adheres strictly to A4 print dimensions (12mm margins, 186mm printable width),
 * responsive word wrapping for long titles and URLs, zero emoji encoding artifacts,
 * sequential non-overlapping footer positioning, and accurate personal summary wording.
 */
export function createBursaryTicketPDF({
  fund,
  profile,
  refCode,
  issuedAt = new Date(),
  statusLabel = 'SHORTLISTED',
}: TicketPDFOptions): jsPDF {
  // Standard A4 dimensions in millimeters
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12; // 12mm margin as specified
  const contentWidth = pageWidth - margin * 2; // Exactly 186mm printable width

  const formattedDate = issuedAt.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 1. Page Background & Frame
  doc.setFillColor(254, 253, 250); // Soft oat background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer printable border frame (186mm width)
  doc.setDrawColor(218, 206, 192);
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  // 2. Header Banner (Deep African Earth Ink)
  let y = margin;
  const bannerHeight = 22;
  doc.setFillColor(37, 28, 22); // #251C16
  doc.rect(margin, y, contentWidth, bannerHeight, 'F');

  // App Monogram Icon
  doc.setFillColor(212, 163, 115); // Warm bronze #D4A373
  doc.roundedRect(margin + 4, y + 4, 14, 14, 2, 2, 'F');
  doc.setTextColor(37, 28, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('BF', margin + 11, y + 13, { align: 'center' });

  // Brand Titles
  doc.setTextColor(247, 240, 230);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('BURSARY FINDER SA', margin + 22, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(212, 163, 115);
  doc.text('STUDENT BURSARY & FINANCIAL AID APPLICATION SUMMARY', margin + 22, y + 15.5);

  doc.setFontSize(6.8);
  doc.setTextColor(190, 175, 160);
  doc.text('Independent Discovery & Application Preparation Helper · 100% Free Service', margin + 22, y + 19.5);

  // Top Right Reference Box (Personal Tracking Only)
  const refBoxWidth = 52;
  const refBoxX = pageWidth - margin - refBoxWidth - 4;
  doc.setFillColor(52, 40, 32);
  doc.roundedRect(refBoxX, y + 3, refBoxWidth, 16, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(212, 163, 115);
  doc.text('PERSONAL TRACKING REF', refBoxX + refBoxWidth / 2, y + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(refCode, refBoxX + refBoxWidth / 2, y + 12.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(180, 165, 150);
  doc.text('For personal notes & filing', refBoxX + refBoxWidth / 2, y + 16.5, { align: 'center' });

  // 3. Document Title & Shortlist Date Bar
  y += bannerHeight + 3;
  const titleBarHeight = 13;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 210, 198);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, titleBarHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(37, 28, 22);
  doc.text('Your Funding Application Summary', margin + 6, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 100, 85);
  doc.text(`Saved to your shortlist on ${formattedDate}  ·  Personal Reference: ${refCode}`, margin + 6, y + 10);

  // Status Pill on the Right (Properly sized to content, no letter-spacing clipping)
  const badgeLabel = statusLabel || 'SHORTLISTED';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  const badgeTextWidth = doc.getTextWidth(badgeLabel);
  const pillPadding = 4;
  const pillIconSpace = 5;
  const pillWidth = badgeTextWidth + pillPadding * 2 + pillIconSpace;
  const pillHeight = 6.5;
  const pillX = pageWidth - margin - pillWidth - 6;
  const pillY = y + 3.2;

  // Soft emerald pill background & border
  doc.setFillColor(230, 244, 234);
  doc.setDrawColor(160, 210, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 3, 3, 'FD');

  // Vector checkmark inside pill
  drawVectorCheckIcon(doc, pillX + pillPadding, pillY + 1.2, 3.2);

  // Status text inside pill
  doc.setTextColor(39, 103, 73);
  doc.text(badgeLabel, pillX + pillPadding + pillIconSpace, pillY + 4.6);

  // 4. Next Step Callout Banner
  y += titleBarHeight + 2.5;
  const nextStepHeight = 9.5;
  doc.setFillColor(245, 240, 232);
  doc.setDrawColor(210, 195, 180);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, nextStepHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(115, 60, 20);
  doc.text('Next step: apply on the provider\'s official portal before the closing date.', margin + 6, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 75, 65);
  doc.text('Submit your application and all required certified documents directly to the funding organization.', margin + 6, y + 8);

  // 5. Section A: Bursary Opportunity Details
  y += nextStepHeight + 3.5;
  doc.setFillColor(236, 228, 218);
  doc.rect(margin + 2, y, contentWidth - 4, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION A: BURSARY OPPORTUNITY DETAILS', margin + 5, y + 4.2);

  y += 6;
  // Calculate dynamic height for Section A to accommodate long names and long URLs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const fundNameLines = doc.splitTextToSize(fund.name, contentWidth - 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const summaryLines = doc.splitTextToSize(fund.summary, contentWidth - 14);

  const secABaseHeight = 28 + fundNameLines.length * 4.5 + summaryLines.length * 3.4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(228, 218, 206);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, secABaseHeight, 'FD');

  let curAY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(37, 28, 22);
  doc.text(fundNameLines, margin + 6, curAY);
  curAY += fundNameLines.length * 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(140, 80, 30);
  doc.text(`Provider: ${fund.provider} (${fund.providerType.toUpperCase()})`, margin + 6, curAY);
  curAY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 60, 50);
  doc.text(summaryLines, margin + 6, curAY);
  curAY += summaryLines.length * 3.4 + 2;

  // Grid Divider Line
  doc.setDrawColor(235, 225, 215);
  doc.line(margin + 6, curAY, pageWidth - margin - 6, curAY);
  curAY += 3;

  // Section A Grid Columns: Closing Date, Coverage, Official Portal, Record Audit
  const colW1 = 36;
  const colW2 = 48;
  const colW3 = 60;
  const colX1 = margin + 6;
  const colX2 = colX1 + colW1;
  const colX3 = colX2 + colW2;
  const colX4 = colX3 + colW3;

  // Col 1: Closing Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('CLOSING DATE:', colX1, curAY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 35, 35);
  doc.text(fund.closeDate, colX1, curAY + 4.5);

  // Col 2: Funding Coverage
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('AWARD COVERAGE:', colX2, curAY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 28, 22);
  const coverageList = Object.entries(fund.coverage)
    .filter(([k, v]) => v === true && k !== 'notes')
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
  const coverageText = coverageList.length > 0 ? coverageList.slice(0, 3).join(', ') : 'Tuition & Study Costs';
  doc.text(coverageText, colX2, curAY + 4.5);

  // Col 3: Portal Link (Wraps cleanly without truncation!)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('OFFICIAL PORTAL:', colX3, curAY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(30, 80, 160);
  const urlLines = doc.splitTextToSize(fund.applyUrl, colW3 - 2);
  doc.text(urlLines, colX3, curAY + 4.5);
  // Add clickable hyperlink annotation
  doc.link(colX3, curAY + 1, colW3, urlLines.length * 3.5 + 4, { url: fund.applyUrl });

  // Col 4: Verified Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('RECORD AUDIT:', colX4, curAY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(60, 50, 40);
  doc.text(`Verified ${fund.lastVerifiedAt}`, colX4, curAY + 4.5);

  y += secABaseHeight;

  // 6. Section B: Applicant Profile Summary
  y += 3.5;
  doc.setFillColor(236, 228, 218);
  doc.rect(margin + 2, y, contentWidth - 4, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION B: APPLICANT PROFILE SUMMARY (POPIA PROTECTED)', margin + 5, y + 4.2);

  y += 6;
  const secBHeight = 26;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(228, 218, 206);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, secBHeight, 'FD');

  const appCol1 = margin + 6;
  const appCol2 = margin + 66;
  const appCol3 = margin + 126;

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('STUDY LEVEL / GRADE:', appCol1, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(37, 28, 22);
  doc.text(formatStudyLevel(profile.level), appCol1, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('TARGET FIELD OF STUDY:', appCol2, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(37, 28, 22);
  doc.text(profile.fieldOfStudy, appCol2, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('PROVINCE & CITIZENSHIP:', appCol3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(37, 28, 22);
  const provText = `${profile.province} · ${profile.isSACitizen ? 'SA Citizen' : 'International'}`;
  doc.text(doc.splitTextToSize(provText, 52), appCol3, y + 8.5);

  // Row 1 Divider
  doc.setDrawColor(240, 232, 224);
  doc.line(appCol1, y + 13, pageWidth - margin - 6, y + 13);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('ACADEMIC AVERAGE RECORD:', appCol1, y + 17.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(39, 103, 73);
  doc.text(`${profile.academicAverage}% Overall Average`, appCol1, y + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('KEY SUBJECT SCORES:', appCol2, y + 17.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(37, 28, 22);
  doc.text(`Maths: ${profile.mathAverage ?? 'N/A'}%  |  Science: ${profile.scienceAverage ?? 'N/A'}%`, appCol2, y + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 105, 90);
  doc.text('HOUSEHOLD INCOME BAND:', appCol3, y + 17.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(37, 28, 22);
  const incomeMap: Record<string, string> = {
    under_350k: 'Under R350,000 (NSFAS Cap)',
    '350k_to_600k': 'R350,001 to R600,000 (Missing Middle)',
    above_600k: 'Above R600,000 (Merit Awards)',
  };
  const incText = incomeMap[profile.incomeBand] || profile.incomeBand;
  doc.text(doc.splitTextToSize(incText, 52), appCol3, y + 21.5);

  y += secBHeight;

  // 7. Section C: Mandatory Certified Documents Checklist
  y += 3.5;
  doc.setFillColor(236, 228, 218);
  doc.rect(margin + 2, y, contentWidth - 4, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 50, 30);
  doc.text('SECTION C: APPLICATION PREPARATION & CERTIFIED DOCUMENTS CHECKLIST', margin + 5, y + 4.2);

  y += 6;
  const checklistItems = [
    { title: 'Certified copy of South African ID Document or Smart Card', tip: 'Stamped by SAPS or Post Office within the last 3 months.' },
    { title: 'Latest Academic Results / Grade 11 report or Matric Certificate', tip: 'Official school stamp and seal clearly visible.' },
    { title: 'Proof of Household Income (Pay-slips / Pension statement / SASSA letter)', tip: 'Affidavit from police station if guardian is unemployed or self-employed.' },
    { title: 'Proof of Tertiary Application or Provisional Admission Letter', tip: 'Required for university and TVET college students before fund disbursement.' },
    { title: 'Motivational Essay & Curriculum Vitae (CV)', tip: 'Highlight community involvement, academic ambitions, and financial need.' },
  ];

  const secCHeight = 36;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(228, 218, 206);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, secCHeight, 'FD');

  let checkY = y + 4;
  checklistItems.forEach((item, index) => {
    // Drawn checkbox square
    doc.setDrawColor(180, 160, 140);
    doc.setLineWidth(0.35);
    doc.rect(margin + 6, checkY, 3.2, 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(37, 28, 22);
    doc.text(`${index + 1}. ${item.title}`, margin + 11.5, checkY + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(120, 105, 90);
    doc.text(`— ${item.tip}`, margin + 11.5, checkY + 5.5);

    checkY += 6.2;
  });

  y += secCHeight;

  // 8. Section D: Personal Tracking & Application Notes (The Green Box)
  // Paragraph text wraps inside its box without overflowing past the right edge!
  y += 3.5;
  const stampWidth = 44;
  const textLeftX = margin + stampWidth + 10;
  const availableTextWidth = contentWidth - stampWidth - 16; // approx 126mm

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const para1 = 'Next step: apply on the provider\'s official portal before the closing date.';
  const para1Lines = doc.splitTextToSize(para1, availableTextWidth);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const para2 = `This summary is generated for your personal application planning and document preparation. Bursary Finder SA is an independent free discovery tool and is not affiliated with ${fund.provider}. This slip does not constitute an official submission or waiting list placement with the bursary provider.`;
  const para2Lines = doc.splitTextToSize(para2, availableTextWidth);

  const para3 = `Keep this personal reference code (${refCode}) safe for your records and checklist filing.`;
  const para3Lines = doc.splitTextToSize(para3, availableTextWidth);

  const secDHeight = Math.max(
    28,
    8 + para1Lines.length * 4 + para2Lines.length * 3.3 + para3Lines.length * 3.3 + 4
  );

  doc.setFillColor(242, 248, 244); // Soft sage background #F2F8F4
  doc.setDrawColor(170, 210, 185);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, secDHeight, 'FD');

  // Left Stamp Box (Personal Tracking Only)
  const stampX = margin + 5;
  const stampY = y + 3;
  const stampHeight = secDHeight - 6;
  doc.setDrawColor(39, 103, 73);
  doc.setLineWidth(0.5);
  doc.roundedRect(stampX, stampY, stampWidth, stampHeight, 1.5, 1.5);
  doc.setLineWidth(0.2);
  doc.roundedRect(stampX + 1, stampY + 1, stampWidth - 2, stampHeight - 2, 1, 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(39, 103, 73);
  doc.text('BURSARY FINDER SA', stampX + stampWidth / 2, stampY + 4.5, { align: 'center' });

  doc.setFontSize(7.5);
  doc.text('SHORTLISTED', stampX + stampWidth / 2, stampY + 9, { align: 'center' });

  doc.setFontSize(6);
  doc.setTextColor(70, 110, 85);
  doc.text('PERSONAL TRACKING', stampX + stampWidth / 2, stampY + 13, { align: 'center' });
  doc.text(formattedDate, stampX + stampWidth / 2, stampY + 16.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(39, 103, 73);
  doc.text(refCode, stampX + stampWidth / 2, stampY + 20.5, { align: 'center' });

  // Right Side Text in Green Box (Every line properly wrapped to availableTextWidth)
  let textY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(25, 75, 50);
  doc.text(para1Lines, textLeftX, textY);
  textY += para1Lines.length * 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(45, 65, 55);
  doc.text(para2Lines, textLeftX, textY);
  textY += para2Lines.length * 3.3 + 1;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 80, 55);
  doc.text(para3Lines, textLeftX, textY);

  y += secDHeight;

  // 9. Footer Safety Notice (Anti-Scam)
  // Stacked in normal sequential flow; vector warning icon eliminates '&þ' bug
  y += 3.5;
  const antiScamText =
    'All legitimate bursaries, corporate funding schemes, ISFAP, and NSFAS applications are 100% FREE. Never pay any recruitment fee, application fee, or buy airtime vouchers to anyone offering funding. If anyone asks for money to guarantee an award, report them immediately.';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  const antiScamLines = doc.splitTextToSize(antiScamText, contentWidth - 18);
  const safetyBoxHeight = 8 + antiScamLines.length * 3.2;

  doc.setFillColor(255, 250, 240); // Soft amber background
  doc.setDrawColor(230, 205, 160);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2, y, contentWidth - 4, safetyBoxHeight, 'FD');

  // Vector warning icon (No emoji!)
  drawVectorWarningIcon(doc, margin + 5, y + 2.5, 4.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(140, 75, 10);
  doc.text('CRITICAL SAFETY NOTICE FOR SOUTH AFRICAN LEARNERS & PARENTS:', margin + 11.5, y + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(110, 65, 15);
  doc.text(antiScamLines, margin + 5, y + 8.5);

  y += safetyBoxHeight;

  // 10. Bottom Footer Microprint (Stacked in normal flow with proper spacing; no overlap!)
  y += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(140, 125, 110);
  const microprint = `Bursary Finder SA · Student Application Preparation Summary · Personal Reference: ${refCode} · Saved on device for offline reference`;
  doc.text(microprint, pageWidth / 2, y + 1, { align: 'center' });

  return doc;
}

/**
 * Downloads the bursary application summary as a standard A4 PDF file.
 */
export function downloadBursaryTicketPDF(options: TicketPDFOptions): void {
  const doc = createBursaryTicketPDF(options);
  const safeSlug = options.fund.slug.replace(/[^a-z0-9_-]/gi, '-');
  const filename = `funding-summary-${safeSlug}-${options.refCode}.pdf`;
  doc.save(filename);
}

/**
 * Returns a data URI string for embedding or previewing inside an iframe or viewer.
 */
export function getBursaryTicketPDFDataUri(options: TicketPDFOptions): string {
  const doc = createBursaryTicketPDF(options);
  return doc.output('datauristring');
}

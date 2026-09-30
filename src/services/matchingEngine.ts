/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fund, LearnerProfile, MatchResult, MatchStatus } from '../types';

/**
 * Pure deterministic matching engine.
 * Never promises an award: always phrases as "Likely eligible" or "Close match".
 */
export function matchFund(profile: LearnerProfile, fund: Fund, referenceDate = new Date('2026-10-01')): MatchResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  let score = 50; // Base score for a legitimate fund
  let hasHardBlocker = false;

  // 1. South African Citizenship check
  if (fund.eligibility.saCitizenshipRequired) {
    if (profile.isSACitizen) {
      reasons.push('You are a South African citizen / permanent resident');
      score += 10;
    } else {
      missing.push('Requires South African citizenship or permanent residency');
      score -= 40;
      hasHardBlocker = true;
    }
  }

  // 2. Household Income Eligibility
  if (fund.eligibility.maxIncomeBand === 'under_350k') {
    if (profile.incomeBand === 'under_350k') {
      reasons.push('Household income is within the NSFAS threshold (≤ R350,000 / yr)');
      score += 15;
    } else if (profile.incomeBand === '350k_to_600k') {
      missing.push('Household income exceeds the R350,000 free-education cap (you selected R350k-R600k)');
      score -= 30;
      hasHardBlocker = true;
    } else if (profile.incomeBand === 'above_600k') {
      missing.push('Reserved for households earning under R350,000 per year');
      score -= 40;
      hasHardBlocker = true;
    }
  } else if (fund.eligibility.maxIncomeBand === '350k_to_600k') {
    if (profile.incomeBand === 'under_350k' || profile.incomeBand === '350k_to_600k') {
      reasons.push('Household income meets the "Missing Middle" criteria (≤ R600,000 / yr)');
      score += 15;
    } else if (profile.incomeBand === 'above_600k') {
      missing.push('Exceeds the "Missing Middle" threshold of R600,000 / yr');
      score -= 30;
      hasHardBlocker = true;
    }
  } else {
    // Merit-based / no strict income limit
    if (profile.incomeBand !== 'unknown') {
      reasons.push('No income cap — merit & achievement based');
      score += 5;
    }
  }

  // 3. Study Level Eligibility
  const isLevelAllowed = fund.eligibility.allowedLevels.includes(profile.level);
  if (isLevelAllowed) {
    const levelLabel = formatStudyLevel(profile.level);
    reasons.push(`Accepts applications from ${levelLabel} students`);
    score += 10;
  } else {
    const allowedLabels = fund.eligibility.allowedLevels.map(formatStudyLevel).join(', ');
    missing.push(`Open to ${allowedLabels}; you selected ${formatStudyLevel(profile.level)}`);
    score -= 25;
  }

  // 4. Field of Study
  const isAnyField = fund.eligibility.fieldsOfStudy.includes('Any');
  const isFieldMatch = isAnyField || fund.eligibility.fieldsOfStudy.some(
    f => f.toLowerCase() === profile.fieldOfStudy.toLowerCase() ||
         profile.fieldOfStudy.toLowerCase().includes(f.toLowerCase()) ||
         f.toLowerCase().includes(profile.fieldOfStudy.toLowerCase())
  );

  if (isFieldMatch) {
    if (isAnyField) {
      reasons.push('Open to any approved field of study');
      score += 10;
    } else {
      reasons.push(`Supports your field: ${profile.fieldOfStudy}`);
      score += 15;
    }
  } else {
    missing.push(`Prioritises: ${fund.eligibility.fieldsOfStudy.join(', ')} (your field: ${profile.fieldOfStudy})`);
    score -= 20;
  }

  // 5. Academic Average
  const minAvg = fund.eligibility.minAverage;
  const userAvg = profile.academicAverage;

  if (userAvg >= minAvg) {
    reasons.push(`Academic average of ${userAvg}% satisfies the required ${minAvg}%`);
    score += 15;
    if (userAvg >= minAvg + 10) {
      score += 5; // Distinction bonus
    }
  } else if (userAvg >= minAvg - 5) {
    missing.push(`Needs ${minAvg}% average, you have ${userAvg}% (close reach!)`);
    score -= 10;
  } else {
    missing.push(`Requires minimum ${minAvg}% average (you recorded ${userAvg}%)`);
    score -= 25;
  }

  // 6. Maths / Science Specifics (if required)
  if (fund.eligibility.minMathAverage && profile.mathAverage !== undefined) {
    if (profile.mathAverage >= fund.eligibility.minMathAverage) {
      reasons.push(`Mathematics score of ${profile.mathAverage}% satisfies required ${fund.eligibility.minMathAverage}%`);
      score += 5;
    } else {
      missing.push(`Requires ${fund.eligibility.minMathAverage}% in Mathematics (you have ${profile.mathAverage}%)`);
      score -= 10;
    }
  }

  if (fund.eligibility.minScienceAverage && profile.scienceAverage !== undefined) {
    if (profile.scienceAverage >= fund.eligibility.minScienceAverage) {
      reasons.push(`Physical Science score meets the minimum ${fund.eligibility.minScienceAverage}%`);
      score += 5;
    } else {
      missing.push(`Requires ${fund.eligibility.minScienceAverage}% in Physical Science (you have ${profile.scienceAverage}%)`);
      score -= 10;
    }
  }

  // 7. Province / Region
  const isAllProvinces = fund.eligibility.allowedProvinces.includes('All');
  const isProvinceAllowed = isAllProvinces || fund.eligibility.allowedProvinces.includes(profile.province);

  if (isProvinceAllowed) {
    if (!isAllProvinces) {
      reasons.push(`Specific regional priority for applicants in ${profile.province}`);
      score += 10;
    }
  } else {
    missing.push(`Restricted to students in: ${fund.eligibility.allowedProvinces.join(', ')}`);
    score -= 20;
    hasHardBlocker = true;
  }

  // 8. Disability Concession / Affirmation
  if (profile.hasDisability && fund.eligibility.disabilityPreference) {
    reasons.push('Special support and mark concession for students with disabilities');
    score += 10;
  }

  // Normalize score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine status
  let status: MatchStatus;
  if (!hasHardBlocker && score >= 70 && (userAvg >= minAvg || userAvg >= minAvg - 2)) {
    status = 'likely_eligible';
  } else if (!hasHardBlocker && score >= 45) {
    status = 'close_match';
  } else {
    status = 'not_eligible';
  }

  // Calculate days until closing
  const closeDate = new Date(fund.closeDate);
  const diffTime = closeDate.getTime() - referenceDate.getTime();
  const daysUntilClose = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgency: 'urgent' | 'closing_soon' | 'open' | 'closed';
  if (daysUntilClose < 0 || !fund.isOpen) {
    urgency = 'closed';
  } else if (daysUntilClose <= 7) {
    urgency = 'urgent';
  } else if (daysUntilClose <= 28) {
    urgency = 'closing_soon';
  } else {
    urgency = 'open';
  }

  return {
    fund,
    score,
    status,
    reasons,
    missing,
    daysUntilClose,
    urgency,
  };
}

export function rankFunds(profile: LearnerProfile, funds: Fund[], referenceDate = new Date('2026-10-01')): MatchResult[] {
  return funds
    .map(fund => matchFund(profile, fund, referenceDate))
    .sort((a, b) => {
      // Prioritize likely eligible, then close matches, then by score
      const statusWeight = {
        likely_eligible: 3,
        close_match: 2,
        not_eligible: 1,
      };

      if (statusWeight[a.status] !== statusWeight[b.status]) {
        return statusWeight[b.status] - statusWeight[a.status];
      }

      // If status is equal, sort by score descending
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Then by urgency (urgent closing first so learners don't miss them)
      return a.daysUntilClose - b.daysUntilClose;
    });
}

export function formatStudyLevel(level: string): string {
  switch (level) {
    case 'grade11':
      return 'Grade 11';
    case 'grade12':
      return 'Grade 12 (Matric)';
    case 'tvet':
      return 'TVET College';
    case 'undergrad_1st':
      return '1st Year University';
    case 'undergrad_senior':
      return 'Senior Undergrad (2nd-4th Year)';
    case 'postgrad':
      return 'Postgraduate / Honours';
    default:
      return level;
  }
}

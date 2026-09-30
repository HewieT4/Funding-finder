/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_FUNDS } from '../data/funds';
import { LearnerProfile } from '../types';
import { matchFund, rankFunds } from './matchingEngine';

export interface TestCaseResult {
  name: string;
  passed: boolean;
  details: string;
}

export function runMatchingEngineTests(): TestCaseResult[] {
  const tests: TestCaseResult[] = [];
  const refDate = new Date('2026-10-01');

  // Test 1: NSFAS match for Grade 12 learner under R350k income
  const nsfasFund = INITIAL_FUNDS.find(f => f.id === 'nsfas-2026')!;
  const ruralLearnerProfile: LearnerProfile = {
    province: 'Limpopo',
    level: 'grade12',
    academicAverage: 58,
    fieldOfStudy: 'Education',
    incomeBand: 'under_350k',
    isSACitizen: true,
    hasDisability: false,
  };
  const res1 = matchFund(ruralLearnerProfile, nsfasFund, refDate);
  tests.push({
    name: '1. NSFAS matches rural Grade 12 learner with <R350k income',
    passed: res1.status === 'likely_eligible' && res1.reasons.some(r => r.includes('NSFAS threshold')),
    details: `Status: ${res1.status}, Score: ${res1.score}, Reasons: ${res1.reasons.length}`,
  });

  // Test 2: NSFAS rejects or heavily penalizes income > R350k
  const highIncomeProfile: LearnerProfile = {
    ...ruralLearnerProfile,
    incomeBand: 'above_600k',
  };
  const res2 = matchFund(highIncomeProfile, nsfasFund, refDate);
  tests.push({
    name: '2. NSFAS flags income > R350k as hard ineligible block',
    passed: res2.status === 'not_eligible' && res2.missing.some(m => m.includes('R350,000')),
    details: `Status: ${res2.status}, Missing: ${res2.missing[0] || 'None'}`,
  });

  // Test 3: Non-South African citizen is flagged for citizenship-restricted funds
  const nonCitizenProfile: LearnerProfile = {
    ...ruralLearnerProfile,
    isSACitizen: false,
  };
  const res3 = matchFund(nonCitizenProfile, nsfasFund, refDate);
  tests.push({
    name: '3. Hard citizenship requirement flags non-SA citizen',
    passed: res3.status === 'not_eligible' && res3.missing.some(m => m.includes('citizenship')),
    details: `Status: ${res3.status}, Missing: ${res3.missing.join(', ')}`,
  });

  // Test 4: ISFAP correctly identifies Missing Middle profile (R350k - R600k) in high-demand degree
  const isfapFund = INITIAL_FUNDS.find(f => f.id === 'isfap-missing-middle')!;
  const missingMiddleProfile: LearnerProfile = {
    province: 'Gauteng',
    level: 'undergrad_1st',
    academicAverage: 68,
    mathAverage: 65,
    fieldOfStudy: 'Engineering',
    incomeBand: '350k_to_600k',
    isSACitizen: true,
    hasDisability: false,
  };
  const res4 = matchFund(missingMiddleProfile, isfapFund, refDate);
  tests.push({
    name: '4. ISFAP matches Missing Middle Engineering student',
    passed: res4.status === 'likely_eligible' && res4.reasons.some(r => r.includes('Missing Middle')),
    details: `Status: ${res4.status}, Score: ${res4.score}`,
  });

  // Test 5: Sasol STEM bursary requires 70% in Maths & Science
  const sasolFund = INITIAL_FUNDS.find(f => f.id === 'sasol-corporate-bursary')!;
  const lowMathProfile: LearnerProfile = {
    province: 'Mpumalanga',
    level: 'grade12',
    academicAverage: 72,
    mathAverage: 58, // Below 70%
    scienceAverage: 75,
    fieldOfStudy: 'Engineering',
    incomeBand: 'under_350k',
    isSACitizen: true,
    hasDisability: false,
  };
  const res5 = matchFund(lowMathProfile, sasolFund, refDate);
  tests.push({
    name: '5. Sasol flags insufficient Mathematics mark (58% vs 70%)',
    passed: res5.missing.some(m => m.includes('Mathematics')),
    details: `Missing: ${res5.missing.find(m => m.includes('Mathematics'))}`,
  });

  // Test 6: Close match detection (within 5% of requirement)
  const closeMatchProfile: LearnerProfile = {
    province: 'Western Cape',
    level: 'grade12',
    academicAverage: 62, // 62% vs 65% min for Thuthuka / ISFAP
    mathAverage: 62,
    fieldOfStudy: 'Commerce & Accounting',
    incomeBand: '350k_to_600k',
    isSACitizen: true,
    hasDisability: false,
  };
  const thuthukaFund = INITIAL_FUNDS.find(f => f.id === 'thuthuka-bursary-fund')!;
  const res6 = matchFund(closeMatchProfile, thuthukaFund, refDate);
  tests.push({
    name: '6. Close match: detects 62% average is near 65% threshold',
    passed: res6.missing.some(m => m.includes('close reach') || m.includes('62%')),
    details: `Status: ${res6.status}, Notice: ${res6.missing[0]}`,
  });

  // Test 7: TVET student eligibility
  const tvetProfile: LearnerProfile = {
    province: 'Eastern Cape',
    level: 'tvet',
    academicAverage: 64,
    fieldOfStudy: 'TVET Trades',
    incomeBand: 'under_350k',
    isSACitizen: true,
    hasDisability: false,
  };
  const mqaFund = INITIAL_FUNDS.find(f => f.id === 'mqa-seta-bursary')!;
  const res7 = matchFund(tvetProfile, mqaFund, refDate);
  tests.push({
    name: '7. TVET trade student matches MQA SETA bursary',
    passed: res7.status === 'likely_eligible' && res7.reasons.some(r => r.includes('TVET')),
    details: `Status: ${res7.status}, Score: ${res7.score}`,
  });

  // Test 8: Postgraduate student seeking funding
  const postgradProfile: LearnerProfile = {
    province: 'Western Cape',
    level: 'postgrad',
    academicAverage: 72,
    fieldOfStudy: 'Science',
    incomeBand: 'above_600k',
    isSACitizen: true,
    hasDisability: false,
  };
  const csirFund = INITIAL_FUNDS.find(f => f.id === 'csir-stem-bursary')!;
  const res8 = matchFund(postgradProfile, csirFund, refDate);
  tests.push({
    name: '8. Postgraduate student matches CSIR merit research funding',
    passed: res8.status === 'likely_eligible',
    details: `Status: ${res8.status}, Score: ${res8.score}`,
  });

  // Test 9: Deadline calculation and urgency calculation
  const urgentFund = INITIAL_FUNDS.find(f => f.id === 'sasol-corporate-bursary')!; // closes 2026-10-15
  const res9 = matchFund(missingMiddleProfile, urgentFund, refDate); // refDate is 2026-10-01
  tests.push({
    name: '9. Deadline calculation computes 14 days until closing',
    passed: res9.daysUntilClose === 14 && res9.urgency === 'closing_soon',
    details: `Days: ${res9.daysUntilClose}, Urgency: ${res9.urgency}`,
  });

  // Test 10: Pure ranking algorithm sorts likely eligible and highest scores to top
  const ranked = rankFunds(ruralLearnerProfile, INITIAL_FUNDS, refDate);
  tests.push({
    name: '10. Pure rankFunds orders likely eligible funds first',
    passed: ranked.length > 0 && ranked[0].status === 'likely_eligible' && ranked[0].score >= ranked[ranked.length - 1].score,
    details: `Top fund: ${ranked[0].fund.name} (${ranked[0].score} pts, ${ranked[0].status})`,
  });

  return tests;
}

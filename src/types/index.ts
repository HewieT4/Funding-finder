/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SouthAfricanProvince =
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'Free State'
  | 'North West'
  | 'Northern Cape'
  | 'All';

export type StudyLevel =
  | 'grade11'
  | 'grade12'
  | 'tvet'
  | 'undergrad_1st'
  | 'undergrad_senior'
  | 'postgrad';

export type HouseholdIncomeBand =
  | 'under_350k'       // NSFAS full free higher education threshold (≤ R350,000 / year)
  | '350k_to_600k'     // "Missing Middle" / ISFAP threshold (R350,001 - R600,000 / year)
  | 'above_600k'       // > R600,000 / year (merit bursaries, corporate funds)
  | 'unknown';

export type ProviderType =
  | 'government'
  | 'corporate'
  | 'seta'
  | 'foundation'
  | 'university';

export type FundCategory =
  | 'bursary'
  | 'scholarship'
  | 'nsfas_grant'
  | 'loan_scheme';

export interface FundCoverage {
  tuition: boolean;
  accommodation: boolean;
  allowance: boolean; // living / meal allowance
  books: boolean;
  laptop: boolean;
  travel: boolean;
  notes?: string;
}

export interface FundEligibility {
  minAverage: number;
  minMathAverage?: number;
  minScienceAverage?: number;
  allowedLevels: StudyLevel[];
  fieldsOfStudy: string[]; // e.g. ['Engineering', 'Computer Science & IT', 'Any']
  allowedProvinces: SouthAfricanProvince[]; // ['All'] or specific provinces
  maxIncomeBand?: 'under_350k' | '350k_to_600k' | 'none';
  saCitizenshipRequired: boolean;
  disabilityPreference?: boolean;
  notes?: string;
}

export interface Fund {
  id: string;
  slug: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  category: FundCategory;
  summary: string;
  description: string;
  coverage: FundCoverage;
  eligibility: FundEligibility;
  requiredDocuments: string[];
  openDate: string; // YYYY-MM-DD
  closeDate: string; // YYYY-MM-DD
  isOpen: boolean;
  applyUrl: string;
  sourceUrl: string;
  lastVerifiedAt: string; // YYYY-MM-DD
  verifiedBy: string;
  serviceObligation: string;
  applicationTips: string[];
}

export interface LearnerProfile {
  province: SouthAfricanProvince;
  level: StudyLevel;
  academicAverage: number;
  mathAverage?: number;
  scienceAverage?: number;
  fieldOfStudy: string;
  incomeBand: HouseholdIncomeBand;
  isSACitizen: boolean;
  hasDisability: boolean;
}

export type MatchStatus = 'likely_eligible' | 'close_match' | 'not_eligible';

export interface MatchResult {
  fund: Fund;
  score: number; // 0 to 100
  status: MatchStatus;
  reasons: string[]; // "You qualify because..."
  missing: string[]; // "What is missing..."
  daysUntilClose: number;
  urgency: 'urgent' | 'closing_soon' | 'open' | 'closed';
}

export type ApplicationTrackingStatus =
  | 'saved'
  | 'docs_ready'
  | 'applied'
  | 'interview'
  | 'accepted'
  | 'declined';

export interface SavedFundItem {
  fundId: string;
  savedAt: string;
  status: ApplicationTrackingStatus;
  notes: string;
  preparedDocuments: string[];
}

# AGENTS.md — AI & Engineering Agent Operating Manual

> **System**: Bursary Finder SA (`bursary-finder-sa`)  
> **Target Audience**: South African learners (Grades 9–12, TVET college students, university undergraduates, ages 14–25).  
> **Core Objective**: Connect learners to legitimate educational bursaries, NSFAS aid, and corporate scholarships using 100% deterministic eligibility algorithms, offline-friendly PDF generation, and strict POPIA privacy protection.

---

## 1. Role & Identity for Autonomous Agents

When operating as an agent within this codebase:
- **Tone & Persona**: Act as an empathetic, meticulous, privacy-minded educational product engineer and UX specialist.
- **Audience Understanding**: South African learners face high mobile data costs, frequent loadshedding, complex socio-economic barriers, and aggressive commercial bursary scams. All design choices must respect low bandwidth, offline usability, and absolute transparency.
- **Honesty Invariant**: Never simulate or hallucinate approval. The phrase **"Likely eligible"** or **"Close match"** must always be used instead of "Guaranteed" or "Awarded". Applications must always be completed on official provider portals.

---

## 2. Core Domain Truths & Rules

Every agent modifying this repository must enforce these non-negotiable rules:

| Domain Factor | Non-Negotiable Rule | Rationale |
| :--- | :--- | :--- |
| **NSFAS Household Income Cap** | Households earning **$\le$ R350,000 / year** qualify for government free education. SASSA grant beneficiaries qualify automatically. | South African Department of Higher Education and Training (DHET) statutory threshold. |
| **Missing Middle / ISFAP** | Households earning **R350,001 to R600,000 / year** are ineligible for NSFAS but eligible for ISFAP and corporate Missing Middle schemes. | Solves the funding gap for families above the NSFAS threshold who cannot self-fund tertiary study. |
| **Zero ID Number Storage** | **NEVER** ask for, collect, or store a South African 13-digit National ID number in plain text, databases, or cookies. | Prevents identity theft and POPIA compliance violations. Use date of birth and income bands instead. |
| **Minor Consent (< 18 years)** | In terms of Section 34/35 of POPIA, learners under 18 must have parental/guardian contact on record before any account/data transmission. | South African statutory child data protection requirement. |
| **Zero-Fee Scam Protection** | All bursary, NSFAS, and university applications are **100% free**. Never add payment gateways, premium tiers, or paid listing fees. | Bursary scam protection for vulnerable students. |
| **Pure Determinism** | Bursary ranking (`src/services/matchingEngine.ts`) must remain 100% deterministic and test-backed. | Prevents black-box AI bias and ensures fair, reproducible matching for every student. |

---

## 3. High-Priority Directives for Agents

### 3.1. Zero Black Shading / Visual Integrity
- **Navigation & Drawers**: Ensure the navigation bar and menus maintain clean sand/oat backgrounds (`var(--panel)`) without any dark CSS contrast filter artifacts or black rectangular boxes beneath menus.
- **Mobile First**: All touch targets must measure at least **48px $\times$ 48px** for ergonomic single-handed thumb operation on low-cost mobile smartphones.

### 3.2. PDF File Standard
- Confirmation slips are generated on the client via `jspdf` (`src/services/pdfTicketGenerator.ts`).
- Slips contain the Republic of South Africa emblem, official reference number (e.g. `ZA-2026-BF-XXXX`), applicant credentials, verified closing dates, certified document checklist, and an anti-scam notice.
- **Do not replace PDF files with proprietary formats or raw text files**.

### 3.3. Low-Data Mode Preservation
- When `lowDataMode` is enabled:
  - Background imagery is disabled or replaced with lightweight CSS gradients.
  - Animations are suspended (`prefers-reduced-motion` compliance).
  - Data transfer overhead is strictly minimized.

---

## 4. Workflows for Common Tasks

### Adding a New Bursary or Scholarship (`src/data/funds.ts`)
1. Create a unique slug (e.g. `anglo-american-stem-2027`).
2. Specify exact criteria in `FundEligibility`:
   - `minAverage`: Number (e.g. `65`).
   - `minMathAverage`: Pure Mathematics percentage (not Maths Literacy unless explicitly permitted).
   - `allowedLevels`: Array of `StudyLevel`.
   - `maxIncomeBand`: `'under_350k' | '350k_to_600k' | 'none'`.
3. Provide the verified `applyUrl` and date of verification.
4. Run `npm test` to ensure matching invariants remain intact.

### Modifying the Matching Algorithm (`src/services/matchingEngine.ts`)
1. Ensure every condition has explicit reasons pushed to `reasons: string[]` and disqualifiers to `missing: string[]`.
2. Add or update corresponding unit test cases in `src/services/matchingEngine.test.ts`.
3. Run `npm test` and `npm run lint`.

### Deploying & Verifying Builds
1. Run `npm run lint` (checks TypeScript syntax and missing imports).
2. Run `npm test` (verifies all 10 core algorithm assertions).
3. Run `npm run build` (produces production assets in `/dist`).

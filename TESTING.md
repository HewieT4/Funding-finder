# TESTING.md — Automated Verification & Test Suite

> **Verification Philosophy**: 100% Deterministic, Explainable, Automated  
> **Test Runners**: Headless CLI (`npm test`) & In-Browser UI (`TestRunnerView.tsx`)  
> **Current Status**: 10 / 10 Core Test Cases Passing

---

## 1. Testing Strategy & Two-Tier Architecture

To guarantee reliability across both automated CI/CD pipelines and user-facing audits, Bursary Finder SA implements a two-tier test suite:

```
                          ┌────────────────────────┐
                          │   Test Engine Suite    │
                          │(matchingEngine.test.ts)│
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
      ┌─────────────────────┐                   ┌─────────────────────┐
      │   CLI Test Runner   │                   │ In-Browser Test UI  │
      │ (run-tests-cli.ts)  │                   │ (TestRunnerView.tsx)│
      ├─────────────────────┤                   ├─────────────────────┤
      │ • Runs via npm test │                   │ • Visual dashboard  │
      │ • Headless exit code│                   │ • Interactive rerun │
      │ • CI/CD & pre-push  │                   │ • Public transparency│
      └─────────────────────┘                   └─────────────────────┘
```

1. **Headless CLI Test Runner (`npm test`)**:
   Runs via Node/TSX in under 200ms. Validates algorithmic invariants before builds and git commits. Exits with code `0` on success and `1` on failure.
2. **In-Browser Test Dashboard (`TestRunnerView.tsx`)**:
   Available directly to students, teachers, and auditing organizations in the application UI (under *Algorithm Tests* in the footer). Demonstrates algorithmic fairness and transparency in real-time.

---

## 2. Test Execution Commands

```bash
# Run headless unit tests via CLI
npm test

# Run TypeScript type check
npm run lint

# Run full production build
npm run build
```

---

## 3. The 10 Core Algorithmic Assertions

The test suite in `src/services/matchingEngine.test.ts` validates the following statutory and academic rules:

| # | Test Name | Invariant Under Test | Expected Result |
| :--- | :--- | :--- | :--- |
| **1** | **NSFAS Rural Match** | Grade 12 learner, household income $< \text{R350,000}/\text{yr}$. | `status: likely_eligible`, Score: $100$, includes NSFAS income reason. |
| **2** | **NSFAS Income Cap** | Household income $> \text{R350,000}/\text{yr}$ applying for NSFAS. | `status: not_eligible`, hard disqualifier flagged for exceeding R350k cap. |
| **3** | **Citizenship Block** | Non-SA citizen applying for citizenship-restricted funding. | `status: not_eligible`, hard citizenship disqualifier reported. |
| **4** | **Missing Middle / ISFAP** | Income between R350,001 and R600,000 studying Engineering. | `status: likely_eligible`, Score: $100$, matches ISFAP scheme. |
| **5** | **STEM Maths Prerequisite** | Engineering applicant with $58\%$ Pure Maths (requires $70\%$). | Score penalized $-20$ pts, reason explicitly lists math mark gap. |
| **6** | **Close Match Detection** | Applicant with $62\%$ average applying for $65\%$ requirement. | `status: close_match`, displays "Needs 65%, you have 62% (close reach!)". |
| **7** | **TVET Trade Alignment** | Vocational college student studying Mechanical Fitting. | `status: likely_eligible`, matches MQA SETA technical fund. |
| **8** | **Postgraduate Merit** | Honours/Masters student applying for CSIR scientific grant. | `status: likely_eligible`, matches postgraduate research fund. |
| **9** | **Deadline Countdown** | Fund closing in 14 days from reference date. | `daysUntilClose: 14`, `urgency: closing_soon`. |
| **10** | **Rank Sorting Invariant** | Multiple funds evaluated simultaneously. | `rankFunds` ranks `likely_eligible` first, then `close_match`, ordered by score. |

---

## 4. How to Add New Test Cases

When introducing new bursaries with specialized criteria (e.g. province-specific provincial government funds, or disability-priority schemes):

1. Open `src/services/matchingEngine.test.ts`.
2. Instantiate a mock `LearnerProfile` with the test condition:
   ```typescript
   const customProfile: LearnerProfile = {
     province: 'KwaZulu-Natal',
     level: 'grade12',
     academicAverage: 75,
     fieldOfStudy: 'Health Sciences & Medicine',
     incomeBand: 'under_350k',
     isSACitizen: true,
     hasDisability: true,
   };
   ```
3. Call `matchFund(customProfile, targetFund, refDate)`.
4. Assert the result and push to `tests`:
   ```typescript
   tests.push({
     name: '11. KZN Health bursary matches disabled rural student',
     passed: res.status === 'likely_eligible' && res.score >= 80,
     details: `Score: ${res.score}, Reasons: ${res.reasons.length}`,
   });
   ```
5. Run `npm test` to verify.

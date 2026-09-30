# ARCHITECTURE.md — System & Technical Architecture

> **Architecture Style**: Offline-First Single Page Application (SPA)  
> **Tech Stack**: React 19, TypeScript 5.8+, Vite 8, Tailwind CSS v4, jsPDF  
> **Deployment Target**: Vercel Static Edge CDN

---

## 1. System Overview & Component Hierarchy

Bursary Finder SA is architected as an ultra-fast, offline-capable client-side web application. It eliminates reliance on expensive server roundtrips, allowing South African students in rural or low-bandwidth areas to search, match, and download official PDF confirmation slips without consuming recurring mobile data.

```
                      ┌────────────────────────────────────────┐
                      │          Vercel Edge Global CDN        │
                      └──────────────────┬─────────────────────┘
                                         │  (Static SPA Assets)
                                         ▼
                      ┌────────────────────────────────────────┐
                      │          Client Browser (React 19)     │
                      └──────────────────┬─────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────┐                 ┌──────────────┐                 ┌──────────────┐
│  UI Views    │                 │ Pure Engine  │                 │ PDF Engine   │
├──────────────┤                 ├──────────────┤                 ├──────────────┤
│ • Hero       │                 │ • matchFund  │                 │ • jsPDF      │
│ • Finder     │◄───────────────►│ • rankFunds  │◄───────────────►│ • Barcodes   │
│ • ResultsList│  LearnerProfile │ • scoring    │   Fund + Ref    │ • A4 Stamps  │
│ • Shortlist  │                 │ • urgency    │                 │ • Slips      │
└──────────────┘                 └──────────────┘                 └──────────────┘
        │                                │                                │
        └────────────────────────────────┴────────────────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │   Local Privacy Storage (Indexed/Local)│
                      │   • User Profile (Income band, Marks)  │
                      │   • Shortlist & Tracker Stage          │
                      │   • ZERO ID Numbers / POPIA Compliant  │
                      └────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
├── AGENTS.md                  # Autonomous agent instructions & rules
├── ARCHITECTURE.md            # System architecture specification
├── CODE_STYLE.md              # Coding standards & formatting rules
├── DESIGN_SYSTEM.md           # Tokens, components & visual constitution
├── SECURITY.md                # POPIA compliance, minor data, edge headers
├── TESTING.md                 # Test suite & deterministic verification
├── README.md                  # Master project guide & Vercel deployment
├── vercel.json                # Vercel deployment, SPA rewrites, edge headers
├── package.json               # Dependencies & test scripts
├── vite.config.ts             # Vite build & alias configuration
├── index.html                 # HTML entry with POPIA metadata & fonts
└── src
    ├── main.tsx               # React root mount
    ├── App.tsx                # Central state orchestrator & navigation
    ├── index.css              # Tailwind CSS v4 imports & theme variables
    ├── types
    │   └── index.ts           # Central TypeScript interfaces & enums
    ├── data
    │   └── funds.ts           # Verified South African bursaries database
    ├── services
    │   ├── matchingEngine.ts  # Deterministic matching & ranking engine
    │   ├── matchingEngine.test.ts # Test cases for bursary criteria
    │   ├── run-tests-cli.ts   # CLI runner for `npm test`
    │   ├── pdfTicketGenerator.ts # jsPDF client-side document generator
    │   └── storage.ts         # LocalStorage persistence & calendar exports
    └── components
        ├── Navbar.tsx         # Responsive header & mobile bottom thumb nav
        ├── GooeyNav.tsx       # Desktop smooth particle navigation
        ├── Hero.tsx           # Conversational quick match launcher
        ├── ConversationalFinder.tsx # Step-by-step Grade 9-12 matching wizard
        ├── ResultsList.tsx    # Filterable grid of ranked fund matches
        ├── FundCard.tsx       # Individual opportunity card with match gauge
        ├── FundDetailModal.tsx # Full checklist, tips & portal links
        ├── ApplicationTicketModal.tsx # PDF slip sheet viewer & downloader
        ├── SavedShortlist.tsx # Personal application tracker & notes
        ├── DocumentGuide.tsx  # Certified document prep & SAPS police stamp tips
        ├── TestRunnerView.tsx # In-browser automated test runner
        ├── CookieConsentBanner.tsx # Non-intrusive POPIA consent toast
        ├── LegalCenterModal.tsx # Comprehensive privacy & terms modal
        └── Footer.tsx         # Legal links, community submissions & disclaimer
```

---

## 3. Data Models & Type Contracts (`src/types/index.ts`)

### 3.1. `Fund`
Represents an educational funding scheme (bursary, scholarship, NSFAS grant, or loan):
- `id`: Unique string identifier (e.g. `'nsfas-2026'`).
- `provider`: Organization offering the award (e.g. `'Sasol Foundation'`).
- `providerType`: `'government' | 'corporate' | 'seta' | 'foundation' | 'university'`.
- `coverage`: Granular boolean map (`tuition`, `accommodation`, `allowance`, `books`, `laptop`, `travel`).
- `eligibility`:
  - `minAverage`: Minimum high school or university mark (e.g. `65`).
  - `minMathAverage`, `minScienceAverage`: Subject prerequisites.
  - `allowedLevels`: Target academic levels (`'grade12'`, `'undergrad_1st'`, `'tvet'`, etc.).
  - `maxIncomeBand`: `'under_350k' | '350k_to_600k' | 'none'`.
  - `saCitizenshipRequired`: Boolean.
  - `disabilityPreference`: Boolean.

### 3.2. `LearnerProfile`
Minimal, privacy-preserving profile stored solely on the learner's device:
- `province`: South African province (e.g. `'Gauteng'`).
- `level`: Academic level.
- `academicAverage`: Overall mark percentage.
- `mathAverage`, `scienceAverage`: Optional subject scores.
- `fieldOfStudy`: Target qualification area (e.g. `'Engineering'`).
- `incomeBand`: Household income band (`'under_350k' | '350k_to_600k' | 'above_600k'`).
- `isSACitizen`: Boolean.
- `hasDisability`: Boolean.

---

## 4. Deterministic Matching Engine (`matchingEngine.ts`)

Instead of unpredictable neural network prompts, bursary matching must be 100% deterministic, explainable, and accountable to learners and parents:

### Scoring Formula
$$\text{Base Score} = 50$$

1. **Citizenship Check**:
   - SA Citizen + Required $\to +10$ pts.
   - Non-Citizen + Required $\to -40$ pts (Hard Ineligibility Flag).
2. **Household Income Fit**:
   - Under R350k for NSFAS $\to +15$ pts.
   - Income exceeds threshold $\to -30$ to $-40$ pts (Hard Ineligibility Flag).
   - Missing Middle (R350k–R600k) for ISFAP $\to +15$ pts.
3. **Academic Mark Alignment**:
   - Marks meet or exceed requirement $\to +20$ pts.
   - Marks within $5\%$ of requirement $\to -5$ pts (`close_match` flag).
   - Marks severely below $\to -25$ pts.
4. **Subject Prerequisite Penalties**:
   - Insufficient Maths or Physical Science $\to -20$ pts each.
5. **Study Field & Province Match**:
   - Exact field alignment $\to +15$ pts.
   - Province targeted $\to +10$ pts.

### Status Classification
- **`likely_eligible`**: Score $\ge 70$, zero hard blockers.
- **`close_match`**: Score between $55\text{--}69$, or missing requirement is within reach ($\le 5\%$ academic delta).
- **`not_eligible`**: Has hard blocker (citizenship or income ceiling violation).

---

## 5. Client-Side PDF Generation Engine (`pdfTicketGenerator.ts`)

To support students who must submit physical proof at bursary walk-in centers or attach records to university financial aid applications:
- **Engine**: Pure JavaScript `jspdf` compilation without external network calls.
- **Format**: Standard A4 portrait ($210\text{mm} \times 297\text{mm}$).
- **Document Features**:
  1. High-resolution vector header with Bursary Finder SA branding and national registry badges.
  2. Dynamic deterministic reference code (`ZA-2026-BF-XXXX`).
  3. Simulated vector barcode lines for physical receipt verification.
  4. Structured tabular blocks: Section A (Opportunity), Section B (Applicant Credentials), Section C (Certified Document Checklist with interactive tick boxes).
  5. Green verification seal with digital timestamp and POPIA data protection notice.
  6. Prominent anti-scam warning guaranteeing that legitimate South African bursaries are always 100% free.

---

## 6. Vercel Deployment Architecture

The application is deployed on Vercel as a high-performance Edge Static Single Page Application:
- **Build Output**: Optimized static bundle outputted to `/dist`.
- **Rewrites (`vercel.json`)**: All paths (`/(.*)`) route to `/index.html`, enabling seamless client-side view states and browser history navigation.
- **Caching**: All asset bundles in `/assets/` are fingerprinted and served with `Cache-Control: public, max-age=31536000, immutable`.
- **Edge Security Headers**: Automatically applies `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict `Permissions-Policy`.

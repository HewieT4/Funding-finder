# 🎓 Bursary Finder SA

> **South Africa's Privacy-First Educational Bursary & Scholarship Matching Platform**  
> Designed for learners in Grades 9–12, TVET colleges, and university undergraduates (ages 14–25).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![POPIA Compliant](https://img.shields.io/badge/POPIA-Compliant-success.svg)](SECURITY.md)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-black.svg)](vercel.json)

---

## 🌟 Mission & Key Features

South African students face severe hurdles accessing higher education: data costs are among the highest on the continent, official portals are fragmented, and fraudulent bursary syndicates prey on desperate matriculants. 

**Bursary Finder SA** provides an intuitive, high-speed, and data-frugal portal to discover, verify, and track legitimate funding opportunities:

- **100% Deterministic Matching Engine**: No AI hallucinations. Matches are scored transparently against verified statutory thresholds (NSFAS R350k cap, Missing Middle R600k threshold, subject mark requirements, and provincial criteria).
- **Official Downloadable PDF Confirmation Slips**: Generates official A4 PDF verification documents via client-side `jspdf`—complete with Republic of South Africa emblem, reference code (e.g. `ZA-2026-BF-9184`), applicant credentials, verified deadlines, certified documents audit checklist, and zero-fee scam warnings.
- **Application Stage Tracker & Document Checklist**: Private local tracking for *Saved*, *Documents Ready*, *Applied (Waiting List)*, *Interview*, and *Awarded*. Includes guidance on certifying documents at SAPS police stations.
- **Data-Saver / Low-Data Mode**: Disables background imagery and heavy transitions to ensure the platform operates seamlessly on budget smartphones and entry-level mobile data packages.
- **Strict POPIA Compliance**: Never asks for or stores a 13-digit South African ID number. Zero remote database tracking; personal profile data resides strictly on the learner's device.
- **Scam-Free Zero-Fee Pledge**: Every opportunity is verified active. Emphasizes the golden rule: legitimate South African bursaries are always 100% free.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js `v18.0.0` or higher
- npm (or pnpm / bun)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/bursary-finder-sa.git
cd bursary-finder-sa

# 2. Install dependencies
npm install

# 3. Start the local development server (port 3000)
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## 🧪 Testing & Verification

The repository includes a 10-point deterministic test suite covering statutory thresholds and edge cases:

```bash
# Run headless unit tests (10 assertions)
npm test

# Run TypeScript type-checker
npm run lint

# Compile production bundle
npm run build
```

You can also view and run the test suite directly inside the app by navigating to **Algorithm Tests** in the website footer.

---

## ☁️ Deploying to Vercel

Bursary Finder SA is optimized for instant, zero-configuration deployment to **Vercel**:

### Option 1: Vercel Dashboard (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `bursary-finder-sa` repository.
4. Vercel will automatically detect the **Vite** framework:
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. The included `vercel.json` automatically configures SPA routing rewrites and edge security headers.

### Option 2: Vercel CLI
```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy directly from your terminal
vercel
```

---

## 📚 Technical Documentation Index

Detailed architectural and engineering guides are available in the repository root:

| Document | Purpose & Contents |
| :--- | :--- |
| [**`AGENTS.md`**](AGENTS.md) | Operating manual for AI & autonomous agents; domain truths, rules, and workflows. |
| [**`DESIGN_SYSTEM.md`**](DESIGN_SYSTEM.md) | Visual tokens, typography (`Bricolage Grotesque` / `Figtree`), African palette, and WCAG AA specs. |
| [**`ARCHITECTURE.md`**](ARCHITECTURE.md) | System overview, component tree, pure deterministic matching math, and PDF compilation. |
| [**`SECURITY.md`**](SECURITY.md) | POPIA compliance, minor data protection (< 18 yrs), zero ID storage rule, and edge headers. |
| [**`CODE_STYLE.md`**](CODE_STYLE.md) | TypeScript guidelines, React 19 standards, Tailwind CSS v4 patterns, and error handling. |
| [**`TESTING.md`**](TESTING.md) | Headless test runner, in-browser test dashboard, test assertions matrix, and CI/CD tips. |

---

## 🇿🇦 South African Funding Reference Guide

- **NSFAS**: Department of Higher Education and Training financial aid for households earning $\le \text{R350,000}$ per year.
- **ISFAP**: Ikusasa Student Financial Aid Programme for the "Missing Middle" ($\text{R350,001}\text{--}\text{R600,000}$).
- **SETAs**: Sector Education and Training Authorities (MQA, merSETA, CHIETA, etc.) offering vocational trade and tertiary bursaries.
- **Corporate Bursaries**: Top corporate schemes (Sasol, Shoprite, Allan Gray, Vodacom) providing tuition, accommodation, books, and laptops.

---

## 📄 License

Licensed under the [Apache-2.0 License](LICENSE).

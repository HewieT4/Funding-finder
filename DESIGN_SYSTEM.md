# DESIGN_SYSTEM.md — Bursary Finder SA Design Tokens & Constitution

> **Design Vision**: A warm, trustworthy, African-inspired digital home for learners seeking higher education funding. Crafted for high readability, extreme mobile responsiveness, and zero visual clutter.

---

## 1. Visual Philosophy & Foundations

1. **Warm Earth Tones over Generic Corporate Blue**:
   South African educational interfaces are often either bleak government portals or aggressive commercial lead-generation sites. Bursary Finder SA uses warm, grounding earth tones inspired by the soil, sun, and flora of southern Africa.
2. **Grade 9 Reading Level**:
   Copy and labels avoid dense academic jargon and bureaucratic phrasing. Complex criteria like "missing middle means test" are broken down into simple, immediate language ("Families earning above the NSFAS cap but who cannot afford university tuition").
3. **No Black Shading Artifacts**:
   All header containers, gooey navigation components, and dropdown drawers use clean, transparent background blurs with zero dark rectangular box shadows.

---

## 2. Color Palette & Semantic Tokens

### Core CSS Variables (`src/index.css`)

| Token Name | Light Theme Value | Dark Theme Value | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `--bg` | `#FBF8F3` (Warm Oat) | `#140F0C` (Deep Umber) | Root application background |
| `--panel` | `#FFFFFF` (Pure Card) | `#1E1612` (Dark Charcoal) | Content cards, modal panels |
| `--panel-hover` | `#F5EFE6` (Subtle Cream) | `#261D18` (Elevated Panel) | Hover states on interactive items |
| `--line` | `#E8DED1` (Soft Sand) | `#382921` (Muted Bronze) | Borders, dividers, frame lines |
| `--ink` | `#251C16` (African Ink) | `#F7F0E6` (Pale Cream) | Primary titles, body text |
| `--mute` | `#7D6F63` (Earth Grey) | `#B09F91` (Warm Grey) | Helper text, metadata timestamps |
| `--brown` | `#8B5E3C` (Terracotta) | `#D4A373` (Golden Ochre) | Primary action buttons, brand badges |
| `--brown-hover` | `#70482B` (Deep Sienna) | `#E2B488` (Light Ochre) | Button hover & active states |
| `--sage` | `#276749` (Forest Sage) | `#529972` (Bright Sage) | Eligible status, verified ticks, pass |
| `--gold` | `#B8860B` (Amber Gold) | `#E5A93C` (Vibrant Amber) | Missing Middle badges, closing soon |
| `--blue` | `#2B5876` (Cape Navy) | `#6497B1` (Sky Steel) | Educational guidelines, link accents |

---

## 3. Typography & Hierarchy

### Font Families
- **Display Headings (`font-display`)**: `Bricolage Grotesque`, sans-serif.  
  Expressive, modern, approachable, and highly distinctive.
- **Body & Controls (`font-sans`)**: `Figtree`, system-ui, sans-serif.  
  Engineered for exceptional micro-legibility on low-resolution mobile displays.
- **Reference & Metadata (`font-mono`)**: Monospace (`ui-monospace`, `Courier New`).  
  Used exclusively for reference codes (`ZA-2026-BF-9184`), timestamps, and numeric percentage averages.

### Type Scale
- **H1 / Hero Title**: `text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display`
- **H2 / Section Title**: `text-xl sm:text-2xl font-bold font-display`
- **H3 / Card Title**: `text-base sm:text-lg font-bold font-display`
- **Body Regular**: `text-xs sm:text-sm font-normal leading-relaxed`
- **Badges / Micro-labels**: `text-[10px] sm:text-[11px] font-bold uppercase tracking-wider`

---

## 4. Components & Interactive Patterns

### 4.1. Fund Match Card (`FundCard.tsx`)
- **Circular Fit Gauge**: SVG circular stroke rendering the percentage match ($0\text{--}100\%$) with color transitioning from `--sage` ($\ge 75\%$), `--gold` ($55\text{--}74\%$), to `--mute` ($<55\%$).
- **Plain-Language Match Explanations**: Uses green tick bullets for met criteria and clear orange indicators for missing prerequisites.
- **Single-Row Action Bar**:
  - `PDF Slip` / `Waiting List PDF`: Launches the official confirmation modal.
  - `Calendar (.ics)`: Downloads deadline reminder to phone/Google calendar.
  - `Checklist & Rules`: Opens modal with full criteria and certified document checklists.
  - `Apply Official`: Outbound link to verified sponsor application portal.

### 4.2. Ergonomic Mobile Navigation (`Navbar.tsx`)
- **Fixed Bottom Thumb Bar**:
  - Pinned to the bottom viewport on screens `< 1024px`.
  - Minimum target height: **48px**.
  - High-contrast icons with clear 10px labels: *Home*, *Finder*, *Bursaries*, *Saved*, *PDF Slips*.
- **Desktop Gooey Nav**:
  - Pill animation with smooth transition particles across view switches.
  - Zero drop-shadow dark box under menu bar.

### 4.3. Official PDF Slip Sheet Preview (`ApplicationTicketModal.tsx`)
- Replaces generic text exports with an authentic, A4-styled preview document.
- Embedded vector barcode, reference slip badge, applicant data table, and official green verification stamp.
- Instant 1-click download producing a true `.pdf` binary file (`waiting-list-confirmation-[slug]-[ref].pdf`).

---

## 5. Accessibility (WCAG 2.1 AA) Standards

- **Contrast Ratio**: Body text on backgrounds maintains $\ge 4.5:1$ contrast ratio across both light and dark themes.
- **Skip Links**: Accessible top skip-link (`#main-content`) allows keyboard and screen-reader users to bypass navigation.
- **Keyboard Navigation**:
  - Modal dialogs trap focus and close on `Escape`.
  - Conversational finder supports `Enter ↵` to advance and `Esc` to exit.
- **Low-Data & Reduced-Motion Respect**:
  - Respects `prefers-reduced-motion: reduce`.
  - Disables heavy hero imagery when user activates Low-Data Mode.

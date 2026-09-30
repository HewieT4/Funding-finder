# CODE_STYLE.md — Code Quality & Engineering Standards

> **Stack**: React 19, TypeScript 5.8+, Vite 8, Tailwind CSS v4  
> **Linter**: `tsc --noEmit`  
> **Code Philosophy**: Type-Safe, Component-Modular, Accessible, Clean

---

## 1. TypeScript Conventions

- **Strict Type Checking**:
  - `noImplicitAny: true`
  - Explicit return types on service utilities and exported helper functions.
  - Never use `any` unless strictly bridging dynamic browser events where types are unavailable; prefer `unknown` with type narrowing.
- **Interfaces vs Types**:
  - Use `interface` for component props and entity contracts (`Fund`, `LearnerProfile`, `FundEligibility`).
  - Use `type` for unions and primitives (`StudyLevel`, `HouseholdIncomeBand`, `SouthAfricanProvince`).
- **File & Module Structure**:
  - Interfaces and types shared across components belong in `src/types/index.ts`.
  - Component-specific props belong in the component file (e.g. `interface FundCardProps`).

```typescript
// Good: Clear typed props with optional defaults
interface FundCardProps {
  result: MatchResult;
  isSaved: boolean;
  isApplied?: boolean;
  onToggleSave: (fund: Fund) => void;
  onViewDetails: (fund: Fund) => void;
  lowDataMode: boolean;
}
```

---

## 2. React 19 Best Practices

- **Functional Components with Explicit Types**:
  Use `React.FC<Props>` or typed parameters:
  ```typescript
  export const FundCard: React.FC<FundCardProps> = ({ result, isSaved, ... }) => { ... };
  ```
- **Hooks Discipline**:
  - Never call hooks conditionally.
  - Memoize expensive sorting or filtering using `useMemo`:
    ```typescript
    const allRanked = useMemo(() => rankFunds(profile, funds), [profile, funds]);
    ```
  - Clean up event listeners inside `useEffect`:
    ```typescript
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    ```
- **Pure Functions for Business Logic**:
  Algorithms (`matchingEngine.ts`, `pdfTicketGenerator.ts`) must remain pure functions independent of React state, enabling headless unit testing via CLI.

---

## 3. Tailwind CSS v4 Guidelines

- **Import Standard**:
  Tailwind v4 is loaded directly via `@import "tailwindcss";` in `src/index.css`.
- **CSS Variables for Theme Tokens**:
  Always use semantic CSS variables rather than hardcoded hex colors:
  - `bg-[var(--bg)]` instead of `bg-[#FBF8F3]`.
  - `text-[var(--ink)]` instead of `text-[#251C16]`.
  - `border-[var(--line)]` instead of `border-[#E8DED1]`.
- **Dark Mode Syntax**:
  Use the `.dark` class prefix:
  ```html
  <div className="bg-[var(--panel)] text-[var(--ink)] dark:bg-[#1C1714] dark:text-[#F7F0E6]">
  ```
- **Mobile First Touch Targets**:
  Interactive buttons and navigation links must meet the 48px target on touch viewports:
  ```html
  <button className="min-w-[48px] min-h-[48px] flex items-center justify-center p-2 rounded-xl ...">
  ```

---

## 4. Accessibility & Semantic HTML

- **Semantic Tags**:
  Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` instead of nested `<div>` soup.
- **ARIA Attributes**:
  - Dialogs must have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - Toggle buttons must specify `aria-pressed={isActive}`.
  - Decorative icons must have `aria-hidden="true"`.
- **Contrast & Font Readability**:
  Ensure text contrast passes WCAG AA ($4.5:1$ for normal text, $3:1$ for large headings).

---

## 5. Error Handling & Defensive Coding

- **Storage Resiliency**:
  Wrap all `localStorage` and `sessionStorage` accesses in `try/catch` blocks to protect against incognito storage blocks or quota limits:
  ```typescript
  export function loadSavedProfile(): LearnerProfile {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) {
      console.error('Failed to load profile from storage', e);
    }
    return DEFAULT_PROFILE;
  }
  ```
- **Client PDF Generation**:
  Always wrap PDF compilation in try/catch and provide visual loading and completion feedback to the user.

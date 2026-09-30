# SECURITY.md — Privacy, Security & POPIA Compliance Architecture

> **Regulatory Compliance**: Protection of Personal Information Act (Act No. 4 of 2013) (POPIA), Republic of South Africa  
> **Classification**: Strict Privacy-Preserving Client-Side Application  
> **Security Posture**: Zero-Backend Data Collection · Zero ID Storage · Local-First Security

---

## 1. Compliance with the Protection of Personal Information Act (POPIA)

Bursary Finder SA is explicitly architected to operate under the eight lawful conditions for data processing outlined in POPIA Chapter 3:

| POPIA Condition | Application Implementation | Verification |
| :--- | :--- | :--- |
| **1. Accountability** | Platform operations are fully transparent; users can inspect all matched criteria, ranking formulas, and data usage terms in the Legal Center. | `LegalCenterModal.tsx` |
| **2. Processing Limitation** | No account is required to browse, search, or run the matching engine. Profile data is kept strictly inside the user's browser `localStorage`. | `src/services/storage.ts` |
| **3. Purpose Specification** | Data collected (academic marks, field of study, province) is used solely to match eligibility against published criteria. Never sold to third-party advertisers. | Anti-commercial pledge |
| **4. Further Processing Limitation** | Information entered in the matcher is never repurposed for marketing loans, credit cards, or private tuition programs. | Zero telemetry scripts |
| **5. Information Quality** | Learners have complete control over updating or correcting their marks, province, and target field of study at any time. | Instant profile edit |
| **6. Openness** | Clear, non-intrusive cookie and local storage notice presented on initial arrival. | `CookieConsentBanner.tsx` |
| **7. Security Safeguards** | Zero transmission of private user credentials over the wire. Zero database exposure risk because applicant profiles are not centralized on a remote server. | Client-side engine |
| **8. Data Subject Participation** | Users can instantly inspect their stored profile or permanently delete all bookmarks, notes, and profile history via the **"Clear All Data"** button. | Instant wipe function |

---

## 2. Protection of Minors (Learners Under 18 Years)

Sections 34 and 35 of POPIA strictly prohibit the processing of personal information concerning a child unless carried out with the prior consent of a competent person (parent, legal guardian, or court).

### Bursary Finder SA Minor Protection Rules:
1. **Age Assessment First**:
   Learners entering onboarding flows are queried for their academic stage (e.g. Grade 9–11 vs University Undergrad).
2. **Guardian Consent Required for Cloud Syncing**:
   If an account sync or notification feature is requested by a learner under 18, the system requires a parent/guardian's mobile number or email and logs explicit guardian consent prior to activation.
3. **No Profiling of Minors for Commercial Advertising**:
   Minor profiles are never aggregated or shared with commercial student loan brokers or lead generation agencies.

---

## 3. The Zero ID Number Storage Rule

South African 13-digit National Identity Numbers (`YYMMDD SSSS C A Z`) encode sensitive demographic information (Date of Birth, Gender, and Citizenship status) and are prime targets for financial identity theft.

- **Rule**: Bursary Finder SA **NEVER** asks for, inputs, transmits, or stores a South African ID number.
- **Alternative**: The system uses:
  - Subject averages and grade level for academic evaluation.
  - Broad household income bands (e.g., *Under R350,000 / year*) for financial need tiering.
  - A simple boolean confirmation for citizenship (*"Are you a South African citizen or permanent resident?"*).
- **Physical Verification**: Official ID verification is performed directly by the verified bursary sponsor or university during final document submission.

---

## 4. Anti-Scam Zero-Fee Guarantee

Bursary scams targeting South African matriculants and students are widespread. Scammers impersonate NSFAS agents or corporate foundations and demand "application fees", "processing deposits", or "airtime vouchers".

### In-App Protections:
1. **Safety Banners**: Every bursary card and modal displays an explicit scam warning:  
   *"Safety Reminder: Legitimate bursary and NSFAS applications are ALWAYS 100% free. Never pay anyone claiming to secure funding on your behalf."*
2. **Verified Portal URLs**: Outbound application links (`applyUrl`) point directly to verified sponsor top-level domains (`.ac.za`, `.gov.za`, or verified corporate domains).
3. **PDF Slip Notice**: All downloadable waiting list confirmation slips include the official zero-fee guarantee stamped into the PDF document.

---

## 5. Web & Vercel Edge Security Configuration

In `vercel.json`, strict HTTP security headers are enforced at the edge:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

- **MIME Sniffing Prevention**: `X-Content-Type-Options: nosniff` stops browsers from executing non-script files as scripts.
- **Clickjacking Protection**: `X-Frame-Options: SAMEORIGIN` prevents malicious sites from framing the application.
- **Hardware Isolation**: `Permissions-Policy` disables camera, microphone, and geolocation access by default.

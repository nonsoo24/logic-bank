# 🏦 Logic Bank – Digital Account Maintenance Portal

[![React](https://img.shields.io/badge/React_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)](https://zustand.docs.pmnd.rs/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)

## 📖 Project Overview

**Logic Bank** is a prominent commercial bank in Nigeria, renowned for exceptional customer service, innovative digital banking platforms, and an extensive network of over 790 branches nationwide. With approximately 12,000 active users on its Core Banking System and a strategic presence across Africa, the Middle East, Asia, North America, and Europe, Logic Bank drives financial inclusion through cutting-edge banking solutions.

This portal is a **Digital Account Maintenance Web App** built as part of Logic Bank's Account Maintenance Services. It provides customers with a guided, multi-step self-service flow to **update their ID Card / identity document** — from consent, through OTP-based identity verification, to document upload and submission.

The solution was built against a Figma specification as part of a senior frontend engineering assessment, evaluated on: screen fidelity, error handling, responsiveness, code quality, performance, and documentation.

---

## 🚀 Platform

- [x] Web (responsive — mobile, tablet, desktop)

## 🌐 Browser Support

![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)
![Safari](https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=Safari&logoColor=white)
![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white)

---

## 🧩 Prerequisites

- [Node.js](https://nodejs.org) v18+ (recommended: install via [NVM](https://github.com/nvm-sh/nvm))
- npm v9+

---

## 🏁 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/nonsoo24/logic-bank-portal.git
cd logic-bank-portal
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Visit [http://localhost:5173](http://localhost:5173) to view the app.

5. To create a production build:

```bash
npm run build
```

6. To preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Mock Credentials

This project uses a simulated API (`mockApi.ts`) in place of a live backend. To test the OTP verification step, use:

| Field      | Value      |
| ---------- | ---------- |
| OTP        | `000000`   |
| OTP expiry | 60 seconds |

Any of the pre-seeded account numbers will match during account lookup (e.g. `2100110207`).

---

## 🗺️ User Flow

```
Home → Consent → Terms & Conditions → Identity Document Update
                                              │
                       ┌──────────────────────┼──────────────────────┐
                  Account Lookup         OTP Verification        Document Upload
                 (account number)       (6-digit OTP)          (front + back)
                                                                       │
                                                              Review & Submit
                                                                       │
                                                              Submission Confirmed
```

Flow steps are managed as a typed constant (`FLOW_STEPS`) and persisted in Zustand so the user does not lose progress on page refresh.

| Step | Constant       | Description              |
| ---- | -------------- | ------------------------ |
| 1    | `consent`      | Data privacy consent     |
| 2    | `verification` | Account lookup + OTP     |
| 3    | `documents`    | ID document upload       |
| 4    | `outstanding`  | Outstanding items review |
| 5    | `submitted`    | Confirmation screen      |

---

## 🛠️ Tech Stack

| Technology       | Version | Purpose                                            |
| ---------------- | ------- | -------------------------------------------------- |
| React            | 19      | UI rendering, concurrent features                  |
| TypeScript       | 5.9     | Static typing throughout                           |
| Vite             | 8       | Dev server + build tooling                         |
| Tailwind CSS     | v4      | Utility-first styling                              |
| React Router DOM | v7      | Client-side routing                                |
| React Hook Form  | v7      | Form state + validation                            |
| Zod              | v4      | Schema-based validation                            |
| Zustand          | v5      | Global state management                            |
| Axios            | v1      | HTTP client (wired, ready for live API)            |
| TanStack Query   | v5      | Async state / server state (installed, extendable) |

---

## 🏗️ Project Structure

```
logic-bank-portal/
├── public/                     # Static assets (favicon, etc.)
├── src/
│   ├── app/
│   │   ├── providers/          # App-level providers (QueryClient, ErrorBoundary)
│   │   └── routes/             # Centralised route definitions (AppRoutes)
│   ├── assets/
│   │   └── svg/                # SVG icons exported as typed strings
│   ├── features/
│   │   └── account-management/
│   │       ├── components/     # Feature-specific UI components
│   │       ├── config/         # Config-driven form field definitions
│   │       ├── hooks/          # Feature hooks (useIdentityDocumentForm, etc.)
│   │       ├── pages/          # Route-level page components
│   │       │   ├── HomePage.tsx
│   │       │   ├── ConsentPage.tsx
│   │       │   ├── TermsPage.tsx
│   │       │   └── IdentityDocumentPage.tsx
│   │       ├── schema/         # Zod validation schemas
│   │       ├── services/       # mockApi.ts — simulated async API layer
│   │       ├── store/          # Zustand slices (flow, files, modals)
│   │       └── types/          # Feature-level TypeScript types
│   └── shared/
│       ├── api/                # Axios client instance (client.ts)
│       ├── components/         # Reusable UI components
│       │   ├── AppButton/
│       │   ├── AppInput/
│       │   ├── AppSelect/
│       │   ├── AppCheckbox/
│       │   ├── DocumentUploadModal/
│       │   ├── ErrorBoundary/
│       │   ├── FileUpload/
│       │   ├── Layout/
│       │   ├── Modal/
│       │   ├── Navbar/
│       │   └── OTPInput/
│       ├── constants/          # APP_CONFIG, ROUTES, FLOW_STEPS, MOCK_OTP
│       ├── form/               # Shared form field types
│       ├── store/              # Shared Zustand stores
│       └── utils/              # Utility helpers
├── eslint.config.js
├── tailwind.config (v4 — CSS-based config)
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 🔑 Key Engineering Decisions

### Why React + Vite?

React 19 was chosen for its mature ecosystem, concurrent rendering, and first-class TypeScript support — well-suited for a form-heavy, state-driven banking UI. Vite replaces Create React App for significantly faster cold starts and HMR (Hot Module Replacement), and its `@vitejs/plugin-react` plugin uses Oxc for near-instant transforms during development. The `@` path alias is configured in `vite.config.ts` and both `tsconfig` files so imports stay clean across a deeply nested feature structure.

### Why Config-Driven Forms?

The identity document update flow involves a large number of form fields — personal details, address, employment, next-of-kin — spread across collapsible sections. Hardcoding each field as JSX would result in hundreds of lines of repetitive markup that is hard to maintain or extend.

Instead, all field definitions live in `src/features/account-management/config/` as plain TypeScript arrays:

```ts
export const personalInfoFields: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
  // ...
];
```

The page component maps over these arrays to render `AppInput`, `AppSelect`, or `AppCheckbox` components via a single `renderField()` function. Benefits:

- Adding or reordering fields requires no JSX changes
- Validation rules stay co-located with field definitions (picked up by the Zod schema)
- Consistent rendering and spacing guaranteed across all sections
- Directly mirrors how a real backend-driven form config might work

### How Error Handling Works

Error handling operates at three levels:

**1. Form validation (client-side)**
`react-hook-form` runs in `mode: 'onChange'`, so field-level errors surface immediately as the user types. The Zod schema (`identityDocument.ts`) drives all rules — string lengths, required fields, conditional validation — and `zodResolver` bridges it to RHF. Each `AppInput` and `AppSelect` receives the `error` prop directly from `formState.errors` and renders an inline error message below the field.

**2. Async API errors (mock API)**
`mockApi.ts` simulates real network responses with typed error codes (`'INVALID_OTP' | 'EXPIRED_OTP'`). Each async call is wrapped in a try/catch in the page's `useCallback` handlers. On failure, a toast-style `Modal` component is opened via `modalStore` with the relevant error title and message. The OTP input retains its current value on error (the user doesn't have to re-type the code) and shows an inline error row with an info icon and a "Cancel Request" link.

**3. React ErrorBoundary (runtime)**
An `ErrorBoundary` component wraps the entire app in `App.tsx`. Any unhandled render-time exception is caught and replaced with a graceful fallback UI instead of a blank screen.

---

## 📋 Implemented Features

- [x] Home page with 9 service cards
- [x] Consent page with data privacy agreement
- [x] Terms & Conditions page
- [x] Identity Document Update flow:
  - [x] Account number lookup
  - [x] OTP verification (send / resend / expiry countdown)
  - [x] Multi-section personal details form (config-driven)
  - [x] ID document upload (front + back) with preview
  - [x] Document upload instruction carousel modal
  - [x] Outstanding items review step
  - [x] Submission confirmation screen
- [x] Fully responsive (mobile-first, Tailwind CSS v4)
- [x] Zustand state persistence (flow step survives page refresh)
- [x] Global modal system for success/error/warning alerts
- [x] Fixed navbar with page title bar

---

## 🛠️ Troubleshooting

**Dependency issues:**

```bash
rm -rf node_modules
npm install
```

**Port already in use:**

```bash
# Find the process using port 5173
sudo lsof -i :5173
# Kill it
kill -9 <PID>
```

**TypeScript errors after pulling:**

```bash
npm run build
# tsc -b will show all type errors explicitly
```

---

## 📚 Libraries

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [React Router DOM](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)

---

## 👤 Author

- [Daniel Chukwurah](https://github.com/nonsoo24)

---

## 📜 License

This project was built as part of a technical assessment for Logic Bank. All rights reserved.

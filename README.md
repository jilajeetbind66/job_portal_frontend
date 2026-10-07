# Job Portal – Frontend (React SPA)

Ye project ka frontend hai: **React + Vite + TypeScript** ka alag SPA, jo `../backend` ke Laravel API se baat karta hai.

> **Status:** Abhi sirf Phase 0 scaffold hua hai. Vite project bana hai, dependencies install hui hain aur `src/` ke khali folders bane hain. Abhi koi screen, route, Tailwind config, `@/` alias, API client ya test setup nahi bana. Neeche likha hai ki ye sab **kaise aur kis order me** banega.

---

## 1. Product ka context

- 3 portals hain: **Candidate**, **Partner** (companies jaise SBI, jo jobs post karti hain) aur **Admin** (platform owner).
- Backend multi-tenant hai (har Partner ek tenant). Frontend ko tenant ka kuch nahi karna padta: API jo data deti hai, wahi dikhana hai.
- Roles: `candidate`, `partner_recruiter`, `partner_admin`, `super_admin`.
- Login ke baad role ke hisaab se redirect: candidate → `/candidate`, partner → `/partner`, admin → `/admin`.
- Poora architecture aur 14 modules ka detail "Multi-Tenant Job Portal — Architecture & Plan" doc me hai.

---

## 2. Installed packages

**Runtime:**

| Package | Version | Kaam |
|---|---|---|
| react, react-dom | ^19.2 | UI |
| react-router-dom | ^7.18 | Routing (har role ke liye alag) |
| @tanstack/react-query | ^5.104 | Server data fetch + cache |
| axios | ^1.20 | API calls (cookies ke saath) |
| react-hook-form | ^7.89 | Forms |
| zod | ^4.6 | Validation schemas |
| @hookform/resolvers | ^5.9 | RHF + Zod ko jodta hai |
| clsx | ^2.1 | Conditional class names |
| date-fns | ^4.4 | Dates format karna |
| lucide-react | ^1.52 | Icons |

**Dev:**

| Package | Kaam |
|---|---|
| vite ^8.3, @vitejs/plugin-react | Dev server + build |
| typescript ~6.0 | Types |
| tailwindcss ^4.3, @tailwindcss/vite | Styling (Vite plugin ke through) |
| msw ^2.15 | Backend ready na ho to mock API |
| vitest ^5, jsdom, @testing-library/react, @testing-library/jest-dom | Tests |
| prettier, eslint-config-prettier | Formatting |
| oxlint | Lint (Vite template ke saath aaya) |
| @types/node | `path` wagairah ke types (alias config ke liye) |

---

## 3. Folder structure

```
frontend/
├── public/
├── src/
│   ├── api/            # axios client + har role ke endpoints
│   ├── auth/           # AuthProvider, useAuth, RequireRole
│   ├── layouts/        # PublicLayout, CandidateLayout, PartnerLayout, AdminLayout
│   ├── features/
│   │   ├── public/     # Home, JobSearch, JobDetail, Company
│   │   ├── candidate/  # Dashboard, Profile, Applications, SavedJobs
│   │   ├── partner/    # Dashboard, Jobs, JobEditor, Applicants, Recruiters
│   │   └── admin/      # Dashboard, Partners, Moderation, Users, AuditLogs
│   ├── components/     # Shared UI (Button, Table, Modal, StatusBadge...)
│   ├── hooks/          # useJobs, useApplications (TanStack Query)
│   ├── mocks/          # MSW handlers
│   ├── types/          # Job, Application, Partner, User
│   ├── routes.tsx      # saare routes (abhi bana nahi)
│   └── main.tsx        # entry point
├── index.html
├── vite.config.ts
├── tsconfig*.json
└── package.json
```

Khali folders me `.gitkeep` hai. Pehli file aane par hata dena.

**Rule:** har role ka code apne `features/<role>/` me rahe. Teen portals aapas me mix na ho. Jo cheez 2+ jagah chahiye wo `components/` ya `hooks/` me jaaye.

---

## 4. Kaise banega (build plan)

Order ye rakho. Har step ke baad `npm run build` chala ke dekho.

### Step 1: Base config
1. **Tailwind v4:** `vite.config.ts` me `@tailwindcss/vite` plugin jodo, aur `src/index.css` me `@import "tailwindcss";` rakho.
2. **`@/` alias:** `vite.config.ts` me `resolve.alias` (`@` → `src`), aur `tsconfig.app.json` me `baseUrl` + `paths` (`@/*` → `src/*`).
3. **Env:** `.env.example` banao: `VITE_API_URL=http://localhost:8000`. Asli `.env` git me na jaaye.
4. **Vitest:** `vite.config.ts` me `test` block (`environment: 'jsdom'`, setup file me `@testing-library/jest-dom`).
5. **Scripts:** `package.json` me `dev`, `build`, `test`, `lint`, `format` rakho.
6. **Prettier:** `.prettierrc` banao, aur lint me `eslint-config-prettier` jodo (agar ESLint use karo).

### Step 2: API client (`src/api/client.ts`)
Ek hi axios instance:
- `baseURL = import.meta.env.VITE_API_URL`
- `withCredentials: true` aur `withXSRFToken: true` (Sanctum cookie auth ke liye)
- Login se pehle ek baar `GET /sanctum/csrf-cookie` call hoti hai, phir `POST /api/v1/auth/login`.
- Response interceptor: `401` → login par bhejo, `403` → "access nahi hai" dikhao, `419` → CSRF dobara lo.
- Token localStorage me kabhi mat rakho. Backend HttpOnly session cookie deta hai.

### Step 3: Auth (`src/auth/`)
- `AuthProvider`: app start par `GET /api/v1/auth/me` se user, role aur permissions laata hai.
- `useAuth()`: `user`, `role`, `can(permission)`, `login()`, `logout()`.
- `RequireRole`: route guard. Login nahi → `/login`. Galat role → us role ke apne portal par.
- Buttons permission se hide karo, par yaad rakho ki asli check backend karta hai.

### Step 4: Layouts aur routes (`src/layouts/`, `src/routes.tsx`)
Har layout me sidebar/navbar aur `<Outlet />`. Routes:

| Path | Layout | Guard |
|---|---|---|
| `/`, `/jobs`, `/jobs/:slug`, `/companies/:slug`, `/login`, `/register` | PublicLayout | koi nahi |
| `/candidate/*` | CandidateLayout | `candidate` |
| `/partner/*` | PartnerLayout | `partner_admin`, `partner_recruiter` |
| `/admin/*` | AdminLayout | `super_admin` |

Partner ke andar kuch pages (Recruiters, Company profile) sirf `partner_admin` ko dikhte hain.

### Step 5: Shared components (`src/components/`)
Button, Input, Select, TagInput, Table (pagination ke saath), Modal, ConfirmDialog, StatusBadge, FileUpload, Filters bar, EmptyState, Toast. In sab ka ek hi owner rahe taaki style consistent rahe.

### Step 6: Data fetching pattern
- Har API call ke liye `hooks/` me TanStack Query hook (`useJobs`, `useApplications`...).
- Forms: React Hook Form + Zod schema + `@hookform/resolvers/zod`.
- Lists paginated hain (`?page=&per_page=`). Search filters **URL query params** me rakho taaki link share/bookmark ho sake.
- API responses ke types `src/types/` me.

### Step 7: Mock API (MSW)
Backend endpoint ready na ho to `src/mocks/` me handlers likho aur dev me MSW chalao. Endpoint merge hote hi mock hata do. Pehle API contract (request/response JSON) likh lo, phir dono taraf se kaam shuru.

### Step 8: Features (is order me)
1. Auth screens: Login, Candidate signup, Forgot/Reset password, Verify email notice.
2. Public: Home (search bar), Job search (filter sidebar), Job detail, Company page.
3. Candidate: Profile + resume upload, Apply flow, My applications, Saved jobs, Dashboard.
4. Admin: Partners (list/create/edit/suspend), Moderation queue (approve / reject with reason), Users, Dashboard, Audit logs.
5. Partner: Job editor + jobs list, Applicants list/detail (status change), Recruiters, Company profile, Dashboard.
6. Aakhir me responsive aur accessibility pass.

---

## 5. Screens ki list (module ke hisaab se)

| Module | Screens |
|---|---|
| Auth | Login, Sign up, Forgot password, Reset password, Verify-email notice |
| Job Search | Home, Search results, Job detail, Company page |
| Profile & Resume | Profile editor, Resume upload + preview |
| Applications | Apply modal, My applications, Application detail, Saved jobs, Candidate dashboard |
| Partner Mgmt (Admin) | Partners list, Create/Edit form, Partner detail, Create Partner Admin modal |
| Moderation (Admin) | Queue, Job review (Approve / Reject modal) |
| Users (Admin) | Users list, User detail |
| Analytics (Admin) | Dashboard (stat cards + charts), Audit log list |
| Company & Recruiters | Company profile, Recruiters list, Invite modal |
| Job Posting | Jobs list (status tabs), Job editor, Job detail |
| Applicant Tracking | Applicants list, Applicant detail (status dropdown + timeline) |
| Notifications | Bell icon + dropdown (har layout me) |

---

## 6. Status badges (backend ke saath same naam)

- **Job:** `draft`, `pending_review`, `published`, `closed`, `rejected`
- **Application:** `applied`, `shortlisted`, `interview`, `offered`, `hired`, `rejected`, `withdrawn`
- **Partner / User:** `active`, `suspended`

---

## 7. Commands

```bash
cd frontend
npm install
cp .env.example .env     # .env.example banne ke baad
npm run dev              # http://localhost:5173
npm run build            # type-check + production build
npm run lint             # oxlint
npm test                 # vitest (script jodna baaki hai)
npm run format           # prettier (script jodna baaki hai)
```

Backend `http://localhost:8000` par chalna chahiye. CORS aur Sanctum ke liye `.env` me `SANCTUM_STATEFUL_DOMAINS=localhost:5173` aur `FRONTEND_URL=http://localhost:5173` set hona zaroori hai (backend side).

---

## 8. Dhyan rakhne wali baatein

1. **Port 5173 aur host `localhost` hi rakho.** Sanctum cookie auth ke liye frontend aur backend same domain par (`localhost`) hone chahiye. `127.0.0.1` use mat karo, cookie nahi chalegi.
2. **Backend se `partner_id` kabhi mat bhejo.** Wo server login user se leta hai.
3. **Resume ka link** short-lived signed URL hota hai. Use cache ya save mat karo.
4. **Lint:** Vite template me `oxlint` aaya hai, ESLint nahi. Spec me `eslint-config-prettier` tha. Ya to ESLint config jodo ya oxlint par hi raho aur wo package hata do.
5. `msw` install ke time postinstall script ka warning aaya tha. `npx msw init public/` se worker file banani padegi jab mocks setup karoge.
6. `frontend/` ke andar apna `.git` folder hai (Vite create karte waqt bana). Monorepo me root par ek hi git rakhna hai, to ya to isse hata do ya root init karne se pehle check karo.

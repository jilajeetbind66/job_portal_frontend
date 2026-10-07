# Frontend Kaam ka Batwara (2 Developers)

Frontend par 2 log kaam kar rahe hain. Ye document batata hai ki **kaun kya banayega**, kis order me, aur dono ek-dusre ko kaise block nahi karenge.

Source: "Multi-Tenant Job Portal — Architecture & Plan" doc (Frontend Dev 1 / Frontend Dev 2 ka section).

---

## 1. Ek nazar me

| | **Dev 1** | **Dev 2** |
|---|---|---|
| Kaam | Admin + Partner portals | Setup + Public + Candidate portal |
| Routes | `/admin/*`, `/partner/*` | `/`, `/jobs`, `/jobs/:slug`, `/companies/:slug`, `/login`, `/register`, `/candidate/*` |
| Modules (UI) | 5, 6, 7, 8, 9, 10, 11 | 1, 12, 13, 14 + app setup |
| Pehle kya | Dev 2 ka setup khatam hone ka wait, tab tak layouts ka design | Week 1 me setup, taaki Dev 1 shuru kar sake |

**Naam bhar do:** Dev 1 = `__Tanzeem______`, Dev 2 = `__Vikas______`

---

## 2. Folder ownership

### Dev 2 ke folders (foundation, shared)
- `src/api/`
- `src/auth/`
- `src/components/` (shared components)
- `src/hooks/`
- `src/constants/`
- `src/mocks/`
- `src/routes.jsx`
- `src/main.jsx`
- `src/features/public/`
- `src/features/candidate/`
- `src/layouts/PublicLayout`, `src/layouts/CandidateLayout`

### Dev 1 ke folders
- `src/features/admin/`
- `src/features/partner/`
- `src/layouts/AdminLayout`, `src/layouts/PartnerLayout`

**Rule:** apne folder me jo chaho karo. Dusre ke folder me change chahiye to **PR ya message** se bolo, seedha edit mat karo.

---

## 3. Dev 2 ka kaam: Setup + Public + Candidate

### 3.1 App setup (Week 1, sabse pehle)
- Tailwind (Vite plugin), `@/` alias, `.env.example`, Vitest config, scripts.
- Axios client (`withCredentials`, CSRF cookie call, 401/403 handling).
- TanStack Query provider, MSW mocks.
- `routes.jsx` me saare routes placeholder pages ke saath.
- 4 layouts ke khali shell (taaki Dev 1 apna layout bhar sake).
- Shared constants (`src/constants/`): roles aur job/application status ke naam.

> Ye khatam hone par Dev 1 ko batao. Uske baad hi Dev 1 apne screens shuru karega.

### 3.2 Auth aur routing (Module 1)
- Screens: Login, Candidate signup, Forgot password, Reset password, Verify email notice.
- `AuthProvider`, `useAuth`, `RequireRole` guard.
- Login ke baad role ke hisaab se redirect: `/candidate`, `/partner`, `/admin`.

### 3.3 Shared components
Button, Input, Select, TagInput, Table (pagination), Modal, ConfirmDialog, StatusBadge, FileUpload, Filters bar, EmptyState, Toast.
Dono use karenge. Naya component chahiye to Dev 1 Dev 2 ko batayega.

### 3.4 Public (Module 13)
- Home (search box), Job search results, Job detail, Company page.
- Filter sidebar: keyword, location, company, experience, salary, work mode.
- Filters URL me sync, paginated results, logout hone par "Apply" login par bheje.

### 3.5 Candidate (Modules 12, 14)
- Profile editor (personal info, experience, education, skills), completeness meter.
- Resume upload (progress + preview).
- Apply flow, My applications, Application detail (status timeline), Saved jobs, Candidate dashboard.

### Dev 2 ka order
1. App setup, axios, shared components, MSW (Week 1)
2. Auth screens + `RequireRole` + redirect
3. Public job search aur job detail
4. Candidate profile + resume upload
5. Apply flow, my applications, saved jobs, dashboard
6. Responsive aur accessibility pass

---

## 4. Dev 1 ka kaam: Admin + Partner

Dev 2 ka router aur auth guard ready hone ke baad shuru.

| Module | Screens | UI details |
|---|---|---|
| 5 Partner Management | Partners list, Create/Edit form, Partner detail | Logo upload + preview, status badge, suspend confirm, "Create Partner Admin" modal |
| 6 Job Moderation | Moderation queue, Job review page | Status tabs, Approve button, Reject modal (reason zaroori) |
| 7 User Management | Users list, User detail | Role / partner / status filters, suspend toggle, role dropdown |
| 8 Analytics & Audit Logs | Admin dashboard, Audit log list | Stat cards, charts, date aur actor filters |
| 9 Company & Recruiters | Company profile, Recruiters list | Logo form, invite modal, remove confirm, sirf Partner Admin ko |
| 10 Job Posting | Jobs list, Job editor, Job detail | Multi-section form (Zod), draft vs submit, rejection reason badge |
| 11 Applicant Tracking | Applicants list, Applicant detail | Status tabs, resume viewer, sirf allowed next statuses, history timeline |
| — | Partner dashboard | Open jobs, naye applicants, pending review jobs |

### Dev 1 ka order
1. `AdminLayout` aur `PartnerLayout` (sidebar navigation)
2. Partner Management (testing me partner banane ke liye zaroori)
3. Job editor aur partner jobs list, phir moderation queue
4. Applicants list aur detail
5. Recruiters, company profile, users list
6. Dashboards aur audit logs (sabse last, jab real data aaye)

---

## 5. Aapas me kaam karne ke rules

1. **API contract pehle:** endpoint ka request/response JSON likh ke backend aur frontend dono agree karein, phir code.
2. **Mock se shuru:** backend ready na ho to MSW me mock banao. Endpoint merge hote hi mock hatao.
3. **Shared components ka ek owner (Dev 2):** Dev 1 ko change chahiye to PR kare ya bole.
4. **Roles ke naam same:** `candidate`, `partner_recruiter`, `partner_admin`, `super_admin`.
5. **Status ke naam backend jaise hi:**
   - Job: `draft`, `pending_review`, `published`, `closed`, `rejected`
   - Application: `applied`, `shortlisted`, `interview`, `offered`, `hired`, `rejected`, `withdrawn`
6. **Permissions:** buttons hide karne ke liye `useAuth().can(...)` use karo, par asli check backend karta hai.
7. `partner_id` request me kabhi mat bhejo.
8. **Definition of done:** screen real API se connected ho, loading/error/empty states ho, aur dusra dev review kar de.

---

## 6. Git ka tareeka (suggested)

- `master` par seedha push mat karo. Apni branch banao: `dev1/partners-screen`, `dev2/auth-screens`.
- Chhote PRs, ek feature ek PR.
- Merge se pehle dusra dev review kare.
- `routes.jsx` dono chhuyenge, isliye is file me conflict aa sakta hai. Chhote change karo aur turant merge karo.

---

## 7. Dependency map (kaun kiska wait karega)

```
Dev 2: Setup (Week 1)
   ├── Dev 1: layouts + Partner Management shuru
   └── Dev 2: Auth screens
Dev 2: Auth + RequireRole
   └── Dev 1: sab protected screens real login ke saath test
Backend: Jobs API (Job Posting)
   └── Dev 1: Job editor aur Moderation real data se
Backend: Applications API
   └── Dev 2: Apply flow  |  Dev 1: Applicant tracking
```

---

## 8. Checklist

**Dev 2**
- [ ] Setup (Tailwind, alias, env, Vitest, axios, MSW, routes)
- [ ] Shared components
- [ ] Auth screens + `RequireRole`
- [ ] Public: Home, Search, Job detail, Company
- [ ] Candidate: Profile, Resume
- [ ] Candidate: Apply, Applications, Saved jobs, Dashboard
- [ ] Responsive + accessibility pass

**Dev 1**
- [ ] AdminLayout + PartnerLayout
- [ ] Partners (list, form, detail, create Partner Admin)
- [ ] Jobs list + Job editor
- [ ] Moderation queue + review
- [ ] Applicants list + detail
- [ ] Recruiters + Company profile
- [ ] Users list + detail
- [ ] Admin dashboard + Audit logs
- [ ] Partner dashboard

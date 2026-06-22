# TODO — Guigui BBQ HR Management System

## ✅ Completed

### Session 1 — Architecture + Dashboard UI (2026-06-22)

- [x] Project scaffold (React 19 + Vite 8)
- [x] Install dependencies (firebase, react-router-dom, recharts, framer-motion, react-icons, qrcode.react)
- [x] Design system with CSS custom properties (variables.css, reset.css, typography.css, global.css)
- [x] 15 reusable common components with component-per-folder pattern
- [x] 6 layout components (Sidebar, Navbar, MainLayout, PageContainer, ContentWrapper, Footer)
- [x] Firebase abstraction layer (api/auth.js, api/firestore.js, api/storage.js)
- [x] 7 custom hooks (useAuth, useFirestore, useStorage, useDebounce, useLocalStorage, useMediaQuery, usePagination)
- [x] 7 business service stubs (auth, employee, feedback, forecasting, inventory, notification, sales)
- [x] Utility functions (formatters, validators, dateUtils, fileUtils)
- [x] Constants (roles, inventory, orders, navigation)
- [x] Router with lazy loading and code splitting
- [x] Auth pages UI (Login, Register, Forgot Password) — Vietnamese text
- [x] 404 page
- [x] Sidebar — Guigui BBQ branding, "Quản lý nhân sự" subtitle, 8 HR nav links, logout button
- [x] Navbar — search bar, notification bell with badge, Vietnamese date, manager avatar
- [x] Footer — "© 2024 Guigui BBQ HR Management System"
- [x] WelcomeBanner — red gradient hero with manager greeting
- [x] 4 KPI cards with staggered entrance animation
- [x] QuickActions — 4 pill-shaped action buttons
- [x] ShiftCard — today's shift table (5 placeholder employees)
- [x] AttendanceTable — check-in/out table (4 placeholder rows)
- [x] ShiftRegistrationCard — 48-hour rule with info box
- [x] ChecklistCard — hygiene checklist (5 items, 2/5 progress)
- [x] ActivityTimeline — 5 recent activities with timeline dots
- [x] DashboardPage — assembled all sections with responsive grid
- [x] Placeholder pages for 5 new HR routes (Attendance, MonthlySummary, ShiftRegistration, Checklist, Reports)
- [x] Remove AuthProvider from App.jsx (Firebase not yet configured)
- [x] Build verification — 0 errors, 165 modules, 709ms
- [x] Dev server verification — 0 console errors
- [x] Visual verification via Playwright screenshot

---

## 🔲 Not Started — Next Tasks

### Priority 1: Employee Management Page UI

- [ ] Employee list table with avatar, name, role, phone, status columns
- [ ] Search and filter bar (by name, role, status)
- [ ] Pagination for employee list
- [ ] "Thêm nhân viên" modal/form with all fields
- [ ] Employee detail view / side panel
- [ ] Status badges (Đang làm, Nghỉ phép, Nghỉ việc)
- [ ] Role selector (Quản lý, Nhân viên, Đầu bếp, Phục vụ)

### Priority 2: Attendance Page UI

- [ ] Date picker header
- [ ] Full attendance table with all employees
- [ ] Manual check-in/check-out buttons
- [ ] Late/absent color coding
- [ ] Summary stats at top (total present, late, absent)

### Priority 3: Shift Registration Page UI

- [ ] Weekly calendar grid
- [ ] Shift time slots (Ca sáng, Ca chiều, Ca tối)
- [ ] Employee assignment per slot
- [ ] 48-hour rule visual indicator
- [ ] Swap request UI

### Priority 4: Remaining Page UIs

- [ ] Monthly Summary page — attendance summary table, totals
- [ ] Checklist page — template list, daily assignments, progress
- [ ] Reports page — type selector, date range, chart placeholders
- [ ] Settings page — profile, notifications, system config

### Priority 5: Clean Up Legacy Pages

- [ ] Remove or repurpose legacy placeholder pages (InventoryPage, SalesPage, OrdersPage, FeedbackPage, ForecastingPage) from old restaurant management scope
- [ ] Clean up unused routes in routes.jsx
- [ ] Remove unused service files from old scope

### Priority 6: Firebase Integration

- [ ] Configure Firebase project and environment variables
- [ ] Re-integrate AuthProvider in App.jsx
- [ ] Connect auth pages to Firebase Auth
- [ ] Connect employee data to Firestore
- [ ] Implement real-time attendance tracking

### Priority 7: Business Logic

- [ ] Employee CRUD operations
- [ ] Attendance recording with timestamp validation
- [ ] Shift scheduling with 48-hour rule enforcement
- [ ] Checklist workflow (assign, complete, verify)
- [ ] Report generation from Firestore data

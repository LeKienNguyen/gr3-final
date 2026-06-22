# Roadmap — Guigui BBQ HR Management System

## Phase Overview

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project architecture + design system | ✅ Complete |
| Phase 2 | Manager Dashboard UI skeleton | ✅ Complete |
| Phase 3 | Employee Management page UI | 🔲 Not started |
| Phase 4 | Attendance page UI | 🔲 Not started |
| Phase 5 | Shift Registration page UI | 🔲 Not started |
| Phase 6 | Monthly Summary page UI | 🔲 Not started |
| Phase 7 | Checklist page UI | 🔲 Not started |
| Phase 8 | Reports page UI | 🔲 Not started |
| Phase 9 | Settings page UI | 🔲 Not started |
| Phase 10 | Firebase integration + Authentication | 🔲 Not started |
| Phase 11 | Business logic for all modules | 🔲 Not started |
| Phase 12 | Employee role view | 🔲 Not started |
| Phase 13 | Testing + QA | 🔲 Not started |
| Phase 14 | Deployment | 🔲 Not started |

---

## Phase 1 — Project Architecture ✅

- [x] Vite + React project scaffold
- [x] Folder structure (api, components, config, constants, contexts, data, hooks, layouts, pages, router, services, styles, utils)
- [x] Design system with CSS custom properties (colors, typography, spacing, radius, shadows, transitions, z-index)
- [x] Global styles (reset.css, typography.css, variables.css, global.css)
- [x] 15 reusable common components (Button, Input, Textarea, Select, Modal, Card, Badge, Loading, EmptyState, ConfirmDialog, PageTitle, SectionTitle, SearchBox, Pagination, TableContainer)
- [x] 6 layout components (Navbar, Sidebar, MainLayout, PageContainer, ContentWrapper, Footer)
- [x] Routing with lazy loading and code splitting
- [x] Firebase abstraction layer (api/, services/, hooks/)
- [x] Utility functions (formatters, validators, dateUtils, fileUtils)
- [x] Auth pages UI (Login, Register, Forgot Password)
- [x] 404 Not Found page

## Phase 2 — Manager Dashboard UI ✅

- [x] Sidebar updated with Guigui BBQ branding and HR navigation (8 links + logout)
- [x] Navbar with search bar, notification badge, Vietnamese date, manager avatar
- [x] Footer with Guigui BBQ branding
- [x] WelcomeBanner with gradient hero and greeting
- [x] 4 KPI cards with staggered animation (employees, attendance, shifts, checklists)
- [x] QuickActions pill buttons (add employee, create checklist, view reports, assign shift)
- [x] ShiftCard — today's shift table with employee list and color-coded status
- [x] AttendanceTable — check-in/out table with time, status dots
- [x] ShiftRegistrationCard — 48-hour rule explanation with info box
- [x] ChecklistCard — hygiene checklist with checkboxes, progress counter
- [x] ActivityTimeline — recent activity feed with timeline dots
- [x] Responsive layout verified at desktop/tablet/mobile
- [x] Zero build errors, zero console errors
- [x] Placeholder pages for all HR sidebar routes

## Phase 3 — Employee Management Page (Next)

- [ ] Employee list table with search, filter, pagination
- [ ] Employee detail card / modal
- [ ] Add/edit employee form
- [ ] Employee status badges (active, inactive, on leave)
- [ ] Role assignment UI

## Phase 4 — Attendance Page

- [ ] Date picker for viewing attendance
- [ ] Full attendance table with all employees
- [ ] Check-in / check-out action buttons
- [ ] Late/absent highlighting
- [ ] Export attendance data UI

## Phase 5 — Shift Registration Page

- [ ] Weekly calendar view for shifts
- [ ] Drag-and-drop shift assignment (manager)
- [ ] Employee self-registration form
- [ ] 48-hour rule enforcement display
- [ ] Shift swap requests

## Phase 6 — Monthly Summary Page

- [ ] Monthly attendance summary table
- [ ] Hours worked per employee
- [ ] Overtime tracking
- [ ] Export to CSV/PDF UI

## Phase 7 — Checklist Page

- [ ] Checklist template creation
- [ ] Daily checklist assignment
- [ ] Progress tracking per location/area
- [ ] Photo upload for verification

## Phase 8 — Reports Page

- [ ] Report type selector (attendance, shifts, checklists)
- [ ] Date range picker
- [ ] Charts and graphs (using Recharts)
- [ ] Export functionality UI

## Phase 9 — Settings Page

- [ ] Profile settings
- [ ] Notification preferences
- [ ] System configuration (shift times, locations)
- [ ] User management

## Phase 10 — Firebase Integration

- [ ] Connect Firebase Auth (login, register, forgot password)
- [ ] Connect Firestore for all data modules
- [ ] Firebase Storage for file uploads
- [ ] Environment variable configuration
- [ ] AuthProvider re-integration in App.jsx

## Phase 11 — Business Logic

- [ ] Employee CRUD operations
- [ ] Attendance recording and validation
- [ ] Shift scheduling logic
- [ ] Checklist workflow
- [ ] Report generation
- [ ] Notification system

## Phase 12 — Employee Role View

- [ ] Employee dashboard (limited access)
- [ ] Self-service shift registration
- [ ] Personal attendance history
- [ ] Profile management

## Phase 13 — Testing + QA

- [ ] Component unit tests
- [ ] Page integration tests
- [ ] Responsive testing on real devices
- [ ] Accessibility audit
- [ ] Performance optimization

## Phase 14 — Deployment

- [ ] Firebase Hosting setup
- [ ] CI/CD pipeline
- [ ] Custom domain
- [ ] Production environment variables

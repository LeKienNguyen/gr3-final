# Guigui BBQ — HR Management System

## Overview

Internal Human Resource Management System for **Guigui BBQ** restaurant. Built as a modern SaaS-style dashboard for managing employees, attendance, shift scheduling, hygiene checklists, and reporting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Language | JavaScript (JSX) |
| Routing | React Router v7 |
| Styling | Pure CSS with CSS Custom Properties (no Tailwind, no UI framework) |
| Icons | react-icons (HeroIcons set) |
| Charts | Recharts (installed, not yet used) |
| Animation | Framer Motion (installed, not yet used) + CSS keyframes |
| Backend | Firebase Auth, Firestore, Storage (installed, not yet connected) |
| QR Codes | qrcode.react (installed, not yet used) |

## User Roles

| Role | Access |
|------|--------|
| **Manager** | Full dashboard, employee management, shift assignment, reports, settings |
| **Employee** | Self-service shift registration, attendance, personal profile (not yet built) |

> Current stage: **Manager Dashboard UI only** — no business logic, no Firebase connection.

## Design System

All design tokens are defined in `src/styles/variables.css`.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#C8102E` | Buttons, active states, branding |
| `--color-primary-hover` | `#A50D24` | Button hover, logo gradient |
| `--color-background` | `#F7F8FC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, sidebar, navbar |
| `--color-border` | `#E5E7EB` | Borders, dividers |
| `--color-text-primary` | `#222222` | Headings, body text |
| `--color-text-secondary` | `#666666` | Captions, labels |
| `--color-success` | `#28A745` | Positive status (Đúng giờ, Đang làm) |
| `--color-warning` | `#FFC107` | Warnings (Đi trễ) |
| `--color-danger` | `#DC3545` | Errors, destructive actions |
| `--color-info` | `#0EA5E9` | Informational (Sắp tới, info boxes) |

### Typography

- Font family: Inter (Google Fonts)
- Scale: h1 (2rem) → small (0.75rem), 8 levels
- Weights: regular (400), medium (500), semibold (600), bold (700)

### Spacing

10-step scale from `--space-1` (4px) to `--space-16` (64px).

### Shadows

3 levels: `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

### Border Radius

5 levels: `--radius-sm` (4px) through `--radius-full` (9999px).

## Folder Structure

```
src/
├── api/                    # Firebase abstraction layer
│   ├── auth.js             # Auth wrappers (register, login, logout, reset)
│   ├── firebase.js         # App init, exports auth/db/storage
│   ├── firestore.js        # Generic CRUD + realtime subscriptions
│   ├── storage.js          # File upload/download/delete
│   └── index.js
│
├── components/
│   ├── common/             # 15 reusable UI primitives
│   │   ├── Badge/          # Status badges (success, warning, danger, info)
│   │   ├── Button/         # 5 variants × 3 sizes + loading state
│   │   ├── Card/           # Title + body + footer card wrapper
│   │   ├── ConfirmDialog/  # Modal-based Vietnamese confirm dialog
│   │   ├── EmptyState/     # Empty data placeholder with icon
│   │   ├── Input/          # Text input with label, error, ARIA
│   │   ├── Loading/        # Spinner with size and fullscreen modes
│   │   ├── Modal/          # Portal-based modal with ESC/overlay close
│   │   ├── PageTitle/      # h1 + subtitle + action slot
│   │   ├── Pagination/     # Smart page numbers with Vietnamese labels
│   │   ├── SearchBox/      # Search input with clear button
│   │   ├── SectionTitle/   # h2 + subtitle for sections
│   │   ├── Select/         # Custom-styled select with options
│   │   ├── TableContainer/ # Responsive table with styled header
│   │   ├── Textarea/       # Multi-line input with label, error
│   │   └── index.js        # Barrel export
│   │
│   ├── layout/             # 6 layout building blocks
│   │   ├── ContentWrapper/ # White surface card wrapper
│   │   ├── Footer/         # Guigui BBQ footer
│   │   ├── MainLayout/     # Sidebar + Navbar + Outlet + Footer
│   │   ├── Navbar/         # Search, notifications, date, manager profile
│   │   ├── PageContainer/  # Max-width centered container
│   │   ├── Sidebar/        # Collapsible nav with branding + logout
│   │   └── index.js
│   │
│   └── ui/                 # 7 dashboard-specific widgets
│       ├── ActivityTimeline/     # Recent activity feed with timeline dots
│       ├── AttendanceTable/      # Check-in/out table with status dots
│       ├── ChecklistCard/        # Hygiene checklist with progress
│       ├── KpiCard/              # Animated KPI stat cards
│       ├── QuickActions/         # Pill-shaped action buttons
│       ├── ShiftCard/            # Today's shifts table
│       ├── ShiftRegistrationCard/# Shift rule info with highlighted box
│       └── WelcomeBanner/        # Red gradient welcome hero
│
├── config/
│   └── firebase.config.js  # Environment-based Firebase config
│
├── constants/
│   ├── index.js            # Collections, pagination, app name
│   ├── inventory.js        # Stock statuses, movement types, units
│   ├── navigation.js       # Sidebar links + logout definition
│   ├── orders.js           # Order statuses, payment methods
│   └── roles.js            # User roles (admin, manager, staff, chef)
│
├── contexts/
│   ├── AuthContext.jsx      # Firebase auth state provider (not yet connected)
│   └── index.js
│
├── data/                    # Reserved for mock/static data
│
├── hooks/
│   ├── useAuth.js           # Consumes AuthContext
│   ├── useDebounce.js       # Debounced value
│   ├── useFirestore.js      # Generic Firestore CRUD hook
│   ├── useLocalStorage.js   # Persistent local state
│   ├── useMediaQuery.js     # Responsive breakpoints
│   ├── usePagination.js     # Pagination state
│   ├── useStorage.js        # Firebase Storage hook
│   └── index.js
│
├── layouts/
│   └── AuthLayout/          # Centered card layout for login/register
│
├── pages/                   # 16 route-level pages
│   ├── AttendancePage/      # Chấm công
│   ├── ChecklistPage/       # Checklist vệ sinh
│   ├── DashboardPage/       # Main dashboard (fully built)
│   ├── EmployeesPage/       # Nhân viên (placeholder)
│   ├── FeedbackPage/        # Phản hồi (placeholder, legacy route)
│   ├── ForecastingPage/     # Dự báo AI (placeholder, legacy route)
│   ├── ForgotPasswordPage/  # Quên mật khẩu
│   ├── InventoryPage/       # Kho hàng (placeholder, legacy route)
│   ├── LoginPage/           # Đăng nhập
│   ├── MonthlySummaryPage/  # Tổng công tháng
│   ├── NotFoundPage/        # 404
│   ├── OrdersPage/          # Đơn hàng (placeholder, legacy route)
│   ├── RegisterPage/        # Đăng ký
│   ├── ReportsPage/         # Báo cáo
│   ├── SalesPage/           # Doanh thu (placeholder, legacy route)
│   ├── SettingsPage/        # Cài đặt
│   └── ShiftRegistrationPage/ # Đăng ký ca làm
│
├── router/
│   ├── AppRouter.jsx        # RouterProvider + Suspense fallback
│   ├── routes.jsx           # All routes with lazy loading
│   └── index.js
│
├── services/                # Business logic abstraction (not yet connected)
│   ├── auth.service.js
│   ├── employee.service.js
│   ├── feedback.service.js
│   ├── forecasting.service.js
│   ├── inventory.service.js
│   ├── notification.service.js
│   ├── sales.service.js
│   └── index.js
│
├── styles/
│   ├── global.css           # Font import, body defaults, scrollbar, sr-only
│   ├── reset.css            # CSS reset / normalize
│   ├── typography.css       # Heading/body/caption text classes
│   └── variables.css        # All design tokens
│
├── utils/
│   ├── dateUtils.js         # Date formatting, ranges, helpers
│   ├── fileUtils.js         # File type/size validation, naming
│   ├── formatters.js        # Currency, number, percent, truncate
│   ├── validators.js        # Email, phone, password validation
│   └── index.js
│
├── App.jsx                  # Root component (AppRouter only, no auth)
└── main.jsx                 # Entry point, imports global.css
```

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `KpiCard.jsx` |
| Pages | PascalCase + `Page` | `DashboardPage.jsx` |
| Hooks | camelCase + `use` prefix | `useFirestore.js` |
| Services | camelCase + `.service` suffix | `employee.service.js` |
| Constants | UPPER_SNAKE_CASE | `SIDEBAR_LINKS` |
| CSS files | Match component name | `KpiCard.css` |
| CSS classes | BEM-style | `.kpi-card__value` |
| Folders | PascalCase (components), camelCase (utilities) | `ShiftCard/`, `utils/` |

## Language Policy

- **UI text**: Vietnamese — all buttons, labels, placeholders, messages, navigation
- **Source code**: English — all variables, functions, components, folders, comments

## Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| > 1024px | Desktop |
| 768px–1024px | Tablet |
| 640px–768px | Small tablet |
| < 640px | Mobile |

## How to Run

```bash
cd restaurant-manager
npm install
npm run dev        # Dev server on http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in Firebase credentials:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> Firebase is not yet connected. The app runs without these variables at this stage.

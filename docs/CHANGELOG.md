# Changelog — Guigui BBQ HR Management System

All notable changes to this project are documented in this file.

---

## [0.2.0] — 2026-06-22

### Manager Dashboard UI

**Added — Dashboard Components (7 new UI widgets)**

- `WelcomeBanner` — red gradient hero card with "Xin chào Quản lý!" greeting and decorative circle overlays, slide-in animation on load
- `KpiCard` — stat card with colored icon wrapper (red/green/blue/yellow), large value, description text, hover lift with shadow, staggered entrance animation
- `QuickActions` — horizontal row of pill-shaped action buttons: Thêm nhân viên, Tạo checklist, Xem báo cáo, Phân công ca làm
- `ShiftCard` — table displaying today's shifts with 5 placeholder employees, avatar initials, shift times, color-coded status badges (Đang làm, Sắp tới, Nghỉ phép)
- `AttendanceTable` — check-in/check-out table with 4 placeholder rows, monospace time display, status dots with labels (Đúng giờ, Đi trễ, Chưa đến)
- `ChecklistCard` — hygiene checklist showing 5 items with checkboxes, 2/5 progress counter, completion timestamps, strikethrough for completed items
- `ShiftRegistrationCard` — shift registration rules card with description text and blue info box explaining the 48-hour registration deadline
- `ActivityTimeline` — vertical timeline showing 5 recent activities with colored dot icons per event type (check-in, shift registration, checklist creation, check-out)

**Added — Dashboard Page**

- `DashboardPage` — assembled all 7 dashboard widgets in a responsive grid layout with 4-column KPI grid, 2-column data sections, and 2:1 ratio bottom section
- `DashboardPage.css` — responsive grid that collapses from 4→2→1 columns on tablet/mobile

**Changed — Sidebar**

- Updated branding from "BBQ Manager" to "Guigui BBQ" with "Quản lý nhân sự" subtitle
- Replaced generic restaurant nav items with 8 HR-specific links: Tổng quan, Nhân viên, Chấm công, Tổng công tháng, Đăng ký ca làm, Checklist vệ sinh, Báo cáo, Cài đặt
- Added logout button pinned to sidebar bottom with red hover state
- Logo icon changed to gradient background with box-shadow
- Active nav link now shows a 3px red indicator bar on the left edge
- Hover effect adds 2px horizontal translate

**Changed — Navbar**

- Added centered search input with rounded pill style and "Tìm kiếm nhân viên, ca làm..." placeholder
- Added Vietnamese formatted current date display
- Added notification bell with red badge counter (3)
- Added divider line between notifications and user profile
- Manager avatar now shows "QM" initials with gradient background
- User info shows "Quản lý" name and "Manager" role label
- Search bar and date hide on mobile breakpoints

**Changed — Footer**

- Simplified to single centered line: "© 2024 Guigui BBQ HR Management System"
- Removed support/terms links

**Changed — Navigation Constants**

- Replaced old restaurant navigation items with HR-specific routes
- Added `SIDEBAR_LOGOUT` export for the logout button definition
- Navigation now uses HiOutlineClock, HiOutlineCalendar, HiOutlineClipboardCheck, HiOutlineChartBar, HiOutlineCalendarDays icons

**Changed — Router**

- Added routes: `/attendance`, `/monthly-summary`, `/shift-registration`, `/checklist`, `/reports`
- Removed routes no longer in sidebar: `/inventory`, `/sales`, `/orders`, `/feedback`, `/forecasting`
  - Note: page files still exist for these routes but are no longer routed

**Changed — App.jsx**

- Removed `AuthProvider` wrapper since Firebase is not yet configured — prevents "auth/invalid-api-key" crash on startup

**Added — Placeholder Pages**

- `AttendancePage` — "Chấm công" with subtitle
- `MonthlySummaryPage` — "Tổng công tháng" with subtitle
- `ShiftRegistrationPage` — "Đăng ký ca làm" with subtitle
- `ChecklistPage` — "Checklist vệ sinh" with subtitle
- `ReportsPage` — "Báo cáo" with subtitle

**Changed — Design Token**

- `--color-background` updated from `#F8F9FA` to `#F7F8FC`

**Changed — HTML**

- Page title changed from "BBQ Restaurant Manager" to "Guigui BBQ - Quản lý nhân sự"

---

## [0.1.0] — 2026-06-22

### Project Architecture + Design System

**Added — Project Foundation**

- React 19 + Vite 8 project scaffold with `@` path alias
- Dependencies: firebase, react-router-dom, recharts, framer-motion, react-icons, qrcode.react

**Added — Design System**

- `variables.css` — complete CSS custom properties: colors (12), typography (8 sizes, 4 weights, 3 line-heights), spacing (10 steps), radius (5 levels), shadows (3 levels), layout dimensions, transitions (3 speeds), z-index (5 layers)
- `reset.css` — CSS normalize (box-sizing, margin reset, font inheritance, button/input reset)
- `typography.css` — reusable text classes (heading-1/2/3, subtitle, body-text, caption, button-text, text-small, text-truncate)
- `global.css` — Inter font import, body defaults, focus-visible style, scrollbar styling, sr-only utility

**Added — Common Components (15)**

- `Button` — 5 variants (primary, secondary, outline, ghost, danger), 3 sizes (sm, md, lg), loading spinner, disabled state, focus-visible ring
- `Input` — label, required indicator, error message with ARIA, disabled state, focus ring
- `Textarea` — same API as Input with configurable rows, resizable
- `Select` — custom SVG arrow, options array prop, placeholder, error state
- `Modal` — createPortal-based, ESC key close, overlay click close, 3 sizes (sm, md, lg), header/body/footer slots, slide-in animation
- `Card` — title, subtitle, body, footer with border styling
- `Badge` — 5 variants (default, success, warning, danger, info), pill shape
- `Loading` — CSS spinner animation, 3 sizes, optional text ("Đang tải..."), fullscreen mode
- `EmptyState` — SVG icon, title ("Chưa có dữ liệu"), description, action slot
- `ConfirmDialog` — wraps Modal + Button with Vietnamese defaults ("Xác nhận" / "Hủy")
- `PageTitle` — h1 + subtitle + action slot, responsive (stacks on mobile)
- `SectionTitle` — h2 + subtitle for content sections
- `SearchBox` — inline SVG search icon, clear button, "Tìm kiếm..." placeholder
- `Pagination` — smart ellipsis algorithm, Vietnamese aria-labels ("Trang trước", "Trang sau")
- `TableContainer` — responsive overflow wrapper, styled thead with uppercase headers

**Added — Layout Components (6)**

- `Sidebar` — fixed 260px, collapsible to 64px, mobile drawer with overlay, NavLink active state
- `Navbar` — sticky top bar, hamburger toggle, page title
- `MainLayout` — sidebar + navbar + outlet + footer orchestration, collapse/mobile state
- `PageContainer` — max-width 1280px centered
- `ContentWrapper` — white surface card with border and shadow
- `Footer` — copyright text, responsive

**Added — Firebase Layer**

- `api/firebase.js` — initializeApp, getAuth, getFirestore, getStorage
- `api/auth.js` — register, login, logout, resetPassword, updateProfile, onAuthStateChanged
- `api/firestore.js` — getDocuments, addDocument, updateDocument, deleteDocument, subscribeToCollection, subscribeToDocument
- `api/storage.js` — uploadFile, getFileUrl, deleteFile, listFiles
- `config/firebase.config.js` — environment variable-based configuration
- `.env.example` — template for Firebase credentials

**Added — Services (7)**

- `auth.service.js` — register with profile creation, login, logout, password reset, profile CRUD
- `inventory.service.js` — ingredients, stock movements, suppliers, low stock queries
- `sales.service.js` — orders, daily/monthly sales, date range queries
- `feedback.service.js` — feedback CRUD, feedback URL generation
- `forecasting.service.js` — forecast stubs (demand prediction, purchase recommendations, waste analysis)
- `employee.service.js` — employee CRUD
- `notification.service.js` — notification CRUD, mark as read

**Added — Hooks (7)**

- `useAuth` — consumes AuthContext with error boundary
- `useFirestore` — generic CRUD hook (fetchAll, fetchOne, add, update, remove, subscribe)
- `useStorage` — file upload with progress tracking
- `useDebounce` — debounced value with configurable delay
- `useLocalStorage` — persistent state with JSON serialization
- `useMediaQuery` / `useIsMobile` / `useIsTablet` — responsive breakpoint hooks
- `usePagination` — page state management with navigation helpers

**Added — Utilities**

- `formatters.js` — formatCurrency (VND), formatNumber, formatPercent, truncate, capitalize, slugify
- `validators.js` — isValidEmail, isValidPhone (VN format), isStrongPassword, isRequired, isPositiveNumber, isWithinRange
- `dateUtils.js` — formatDate, formatDateTime (vi-VN locale), getStartOfDay/Month, getEndOfDay/Month, getDaysAgo
- `fileUtils.js` — getFileExtension, generateFileName, isValidFileType, isValidFileSize

**Added — Constants**

- `roles.js` — ROLES (admin, manager, staff, chef) with labels
- `inventory.js` — STOCK_STATUS, MOVEMENT_TYPES, UNITS, LOW_STOCK_THRESHOLD
- `orders.js` — ORDER_STATUS, ORDER_STATUS_LABELS, PAYMENT_METHODS
- `navigation.js` — SIDEBAR_LINKS array with icons
- `index.js` — APP_NAME, COLLECTIONS, PAGINATION, DATE_FORMATS

**Added — Pages (11)**

- `DashboardPage` — placeholder with PageTitle
- `EmployeesPage` — placeholder
- `SettingsPage` — placeholder
- `LoginPage` — form with email/password inputs, Vietnamese text, navigation links
- `RegisterPage` — form with name/email/password/confirm, Vietnamese text
- `ForgotPasswordPage` — form with email input, Vietnamese text
- `NotFoundPage` — 404 with "Không tìm thấy trang" and return button
- `InventoryPage`, `SalesPage`, `OrdersPage`, `FeedbackPage`, `ForecastingPage` — placeholders from initial restaurant scope

**Added — Routing**

- `routes.jsx` — lazy-loaded routes for all pages, AuthLayout for /auth/*, MainLayout for /*, 404 catch-all
- `AppRouter.jsx` — RouterProvider with Suspense + Loading fallback

**Added — Auth Layout**

- `AuthLayout` — centered card with Guigui BBQ logo, subtitle "Hệ thống quản lý nhà hàng", Outlet

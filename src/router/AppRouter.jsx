import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loading } from '@/components/common';
import { MainLayout } from '@/components/layout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })));

const DashboardPage = lazy(() => import('@/pages/DashboardPage/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const EmployeesPage = lazy(() => import('@/pages/EmployeesPage/EmployeesPage').then((m) => ({ default: m.EmployeesPage })));
const AttendancePage = lazy(() => import('@/pages/AttendancePage/AttendancePage').then((m) => ({ default: m.AttendancePage })));
const MonthlySummaryPage = lazy(() => import('@/pages/MonthlySummaryPage/MonthlySummaryPage').then((m) => ({ default: m.MonthlySummaryPage })));
const ShiftRegistrationPage = lazy(() => import('@/pages/ShiftRegistrationPage/ShiftRegistrationPage').then((m) => ({ default: m.ShiftRegistrationPage })));
const ChecklistPage = lazy(() => import('@/pages/ChecklistPage/ChecklistPage').then((m) => ({ default: m.ChecklistPage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading fullscreen text="Đang tải..." />}>
      <Routes>
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<ProtectedRoute requireManager><EmployeesPage /></ProtectedRoute>} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="monthly-summary" element={<MonthlySummaryPage />} />
          <Route path="shift-registration" element={<ShiftRegistrationPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="reports" element={<ProtectedRoute requireManager><ReportsPage /></ProtectedRoute>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

import { lazy } from 'react';
import { MainLayout } from '@/components/layout';
import { AuthLayout } from '@/layouts/AuthLayout';

const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));

const DashboardPage = lazy(() => import('@/pages/DashboardPage/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const EmployeesPage = lazy(() => import('@/pages/EmployeesPage/EmployeesPage').then((m) => ({ default: m.EmployeesPage })));
const AttendancePage = lazy(() => import('@/pages/AttendancePage/AttendancePage').then((m) => ({ default: m.AttendancePage })));
const MonthlySummaryPage = lazy(() => import('@/pages/MonthlySummaryPage/MonthlySummaryPage').then((m) => ({ default: m.MonthlySummaryPage })));
const ShiftRegistrationPage = lazy(() => import('@/pages/ShiftRegistrationPage/ShiftRegistrationPage').then((m) => ({ default: m.ShiftRegistrationPage })));
const ChecklistPage = lazy(() => import('@/pages/ChecklistPage/ChecklistPage').then((m) => ({ default: m.ChecklistPage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const routes = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'monthly-summary', element: <MonthlySummaryPage /> },
      { path: 'shift-registration', element: <ShiftRegistrationPage /> },
      { path: 'checklist', element: <ChecklistPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

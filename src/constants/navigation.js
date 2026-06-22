import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
} from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';

export const SIDEBAR_LINKS = [
  { label: 'Tổng quan', path: '/dashboard', icon: HiOutlineHome, end: true },
  { label: 'Nhân viên', path: '/employees', icon: HiOutlineUserGroup },
  { label: 'Chấm công', path: '/attendance', icon: HiOutlineClock },
  { label: 'Tổng công tháng', path: '/monthly-summary', icon: HiOutlineCalendar },
  { label: 'Đăng ký ca làm', path: '/shift-registration', icon: HiOutlineCalendarDays },
  { label: 'Checklist vệ sinh', path: '/checklist', icon: HiOutlineClipboardCheck },
  { label: 'Báo cáo', path: '/reports', icon: HiOutlineChartBar },
  { label: 'Cài đặt', path: '/settings', icon: HiOutlineCog },
];

export const SIDEBAR_LOGOUT = {
  label: 'Đăng xuất',
  icon: HiOutlineLogout,
};

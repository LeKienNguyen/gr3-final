import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './QuickActions.css';

const MANAGER_ACTIONS = [
  { id: 'add-employee', icon: '👤', label: 'Thêm nhân viên', path: '/employees' },
  { id: 'create-checklist', icon: '📋', label: 'Tạo checklist', path: '/checklist' },
  { id: 'view-reports', icon: '📊', label: 'Xem báo cáo', path: '/reports' },
  { id: 'assign-shift', icon: '📅', label: 'Phân công ca làm', path: '/shift-registration' },
];

const EMPLOYEE_ACTIONS = [
  { id: 'attendance', icon: '⏰', label: 'Chấm công', path: '/attendance' },
  { id: 'my-schedule', icon: '📅', label: 'Lịch ca làm', path: '/shift-registration' },
  { id: 'monthly', icon: '📊', label: 'Tổng công tháng', path: '/monthly-summary' },
  { id: 'checklist', icon: '📋', label: 'Checklist vệ sinh', path: '/checklist' },
];

export const QuickActions = () => {
  const navigate = useNavigate();
  const { isManager } = useAuth();

  const actions = isManager ? MANAGER_ACTIONS : EMPLOYEE_ACTIONS;

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button key={action.id} className="quick-actions__button" onClick={() => navigate(action.path)}>
          <span className="quick-actions__icon">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
};

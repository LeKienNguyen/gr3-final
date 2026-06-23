import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const ACTIONS = [
  { id: 'add-employee', icon: '👤', label: 'Thêm nhân viên', path: '/employees' },
  { id: 'create-checklist', icon: '📋', label: 'Tạo checklist', path: '/checklist' },
  { id: 'view-reports', icon: '📊', label: 'Xem báo cáo', path: '/reports' },
  { id: 'assign-shift', icon: '📅', label: 'Phân công ca làm', path: '/shift-registration' },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      {ACTIONS.map((action) => (
        <button key={action.id} className="quick-actions__button" onClick={() => navigate(action.path)}>
          <span className="quick-actions__icon">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
};

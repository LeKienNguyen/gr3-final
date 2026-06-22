import './QuickActions.css';

const ACTIONS = [
  { id: 'add-employee', icon: '👤', label: 'Thêm nhân viên' },
  { id: 'create-checklist', icon: '📋', label: 'Tạo checklist' },
  { id: 'view-reports', icon: '📊', label: 'Xem báo cáo' },
  { id: 'assign-shift', icon: '📅', label: 'Phân công ca làm' },
];

export const QuickActions = () => (
  <div className="quick-actions">
    {ACTIONS.map((action) => (
      <button key={action.id} className="quick-actions__button">
        <span className="quick-actions__icon">{action.icon}</span>
        {action.label}
      </button>
    ))}
  </div>
);

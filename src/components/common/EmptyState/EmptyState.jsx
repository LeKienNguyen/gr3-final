import './EmptyState.css';

const DefaultIcon = () => (
  <svg className="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

export const EmptyState = ({
  icon: Icon,
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại không có dữ liệu nào để hiển thị.',
  action,
}) => (
  <div className="empty-state">
    {Icon ? <Icon className="empty-state__icon" /> : <DefaultIcon />}
    <h3 className="empty-state__title">{title}</h3>
    <p className="empty-state__description">{description}</p>
    {action}
  </div>
);

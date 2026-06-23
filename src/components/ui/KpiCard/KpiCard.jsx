import './KpiCard.css';

export const KpiCard = ({ icon, label, value, description, color = 'red', delay = 0, onClick }) => (
  <div
    className={`kpi-card${onClick ? ' kpi-card--clickable' : ''}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    <div className={`kpi-card__icon-wrapper kpi-card__icon-wrapper--${color}`}>
      {icon}
    </div>
    <div className="kpi-card__content">
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      {description && <p className="kpi-card__description">{description}</p>}
    </div>
  </div>
);

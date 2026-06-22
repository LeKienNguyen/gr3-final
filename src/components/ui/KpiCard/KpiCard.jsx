import './KpiCard.css';

export const KpiCard = ({ icon, label, value, description, color = 'red', delay = 0 }) => (
  <div
    className="kpi-card"
    style={{ animationDelay: `${delay}ms` }}
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

import './PageTitle.css';

export const PageTitle = ({ title, subtitle, action }) => (
  <div className="page-title">
    <div className="page-title__content">
      <h1 className="page-title__heading">{title}</h1>
      {subtitle && <p className="page-title__subtitle">{subtitle}</p>}
    </div>
    {action && <div className="page-title__action">{action}</div>}
  </div>
);

import './SectionTitle.css';

export const SectionTitle = ({ title, subtitle }) => (
  <div className="section-title">
    <h2 className="section-title__heading">{title}</h2>
    {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
  </div>
);

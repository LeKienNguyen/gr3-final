import './Card.css';

export const Card = ({ children, title, subtitle, footer, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {title && (
      <div className="card__header">
        <div>
          <h3 className="card__title">{title}</h3>
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      </div>
    )}
    <div className="card__body">
      {children}
    </div>
    {footer && (
      <div className="card__footer">
        {footer}
      </div>
    )}
  </div>
);

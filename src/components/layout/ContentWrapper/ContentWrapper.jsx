import './ContentWrapper.css';

export const ContentWrapper = ({ children, className = '' }) => (
  <div className={`content-wrapper ${className}`}>
    {children}
  </div>
);

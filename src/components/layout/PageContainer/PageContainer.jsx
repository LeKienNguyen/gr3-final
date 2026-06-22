import './PageContainer.css';

export const PageContainer = ({ children, className = '' }) => (
  <div className={`page-container ${className}`}>
    {children}
  </div>
);

import './Badge.css';

export const Badge = ({ children, variant = 'default', className = '', ...props }) => (
  <span className={`badge badge--${variant} ${className}`} {...props}>
    {children}
  </span>
);

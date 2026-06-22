import { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

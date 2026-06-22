import { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(({
  label,
  error,
  id,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const fieldClasses = [
    'input-group__field',
    error && 'input-group__field--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label
          htmlFor={id}
          className={`input-group__label${required ? ' input-group__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={fieldClasses}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="input-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

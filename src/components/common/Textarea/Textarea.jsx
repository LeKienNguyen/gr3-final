import { forwardRef } from 'react';
import './Textarea.css';

export const Textarea = forwardRef(({
  label,
  error,
  id,
  rows = 4,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const fieldClasses = [
    'textarea-group__field',
    error && 'textarea-group__field--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="textarea-group">
      {label && (
        <label
          htmlFor={id}
          className={`textarea-group__label${required ? ' textarea-group__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={fieldClasses}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="textarea-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

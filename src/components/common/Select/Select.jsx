import { forwardRef } from 'react';
import './Select.css';

export const Select = forwardRef(({
  label,
  error,
  id,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const fieldClasses = [
    'select-group__field',
    error && 'select-group__field--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="select-group">
      {label && (
        <label
          htmlFor={id}
          className={`select-group__label${required ? ' select-group__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={fieldClasses}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className="select-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

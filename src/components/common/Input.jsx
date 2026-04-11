import { useState, useCallback } from 'react';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon, CloseIcon } from '../icons/Icon';

/**
 * Run Zod schema validation and return the first error message or null.
 * @param {import('zod').ZodType} schema - Zod schema (e.g. z.string().email())
 * @param {unknown} value - Value to validate
 * @returns {string|null}
 */
export function getValidationError(schema, value) {
  if (!schema) return null;
  const result = schema.safeParse(value);
  if (result.success) return null;
  const issue = result.error.issues?.[0];
  return issue?.message ?? 'Invalid value';
}

/**
 * Reusable form input with label, optional error, and optional Zod validation.
 * @param {string} [label] - Label text
 * @param {boolean} [required] - If true, shows an asterisk (*) after the label to indicate required field
 * @param {string} [type='text'] - Input type (text, email, password, textarea, etc.)
 * @param {string} [id] - Input id (for label htmlFor)
 * @param {string} [className] - Extra classes for wrapper
 * @param {string} [error] - Error message from parent (e.g. form-level validation)
 * @param {import('zod').ZodType} [schema] - Optional Zod schema for this field (validates on blur and when value changes)
 * @param {object} [inputProps] - Rest props passed to the native input (value, onChange, etc.)
 */
export default function Input({
  label,
  required = false,
  type = 'text',
  id,
  className = '',
  error: errorProp,
  schema,
  clearable = false,
  onClear,
  onChange,
  ...inputProps
}) {
  const [touchedError, setTouchedError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const value = inputProps.value ?? '';
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const validate = useCallback(() => {
    if (!schema) return null;
    return getValidationError(schema, value);
  }, [schema, value]);

  const handleBlur = useCallback(
    (e) => {
      const message = validate();
      setTouchedError(message || null);
      inputProps.onBlur?.(e);
    },
    [validate, inputProps.onBlur]
  );

  const handleChange = useCallback(
    (e) => {
      onChange?.(e);
      if (touchedError) {
        const nextMessage = getValidationError(schema, e.target.value);
        setTouchedError(nextMessage || null);
      }
    },
    [onChange, touchedError, schema]
  );

  const handleClear = useCallback(() => {
    setTouchedError(null);
    onClear?.();
    // If parent passes `onChange`, call it with a synthetic event so `e.target.value` becomes ''.
    if (onChange) onChange({ target: { value: '' } });
  }, [onChange, onClear]);

  const error = (errorProp && String(errorProp).trim()) ? errorProp : touchedError;

  const inputClassName = `w-full py-3 text-base border-2 rounded-[10px] bg-white dark:bg-gray-700 text-text dark:text-gray-200 transition-colors ${isPassword ? 'pl-4 pr-11' : 'px-4'} ${type === 'number' ? '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] appearance-[textfield]' : ''} ${isTextarea ? 'min-h-[120px] resize-y' : ''} ${error ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20 focus:outline-none' : 'border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20'}`;

  return (
    <div className={className || 'mb-4'}>
      {label && (
        <label htmlFor={inputId} className="block font-medium mb-1.5 text-text dark:text-gray-300">
          {label}
          {required && <span className="text-error" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="relative">
        {isTextarea ? (
          <textarea
            id={inputId}
            name={inputProps.name}
            placeholder={inputProps.placeholder}
            required={required}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...Object.fromEntries(Object.entries(inputProps).filter(([k]) => !['name', 'placeholder', 'required', 'value', 'onChange', 'onBlur'].includes(k)))}
          />
        ) : (
          <input
            id={inputId}
            type={inputType}
            className={inputClassName}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            {...inputProps}
          />
        )}
        {!isPassword && clearable && !isTextarea && value && (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded text-text-muted dark:text-gray-400 hover:text-text dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20"
            aria-label="Clear input"
            tabIndex={-1}
          >
            <CloseIcon className="text-[22px]" />
          </button>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded text-text-muted dark:text-gray-400 hover:text-text dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon className="text-[26px]" /> : <EyeIcon className="text-[22px]" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

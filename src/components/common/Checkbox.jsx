import { forwardRef, useEffect, useRef, useState } from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 rounded-[4px]',
  md: 'h-5 w-5 rounded-[5px]',
};

/**
 * Custom checkbox: unchecked (white + gray border), checked (purple + checkmark), indeterminate (purple + minus).
 * @param {string} [size='md'] - 'sm' | 'md'
 * @param {React.ReactNode} [label] - Optional label (rendered to the right)
 * @param {boolean} [indeterminate] - When true, show indeterminate state (or set input.indeterminate via ref)
 * @param {string} [className] - Extra classes for the wrapper
 * @param {object} [props] - Rest passed to the native input (checked, onChange, etc.)
 */
const Checkbox = forwardRef(function Checkbox(
  { size = 'md', label, className = '', id, checked, indeterminate, onChange, ...props },
  ref
) {
  const [state, setState] = useState('unchecked');
  const innerRef = useRef(null);
  const boxClass = sizeClasses[size] || sizeClasses.md;
  const inputId = id || (label ? `checkbox-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const setRef = (el) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const sync = () => setState(el.indeterminate ? 'indeterminate' : el.checked ? 'checked' : 'unchecked');
    sync();
    el.addEventListener('change', sync);
    return () => el.removeEventListener('change', sync);
  }, [checked]);

  useEffect(() => {
    const el = innerRef.current;
    if (el && typeof indeterminate === 'boolean') {
      el.indeterminate = indeterminate;
      setState(indeterminate ? 'indeterminate' : el.checked ? 'checked' : 'unchecked');
    }
  }, [indeterminate, checked]);

  const isChecked = state === 'checked';
  const isIndeterminate = state === 'indeterminate';
  const isFilled = isChecked || isIndeterminate;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 select-none ${className}`.trim()}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={setRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <span
          className={`${boxClass} inline-flex items-center justify-center border-2 transition-colors ${
            isFilled
              ? 'border-info bg-info text-white dark:border-info dark:bg-info dark:text-white'
              : 'border-slate-300 bg-white dark:border-gray-500 dark:bg-gray-700'
          }`}
          aria-hidden
        >
          {/* Checkmark - shown when checked (white for both modes) */}
          {isChecked && (
            <span className="flex items-center justify-center text-white [&_path]:stroke-white">
              <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={size === 'sm' ? 'h-2 w-2.5' : 'h-2.5 w-3'}>
                <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {/* Minus - shown when indeterminate (white for both modes) */}
          {isIndeterminate && (
            <span className="flex items-center justify-center text-white [&_path]:stroke-white">
              <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" className={size === 'sm' ? 'h-0.5 w-2' : 'h-0.5 w-2.5'}>
                <path d="M1 1H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          )}
        </span>
      </span>
      {label != null && (
        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{label}</span>
      )}
    </label>
  );
});

export default Checkbox;

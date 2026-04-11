import { useId, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '../icons';

/**
 * Professional custom dropdown with styled trigger and options panel.
 * @param {string} [label] - Optional label above the dropdown
 * @param {boolean} [required] - If true, shows an asterisk (*) after the label to indicate required field
 * @param {string} [placeholder] - Placeholder when value is empty (e.g. "All categories")
 * @param {string} value - Current value (controlled)
 * @param {function(string): void} onChange - Called with the selected value
 * @param {Array<{ value: string, label: string }> | Array<{ _id: string, name: string }>} options - List of options
 * @param {string} [className] - Extra classes for the wrapper
 * @param {string} [id] - Optional id for the trigger (for label htmlFor)
 * @param {boolean} [disabled] - Disable the dropdown
 * @param {function()} [onBlur] - Called when the trigger loses focus (e.g. for on-touch validation)
 * @param {string} [error] - Error message to show below the trigger (same as Input; applies error border styling)
 * @param {boolean} [showPlaceholderOption=true] - When false, the "Select" / clear option at the top of the list is hidden
 * @param {import('react').ReactNode} [triggerContent] - When set, shown in the trigger instead of the selected label (e.g. header menus)
 * @param {string} [triggerClassName] - Extra classes on the trigger button
 * @param {string} [triggerAriaLabel] - aria-label on trigger when using triggerContent
 * @param {number} [panelMinWidth] - Minimum panel width in px (panel can be wider than the trigger)
 * @param {'start'|'end'} [panelAlign='start'] - end: align panel to trigger’s right edge (e.g. header profile)
 * @param {boolean} [usePortal=true] - When false, panel is absolutely positioned under the trigger (stays with scroll/layout; use for table pagination, etc.)
 */
export default function Dropdown({
  label,
  required = false,
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
  id: idProp,
  disabled = false,
  onBlur,
  error,
  showPlaceholderOption = true,
  triggerContent,
  triggerClassName = '',
  triggerAriaLabel,
  panelMinWidth,
  panelAlign = 'start',
  usePortal = true,
}) {
  const generatedId = useId();
  const id = idProp || (label ? `dropdown-${generatedId.replace(/:/g, '')}` : undefined);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [panelRect, setPanelRect] = useState(null);
  /** Inline panel opens upward when there is not enough viewport space below (e.g. table footer). */
  const [inlineOpenUp, setInlineOpenUp] = useState(false);

  const normalizedOptions = options.map((opt) =>
    opt.value !== undefined && opt.label !== undefined
      ? {
          value: opt.value,
          label: opt.label,
          icon: opt.icon,
          optionTone: opt.optionTone,
          dividerBefore: opt.dividerBefore,
        }
      : { value: opt._id, label: opt.name }
  );

  const selectedOption = normalizedOptions.find(
    (o) => String(o.value) === String(value)
  );
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || 'Select');

  const updatePanelRect = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const w = Math.max(rect.width, panelMinWidth || 0);
    const left = panelAlign === 'end' ? rect.right - w : rect.left;
    const gap = 6;
    const panelMaxH = 240;
    const innerH = window.innerHeight;
    const spaceBelow = innerH - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    // Open upward when the viewport has little room below (e.g. table footer) but more room above.
    const flipThreshold = 120;
    const openAbove =
      spaceBelow < flipThreshold && spaceAbove > spaceBelow && spaceAbove >= 72;

    if (openAbove) {
      setPanelRect({
        placement: 'above',
        left,
        width: w,
        bottom: innerH - rect.top + gap,
        maxHeight: Math.min(panelMaxH, Math.max(96, spaceAbove - gap)),
      });
    } else {
      setPanelRect({
        placement: 'below',
        left,
        width: w,
        top: rect.bottom + gap,
        maxHeight: Math.min(panelMaxH, Math.max(96, spaceBelow - gap)),
      });
    }
  }, [panelMinWidth, panelAlign]);

  useLayoutEffect(() => {
    if (!open) {
      setPanelRect(null);
      return;
    }

    if (!usePortal) {
      const measureInline = () => {
        const trigger = triggerRef.current;
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        const gap = 8;
        const panelMax = 240;
        const spaceBelow = window.innerHeight - rect.bottom - gap;
        const spaceAbove = rect.top - gap;
        setInlineOpenUp(spaceBelow < panelMax && spaceAbove > spaceBelow);
      };
      measureInline();
      window.addEventListener('resize', measureInline);
      document.addEventListener('scroll', measureInline, true);
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.addEventListener('resize', measureInline);
        window.visualViewport.addEventListener('scroll', measureInline);
      }
      return () => {
        window.removeEventListener('resize', measureInline);
        document.removeEventListener('scroll', measureInline, true);
        if (typeof window !== 'undefined' && window.visualViewport) {
          window.visualViewport.removeEventListener('resize', measureInline);
          window.visualViewport.removeEventListener('scroll', measureInline);
        }
      };
    }

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updatePanelRect();
      });
    };

    updatePanelRect();

    const trigger = triggerRef.current;
    const ro = trigger ? new ResizeObserver(scheduleUpdate) : null;
    if (trigger && ro) ro.observe(trigger);

    window.addEventListener('resize', scheduleUpdate);
    document.addEventListener('scroll', scheduleUpdate, true);

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', scheduleUpdate);
      window.visualViewport.addEventListener('scroll', scheduleUpdate);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      document.removeEventListener('scroll', scheduleUpdate, true);
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', scheduleUpdate);
        window.visualViewport.removeEventListener('scroll', scheduleUpdate);
      }
    };
  }, [open, usePortal, updatePanelRect]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    const idx = normalizedOptions.findIndex(
      (o) => String(o.value) === String(value)
    );
    if (e.key === 'ArrowDown' && idx < normalizedOptions.length - 1) {
      e.preventDefault();
      onChange(normalizedOptions[idx + 1].value);
    }
    if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault();
      onChange(normalizedOptions[idx - 1].value);
    }
    if (e.key === 'Enter' && selectedOption) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const panelBgStyle = {
    backgroundImage:
      'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCkiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzNykiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right top, left bottom',
  };

  const panelSurfaceClass =
    'py-1.5 rounded-[10px] border-2 border-gray-200 dark:border-gray-600 shadow-xl overflow-y-auto overflow-x-hidden outline-none backdrop-blur-[20px] bg-white/90 dark:bg-gray-800/90 transition-shadow duration-300';

  const listboxContent = (
    <>
      {showPlaceholderOption && (
        <button
          type="button"
          role="option"
          aria-selected={!value}
          id={value ? undefined : `${id}-placeholder`}
          onClick={() => handleSelect('')}
          className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${
            !value
              ? 'bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {placeholder || 'Select'}
        </button>
      )}
      {normalizedOptions.flatMap((opt) => {
        const isSelected = String(value) === String(opt.value);
        const danger = opt.optionTone === 'danger';
        const row = (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            id={`${id}-opt-${opt.value}`}
            onClick={() => handleSelect(opt.value)}
            className={`flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm font-medium transition-colors ${
              danger
                ? 'text-error hover:bg-error-lighter dark:hover:bg-error-lighter/30 dark:text-error-light'
                : isSelected
                  ? 'bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {opt.icon ? <span className="flex shrink-0">{opt.icon}</span> : null}
            <span className="min-w-0">{opt.label}</span>
          </button>
        );
        if (opt.dividerBefore) {
          return [
            <div
              key={`${opt.value}-sep`}
              className="my-1.5 border-t border-gray-200 dark:border-gray-600"
              role="separator"
            />,
            row,
          ];
        }
        return [row];
      })}
    </>
  );

  const showPanel = open && (usePortal ? panelRect : true);

  return (
    <div className={className || 'w-full'} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-error" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-label={triggerAriaLabel || label || placeholder || 'Select option'}
          className={`relative flex items-center justify-between gap-3 pl-5 pr-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white shadow-sm transition-[border-color,box-shadow] duration-75 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            triggerContent ? 'w-auto min-w-0' : 'w-full'
          } ${
            error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20 focus:outline-none'
              : open
                ? 'border-primary dark:border-secondary ring-2 ring-primary/20 dark:ring-secondary/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-secondary dark:focus:border-secondary'
          } ${!selectedOption && !triggerContent ? 'text-gray-500 dark:text-gray-400' : ''} ${triggerClassName}`.trim()}
        >
        <div className={`flex min-w-0 items-center justify-between gap-3 ${triggerContent ? '' : 'w-full'}`}>
          {triggerContent != null ? (
            <span className="inline-flex min-w-0 items-center gap-2">{triggerContent}</span>
          ) : (
            <span className="min-w-0">{displayLabel}</span>
          )}
          <span
            className={`flex shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-75 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <ChevronDownIcon className={triggerContent ? 'text-lg' : 'text-2xl'} />
          </span>
        </div>
        </button>

        {showPanel &&
          (usePortal && panelRect
            ? createPortal(
                <div
                  ref={panelRef}
                  role="listbox"
                  className={`fixed z-2000 ${panelSurfaceClass}`}
                  style={{
                    left: panelRect.left,
                    width: panelRect.width,
                    minWidth: 'auto',
                    maxHeight: panelRect.maxHeight,
                    ...(panelRect.placement === 'above'
                      ? { bottom: panelRect.bottom, top: 'auto' }
                      : { top: panelRect.top, bottom: 'auto' }),
                    ...panelBgStyle,
                  }}
                  aria-activedescendant={value ? `${id}-opt-${value}` : undefined}
                >
                  {listboxContent}
                </div>,
                document.body,
              )
            : !usePortal && (
                <div
                  ref={panelRef}
                  role="listbox"
                  className={`absolute left-0 right-0 z-2100 min-w-full max-h-[240px] ${inlineOpenUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} ${panelSurfaceClass}`}
                  style={panelBgStyle}
                  aria-activedescendant={value ? `${id}-opt-${value}` : undefined}
                >
                  {listboxContent}
                </div>
              ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

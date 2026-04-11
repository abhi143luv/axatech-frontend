import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TrashIcon, PenIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUpIcon, CloseIcon, SearchIcon } from '../icons';
import { Dropdown, Checkbox, Loader } from './index';
import Badge from './Badge';

const tableClass = 'w-full border-collapse text-sm';
const thBaseClass =
  'border-b border-slate-200 border-dashed bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400';
const tdBaseClass =
  'border-b border-slate-200 border-dashed px-4 py-3 text-slate-700 dark:border-gray-600 dark:text-gray-300';
const rowHoverClass = 'transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/30';

const actionMenuClass =
  'fixed z-11 min-w-[140px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-gray-600 dark:bg-gray-800';
// they are mostly same classes, only color classes differ
const baseActionMenuItemClass =
  'flex w-full items-center gap-2 px-1 py-2.5 rounded-md text-left text-sm font-medium cursor-pointer';
const actionMenuItemClass = `${baseActionMenuItemClass} text-slate-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-700`;
const actionMenuDeleteClass = `${baseActionMenuItemClass} text-error hover:bg-error-lighter dark:hover:bg-gray-700`;


function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClass + (className ? ` ${className}` : '')}>
        {children}
      </table>
    </div>
  );
}

function Head({ children, columns, selectAll, sortState, onSort }) {
  return (
    <thead>
      <tr>
        {selectAll && (
          <th className={`${thBaseClass} w-10 px-2 text-center`}>
            <Checkbox
              ref={selectAll.indeterminateRef}
              checked={selectAll.checked}
              indeterminate={selectAll.indeterminate}
              onChange={selectAll.onChange}
              aria-label="Select all rows"
              size="sm"
              className="justify-center"
            />
          </th>
        )}
        {columns
          ? columns.map((col, i) => {
              const key = col.key ?? i;
              const isSortable = col.sortable && typeof onSort === 'function';
              const isSorted = sortState && sortState.key === key;
              const direction = isSorted ? sortState.direction : null;
              return (
                <Th key={key} align={col.align} className={col.className} isSortable={isSortable} isSorted={isSorted} direction={direction} onSort={isSortable ? () => onSort(key) : undefined} label={col.label} />
              );
            })
          : children}
      </tr>
    </thead>
  );
}

function Body({ children }) {
  return <tbody>{children}</tbody>;
}

/**
 * Single row shown when the table has no data. Centered icon (ic-content.svg) + "No data" text.
 * Uses border radius and gap like the reference UI.
 * @param {number} colSpan - Number of columns to span (must match table header column count, including selection column if any)
 * @param {string} [message='No data'] - Message to show below the icon
 * @param {string} [className] - Extra classes for the td
 */
function EmptyState({ colSpan, message = 'No data', className = '' }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`${tdBaseClass} border-0 py-8 align-middle ${className}`.trim()}
      >
        <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-5 py-10 rounded-xl border border-slate-200/80 bg-white  dark:border-gray-600/80 dark:bg-gray-800/80">
          <img
            src="/images/ic-content.svg"
            alt=""
            width={120}
            height={120}
            className=" w-full max-w-[160px] shrink-0"
            aria-hidden
          />
          <p className="text-lg font-medium text-slate-500 dark:text-gray-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

Table.EmptyState = EmptyState;

/**
 * Single row shown while table data is loading from API.
 * Shows centered Loader inside the same styled container as EmptyState.
 * @param {number} colSpan - Number of columns to span
 * @param {string} [message='Loading...'] - Optional text to show below the loader
 * @param {string} [className] - Extra classes for the td
 */
function LoadingState({ colSpan, message = 'Loading...', className = '' }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`${tdBaseClass} border-0 py-8 align-middle ${className}`.trim()}
      >
        <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-5 py-10 rounded-xl border border-slate-200/80 bg-white dark:border-gray-600/80 dark:bg-gray-800/80">
          <Loader />
          {message && (
            <p className="text-lg font-medium text-slate-500 dark:text-gray-400">{message}</p>
          )}
        </div>
      </td>
    </tr>
  );
}

Table.LoadingState = LoadingState;

function Row({ children, className = '', hover = true }) {
  return (
    <tr className={(hover ? rowHoverClass : '') + (className ? ` ${className}` : '')}>
      {children}
    </tr>
  );
}

function Th({ children, align = 'left', className = '', isSortable, isSorted, direction, onSort, label }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  const buttonClass = align === 'right' ? 'justify-end text-right' : 'justify-start text-left';
  const content = label != null ? (
    isSortable ? (
      <button
        type="button"
        onClick={onSort}
        className={`inline-flex items-center gap-1 w-full font-inherit text-inherit uppercase tracking-wider ${buttonClass} hover:text-slate-700 dark:hover:text-gray-200`}
        aria-sort={isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        {isSorted && (
          <span className={`inline-block transition-transform duration-100 ease-in-out ${direction === 'asc' ? '-rotate-180' : ''}`}>
            <ArrowUpIcon className="text-base  shrink-0" />
          </span>
        )}
      </button>
    ) : (
      label
    )
  ) : (
    children
  );
  return (
    <th className={`${thBaseClass} ${alignClass}${className ? ` ${className}` : ''}`}>
      {content}
    </th>
  );
}

function Td({ children, align, colSpan, className = '' }) {
  const alignClass = align === 'right' ? 'text-right' : '';
  return (
    <td
      colSpan={colSpan}
      className={`${tdBaseClass} ${alignClass}${className ? ` ${className}` : ''}`}
    >
      {children}
    </td>
  );
}

/**
 * Cell that wraps the row selection checkbox. Use when table has selectAll in Head.
 * @param {boolean} checked - Whether the row is selected
 * @param {function(): void} onChange - Called when checkbox is toggled
 * @param {string} [ariaLabel] - Accessible label, e.g. "Select Plan name"
 */
function SelectionCell({ checked, onChange, ariaLabel = 'Select row', className = '' }) {
  return (
    <td className={`${tdBaseClass} w-10 px-2 text-center ${className}`.trim()}>
      <Checkbox
        size="sm"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="justify-center"
      />
    </td>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Th = Th;
Table.Td = Td;
Table.SelectionCell = SelectionCell;

/**
 * Bulk selection bar shown above table body when rows are selected.
 * @param {number} selectedCount - Number of selected rows (bar hidden when 0)
 * @param {number} [totalCount] - Total rows; when provided, checkbox is indeterminate when 0 < selectedCount < totalCount
 * @param {function(): void} onClearSelection - Called when user clears selection (checkbox or label click)
 * @param {function(): void} [onBulkDelete] - Optional; if provided, shows delete button
 * @param {string} [label='selected'] - Text after count, e.g. "5 selected"
 * @param {string} [className] - Extra classes for the bar wrapper
 */
function SelectionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onBulkDelete,
  label = 'selected',
  className = '',
}) {
  const allSelected = totalCount != null && totalCount > 0 && selectedCount === totalCount;
  const indeterminate = totalCount != null && selectedCount > 0 && selectedCount < totalCount;
  const showChecked = totalCount == null ? true : allSelected;

  if (selectedCount === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`${selectedCount} ${label}`}
      className={`flex items-center justify-between gap-3 border-b border-success-light bg-success-lighter px-4 py-2.5 text-sm font-medium text-success-dark dark:border-success-dark dark:bg-success-darker/30 dark:text-success-light ${className}`.trim()}
    >
      <button
        type="button"
        onClick={onClearSelection}
        className="flex items-center gap-2 rounded-md hover:bg-success-lighter dark:hover:bg-success-darker/30"
        aria-label="Clear selection"
      >
        <Checkbox
          checked={showChecked}
          indeterminate={indeterminate}
          readOnly
          size="sm"
          aria-hidden
        />
        <span>{selectedCount} {label}</span>
      </button>
      {onBulkDelete && (
        <button
          type="button"
          onClick={onBulkDelete}
          aria-label="Delete selected"
          className="inline-flex items-center justify-center rounded-lg p-2 text-success-dark hover:bg-error-lighter hover:text-error dark:text-success-light dark:hover:bg-error-lighter/30 dark:hover:text-error-light"
        >
          <TrashIcon className="text-xl" />
        </button>
      )}
    </div>
  );
}

Table.SelectionBar = SelectionBar;

/**
 * Status tabs row: tab buttons with badge counts. Use above table toolbar (e.g. with search).
 * @param {Array<{ value: string, label: string, variant?: string, activeVariant?: string, activeSolid?: boolean }>} tabs - Tab config (value, label, variant, activeVariant, activeSolid)
 * @param {string} value - Current selected tab value
 * @param {function(string): void} onChange - Called when a tab is clicked
 * @param {Record<string, number>} [counts={}] - Map of tab value to count for badge
 * @param {string} [className] - Extra classes for the wrapper div
 */
function StatusTabs({ tabs = [], value, onChange, counts = {}, className = '' }) {
  return (
    <div
      className={`flex flex-wrap gap-0 px-4 pt-4 pb-0 border-b border-slate-200 dark:border-gray-600 ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const count = counts[tab.value] ?? 0;
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`cursor-pointer flex items-center gap-2 rounded-t-lg border-b-2 -mb-px px-5 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-transparent text-slate-900 dark:text-white border-slate-900 dark:border-white'
                : 'border-transparent bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
            <Badge
              size="sm"
              variant={isActive ? tab.activeVariant : tab.variant}
              solid={isActive && !!tab.activeSolid}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}

Table.StatusTabs = StatusTabs;

const searchInputClass =
  'h-[42px] w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-secondary dark:focus:ring-secondary/20';

/**
 * Toolbar row for table filters: flex wrapper for search + optional dropdowns/buttons.
 * @param {React.ReactNode} [children] - Toolbar content (e.g. Table.SearchInput, Dropdown, buttons)
 * @param {string} [className] - Extra classes for the wrapper
 */
function Toolbar({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 px-4 py-3 ${className}`.trim()}>
      {children}
    </div>
  );
}

Table.Toolbar = Toolbar;

/**
 * Search input with icon for table toolbar.
 * @param {string} [value] - Controlled value
 * @param {function(React.ChangeEvent): void} [onChange] - Change handler
 * @param {string} [placeholder='Search...'] - Placeholder text
 * @param {string} [ariaLabel] - Accessible label (e.g. "Search products")
 * @param {string} [className] - Extra classes for the wrapper div (e.g. flex-1 min-w-[200px])
 */
function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  className = '',
  debounceMs = 500,
}) {
  const hasDebounce = typeof debounceMs === 'number' && debounceMs > 0 && typeof onChange === 'function';
  const [draftValue, setDraftValue] = useState(value ?? '');
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Sync displayed text when parent updates (clear / filter reset).
    setDraftValue(value ?? '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    if (!hasDebounce) {
      onChange?.(e);
      return;
    }

    const next = e?.target?.value ?? '';
    setDraftValue(next);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Empty input should apply immediately for good UX.
    if (String(next).trim() === '') {
      onChange?.({ target: { value: '' } });
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange?.({ target: { value: next } });
    }, debounceMs);
  };

  return (
    <div className={`relative flex flex-1 min-w-[200px] items-center ${className}`.trim()}>
      <span
        className="pointer-events-none absolute left-0 top-0 flex h-[42px] w-10 items-center justify-center text-slate-400 dark:text-gray-500"
        aria-hidden
      >
        <SearchIcon className="text-xl leading-none" />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        value={hasDebounce ? draftValue : value}
        onChange={handleChange}
        className={searchInputClass}
        aria-label={ariaLabel}
      />
    </div>
  );
}

Table.SearchInput = SearchInput;

const toolbarDropdownClass =
  'w-40 [&_button]:h-[42px] [&_button]:py-2.5 [&_button]:rounded-lg [&_button]:border [&_button]:border-slate-200 [&_button]:text-sm [&_button]:bg-white [&_button]:dark:border-gray-600 [&_button]:dark:bg-gray-700';

/**
 * Dropdown for table toolbar. Use inside Table.Toolbar so multiple filter dropdowns share the same size and style.
 * Same props as Dropdown (value, onChange, options, placeholder, showPlaceholderOption, etc.); className is merged with toolbar styles.
 */
function ToolbarDropdown({ className = '', ...props }) {
  return (
    <Dropdown
      {...props}
      className={`${toolbarDropdownClass} ${className}`.trim()}
    />
  );
}

Table.ToolbarDropdown = ToolbarDropdown;

/**
 * Active filters bar: shows applied filters as removable chips, result count, and Clear all.
 * @param {Array<{ id: string, label: string, value: string, onRemove: function(): void }>} filters - Active filter chips to show
 * @param {number} resultCount - Number of results after filtering (e.g. "0 results found")
 * @param {function(): void} onClearAll - Called when user clicks Clear to remove all filters
 * @param {string} [className] - Extra classes for the bar wrapper
 */
function ActiveFilters({ filters = [], resultCount, onClearAll, className = '' }) {
  if (filters.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Active filters"
      className={`flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-700/20 ${className}`.trim()}
    >
      <span className="font-medium text-slate-600 dark:text-gray-400" aria-live="polite">
        {resultCount === 0 ? '0' : resultCount} results found
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <span
            key={f.id}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-200 pl-3 pr-1.5 py-1.5 text-slate-700 dark:border-gray-600 dark:text-gray-200"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium leading-none">
              {f.label}:
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-1.5 py-1 dark:bg-gray-600">
                <span className="text-[11px] leading-none">{f.value}</span>
                <button
                  type="button"
                  onClick={f.onRemove}
                  aria-label={`Remove ${f.label} filter`}
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-400 text-slate-700 hover:bg-gray-500 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-400"
                >
                  <CloseIcon className="text-[10px] text-white" />
                </button>
              </span>
            </span>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-error bg-transparent hover:bg-error/10"
        aria-label="Clear all filters"
      >
        <TrashIcon className="text-lg" />
        Clear
      </button>
    </div>
  );
}

Table.ActiveFilters = ActiveFilters;

/**
 * Table footer pagination: rows per page dropdown, "start-end of total", prev/next buttons.
 * @param {number} page - Current page (1-based)
 * @param {number} rowsPerPage - Rows per page
 * @param {number} totalRows - Total number of rows
 * @param {function(number): void} onPageChange - Called with new page (1-based)
 * @param {function(number): void} onRowsPerPageChange - Called with new rows per page
 * @param {number[]} [rowsPerPageOptions=[5, 10, 20, 50]] - Options for rows per page dropdown
 * @param {string} [className] - Extra classes for the footer wrapper
 */
function TablePagination({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const start = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalRows);

  const rowsPerPageOptionsList = rowsPerPageOptions.map((n) => ({
    value: String(n),
    label: String(n),
  }));

  return (
    <div
      className={`flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600 dark:border-gray-600 dark:bg-gray-700/20 dark:text-gray-400 ${className}`.trim()}
      role="navigation"
      aria-label="Table pagination"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">Rows per page:</span>
        <Dropdown
          showPlaceholderOption={false}
          value={String(rowsPerPage)}
          onChange={(v) => onRowsPerPageChange(Number(v))}
          options={rowsPerPageOptionsList}
          className="w-16 min-w-17 [&_button]:h-9 [&_button]:py-1.5 [&_button]:rounded-lg [&_button]:text-sm [&_button]:pl-3 [&_button]:pr-8 [&_button]:border [&_button]:border-slate-200 [&_button]:dark:border-gray-600 [&_button]:bg-white [&_button]:dark:bg-gray-700 [&_button]:text-slate-800 [&_button]:dark:text-gray-100"
        />
      </div>
      <span className="font-medium" aria-live="polite">
        {totalRows === 0 ? '0-0 of 0' : `${start}-${end} of ${totalRows}`}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-600 dark:disabled:hover:bg-transparent"
        >
          <ChevronLeftIcon className="text-xl" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-600 dark:disabled:hover:bg-transparent"
        >
          <ChevronRightIcon className="text-xl" />
        </button>
      </div>
    </div>
  );
}

Table.Pagination = TablePagination;

function ActionMenu({ open, position, onView, onEdit, onDelete, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open || !position) return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      className={actionMenuClass}
      // style={{ top: position.top, left: position.left }}
      style={{
              top: position.top,
              left: position.left,
              // width: position.width,
              // minWidth: 'auto',
              backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCkiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzNykiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
              // backgroundSize: '50% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right top, left bottom',
            }}
    >
      {onView && (
        <button
          type="button"
          role="menuitem"
          className={actionMenuItemClass}
          onClick={() => {
            onView?.();
            onClose?.();
          }}
        >
          <EyeIcon className="text-lg text-slate-500 dark:text-gray-400" />
          View
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          role="menuitem"
          className={actionMenuItemClass}
          onClick={() => {
            onEdit?.();
            onClose?.();
          }}
        >
          <PenIcon className="text-lg text-slate-500 dark:text-gray-400" />
          Edit
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          role="menuitem"
          className={actionMenuDeleteClass}
          onClick={() => {
            onDelete?.();
            onClose?.();
          }}
        >
          <TrashIcon className="text-lg" />
          Delete
        </button>
      )}
    </div>,
    document.body
  );
}

Table.ActionMenu = ActionMenu;

export default Table;

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Input, Checkbox } from '../common';
import { ChevronDownIcon } from '../icons';

function CategoryMultiSelect({
  placeholder = 'All categories',
  selectedCategoryIds = [],
  onCategoryChange,
  categories = [],
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [panelRect, setPanelRect] = useState(null);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const activeCategories = categories.filter((c) => c.isActive !== false);
  const allSelected = selectedCategoryIds.length === 0;
  const singleCat = selectedCategoryIds.length === 1 ? activeCategories.find((c) => (c._id ?? c.value) === selectedCategoryIds[0]) : null;
  const displayLabel =
    allSelected ? placeholder : selectedCategoryIds.length === 1 ? (singleCat?.name ?? singleCat?.label ?? '1 category') : `${selectedCategoryIds.length} categories`;

  useLayoutEffect(() => {
    if (!open) {
      setPanelRect(null);
      return;
    }
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setPanelRect({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 220) });
    }
  }, [open]);

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

  const handleAllChange = () => {
    if (!allSelected) onCategoryChange?.([]);
  };

  const handleCategoryToggle = (id, checked) => {
    if (checked) {
      onCategoryChange?.([...selectedCategoryIds, id]);
    } else {
      onCategoryChange?.(selectedCategoryIds.filter((x) => x !== id));
    }
  };

  return (
    <div className={className} ref={containerRef}>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select categories"
          className={`relative w-full flex items-center justify-between gap-3 pl-5 pr-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white shadow-sm transition-[border-color,box-shadow] duration-75 cursor-pointer ${
            open ? 'border-primary dark:border-secondary ring-2 ring-primary/20 dark:ring-secondary/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-secondary dark:focus:border-secondary'
          }`}
        >
          <span className={allSelected ? 'text-gray-500 dark:text-gray-400' : ''}>{displayLabel}</span>
          <span
            className={`flex shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-75 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <ChevronDownIcon className="text-2xl" />
          </span>
        </button>

        {open && panelRect && createPortal(
          <div
            ref={panelRef}
            role="listbox"
            aria-multiselectable="true"
            className="fixed py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl max-h-60 overflow-y-auto z-10 flex flex-col gap-1"
            style={{ top: panelRect.top, left: panelRect.left, width: panelRect.width, minWidth: 'auto' }}
          >
            <div className="px-3 py-1.5">
              <Checkbox
                size="sm"
                label={placeholder}
                checked={allSelected}
                onChange={handleAllChange}
                className="w-full"
              />
            </div>
            {activeCategories.map((c) => {
              const id = c._id ?? c.value;
              const name = c.name ?? c.label ?? '';
              if (!id || !name) return null;
              const isChecked = selectedCategoryIds.includes(id);
              return (
                <div key={id} className="px-3 py-1.5">
                  <Checkbox
                    size="sm"
                    label={name}
                    checked={isChecked}
                    onChange={(e) => handleCategoryToggle(id, e.target.checked)}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

export default function ProductsToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  selectedCategoryIds = [],
  onCategoryChange,
  categories,
  showCategoryDropdown = false,
  selectedProductIds = [],
}) {
  const hasSelection = selectedProductIds.length > 0;

  return (
    <div className="flex flex-wrap gap-4 items-center mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      <form onSubmit={onSearchSubmit} className="flex gap-3 flex-1 min-w-[200px]">
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 mb-0 min-w-0"
          clearable
          onClear={onClearSearch}
        />
        <Button
          size="lg"
          type="submit"
          variant="primary"
          fullWidth={false}
          className="w-[120px] px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          Search
        </Button>
        {hasSelection && (
          <Button
            size="lg"
            type="button"
            variant="secondary"
            fullWidth={false}
            to="/contact"
            state={{ enquiryType: 'product', productIds: selectedProductIds }}
            className="w-[140px] px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 whitespace-nowrap"
          >
            Enquiry
          </Button>
        )}
      </form>
      {showCategoryDropdown && (
        <div className="lg:hidden w-full sm:w-auto max-w-[220px] sm:max-w-[220px]">
          <CategoryMultiSelect
            placeholder="All categories"
            selectedCategoryIds={selectedCategoryIds}
            onCategoryChange={onCategoryChange}
            categories={categories ?? []}
          />
        </div>
      )}
    </div>
  );
}

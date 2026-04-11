import Checkbox from '../common/Checkbox';

/**
 * Left sidebar showing categories with checkboxes (multi-select, Amazon-style).
 * - "All Categories" checkbox: when checked, no category filter; when unchecked, keeps current selection.
 * - Category checkboxes: user can select multiple; products in any selected category are shown.
 */
export default function ProductsSidebar({
  categories = [],
  selectedCategoryIds = [],
  onCategoryChange,
}) {
  const activeCategories = categories.filter((c) => c.isActive !== false);
  const allSelected = selectedCategoryIds.length === 0;

  const handleAllChange = () => {
    if (allSelected) return; // already showing all
    onCategoryChange?.([]);
  };

  const handleCategoryToggle = (id, checked) => {
    if (checked) {
      onCategoryChange?.([...selectedCategoryIds, id]);
    } else {
      onCategoryChange?.(selectedCategoryIds.filter((x) => x !== id));
    }
  };

  return (
    <aside
      className="w-full shrink-0 lg:w-56 xl:w-64"
      aria-label="Filter by category"
    >
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm overflow-hidden sticky top-24">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Categories
          </h2>
        </div>
        <nav className="py-2 px-2 flex flex-col gap-2" role="navigation">
          <div
            className={`rounded-lg px-2 py-2 ${!allSelected ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'bg-primary/10 dark:bg-secondary/20'}`}
          >
            <Checkbox
              size="sm"
              label="All Categories"
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
              <div
                key={id}
                className={`rounded-lg px-2 py-2 ${isChecked ? 'bg-primary/10 dark:bg-secondary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
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
        </nav>
      </div>
    </aside>
  );
}

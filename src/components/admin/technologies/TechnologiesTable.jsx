import { useState, useRef, useEffect, useMemo } from 'react';
import { Table, ConfirmModal, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'active', label: 'Active', variant: 'success', activeVariant: 'success', activeSolid: true },
  { value: 'inactive', label: 'Inactive', variant: 'warning', activeVariant: 'warning', activeSolid: true },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'Frontend Technologies', label: 'Frontend' },
  { value: 'Backend Technologies', label: 'Backend' },
  { value: 'Database Technologies', label: 'Database' },
];

export default function TechnologiesTable({
  technologies = [],
  onOpenEdit,
  onRemove,
  loading = false,
  statusFilter = 'all',
  onStatusFilterChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  page = 1,
  rowsPerPage = 5,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  sortKey = 'title',
  sortDirection = 'asc',
  onSortChange,
  counts = { all: 0, active: 0, inactive: 0 },
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetCategoryFilter = (val) => onCategoryFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnPageChange = (val) => onPageChange?.(val);
  const safeOnRowsPerPageChange = (val) => onRowsPerPageChange?.(val);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const kebabRefs = useRef({});

  const totalFiltered = totalRows;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / rowsPerPage));
  const pageSafe = Math.min(Math.max(page, 1), totalPages);

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== 'all') {
      const label = STATUS_TABS.find((t) => t.value === statusFilter)?.label ?? statusFilter;
      list.push({ id: 'status', label: 'Status', value: label, onRemove: () => safeSetStatusFilter('all') });
    }
    if (categoryFilter !== 'all') {
      const label = CATEGORY_OPTIONS.find((t) => t.value === categoryFilter)?.label ?? categoryFilter;
      list.push({ id: 'category', label: 'Category', value: label, onRemove: () => safeSetCategoryFilter('all') });
    }
    if (searchQuery.trim()) {
      list.push({
        id: 'keyword',
        label: 'Keyword',
        value: searchQuery.trim(),
        onRemove: () => safeSetSearchQuery(''),
      });
    }
    return list;
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleClearAllFilters = () => {
    safeSetStatusFilter('all');
    safeSetCategoryFilter('all');
    safeSetSearchQuery('');
  };

  const handleSort = (key) => {
    if (typeof onSortChange !== 'function') return;
    const nextDirection = sortKey === key ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    onSortChange(key, nextDirection);
  };

  const allSelected = technologies.length > 0 && technologies.every((t) => selectedIds.has(t._id));
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(technologies.map((t) => t._id)));
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openActionMenu = (e, id) => {
    e.stopPropagation();
    const el = kebabRefs.current[id] || e.currentTarget;
    const rect = el.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom - 45, left: rect.left - 135 });
    setOpenActionId(id);
  };

  const closeMenu = () => setOpenActionId(null);

  const openSingleDeleteConfirm = (tech) => {
    closeMenu();
    setDeleteConfirm({ type: 'single', id: tech._id, title: tech.title });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setDeleteConfirm({ type: 'bulk', ids: [...selectedIds] });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'single') {
      onRemove(deleteConfirm.id);
    } else {
      deleteConfirm.ids.forEach((id) => onRemove(id));
      setSelectedIds(new Set());
    }
    setDeleteConfirm(null);
  };

  const techForMenu = openActionId ? technologies.find((t) => t._id === openActionId) : null;

  // Clear selection/menu when the underlying server results change (filters/page).
  useEffect(() => {
    setSelectedIds(new Set());
    setOpenActionId(null);
    setDeleteConfirm(null);
  }, [technologies]);

  return (
    <>
      <div className="border-b border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <Table.StatusTabs
          tabs={STATUS_TABS}
          value={statusFilter}
          onChange={safeSetStatusFilter}
          counts={counts}
        />
        <Table.Toolbar>
          <Table.ToolbarDropdown
            value={categoryFilter}
            onChange={safeSetCategoryFilter}
            options={CATEGORY_OPTIONS}
            showPlaceholderOption={false}
          />
          <Table.SearchInput
            value={searchQuery}
            // debounceMs={450}
            onChange={(e) => safeSetSearchQuery(e.target.value)}
            ariaLabel="Search technologies"
            placeholder="Search technologies"
          />
        </Table.Toolbar>
      </div>

      <Table.ActiveFilters
        filters={activeFilters}
        resultCount={totalFiltered}
        onClearAll={handleClearAllFilters}
      />

      <Table.SelectionBar
        selectedCount={selectedIds.size}
        totalCount={totalFiltered}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        label="selected"
      />

      <Table>
        {selectedIds.size === 0 && (
          <Table.Head
            columns={[
              { key: 'image', label: 'Image', sortable: false },
              { key: 'title', label: 'Title', sortable: true },
              { key: 'category', label: 'Category', sortable: true },
              { key: 'isActive', label: 'Active', sortable: true },
              { key: 'actions', label: 'Actions', align: 'right' },
            ]}
            selectAll={{
              checked: allSelected,
              indeterminate: someSelected && !allSelected,
              onChange: handleSelectAll,
            }}
            sortState={{ key: sortKey, direction: sortDirection }}
            onSort={handleSort}
          />
        )}
        <Table.Body>
          {loading ? (
            <Table.LoadingState colSpan={6} />
        ) : technologies.length === 0 ? (
            <Table.EmptyState colSpan={6} />
          ) : (
          technologies.map((t) => (
              <Table.Row key={t._id}>
                <Table.SelectionCell
                  checked={selectedIds.has(t._id)}
                  onChange={() => handleSelectRow(t._id)}
                  ariaLabel={`Select ${t.title}`}
                />
                <Table.Td className="w-16">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-gray-600"
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-gray-700 dark:text-gray-500 text-xs">—</span>
                  )}
                </Table.Td>
                <Table.Td>{t.title}</Table.Td>
                <Table.Td>{t.category}</Table.Td>
                <Table.Td>
                  <Badge variant={t.isActive !== false ? 'success' : 'warning'}>
                    {t.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td align="right" className="whitespace-nowrap">
                  <div className="relative flex justify-end">
                    <button
                      ref={(el) => (kebabRefs.current[t._id] = el)}
                      type="button"
                      onClick={(e) => openActionMenu(e, t._id)}
                      aria-label="Open actions"
                      aria-expanded={openActionId === t._id}
                      aria-haspopup="menu"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                    >
                      <DotsVerticalIcon className="text-xl" />
                    </button>
                  </div>
                </Table.Td>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <Table.Pagination
        page={pageSafe}
        rowsPerPage={rowsPerPage}
        totalRows={totalFiltered}
        onPageChange={safeOnPageChange}
        onRowsPerPageChange={safeOnRowsPerPageChange}
      />

      <Table.ActionMenu
        open={!!openActionId}
        position={menuPosition}
        onEdit={techForMenu ? () => onOpenEdit(techForMenu) : undefined}
        onDelete={techForMenu ? () => openSingleDeleteConfirm(techForMenu) : undefined}
        onClose={closeMenu}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Delete technology"
        message={
          deleteConfirm?.type === 'single'
            ? `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`
            : deleteConfirm?.type === 'bulk'
              ? `Are you sure you want to delete ${deleteConfirm.ids.length} selected item(s)? This cannot be undone.`
              : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="error"
      />
    </>
  );
}

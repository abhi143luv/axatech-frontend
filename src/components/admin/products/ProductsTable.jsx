import { useState, useRef, useMemo } from 'react';
import { Table, ConfirmModal, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'featured', label: 'Featured', variant: 'info', activeVariant: 'info', activeSolid: true },
  { value: 'active', label: 'Active', variant: 'success', activeVariant: 'success', activeSolid: true },
  { value: 'inactive', label: 'Inactive', variant: 'warning', activeVariant: 'warning', activeSolid: true },
];

export default function ProductsTable({
  products = [],
  onOpenEdit,
  onRemove,
  loading = false,
  statusFilter = 'all',
  onStatusFilterChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  categoryOptions = [{ value: 'all', label: 'All categories' }],
  searchQuery = '',
  onSearchQueryChange,
  sortKey = 'name',
  sortDirection = 'asc',
  onSortChange,
  page = 1,
  rowsPerPage = 5,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  counts = { all: 0, featured: 0, active: 0, inactive: 0 },
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetCategoryFilter = (val) => onCategoryFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnSortChange = (key, dir) => onSortChange?.(key, dir);
  const safeOnPageChange = (nextPage) => onPageChange?.(nextPage);
  const safeOnRowsPerPageChange = (nextRowsPerPage) => onRowsPerPageChange?.(nextRowsPerPage);

  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const kebabRefs = useRef({});

  const totalFiltered = totalRows;

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== 'all') {
      const label = STATUS_TABS.find((t) => t.value === statusFilter)?.label ?? statusFilter;
      list.push({
        id: 'status',
        label: 'Status',
        value: label,
        onRemove: () => safeSetStatusFilter('all'),
      });
    }
    if (categoryFilter !== 'all') {
      const label = categoryOptions.find((c) => c.value === categoryFilter)?.label ?? categoryFilter;
      list.push({
        id: 'category',
        label: 'Category',
        value: label,
        onRemove: () => safeSetCategoryFilter('all'),
      });
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
  }, [statusFilter, categoryFilter, categoryOptions, searchQuery]);

  const handleClearAllFilters = () => {
    safeSetStatusFilter('all');
    safeSetCategoryFilter('all');
    safeSetSearchQuery('');
  };

  const handleSort = (key) => {
    const nextDirection = sortKey === key ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    safeOnSortChange(key, nextDirection);
  };

  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p._id));
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map((p) => p._id)));
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

  const openSingleDeleteConfirm = (product) => {
    closeMenu();
    setDeleteConfirm({ type: 'single', id: product._id, name: product.name });
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
      onRemove(deleteConfirm.ids);
      setSelectedIds(new Set());
    }
    setDeleteConfirm(null);
  };

  const productForMenu = openActionId ? products.find((p) => p._id === openActionId) : null;

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
            options={categoryOptions}
            showPlaceholderOption={false}
          />
          <Table.SearchInput
            value={searchQuery}
            onChange={(e) => safeSetSearchQuery(e.target.value)}
            // debounceMs={450}
            ariaLabel="Search products"
            placeholder="Search products"
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
              { key: 'name', label: 'Name', sortable: true },
              { key: 'category', label: 'Category', sortable: true },
              { key: 'featured', label: 'Featured', sortable: true },
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
          ) : products.length === 0 ? (
            <Table.EmptyState colSpan={6} />
          ) : (
          products.map((p) => (
            <Table.Row key={p._id}>
              <Table.SelectionCell
                checked={selectedIds.has(p._id)}
                onChange={() => handleSelectRow(p._id)}
                ariaLabel={`Select ${p.name}`}
              />
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.category?.name || '—'}</Table.Td>
              <Table.Td>
                <Badge variant={p.featured ? 'info' : 'neutral'} size="md">
                  {p.featured ? 'Yes' : 'No'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge variant={p.isActive !== false ? 'success' : 'warning'} size="md">
                  {p.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td align="right" className="whitespace-nowrap">
                <div className="relative flex justify-end">
                  <button
                    ref={(el) => (kebabRefs.current[p._id] = el)}
                    type="button"
                    onClick={(e) => openActionMenu(e, p._id)}
                    aria-label="Open actions"
                    aria-expanded={openActionId === p._id}
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
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalFiltered}
        onPageChange={safeOnPageChange}
        onRowsPerPageChange={safeOnRowsPerPageChange}
      />

      <Table.ActionMenu
        open={!!openActionId}
        position={menuPosition}
        onEdit={productForMenu ? () => onOpenEdit(productForMenu) : undefined}
        onDelete={productForMenu ? () => openSingleDeleteConfirm(productForMenu) : undefined}
        onClose={closeMenu}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Delete product"
        message={
          deleteConfirm?.type === 'single'
            ? `Are you sure you want to delete "${deleteConfirm.name}"? This cannot be undone.`
            : deleteConfirm?.type === 'bulk'
              ? `Are you sure you want to delete ${deleteConfirm.ids.length} selected product(s)? This cannot be undone.`
              : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="error"
      />
    </>
  );
}

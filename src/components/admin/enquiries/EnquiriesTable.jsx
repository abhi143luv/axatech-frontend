import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'New', label: 'New', variant: 'info', activeVariant: 'info', activeSolid: true },
  { value: 'Contacted', label: 'Contacted', variant: 'warning', activeVariant: 'warning', activeSolid: true },
  { value: 'Closed', label: 'Closed', variant: 'success', activeVariant: 'success', activeSolid: true },
];

export default function EnquiriesTable({
  enquiries = [],
  loading = false,
  onView,
  statusFilter = 'all',
  onStatusFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  page = 1,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  counts = { all: 0, New: 0, Contacted: 0, Closed: 0 },
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnPageChange = (next) => onPageChange?.(next);
  const safeOnRowsPerPageChange = (next) => onRowsPerPageChange?.(next);

  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const kebabRefs = useRef({});

  const statusVariant = (s) => {
    if (s === 'New') return 'info';
    if (s === 'Contacted') return 'warning';
    if (s === 'Closed') return 'success';
    return 'neutral';
  };

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
    if (searchQuery.trim()) {
      list.push({
        id: 'keyword',
        label: 'Keyword',
        value: searchQuery.trim(),
        onRemove: () => safeSetSearchQuery(''),
      });
    }
    return list;
  }, [statusFilter, searchQuery]);

  const handleClearAllFilters = () => {
    safeSetStatusFilter('all');
    safeSetSearchQuery('');
  };

  const openActionMenu = (e, id) => {
    e.stopPropagation();
    const el = kebabRefs.current[id] || e.currentTarget;
    const rect = el.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom - 45, left: rect.left - 135 });
    setOpenActionId(id);
  };

  const closeMenu = () => setOpenActionId(null);

  const enquiryForMenu = openActionId
    ? enquiries.find((e) => e._id === openActionId)
    : null;

  // Clear menu state when the underlying server results change.
  useEffect(() => {
    setOpenActionId(null);
  }, [enquiries]);

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <Table.StatusTabs
          tabs={STATUS_TABS}
          value={statusFilter}
          onChange={safeSetStatusFilter}
          counts={{
            all: counts.all ?? 0,
            New: counts.New ?? 0,
            Contacted: counts.Contacted ?? 0,
            Closed: counts.Closed ?? 0,
          }}
        />
        <Table.Toolbar>
          <Table.SearchInput
            value={searchQuery}
            debounceMs={500}
            onChange={(e) => safeSetSearchQuery(e.target.value)}
            ariaLabel="Search enquiries"
            placeholder="Search by name, email, or type"
          />
        </Table.Toolbar>
      </div>

      <Table.ActiveFilters
        filters={activeFilters}
        resultCount={totalRows}
        onClearAll={handleClearAllFilters}
      />

      <Table>
        <Table.Head
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'type', label: 'Type' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions', align: 'right' },
          ]}
        />
        <Table.Body>
          {loading ? (
            <Table.LoadingState colSpan={6} />
          ) : enquiries.length === 0 ? (
            <Table.EmptyState colSpan={6} />
          ) : (
            enquiries.map((e) => (
              <Table.Row key={e._id}>
                <Table.Td>
                  {new Date(e.createdAt).toLocaleString()}
                </Table.Td>
                <Table.Td>{e.type}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.email}</Table.Td>
                <Table.Td>
                  <Badge variant={statusVariant(e.status)} size="md">
                    {e.status || '—'}
                  </Badge>
                </Table.Td>
                <Table.Td align="right" className="whitespace-nowrap">
                  <div className="relative flex justify-end">
                    <button
                      ref={(el) => (kebabRefs.current[e._id] = el)}
                      type="button"
                      onClick={(evt) => openActionMenu(evt, e._id)}
                      aria-label="Open actions"
                      aria-expanded={openActionId === e._id}
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
        totalRows={totalRows}
        onPageChange={safeOnPageChange}
        onRowsPerPageChange={safeOnRowsPerPageChange}
      />

      <Table.ActionMenu
        open={!!openActionId}
        position={menuPosition}
        onView={enquiryForMenu ? () => onView?.(enquiryForMenu._id) : undefined}
        onClose={closeMenu}
      />
    </div>
  );
}


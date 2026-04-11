import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import EnquiriesHeader from './EnquiriesHeader';
import EnquiriesTable from './EnquiriesTable';
import EnquiryDetailModal from './EnquiryDetailModal';

export default function EnquiriesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status') || 'all';
  const [statusFilter, setStatusFilter] = useState(urlStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState({
    enquiries: [],
    total: 0,
    pages: 1,
    counts: { all: 0, New: 0, Contacted: 0, Closed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const params = {
      page,
      limit: rowsPerPage,
      search: searchQuery.trim() ? searchQuery.trim() : undefined,
    };
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    return api.admin.enquiries.list(params).then(setData).catch(console.error);
  };

  useEffect(() => {
    setStatusFilter(urlStatus || 'all');
    setPage(1);
  }, [urlStatus]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [statusFilter, searchQuery, page, rowsPerPage]);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    api.admin.enquiries
      .get(detailId)
      .then((e) => {
        setDetail(e);
        setStatus(e.status);
        setAdminNotes(e.adminNotes || '');
      })
      .catch(console.error);
  }, [detailId]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await api.admin.enquiries.updateStatus(detailId, { status, adminNotes });
      setDetail((d) => (d ? { ...d, status, adminNotes } : d));
      load();
      setDetailId(null);
      toast.success('Enquiry updated');
    } catch (e) {
      toast.error(e.message || 'Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusFilterChange = (val) => {
    const next = val || 'all';
    setStatusFilter(next);
    setPage(1);

    if (next === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ status: next });
    }
  };

  const handleSearchQueryChange = (val) => {
    setSearchQuery(val ?? '');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <EnquiriesHeader statusFilter={statusFilter} />

      <EnquiriesTable
        enquiries={data.enquiries}
        loading={loading}
        onView={(id) => setDetailId(id)}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={data.total}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setPage(1);
        }}
        counts={data.counts}
      />

      <EnquiryDetailModal
        open={!!detail}
        detail={detail}
        status={status}
        adminNotes={adminNotes}
        saving={saving}
        onClose={() => setDetailId(null)}
        onStatusChange={setStatus}
        onAdminNotesChange={setAdminNotes}
        onUpdate={updateStatus}
      />
    </div>
  );
}


import { Pagination } from '../common';

export default function ProductsPagination({ page, pages, onPageChange }) {
  return (
    <Pagination
      page={page}
      totalPages={pages}
      onPageChange={(nextPage) => onPageChange(nextPage)}
      className="mt-10"
    />
  );
}

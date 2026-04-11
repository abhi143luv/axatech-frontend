import ServiceCard from './ServiceCard';
import { Pagination } from '../common';

export default function ServicesGrid({ services, page, totalPages, onPageChange }) {
  if (!services?.length) {
    return (
      <div className="text-center py-16 px-5">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No services available at the moment. Check back later.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <ServiceCard key={s._id} service={s} index={i} />
        ))}
      </div>
      {totalPages > 1 ? (
        <div className="mt-10">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </>
  );
}

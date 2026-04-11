import BlogCard from './BlogCard';
import { Loader, Pagination } from '../common';

export default function BlogGrid({ blogs = [], loading = false, page = 1, totalPages = 1, onPageChange }) {
  if (loading) {
    return <Loader className="min-h-[40vh]" />;
  }
  if (!blogs?.length) {
    return (
      <div className="text-center py-16 px-5">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No posts yet. Check back later for updates and insights.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b, i) => (
          <BlogCard key={b._id} post={b} index={i} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-10"
        />
      )}
    </>
  );
}

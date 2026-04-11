import { Loader } from '../common';
import TechnologyCard from './TechnologyCard';

export default function TechnologiesGrid({ technologies, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
        <Loader className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading technologies...</p>
      </div>
    );
  }
  if (!technologies?.length) {
    return (
      <div className="text-center py-16 px-5">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No technologies available at the moment. Check back later.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {technologies.map((tech, i) => (
        <TechnologyCard key={tech._id} technology={tech} index={i} />
      ))}
    </div>
  );
}

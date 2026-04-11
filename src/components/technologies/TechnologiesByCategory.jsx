import { Loader } from '../common';
import TechnologyCard from './TechnologyCard';

const CATEGORY_ORDER = [
  'Frontend Technologies',
  'Backend Technologies',
  'Database Technologies',
];

function groupByCategory(technologies) {
  const map = {};
  for (const cat of CATEGORY_ORDER) map[cat] = [];
  for (const tech of technologies || []) {
    const cat = tech.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push(tech);
  }
  return CATEGORY_ORDER.map((cat) => ({ category: cat, items: map[cat] || [] }));
}

export default function TechnologiesByCategory({ technologies, loading }) {
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

  const sections = groupByCategory(technologies);

  return (
    <div className="space-y-16 md:space-y-20">
      {sections.map(({ category, items }) => (
        <section key={category}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
            {category}
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((tech, i) => (
              <TechnologyCard key={tech._id} technology={tech} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

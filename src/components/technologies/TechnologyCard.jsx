import { Link } from 'react-router-dom';
import { CodeIcon } from '../icons';

export default function TechnologyCard({ technology, index = 0 }) {
  const { title, description, image, slug, _id } = technology;
  const to = `/technologies/${slug || _id}`;

  return (
    <Link
      to={to}
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-lg flex flex-col animate-[home-fadeInUp_0.6s_ease-out_both] text-inherit no-underline"
      style={{ animationDelay: `${0.15 + index * 0.05}s` }}
    >
      <div className="aspect-square bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center p-5 shrink-0">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-contain max-h-28"
          />
        ) : (
          <CodeIcon className="text-5xl text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRightIcon, BlogsIcon } from '../icons';

export default function BlogCard({ post, index = 0 }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 text-inherit no-underline animate-[home-fadeInUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${0.4 + index * 0.08}s` }}
    >
      {post.image ? (
        <div className="aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
          <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      ) : (
        <div className="aspect-4/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
          <BlogsIcon className="text-4xl text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {post.excerpt || (post.content?.slice(0, 120) + '…')}
        </p>
        <div className="flex items-center justify-between gap-3 mt-auto shrink-0">
          {post.publishedAt ? (
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 font-semibold text-secondary dark:text-accent text-sm">
            Read more
            <ArrowRightIcon className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

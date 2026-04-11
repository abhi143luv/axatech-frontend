import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Pagination, SectionHeader } from '../common';
import { ArrowRightIcon, ProjectsIcon } from '../icons';
import api from '../../api';

const ITEMS_PER_PAGE = 8;

export default function ProjectsSection({ projects = [], loading }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [pagedProjects, setPagedProjects] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          projects
            .map((p) => p.category)
            .filter((c) => c && typeof c === 'string')
        )
      ),
    ],
    [projects]
  );

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    const fetchPagedProjects = async () => {
      setQueryLoading(true);
      try {
        const params = {
          page,
          limit: ITEMS_PER_PAGE,
          ...(activeCategory !== 'All' ? { category: activeCategory } : {}),
        };
        const res = await api.projects(params);

        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.projects)
            ? res.projects
            : Array.isArray(res?.items)
              ? res.items
              : [];

        const apiTotalPages = Number(
          res?.totalPages ?? res?.pagination?.totalPages ?? 0
        );
        const hasApiPagination = apiTotalPages > 0;
        const nextTotalPages = hasApiPagination
          ? apiTotalPages
          : Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
        const nextPageList = hasApiPagination
          ? list
          : list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        if (!cancelled) {
          setPagedProjects(nextPageList);
          setTotalPages(nextTotalPages);
        }
      } catch (e) {
        // Fallback to in-memory behavior if API pagination params are unsupported.
        const localList = (activeCategory === 'All'
          ? projects
          : projects.filter((p) => p.category === activeCategory));
        const start = (page - 1) * ITEMS_PER_PAGE;
        const sliced = localList.slice(start, start + ITEMS_PER_PAGE);
        const localTotalPages = Math.max(1, Math.ceil(localList.length / ITEMS_PER_PAGE));

        if (!cancelled) {
          setPagedProjects(sliced);
          setTotalPages(localTotalPages);
        }
      } finally {
        if (!cancelled) setQueryLoading(false);
      }
    };

    fetchPagedProjects();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, page, loading, projects]);

  return (
    <section className="bg-white pb-20 md:pb-24 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="hero-gradient-section py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-5">
          <SectionHeader
            label="Projects"
            title="Our Featured Projects"
            subtitle={null}
            centered
            inverse
            subtitleClassName="mb-0"
            dataAos="fade-up"
          />
          <div className="hero-glass-panel mt-6 rounded-2xl p-5" data-aos="fade-up">
            <p className="text-sm font-medium text-white/95">
              Discover our portfolio of innovative solutions across various industries.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-5">

        {/* Category pills */}
        {!loading && projects.length > 0 && (
          <div
            className="mb-10 flex flex-wrap gap-2 justify-center"
            data-aos="fade-up"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/25 dark:bg-secondary'
                      : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-secondary/40 hover:bg-slate-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {loading || queryLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="min-h-[120px]" />
          </div>
        ) : !pagedProjects.length ? (
          <p className="py-16 text-center text-gray-500 dark:text-gray-400">
            No projects to show yet.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {pagedProjects.map((p, i) => (
                <Link
                  to={`/projects/${p.slug}`}
                  key={p._id}
                  className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 text-inherit no-underline"
                  data-aos="fade-up"
                  style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                >
                  {p.image ? (
                    <div className="aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-4/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ProjectsIcon className="text-4xl text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    {p.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-secondary mb-1.5 block">
                        {p.category}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {p.description?.slice(0, 100)}
                      {p.description?.length > 100 ? '…' : ''}
                    </p>
                    <span className="inline-flex items-center gap-1 font-semibold text-secondary dark:text-accent text-sm">
                      Learn more
                      <ArrowRightIcon className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-10"
            />

            {/* <div className="mt-10 text-center" data-aos="fade-up">
              <Button
                to="/projects"
                variant="secondary"
                fullWidth={false}
                className="inline-flex items-center justify-center gap-2"
              >
                <ProjectsIcon className="text-[20px] shrink-0" />
                All Projects
              </Button>
            </div> */}
          </>
        )}
      </div>
    </section>
  );
}
